import type { HTMLAttributes } from 'react'
import { cx } from '../cx'

/** A keyboard key hint. Use inside buttons, menus and tooltips — never as decoration. */
export function Kbd({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <kbd className={cx('w-kbd', className)} {...rest} />
}
