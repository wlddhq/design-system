'use client'
import type { KeyboardEvent, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cx } from '../cx'

/** Arrow keys, Home and End move between options and select them; Tab leaves the group (one tab stop). */
function rove<T extends string>(e: KeyboardEvent<HTMLDivElement>, items: TabItem<T>[], value: T, onChange: (v: T) => void) {
  const i = items.findIndex((it) => it.value === value)
  const n = items.length
  const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i + 1) % n
    : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i - 1 + n) % n
    : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1
  if (next < 0 || n === 0) return
  e.preventDefault()
  onChange(items[next]!.value)
  const btn = e.currentTarget.querySelectorAll<HTMLButtonElement>('button')[next]
  btn?.focus()
  btn?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}
// The selected option is the tab stop; with none selected, the first one is.
const stop = <T extends string>(items: TabItem<T>[], value: T, v: T, k: number) =>
  v === value || (k === 0 && !items.some((it) => it.value === value)) ? 0 : -1

export type TabItem<T extends string> = { value: T; label: ReactNode; count?: number; icon?: LucideIcon }

export type TabsProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  items: TabItem<T>[]
  /** pill for view tabs in a toolbar (All · Active · Pipeline); underline for page sections. @default 'pill' */
  variant?: 'pill' | 'underline'
  className?: string
}

/** Switches between views of the same records, or sections of one page. Counts sit beside labels. */
export function Tabs<T extends string>({ value, onChange, items, variant = 'pill', className }: TabsProps<T>) {
  return (
    <div className={cx('w-tabs', className)} data-variant={variant} role="tablist" onKeyDown={(e) => rove(e, items, value, onChange)}>
      {items.map((it, k) => (
        <button key={it.value} type="button" role="tab" aria-selected={value === it.value} tabIndex={stop(items, value, it.value, k)} className="w-tab" onClick={() => onChange(it.value)}>
          {it.icon && <it.icon size={14} aria-hidden />}
          {it.label}
          {it.count != null && <span className="w-tab-n">{it.count}</span>}
        </button>
      ))}
    </div>
  )
}

export type SegmentedProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  items: TabItem<T>[]
  /** @default 'md' */
  size?: 'md' | 'sm'
  className?: string
}

/** Picks one of two to five options in place: Light · Dark · System, List · Board. */
export function Segmented<T extends string>({ value, onChange, items, size = 'md', className }: SegmentedProps<T>) {
  return (
    <div className={cx('w-seg', className)} data-size={size} role="radiogroup" onKeyDown={(e) => rove(e, items, value, onChange)}>
      {items.map((it, k) => (
        <button key={it.value} type="button" role="radio" aria-checked={value === it.value} tabIndex={stop(items, value, it.value, k)} onClick={() => onChange(it.value)}>
          {it.icon && <it.icon size={14} aria-hidden />}
          {it.label}
          {it.count != null && <span className="w-tab-n">{it.count}</span>}
        </button>
      ))}
    </div>
  )
}
