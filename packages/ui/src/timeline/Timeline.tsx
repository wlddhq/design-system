'use client'
import { createContext, useContext, useLayoutEffect, useRef, type ReactNode } from 'react'
import { cx } from '../cx'
import { Tooltip } from '../tooltip/Tooltip'

const DAY = 864e5
const PX = { week: 16, month: 6, quarter: 3 } as const
const short = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
type Ctx = { from: number; dw: number; width: number }
const TlCtx = createContext<Ctx>({ from: 0, dw: 16, width: 0 })

export type TimelineProps = {
  /** First day shown. It snaps back to a Monday. */
  start: Date
  /** How many days across. @default 168 (24 weeks) */
  days?: number
  /** week shows day numbers; month and quarter pack more time in. @default 'week' */
  zoom?: 'week' | 'month' | 'quarter'
  /** Draws the pink Today line and scrolls it into view. @default new Date() */
  today?: Date
  /** TimelineGroups and TimelineRows. */
  children: ReactNode
  className?: string
}

/**
 * Records as bars on a calendar: when each one runs, and how far along it is.
 * The name column stays put while time scrolls sideways; it opens scrolled to today.
 */
export function Timeline({ start, days = 168, zoom = 'week', today = new Date(), children, className }: TimelineProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const from = new Date(start); from.setHours(0, 0, 0, 0)
  from.setDate(from.getDate() - ((from.getDay() + 6) % 7)) // Monday
  const dw = PX[zoom]
  const width = days * dw
  const x = (d: Date) => ((d.getTime() - from.getTime()) / DAY) * dw

  useLayoutEffect(() => {
    const s = scroller.current
    if (!s) return
    const name = parseFloat(getComputedStyle(s).getPropertyValue('--tl-name')) || 300
    s.scrollLeft = Math.max(0, x(today) - Math.min(320, (s.clientWidth - name) / 3))
  }, [zoom]) // eslint-disable-line react-hooks/exhaustive-deps

  const months: { i: number; label: string }[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(from.getTime() + i * DAY)
    if (i === 0 || d.getDate() === 1) months.push({ i, label: d.toLocaleDateString('en-GB', { month: 'short' }) + (d.getMonth() === 0 || i === 0 ? ' ' + d.getFullYear() : '') })
  }
  const weeks = Array.from({ length: Math.ceil(days / 7) }, (_, i) => new Date(from.getTime() + i * 7 * DAY))
  const t = x(today)

  return (
    <TlCtx.Provider value={{ from: from.getTime(), dw, width }}>
      <div ref={scroller} className={cx('w-tl', className)}>
        <div className="w-tl-in" style={{ width: `calc(var(--tl-name) + ${width}px)` }}>
          <div className="w-tl-head">
            <div className="w-tl-name w-tl-corner" />
            <div className="w-tl-scale" style={{ width }}>
              {months.map((m) => <span key={m.i} className="w-tl-m" style={{ left: m.i * dw }}>{m.label}</span>)}
              {zoom === 'week' && weeks.map((w, i) => <span key={i} className="w-tl-w" style={{ left: i * 7 * dw }}>{w.getDate()}</span>)}
            </div>
          </div>
          <div className="w-tl-body">
            <div className="w-tl-grid" style={{ width, backgroundSize: `${7 * dw}px 100%` }} />
            {t >= 0 && t <= width && <div className="w-tl-today" style={{ left: `calc(var(--tl-name) + ${t}px)` }}><span>Today</span></div>}
            {children}
          </div>
        </div>
      </div>
    </TlCtx.Provider>
  )
}

/** A group band across the timeline: stage, pod or lead. Rows follow it. */
export function TimelineGroup({ icon, label, count }: { icon?: ReactNode; label: ReactNode; count?: number }) {
  return <div className="w-tl-g"><div className="w-tl-name">{icon}<span className="w-tl-gl">{label}</span>{count != null && <span className="w-tl-gn">{count}</span>}</div></div>
}

export type TimelineRowProps = {
  /** The frozen left cell: ProgressIcon, Logo and the name (a ListTitle reads well here). */
  name: ReactNode
  start: Date
  /** Leave out for "about a month". */
  end?: Date
  /** Bar colour: yellow while set up, green when live, violet when complete. @default 'neutral' */
  tone?: 'neutral' | 'green' | 'violet' | 'pink' | 'yellow'
  /** How far along, 0 to 1: a deeper fill from the left. */
  progress?: number
  /** Text inside the bar, shown when the bar is wide enough. */
  label?: ReactNode
  /** Extra text after the label on long bars, e.g. the budget. */
  detail?: ReactNode
  onClick?: () => void
}

/** One record: its name on the left, its bar on the calendar. */
export function TimelineRow({ name, start, end, tone = 'neutral', progress = 0, label, detail, onClick }: TimelineRowProps) {
  const { from, dw, width } = useContext(TlCtx)
  const fin = end ?? new Date(start.getTime() + 30 * DAY)
  const l = ((start.getTime() - from) / DAY) * dw
  const w = Math.max(dw * 2, ((fin.getTime() - start.getTime()) / DAY) * dw)
  const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0))
  return (
    <div className="w-tl-row">
      <button type="button" className="w-tl-name" onClick={onClick}>{name}</button>
      <div className="w-tl-track" style={{ width }}>
        <Tooltip label={`${short(start)} → ${short(fin)}`} className="w-tl-tipw">
          <button type="button" className="w-tl-bar" data-tone={tone} style={{ left: l, width: w }} onClick={onClick}>
            <i style={{ transform: `scaleX(${p})` }} />
            <span>{w > 120 ? label : null}{w > 220 && detail != null ? <span className="w-tl-amt"> · {detail}</span> : null}</span>
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
