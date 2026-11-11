'use client'
import type { LucideIcon } from 'lucide-react'
import { cx } from '../cx'

export type ViewOption<T extends string> = { value: T; label: string; icon: LucideIcon }

export type ViewPickerProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  /** The layouts: List, Board, Table, Timeline, Grid. Two to six. */
  items: ViewOption<T>[]
  className?: string
}

/** Picks how records are laid out, as icon tiles. The top of a Display popover. */
export function ViewPicker<T extends string>({ value, onChange, items, className }: ViewPickerProps<T>) {
  return (
    <div className={cx('w-views', className)} role="radiogroup" aria-label="Layout" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {items.map((it) => (
        <button key={it.value} type="button" role="radio" aria-checked={value === it.value} className="w-view" onClick={() => onChange(it.value)}>
          <it.icon size={15} aria-hidden />{it.label}
        </button>
      ))}
    </div>
  )
}

export type ToggleChipsProps<T extends string> = {
  /** Which are on. */
  value: T[]
  onChange: (value: T[]) => void
  items: { value: T; label: string }[]
  /** Accessible name for the group, e.g. "Properties". */
  label?: string
  className?: string
}

/** Turns several options on and off at once, as small pills: the properties a view shows. */
export function ToggleChips<T extends string>({ value, onChange, items, label, className }: ToggleChipsProps<T>) {
  return (
    <div className={cx('w-tchips', className)} role="group" aria-label={label}>
      {items.map((it) => {
        const on = value.includes(it.value)
        return (
          <button key={it.value} type="button" aria-pressed={on} className="w-tchip"
            onClick={() => onChange(on ? value.filter((v) => v !== it.value) : [...value, it.value])}>{it.label}</button>
        )
      })}
    </div>
  )
}
