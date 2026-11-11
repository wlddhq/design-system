import type { ElementType, ReactNode } from 'react'
import { cx } from '../cx'

const fmt = (n: number) => n.toLocaleString('en-IN')

/** Cards in a responsive grid: as many 300px-plus columns as fit, one on phones. */
export function CardGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('w-cgrid', className)}>{children}</div>
}

/** A labelled run of cards in a Grid view: "Activation 9", then its CardGrid. */
export function CardGroup({ icon, label, count, children }: { icon?: ReactNode; label?: ReactNode; count?: number; children: ReactNode }) {
  return (
    <section className="w-cgroup">
      {/* A div, not an h3: host pages often style headings, which would resize it. */}
      {label != null && <div className="w-cgroup-h" role="heading" aria-level={3}>{icon}<span>{label}</span>{count != null && <span className="w-cgroup-n">{fmt(count)}</span>}</div>}
      <CardGrid>{children}</CardGrid>
    </section>
  )
}

export type RecordCardProps = {
  href?: string
  onClick?: () => void
  as?: ElementType
  /** A Logo (size 32) for the record. */
  lead?: ReactNode
  title: ReactNode
  /** Muted text after the title: the activity. */
  sub?: ReactNode
  /** Muted line under the title: code and pod. */
  caption?: ReactNode
  /** Top right: the lead's Avatar. */
  corner?: ReactNode
  /** The middle: usually a Sparkline. */
  children?: ReactNode
  /** The status line: ProgressIcon + stage, tags, and the amount on the right (wrap the amount in <span className="ml-auto">). */
  footer?: ReactNode
  /** A muted last line: dates, "Updated 2h ago". */
  meta?: ReactNode
  className?: string
}

/** One record as a card: who, how it's trending, where it stands. The whole card opens it. */
export function RecordCard({ href, onClick, as, lead, title, sub, caption, corner, children, footer, meta, className }: RecordCardProps) {
  const C: ElementType = as ?? (href ? 'a' : onClick ? 'button' : 'div')
  return (
    <C className={cx('w-rcard', className)} href={href} onClick={onClick} type={C === 'button' ? 'button' : undefined}>
      <span className="w-rcard-head">
        {lead}
        <span className="w-rcard-t">
          <span className="w-rcard-title"><b>{title}</b>{sub != null && <> <span className="w-rcard-sub">× {sub}</span></>}</span>
          {caption != null && <span className="w-rcard-cap">{caption}</span>}
        </span>
        {corner}
      </span>
      {children != null && <span className="w-rcard-body">{children}</span>}
      {footer != null && <span className="w-rcard-foot">{footer}</span>}
      {meta != null && <span className="w-rcard-meta">{meta}</span>}
    </C>
  )
}
