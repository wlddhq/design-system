'use client'
import { cx } from '../cx'

export type SwitchProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Required: what it turns on ("Show completed"). */
  label: string
  disabled?: boolean
  className?: string
}

/** Turns a setting on or off, taking effect immediately. */
export function Switch({ checked, onChange, label, disabled, className }: SwitchProps) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled}
      className={cx('w-switch', className)} data-on={checked || undefined}
      onClick={(e) => { e.stopPropagation(); onChange(!checked) }}>
      <i />
    </button>
  )
}