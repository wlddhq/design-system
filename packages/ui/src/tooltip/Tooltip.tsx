'use client'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../cx'

// Once one tooltip has shown, the next appears instantly (moving along a toolbar).
let warmUntil = 0

export type TooltipProps = {
  /** One or two words: what the control does. */
  label: ReactNode
  /** Shortcut shown after the label, e.g. "⌘K" */
  kbd?: string
  /** @default 'bottom' */
  side?: 'bottom' | 'top' | 'right'
  /** Delay before the first tooltip, in ms. @default 450 */
  delay?: number
  children: ReactNode
  className?: string
}

/** Names a control on hover. Delayed the first time, instant after. Press and hold on touch. */
export function Tooltip({ label, kbd, side = 'bottom', delay = 450, children, className }: TooltipProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const tip = useRef<HTMLSpanElement>(null)
  const [state, setState] = useState<{ x: number; y: number; side: 'bottom' | 'top' | 'right'; instant: boolean } | null>(null)
  const [dx, setDx] = useState(0)

  const place = (instant: boolean, touch?: boolean) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    // Touch shows above the finger. Near an edge, flip to the side that has room.
    let s: 'bottom' | 'top' | 'right' = touch ? 'top' : side
    if (s === 'bottom' && r.bottom + 40 > window.innerHeight) s = 'top'
    else if (s === 'top' && r.top < 40) s = 'bottom'
    else if (s === 'right' && r.right + 160 > window.innerWidth) s = 'bottom'
    const pos = s === 'right' ? { x: r.right + 8, y: r.top + r.height / 2 }
      : s === 'top' ? { x: r.left + r.width / 2, y: r.top - (touch ? 10 : 8) }
      : { x: r.left + r.width / 2, y: r.bottom + 8 }
    setDx(0)
    setState({ ...pos, side: s, instant })
  }
  // Keep it on screen: nudge sideways once its real width is known.
  useLayoutEffect(() => {
    const t = tip.current?.getBoundingClientRect()
    if (!t) return
    const over = t.right - (window.innerWidth - 8)
    const under = 8 - t.left
    if (over > 0) setDx((d) => d - over)
    else if (under > 0) setDx((d) => d + under)
  }, [state])
  // A tooltip left behind by scrolling would point at nothing.
  useEffect(() => {
    if (!state) return
    const away = () => hide()
    window.addEventListener('scroll', away, true)
    return () => window.removeEventListener('scroll', away, true)
  }, [!!state])
  const show = () => {
    clearTimeout(timer.current)
    if (Date.now() < warmUntil) place(true)
    else timer.current = setTimeout(() => place(false), delay)
  }
  const hide = () => {
    clearTimeout(timer.current)
    setState((s) => { if (s) warmUntil = Date.now() + 500; return null })
  }
  useEffect(() => () => clearTimeout(timer.current), [])
  if (label == null || label === '') return <>{children}</>

  return (
    <span ref={ref} className={cx('w-tipw', className)}
      onPointerEnter={(e) => e.pointerType !== 'touch' && show()}
      onFocus={(e) => { if ((e.target as HTMLElement).matches?.(':focus-visible')) place(true) }}
      onBlur={hide}
      onKeyDown={(e) => e.key === 'Escape' && hide()}
      onPointerLeave={(e) => e.pointerType !== 'touch' && hide()}
      onPointerDown={(e) => {
        if (e.pointerType !== 'touch') return hide()
        clearTimeout(timer.current)
        timer.current = setTimeout(() => { place(true, true); timer.current = setTimeout(hide, 1600) }, 420)
      }}>
      {children}
      {state && createPortal(
        <span ref={tip} role="tooltip" className={cx('w-tip', `w-tip-${state.side}`, state.instant && 'instant')} style={{ left: state.x + dx, top: state.y }}>
          {label}{kbd && <span className="w-tip-k">{kbd}</span>}
        </span>,
        document.body,
      )}
    </span>
  )
}
