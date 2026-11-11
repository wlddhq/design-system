'use client'
import { useId, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, Search, type LucideIcon } from 'lucide-react'
import { cx } from '../cx'
import { MenuItem, Popover } from '../popover/Popover'

export type RadioOption<T extends string> = { value: T; label: ReactNode; description?: ReactNode; icon?: LucideIcon; disabled?: boolean }

export type RadioGroupProps<T extends string> = {
  value: T | null
  onChange: (value: T) => void
  options: RadioOption<T>[]
  /** list: a column of rows with a round mark. cards: tiles in a row, for two to four visual choices. @default 'list' */
  variant?: 'list' | 'cards'
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  className?: string
}

/** Picks one of a few visible options. Arrow keys move between them (native radios). */
export function RadioGroup<T extends string>({ value, onChange, options, variant = 'list', id, className, ...aria }: RadioGroupProps<T>) {
  const name = useId()
  return (
    <div id={id} role="radiogroup" className={cx('w-radios', className)} data-variant={variant} aria-describedby={aria['aria-describedby']} aria-invalid={aria['aria-invalid']}>
      {options.map((o) => (
        <label key={o.value} className="w-radio" data-on={value === o.value || undefined} data-disabled={o.disabled || undefined}>
          <input type="radio" name={name} value={o.value} checked={value === o.value} disabled={o.disabled} onChange={() => onChange(o.value)} />
          {variant === 'cards' && o.icon ? <o.icon size={18} aria-hidden /> : <i aria-hidden />}
          <span className="w-radio-t"><b>{o.label}</b>{o.description != null && <span>{o.description}</span>}</span>
        </label>
      ))}
    </div>
  )
}

export type MultiSelectOption<T extends string> = { value: T; label: string; lead?: ReactNode; hint?: ReactNode }

export type MultiSelectProps<T extends string> = {
  value: T[]
  onChange: (value: T[]) => void
  options: MultiSelectOption<T>[]
  /** Shown when nothing is chosen. @default 'Select' */
  placeholder?: string
  /** Search box at the top of the menu. On by default past 7 options. */
  searchable?: boolean
  /** Menu width in px. Defaults to the field's width. */
  width?: number
  disabled?: boolean
  id?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  className?: string
}

/**
 * Picks several from a list: the team, the services. A field that opens a checkable menu with search.
 * The field lists the first two choices, then "+n".
 */
export function MultiSelect<T extends string>({ value, onChange, options, placeholder = 'Select', searchable, width, disabled, id, className, ...aria }: MultiSelectProps<T>) {
  const [q, setQ] = useState('')
  const field = useRef<HTMLButtonElement>(null)
  const chosen = options.filter((o) => value.includes(o.value))
  const search = searchable ?? options.length > 7
  const needle = q.trim().toLowerCase()
  const shown = needle ? options.filter((o) => o.label.toLowerCase().includes(needle)) : options
  const flip = (v: T) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  const summary = chosen.length === 0 ? <span className="w-ms-ph">{placeholder}</span>
    : <>{chosen.slice(0, 2).map((o) => o.label).join(', ')}{chosen.length > 2 && <span className="w-ms-more">+{chosen.length - 2}</span>}</>
  return (
    <Popover align="start" width={width ?? (field.current?.offsetWidth || 260)} className="w-ms-pop" trigger={
      <button ref={field} type="button" id={id} disabled={disabled || options.length === 0} className={cx('w-input w-ms', className)}
        aria-describedby={aria['aria-describedby']} aria-invalid={aria['aria-invalid']} onClick={() => setQ('')}>
        <span className="w-ms-v">{summary}</span><ChevronDown size={14} className="w-ms-chev" aria-hidden />
      </button>
    }>
      {search && (
        <label className="w-ms-q"><Search size={14} aria-hidden /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search"
          onKeyDown={(e) => { if (e.key === 'Enter' && shown[0]) { e.preventDefault(); flip(shown[0].value) } }} /></label>
      )}
      {shown.map((o) => <MenuItem key={o.value} lead={o.lead} hint={o.hint} checked={value.includes(o.value)} keepOpen onSelect={() => flip(o.value)}>{o.label}</MenuItem>)}
      {shown.length === 0 && <div className="w-ms-none">No match for “{q}”</div>}
      {value.length > 0 && <><div className="w-menu-sep" /><MenuItem keepOpen onSelect={() => onChange([])}>Clear</MenuItem></>}
    </Popover>
  )
}
