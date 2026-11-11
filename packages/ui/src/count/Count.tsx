import type { ReactNode } from 'react'
import { cx } from '../cx'

/** A muted number beside a label: "Campaigns 28", "Approvals 3". Never a sentence. Numbers get Indian grouping (12,40,000). */
export function Count({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx('w-count', className)}>{typeof children === 'number' ? children.toLocaleString('en-IN') : children}</span>
}
