'use client'
import { useEffect, useState } from 'react'

/** Re-renders whenever the theme on <html> changes. Returns whether it is dark and a change counter. */
export function useHtmlTheme() {
  const [state, set] = useState({ dark: false, rev: 0 })
  useEffect(() => {
    const el = document.documentElement
    const read = () => set((s) => ({ dark: el.dataset.theme === 'dark' || el.dataset.style === 'kajal', rev: s.rev + 1 }))
    read()
    const mo = new MutationObserver(read)
    mo.observe(el, { attributes: true, attributeFilter: ['data-theme', 'data-style', 'data-tone', 'data-corners', 'data-font', 'style'] })
    return () => mo.disconnect()
  }, [])
  return state
}
