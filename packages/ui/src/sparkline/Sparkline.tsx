import { useId } from 'react'
import { cx } from '../cx'

export type SparklineProps = {
  /** The values, oldest first. Two or more. */
  data: number[]
  /** Drawn width in px; it also stretches to its container. @default 80 */
  width?: number
  /** @default 24 */
  height?: number
  /** A token colour: 'green' when it's going well, 'muted' otherwise. @default 'muted' */
  tone?: 'muted' | 'green' | 'violet' | 'pink' | 'yellow' | 'fg'
  /** A soft fill under the line. @default true */
  fill?: boolean
  className?: string
}

const COL = { muted: 'var(--muted)', green: 'var(--green)', violet: 'var(--violet)', pink: 'var(--pink)', yellow: 'var(--yellow)', fg: 'var(--fg)' }

/** A tiny trend line, no axes. Shape over numbers: put the number beside it. */
export function Sparkline({ data, width = 80, height = 24, tone = 'muted', fill = true, className }: SparklineProps) {
  const id = 'sp' + useId().replace(/:/g, '')
  const vals = data.filter(Number.isFinite)
  const pts = vals.length < 2 ? [[2, height / 2], [width - 2, height / 2]] : (() => {
    const lo = Math.min(...vals), hi = Math.max(...vals), span = hi - lo || 1
    return vals.map((v, i) => [2 + (i / (vals.length - 1)) * (width - 4), 3 + (1 - (v - lo) / span) * (height - 6)])
  })()
  // Smooth: straight to the first midpoint, curve through each point to the next midpoint, straight to the end.
  const f = (p: number[]) => `${p[0]!.toFixed(1)},${p[1]!.toFixed(1)}`
  const mid = (a: number[], b: number[]) => [(a[0]! + b[0]!) / 2, (a[1]! + b[1]!) / 2]
  let d = `M${f(pts[0]!)} L${f(mid(pts[0]!, pts[1]!))}`
  for (let i = 1; i < pts.length - 1; i++) d += ` Q${f(pts[i]!)} ${f(mid(pts[i]!, pts[i + 1]!))}`
  d += ` L${f(pts[pts.length - 1]!)}`
  const c = COL[tone]
  return (
    <svg className={cx('w-spark', className)} viewBox={`0 0 ${width} ${height}`} width={width} height={height} preserveAspectRatio="none" aria-hidden>
      {fill && (
        <>
          <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={c} stopOpacity=".22" /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient></defs>
          <path d={`${d} L${width - 2},${height} L2,${height} Z`} fill={`url(#${id})`} />
        </>
      )}
      <path d={d} fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
