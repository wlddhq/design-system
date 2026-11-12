import type { ReactNode } from 'react'
import { cx } from '../cx'
import { Ticker } from '../motion/Ticker'
import { Sparkline } from '../sparkline/Sparkline'

export type MetricsProps = {
  /** Two to four Metrics. More than four: make two groups, or a table. */
  children: ReactNode
  /** One per row, divided by hairlines: for a side panel beside the work. @default false */
  stacked?: boolean
  /** Names the group for screen readers: "This month". */
  label?: string
  className?: string
}

/** A row of headline numbers in one frame, divided by hairlines. Phones stack them. */
export function Metrics({ children, stacked, label, className }: MetricsProps) {
  return <div className={cx('w-metrics', stacked && 'w-metrics-stack', className)} role="group" aria-label={label}>{children}</div>
}

export type MetricProps = {
  /** One or two words: "Billing", "To approve", "Live". */
  label: ReactNode
  /** The number (it rolls when it changes), or a finished node. */
  value: number | ReactNode
  /** How the number reads: ₹ amounts, compact counts, a percentage. @default n => n.toLocaleString('en-IN') */
  format?: (n: number) => string
  /** green when the number is good news against a target (margin above plan); pink when it needs action. Never for direction. */
  tone?: 'green' | 'pink'
  /** A small line under the value: "of ₹40L planned", "+12% this week". */
  note?: ReactNode
  /** The last few values, oldest first: a small trend beside the number. */
  series?: number[]
  /** Makes the tile a button: ask about it, filter by it, peek at it. */
  onClick?: () => void
  /** With onClick: this tile is the one being shown. */
  pressed?: boolean
  /** Makes the tile a link to its page. */
  href?: string
  className?: string
}

/** One headline number: a quiet label above, the value, and an optional trend. */
export function Metric({ label, value, format, tone, note, series, onClick, pressed, href, className }: MetricProps) {
  const body = (
    <>
      <span className="w-metric-l">{label}</span>
      <span className="w-metric-r">
        <span className="w-metric-v" data-tone={tone}>{typeof value === 'number' ? <Ticker value={value} format={format} /> : value}</span>
        {series && series.length > 1 && <Sparkline data={series} width={56} height={20} tone="fg" fill={false} className="w-metric-s" />}
      </span>
      {note != null && <span className="w-metric-n">{note}</span>}
    </>
  )
  const cls = cx('w-metric', className)
  if (href) return <a className={cls} href={href}>{body}</a>
  if (onClick) return <button type="button" className={cls} onClick={onClick} aria-pressed={pressed}>{body}</button>
  return <div className={cls}>{body}</div>
}
