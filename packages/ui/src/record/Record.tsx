import type { ReactNode } from 'react'
import { cx } from '../cx'

export type RecordHeaderProps = {
  /** The record's Logo, size 40. */
  lead?: ReactNode
  title: ReactNode
  /** Muted, after the title: "× Always-on Q4". */
  sub?: ReactNode
  /** One quiet line under the title: pod, services. */
  meta?: ReactNode
  /** Right side: icon buttons, then at most one primary ("Move to Activation"). */
  actions?: ReactNode
  className?: string
}

/** The top of a record page: who it is, the one line that places it, and what to do next. */
export function RecordHeader({ lead, title, sub, meta, actions, className }: RecordHeaderProps) {
  return (
    <header className={cx('w-rhead', className)}>
      {lead}
      <div className="w-rhead-t">
        <h1>{title}{sub != null && <> <span className="w-rhead-sub">{sub}</span></>}</h1>
        {meta != null && <div className="w-rhead-meta">{meta}</div>}
      </div>
      {actions != null && <div className="w-rhead-a">{actions}</div>}
    </header>
  )
}

export type StepperProps = {
  /** Every stage, in order. */
  steps: string[]
  /** The current stage (0-based). Past stages fill dark, the current one green; steps.length means all done. */
  value: number
  className?: string
}

/** Where a record is in its whole journey: one bar per stage, with names. Phones keep the bars and drop the names. */
export function Stepper({ steps, value, className }: StepperProps) {
  const v = Number.isFinite(value) ? Math.max(0, Math.min(value, steps.length)) : 0
  return (
    <ol className={cx('w-stepper', className)} style={{ gridTemplateColumns: `repeat(${Math.max(1, steps.length)}, 1fr)` }}>
      {steps.map((s, i) => {
        const st = i < v ? 'done' : i === v ? 'cur' : undefined
        return (
          <li key={s} className="w-step" data-s={st} aria-current={st === 'cur' ? 'step' : undefined}>
            <span className="w-step-bar"><i style={{ transform: `scaleX(${st === 'done' ? 1 : st === 'cur' ? 0.4 : 0})` }} /></span>
            <span className="w-step-l">{s}</span>
          </li>
        )
      })}
    </ol>
  )
}

/** A strip of two to four key numbers in one frame: Budget · Plan cost · Margin. */
export function Metrics({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('w-metrics', className)}>{children}</div>
}

export type MetricProps = {
  label: ReactNode
  /** The number, already formatted: "₹22L", "31%". */
  value: ReactNode
  /** green when the number is good news. */
  tone?: 'green' | 'pink'
  /** A small line under the value: "+12% this week". */
  note?: ReactNode
}

export function Metric({ label, value, tone, note }: MetricProps) {
  return (
    <div className="w-metric">
      <span className="w-metric-l">{label}</span>
      <span className="w-metric-v" data-tone={tone}>{value}</span>
      {note != null && <span className="w-metric-n">{note}</span>}
    </div>
  )
}

/** Label-value rows down the side of a record: Lead, Team, Started, Drive… */
export function PropertyList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('w-props', className)}>{children}</div>
}

/** One row: a muted label on the left, the value (text, Avatar, Chip, Switch) on the right. */
export function Property({ label, children }: { label: ReactNode; children: ReactNode }) {
  return <div className="w-prop"><span className="w-prop-l">{label}</span><span className="w-prop-v">{children}</span></div>
}

/** A hairline between groups of properties. */
export const PropertySeparator = () => <div className="w-prop-sep" role="separator" />

/** A record page's body: the main column, and a 280px side column for properties. Stacks on phones. */
export function RecordLayout({ children, side, className }: { children: ReactNode; side?: ReactNode; className?: string }) {
  return (
    <div className={cx('w-rlayout', className)} data-side={side != null || undefined}>
      <div className="w-rlayout-main">{children}</div>
      {side != null && <aside className="w-rlayout-side">{side}</aside>}
    </div>
  )
}
