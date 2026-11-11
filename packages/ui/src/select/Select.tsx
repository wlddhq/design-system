'use client'
import type { ReactNode } from 'react'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import { Button } from '../button/Button'
import { MenuItem, Popover } from '../popover/Popover'

export type SelectOption<T extends string> = { value: T; label: ReactNode; icon?: LucideIcon; lead?: ReactNode }

export type SelectProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: SelectOption<T>[]
  /** @default 'end' */
  align?: 'start' | 'end'
  /** Menu width in px. @default 180 */
  width?: number
  /** Accessible name when the visible label isn't enough. */
  label?: string
  /** Shown when the value matches no option (nothing chosen yet). @default 'Select' */
  placeholder?: string
  disabled?: boolean
}

/** Picks one option from a short list. A small button that opens a menu. */
export function Select<T extends string>({ value, onChange, options, align = 'end', width = 180, label, disabled, placeholder = 'Select' }: SelectProps<T>) {
  // An unknown value shows the placeholder (never a wrong option); no options disables the button.
  const cur = options.find((o) => o.value === value)
  return (
    <Popover align={align} width={width} trigger={
      <Button size="sm" icon={cur?.icon} disabled={disabled || options.length === 0} aria-label={label} className="w-select">
        {cur ? <>{cur.lead}<span className="w-select-t">{cur.label}</span></> : <span className="w-select-t w-select-ph">{placeholder}</span>}<ChevronDown size={13} className="w-select-chev" aria-hidden />
      </Button>
    }>
      {options.map((o) => (
        <MenuItem key={o.value} icon={o.icon} lead={o.lead} checked={o.value === value} onSelect={() => onChange(o.value)}>{o.label}</MenuItem>
      ))}
    </Popover>
  )
}
