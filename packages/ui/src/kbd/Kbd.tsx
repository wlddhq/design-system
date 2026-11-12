'use client'
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../cx'
import { useKeys } from './keys'

export type KbdProps = HTMLAttributes<HTMLElement> & {
  /** The shortcut, written once for every platform: "mod+k", "alt+1", "shift+mod+b", "c". Shows ⌘K on a Mac, Ctrl K on Windows. */
  children?: ReactNode
}

/** A keyboard key hint. Use inside buttons, menus and tooltips — never as decoration. */
export function Kbd({ className, children, ...rest }: KbdProps) {
  const keys = useKeys()
  return <kbd className={cx('w-kbd', className)} {...rest}>{typeof children === 'string' ? keys(children) : children}</kbd>
}
