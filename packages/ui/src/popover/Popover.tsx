'use client'
import {
  cloneElement, createContext, isValidElement, useContext, useEffect, useRef, useState,
  type CSSProperties, type MouseEvent, type ReactElement, type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import type { LucideIcon } from 'lucide-react'
import { Check } from 'lucide-react'
import { cx } from '../cx'
import { Kbd } from '../kbd/Kbd'

const PopCtx = createContext<{ close: () => void }>({ close: () => {} })
/** Inside a Popover: `const { close } = usePopover()` */
export const usePopover = () => useContext(PopCtx)

export type PopoverProps = {
  /** The element that opens it, usually a Button. It gets aria-expanded and shows as pressed while open. */
  trigger: ReactElement<{ onClick?: (e: MouseEvent) => void }>
  children: ReactNode
  /** Which edge of the trigger it lines up with. @default 'end' */
  align?: 'start' | 'end'
  /** Width in px. @default 220 */
  width?: number
  /** Open above or below; flips automatically when there's no room. */
  side?: 'top' | 'bottom'
  className?: string
}

type Pos = { top?: number; bottom?: number; left?: number; right?: number; side: 'top' | 'bottom'; maxHeight: number }

/**
 * Floating panel anchored to its trigger. Portalled and fixed, so tables and scroll areas never clip it.
 * Scales in from the trigger's corner. Closes on outside click, Escape, scroll and resize.
 */
export function Popover({ trigger, children, align = 'end', width = 220, side: forced, className }: PopoverProps) {
  const [pos, setPos] = useState<Pos | null>(null)
  const anchor = useRef<HTMLSpanElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const open = !!pos

  const place = (): Pos => {
    const r = anchor.current!.getBoundingClientRect()
    const side = forced || (window.innerHeight - r.bottom < 300 && r.top > 300 ? 'top' : 'bottom')
    const w = Math.min(width, window.innerWidth - 16)
    // Never taller than the room on its side: long menus scroll inside.
    const room = side === 'top' ? r.top - 14 : window.innerHeight - r.bottom - 14
    const p: Pos = { side, maxHeight: Math.max(120, room) }
    if (side === 'top') p.bottom = window.innerHeight - r.top + 6
    else p.top = r.bottom + 6
    if (align === 'start') p.left = Math.max(8, Math.min(r.left, window.innerWidth - 8 - w))
    else p.right = Math.max(8, Math.min(window.innerWidth - r.right, window.innerWidth - 8 - w))
    return p
  }
  const close = () => setPos(null)

  useEffect(() => {
    if (!open) return
    // Clicks inside this popover, or inside one opened from it (later in the DOM), keep it open.
    const inside = (t: EventTarget | null) => {
      const n = t as Node
      if (anchor.current?.contains(n) || panel.current?.contains(n)) return true
      const pops = [...document.querySelectorAll('.w-pop')]
      return pops.slice(pops.indexOf(panel.current!) + 1).some((p) => p.contains(n))
    }
    const down = (e: Event) => { if (!inside(e.target)) close() }
    const key = (e: KeyboardEvent) => {
      // Only the newest open popover answers keys.
      const pops = [...document.querySelectorAll('.w-pop')]
      if (pops[pops.length - 1] !== panel.current) return
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        anchor.current?.querySelector<HTMLElement>('button, a, [tabindex]')?.focus()
        return
      }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      const items = [...panel.current!.querySelectorAll<HTMLElement>('.w-menu-item:not(:disabled)')]
      if (!items.length) return
      e.preventDefault()
      const i = items.indexOf(document.activeElement as HTMLElement)
      const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i <= 0 ? items.length : i) - 1
      items[next]!.focus()
    }
    const away = (e: Event) => { if (!inside(e.target)) close() }
    document.addEventListener('mousedown', down)
    window.addEventListener('keydown', key)
    window.addEventListener('scroll', away, true)
    window.addEventListener('resize', away)
    return () => {
      document.removeEventListener('mousedown', down)
      window.removeEventListener('keydown', key)
      window.removeEventListener('scroll', away, true)
      window.removeEventListener('resize', away)
    }
  }, [open])

  const t = isValidElement(trigger)
    ? cloneElement(trigger, {
        'aria-expanded': open,
        'aria-haspopup': 'dialog',
        onClick: (e: MouseEvent) => { trigger.props.onClick?.(e); e.stopPropagation(); setPos(open ? null : place()) },
      } as Record<string, unknown>)
    : trigger

  const style: CSSProperties = {
    top: pos?.top, bottom: pos?.bottom, left: pos?.left, right: pos?.right, width, maxHeight: pos?.maxHeight,
    transformOrigin: `${pos?.side === 'top' ? 'bottom' : 'top'} ${align === 'start' ? 'left' : 'right'}`,
  }
  return (
    <span ref={anchor} className="w-pop-anchor">
      {t}
      {pos && createPortal(
        <PopCtx.Provider value={{ close }}>
          <div ref={panel} className={cx('w-pop', className)} style={style} onClick={(e) => e.stopPropagation()}>{children}</div>
        </PopCtx.Provider>,
        document.body,
      )}
    </span>
  )
}

export type MenuItemProps = {
  icon?: LucideIcon
  /** Any leading visual instead of an icon: a Dot, Avatar, Logo or ProgressIcon. */
  lead?: ReactNode
  /** Shows a check on the right: the current choice. */
  checked?: boolean
  /** Shortcut on the right. */
  kbd?: string
  /** Muted text on the right, e.g. a count. */
  hint?: ReactNode
  onSelect?: () => void
  /** Keep the popover open after selecting (toggles). */
  keepOpen?: boolean
  danger?: boolean
  disabled?: boolean
  children: ReactNode
}

/** One row in a Popover menu. Closes the popover after selecting unless keepOpen. */
export function MenuItem({ icon: Icon, lead, checked, kbd, hint, onSelect, keepOpen, danger, disabled, children }: MenuItemProps) {
  const { close } = usePopover()
  return (
    <button type="button" className="w-menu-item" data-danger={danger || undefined} disabled={disabled}
      onClick={() => { onSelect?.(); if (!keepOpen) close() }}>
      {Icon ? <Icon size={14} aria-hidden /> : lead}
      <span className="w-menu-t">{children}</span>
      {hint != null && <span className="w-menu-hint">{hint}</span>}
      {kbd && <Kbd>{kbd}</Kbd>}
      {checked && <Check size={14} className="w-menu-check" aria-label="Selected" />}
    </button>
  )
}

/** A small heading inside a menu ("Pod", "Sort by"). */
export const MenuLabel = ({ children }: { children: ReactNode }) => <div className="w-menu-label">{children}</div>
/** A hairline between groups of menu items. */
export const MenuSeparator = () => <div className="w-menu-sep" role="separator" />
/** A padded block for controls inside a popover (switches, selects, segmented). */
export const PopoverSection = ({ children }: { children: ReactNode }) => <div className="w-pop-sec">{children}</div>
/** A label on the left and a control on the right, inside a PopoverSection. */
export const PopoverRow = ({ label, children }: { label: ReactNode; children: ReactNode }) => (
  <div className="w-pop-row"><span>{label}</span>{children}</div>
)
