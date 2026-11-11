import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cx } from '../cx'

export type EmptyProps = {
  icon?: LucideIcon
  /** One bold word or two: "Clear", "No campaigns". */
  title: string
  /** At most one short line. */
  children?: ReactNode
  /** One Button, when there's an obvious next step. */
  action?: ReactNode
  className?: string
}

/** What a list or page shows when there's nothing in it. */
export function Empty({ icon: Icon, title, children, action, className }: EmptyProps) {
  return (
    <div className={cx('w-empty', className)}>
      {Icon && <Icon size={20} aria-hidden />}
      <b>{title}</b>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}
