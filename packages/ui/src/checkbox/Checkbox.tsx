'use client'
import type { MouseEvent } from 'react'
import { cx } from '../cx'

export type CheckboxProps = {
  checked: boolean
  /** Some, not all, selected (a table's header checkbox). */
  indeterminate?: boolean
  onChange: (checked: boolean) => void
  /** Required: what the box selects ("Select Lenskart × Wrapped", "Select all"). */
  label: string
  disabled?: boolean
  className?: string
}

/** Selects a row or an option. Clicks don't bubble, so it's safe inside clickable rows. */
export function Checkbox({ checked, indeterminate, onChange, label, disabled, className }: CheckboxProps) {
  const on = checked || indeterminate
  return (
    <button type="button" role="checkbox" aria-checked={indeterminate ? 'mixed' : checked} aria-label={label} disabled={disabled}
      className={cx('w-check', className)} data-on={on || undefined}
      onClick={(e: MouseEvent) => { e.stopPropagation(); onChange(!checked) }}>
      {indeterminate ? (
        <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden><path d="M1.5 4.5h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      ) : checked ? (
        <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
      ) : null}
    </button>
  )
}