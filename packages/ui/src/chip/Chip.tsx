import type { HTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cx } from '../cx'

export type Tone = 'neutral' | 'green' | 'violet' | 'pink' | 'yellow'

export type ChipProps = {
  /** neutral by default. Colour means status, never decoration. @default 'neutral' */
  tone?: Tone
  icon?: LucideIcon
  children: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

/** A short label or status: "Paid", "Overdue", "3 links". */
export function Chip({ tone = 'neutral', icon: Icon, children, className, ...rest }: ChipProps) {
  return (
    <span className={cx('w-chip', className)} data-tone={tone} {...rest}>
      {Icon && <Icon size={12} aria-hidden />}
      <span className="w-chip-t">{children}</span>
    </span>
  )
}

export type TagProps = { children: ReactNode; className?: string } & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

/** A short code in mono: service codes like AMP, INF, MEMD. Put the full name in a Tooltip. */
export function Tag({ children, className, ...rest }: TagProps) {
  return <span className={cx('w-tag', className)} {...rest}>{children}</span>
}

/** A row of Tags with the right gap. */
export function TagList({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx('w-tags', className)}>{children}</span>
}
