'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cx } from '../cx'
import { Button } from '../button/Button'

const fmt = (n: number) => n.toLocaleString('en-IN')

export type SelectionBarProps = {
  /** How many are selected. The bar hides at 0. */
  count: number
  /** Bulk actions: small Buttons. */
  children?: ReactNode
  /** Word after the count. @default 'selected' */
  noun?: string
  /**
   * How many records match the current view, loaded or not. With `onSelectAll`, the bar offers
   * "Select all 1,240" while only some are selected, so a bulk action never silently skips unloaded rows.
   */
  total?: number
  onSelectAll?: () => void
  /** Clears the selection: adds the × button and makes Escape clear too. */
  onClear?: () => void
  className?: string
}

/** Floats at the bottom while rows are selected, with the bulk actions. */
export function SelectionBar({ count, children, noun = 'selected', total, onSelectAll, onClear, className }: SelectionBarProps) {
  const clear = useRef(onClear)
  clear.current = onClear
  const shown = count > 0
  const canClear = !!onClear

  useEffect(() => {
    if (!shown || !canClear) return
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return
      // Escape closes an open menu first; the next press clears.
      if (document.querySelector('.w-pop')) return
      // Escape inside a text field belongs to the field.
      const t = e.target
      if (t instanceof Element && t.closest('input, textarea, [contenteditable="true"]')) return
      clear.current?.()
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [shown, canClear])

  if (!shown) return null
  const all = total != null && count >= total
  return (
    <div className={cx('w-selbar', className)} role="toolbar" aria-label={`${fmt(count)} ${noun}`}>
      <span className="w-selbar-n">{all && count > 1 ? `All ${fmt(count)}` : fmt(count)}</span>
      <span className="w-selbar-l">{noun}</span>
      {!all && total != null && onSelectAll && (
        <button type="button" className="w-selbar-all" onClick={onSelectAll}>Select all {fmt(total)}</button>
      )}
      {children}
      {onClear && <Button size="sm" icon={X} aria-label="Clear selection" onClick={onClear} />}
    </div>
  )
}
