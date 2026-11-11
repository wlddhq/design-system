'use client'
import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../cx'

/* ───────── Frame ───────── */

export type AppShellProps = {
  /** A <Sidebar>. */
  sidebar: ReactNode
  /** TopBar, Toolbar and PageScroll. */
  children: ReactNode
  /** Phones and tablets: the sidebar is a drawer. Control it with these. */
  sidebarOpen?: boolean
  onSidebarClose?: () => void
  className?: string
  style?: CSSProperties
}

/** The DMS frame (Velin): sidebar on the page colour, main panel flush beside it with one hairline. */
export function AppShell({ sidebar, children, sidebarOpen, onSidebarClose, className, style }: AppShellProps) {
  return (
    <div className={cx('w-app', className)} style={style} data-drawer={sidebarOpen || undefined}>
      {sidebar}
      <div className="w-scrim" onClick={onSidebarClose} aria-hidden />
      <main className="w-main">{children}</main>
    </div>
  )
}
