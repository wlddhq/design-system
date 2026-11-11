'use client'
import { useEffect, useRef, type RefObject } from 'react'

// Every open layer (sheet, dialog), newest last. Only the newest answers Escape and traps Tab.
const stack: RefObject<HTMLElement | null>[] = []
const FOCUSABLE = 'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'

/**
 * Shared behaviour for modal layers: Escape closes the newest one, focus moves in on open and goes back to
 * whatever opened it on close, Tab stays inside, and the page behind doesn't scroll.
 */
export function useLayer(open: boolean, onClose: () => void, panel: RefObject<HTMLElement | null>) {
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    if (!open) return
    const back = document.activeElement as HTMLElement | null
    stack.push(panel)
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    // Focus the first field, else the panel itself, once it has mounted.
    const t = setTimeout(() => {
      const p = panel.current
      if (!p || p.contains(document.activeElement)) return
      const first = p.querySelector<HTMLElement>('[autofocus], input:not(:disabled), textarea:not(:disabled)') ?? p
      first.focus({ preventScroll: true })
    }, 30)

    const key = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== panel) return
      // A menu open inside the layer gets Escape first.
      if (e.key === 'Escape' && !document.querySelector('.w-pop')) { e.preventDefault(); close.current() }
      if (e.key !== 'Tab' || !panel.current) return
      const els = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!els.length) return
      const first = els[0]!, last = els[els.length - 1]!
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', key)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', key)
      stack.splice(stack.indexOf(panel), 1)
      if (!stack.length) root.style.overflow = prevOverflow
      back?.focus?.({ preventScroll: true })
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
}
