'use client'
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { cx } from '../cx'
import { Ticker } from '../motion/Ticker'

/*
  Charts for dashboards, drawn in plain SVG/HTML from the chart tokens (--chart-1…4, validated for colour-blind
  separation in light and dark). Every chart: one series colour per entity in a fixed order, 2px lines, 4px rounded
  bar ends on the baseline, 2px gaps between filled parts, recessive grid, a hover readout, arrow keys to step
  through values, and a hidden table for screen readers. Text never wears a series colour.
*/

type Fmt = (n: number) => string
const plain: Fmt = (n) => n.toLocaleString('en-IN')
/** The fixed series order. A fifth part folds into "Other". */
export const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'] as const

/** Width of the element, kept current. SSR draws at `fallback`, then corrects on mount. */
function useWidth(fallback: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    setW(el.clientWidth || fallback)
    const ro = new ResizeObserver(([e]) => e && setW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [fallback])
  return [ref, w] as const
}

/** Hover and keyboard share one "current point": pointer sets it, ←/→ step it, Esc clears it. */
function usePoint(n: number) {
  const [at, setAt] = useState<number | null>(null)
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setAt((a) => Math.max(0, Math.min(n - 1, a == null ? (e.key === 'ArrowRight' ? 0 : n - 1) : a + (e.key === 'ArrowRight' ? 1 : -1))))
    } else if (e.key === 'Home') { e.preventDefault(); setAt(0) }
    else if (e.key === 'End') { e.preventDefault(); setAt(n - 1) }
    else if (e.key === 'Escape') setAt(null)
  }
  return { at, setAt, onKey, onBlur: () => setAt(null) }
}

/** The values as a table, for screen readers. */
function SrTable({ caption, rows }: { caption: string; rows: [string, string][] }) {
  return (
    <table className="w-sr">
      <caption>{caption}</caption>
      <tbody>{rows.map(([k, v], i) => <tr key={i}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody>
    </table>
  )
}

/** Monotone cubic through the points: smooth, but never overshoots a value (no fake peaks or dips). */
function monotone(p: [number, number][]) {
  if (p.length < 2) return ''
  const n = p.length, d: number[] = [], m: number[] = []
  for (let i = 0; i < n - 1; i++) d.push((p[i + 1]![1] - p[i]![1]) / (p[i + 1]![0] - p[i]![0]))
  m[0] = d[0]!; m[n - 1] = d[n - 2]!
  // Fritsch–Carlson: harmonic mean of the neighbouring slopes keeps the curve monotone between points.
  for (let i = 1; i < n - 1; i++) { const a = d[i - 1]!, b = d[i]!; m[i] = a * b <= 0 ? 0 : (2 * a * b) / (a + b) }
  let s = `M${p[0]![0].toFixed(1)},${p[0]![1].toFixed(1)}`
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = p[i]!, [x1, y1] = p[i + 1]!, h = (x1 - x0) / 3
    s += ` C${(x0 + h).toFixed(1)},${(y0 + m[i]! * h).toFixed(1)} ${(x1 - h).toFixed(1)},${(y1 - m[i + 1]! * h).toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`
  }
  return s
}

/* ───────── Area chart ───────── */

export type AreaChartProps = {
  /** One value per period, oldest first. */
  data: number[]
  /** The period names, same length as data: "Jun", "Jul"… */
  labels: string[]
  /** What it shows, for screen readers and the table: "Closed by month". */
  label: string
  /** How values read: ₹ lakhs, compact counts. @default n => n.toLocaleString('en-IN') */
  format?: Fmt
  /** px. @default 180 */
  height?: number
  /** A chart token. One series is one colour; the title names it, so no legend. @default 'var(--chart-1)' */
  color?: string
  /** Faint guide lines at a quarter, half and three quarters. @default true */
  grid?: boolean
  className?: string
}

/** One measure over time, from zero. Hover or ←/→ to read each period. */
export function AreaChart({ data, labels, label, format = plain, height = 180, color = CHART_COLORS[0], grid = true, className }: AreaChartProps) {
  const [ref, w] = useWidth(600)
  const { at, setAt, onKey, onBlur } = usePoint(data.length)
  const gid = 'wa' + useId().replace(/:/g, '')
  const PAD = 8, top = 10
  const hi = Math.max(0, ...data), lo = Math.min(0, ...data), span = hi - lo || 1
  const x = (i: number) => (data.length < 2 ? w / 2 : PAD + (i / (data.length - 1)) * (w - PAD * 2))
  const y = (v: number) => top + (1 - (v - lo) / span) * (height - top - 2)
  const pts = data.map((v, i) => [x(i), y(v)] as [number, number])
  const line = monotone(pts)
  const base = y(0)
  const last = useRef(data.length - 1)
  if (at != null) last.current = at
  const cur = Math.min(last.current, data.length - 1)
  const p = pts[cur] ?? [0, 0]

  const move = (e: PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setAt(Math.max(0, Math.min(data.length - 1, Math.round(((e.clientX - r.left - PAD) / (r.width - PAD * 2)) * (data.length - 1)))))
  }
  return (
    <figure className={cx('w-chart', className)}>
      <div ref={ref} className="w-chart-plot" style={{ height }} tabIndex={0} role="group" aria-roledescription="chart" aria-label={`${label}. Use the arrow keys to read each value.`}
        onPointerMove={move} onPointerLeave={() => setAt(null)} onKeyDown={onKey} onBlur={onBlur}>
        <svg width={w} height={height} aria-hidden>
          <defs><linearGradient id={gid} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".2" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
          {grid && [0.25, 0.5, 0.75].map((g) => <line key={g} className="w-chart-grid" x1={0} x2={w} y1={top + (height - top) * g} y2={top + (height - top) * g} />)}
          <line className="w-chart-base" x1={0} x2={w} y1={base} y2={base} />
          {pts.length > 1 && <path d={`${line} L${pts[pts.length - 1]![0].toFixed(1)},${base} L${pts[0]![0].toFixed(1)},${base} Z`} fill={`url(#${gid})`} />}
          <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <g className="w-chart-x" style={{ opacity: at == null ? 0 : 1, transform: `translateX(${p[0]}px)` }}><line x1={0} x2={0} y1={0} y2={height} /></g>
          <g className="w-chart-x" style={{ opacity: at == null ? 0 : 1, transform: `translate(${p[0]}px, ${p[1]}px)` }}><circle r={4.5} fill={color} className="w-chart-dot" /></g>
        </svg>
        <div className="w-chart-tip" aria-hidden style={{ opacity: at == null ? 0 : 1, transform: `translate(calc(${Math.min(Math.max(p[0], 56), w - 56)}px - 50%), calc(${p[1] - 14}px - 100%))` }}>
          <span>{labels[cur]}</span><b>{format(data[cur] ?? 0)}</b>
        </div>
      </div>
      <div className="w-chart-labels" aria-hidden>{labels.map((l, i) => <span key={i} className={at === i ? 'on' : undefined}>{l}</span>)}</div>
      <span className="w-sr" aria-live="polite">{at != null ? `${labels[at]}: ${format(data[at] ?? 0)}` : ''}</span>
      <SrTable caption={label} rows={data.map((v, i) => [labels[i] ?? String(i + 1), format(v)])} />
    </figure>
  )
}

/* ───────── Bars ───────── */

export type BarsProps = {
  /** One value per period or category, in reading order. */
  data: number[]
  /** A short name under each bar: "Jun", "Kulfi". */
  labels: string[]
  /** What it shows, for screen readers: "Paid out by month". */
  label: string
  format?: Fmt
  /** px, including the labels. @default 140 */
  height?: number
  /** @default 'var(--chart-1)' */
  color?: string
  /** One bar in full colour, the rest softer: the current month, the selected pod. 'none' for all equal. @default 'last' */
  highlight?: number | 'last' | 'none'
  className?: string
}

/** Amounts side by side, from a zero baseline. Hover or ←/→ for each value. */
export function Bars({ data, labels, label, format = plain, height = 140, color = CHART_COLORS[0], highlight = 'last', className }: BarsProps) {
  const { at, setAt, onKey, onBlur } = usePoint(data.length)
  const max = Math.max(0, ...data) || 1
  const hl = highlight === 'last' ? data.length - 1 : highlight === 'none' ? -1 : highlight
  return (
    <figure className={cx('w-chart', className)}>
      <div className="w-bars" style={{ height }} tabIndex={0} role="group" aria-roledescription="chart" aria-label={`${label}. Use the arrow keys to read each value.`} onKeyDown={onKey} onBlur={onBlur} onPointerLeave={() => setAt(null)}>
        {data.map((v, i) => {
          const soft = at != null ? at !== i : hl >= 0 && hl !== i
          return (
            <div key={i} className="w-bars-col" onPointerEnter={() => setAt(i)} aria-hidden>
              <div className="w-bars-area">
                {at === i && <div className="w-chart-tip w-bars-tip"><span>{labels[i]}</span><b>{format(v)}</b></div>}
                <div className="w-bars-bar" style={{ height: `${(Math.max(0, v) / max) * 100}%`, background: color, opacity: soft ? 0.4 : 1 }} />
              </div>
              <span className={cx('w-bars-l', at === i && 'on')}>{labels[i]}</span>
            </div>
          )
        })}
      </div>
      <span className="w-sr" aria-live="polite">{at != null ? `${labels[at]}: ${format(data[at] ?? 0)}` : ''}</span>
      <SrTable caption={label} rows={data.map((v, i) => [labels[i] ?? String(i + 1), format(v)])} />
    </figure>
  )
}

/* ───────── Share bar ───────── */

export type SharePart = { label: string; value: number; /** A chart token. Defaults follow the fixed order; 'var(--chart-other)' for the rest. */ color?: string }
export type ShareBarProps = {
  /** The parts of one whole, biggest decisions first: Converted, Approved, Mapped, Cancelled. Four at most; fold the rest into "Other". */
  parts: SharePart[]
  /** What the whole is, for screen readers: "Proposals by status". */
  label: string
  format?: Fmt
  /** A heading-sized total above the bar. */
  title?: ReactNode
  className?: string
}

/** How one whole splits: a single bar in parts, with a legend that names every part and its count. */
export function ShareBar({ parts, label, format = plain, title, className }: ShareBarProps) {
  const [at, setAt] = useState<number | null>(null)
  const total = parts.reduce((a, p) => a + Math.max(0, p.value), 0)
  const col = (p: SharePart, i: number) => p.color ?? (i < CHART_COLORS.length ? CHART_COLORS[i]! : 'var(--chart-other)')
  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0)
  return (
    <figure className={cx('w-chart w-share', className)}>
      {title != null && <div className="w-share-h">{title}</div>}
      <div className="w-share-bar" aria-hidden onPointerLeave={() => setAt(null)}>
        {total === 0 ? <i className="w-share-empty" /> : parts.map((p, i) => p.value > 0 && (
          <i key={i} style={{ flexGrow: p.value, background: col(p, i), opacity: at != null && at !== i ? 0.4 : 1 }} onPointerEnter={() => setAt(i)} />
        ))}
        {at != null && parts[at] && <span className="w-chart-tip w-share-tip"><span>{parts[at]!.label}</span><b>{format(parts[at]!.value)} · {pct(parts[at]!.value)}%</b></span>}
      </div>
      <ul className="w-share-legend" aria-label={label}>
        {parts.map((p, i) => (
          <li key={i} onPointerEnter={() => setAt(i)} onPointerLeave={() => setAt(null)}>
            <span className="w-share-dot" style={{ background: col(p, i) }} aria-hidden />{p.label} <b>{format(p.value)}</b>
            <span className="w-sr"> ({pct(p.value)}%)</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}

/* ───────── Panel ───────── */

export type ChartPanelProps = {
  /** Names the measure: "Closed by month", "Proposals". For one series this is its legend. */
  title: string
  /** A headline number beside the title: the total the chart breaks down. Rolls when it changes. */
  total?: number
  /** How the total reads. */
  format?: Fmt
  /** Controls on the right: a Segmented for Month / Quarter / Year. */
  actions?: ReactNode
  /** The chart. */
  children: ReactNode
  className?: string
}

/** The frame for one chart: title (and total) on the left, controls on the right, the chart below. */
export function ChartPanel({ title, total, format, actions, children, className }: ChartPanelProps) {
  return (
    <section className={cx('w-panel', className)} aria-label={title}>
      <header className="w-panel-h">
        <h3>{title}</h3>
        {total != null && <span className="w-panel-t"><Ticker value={total} format={format} /></span>}
        {actions != null && <div className="w-panel-a">{actions}</div>}
      </header>
      {children}
    </section>
  )
}
