'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { applyTheme, DEFAULT_THEME, type Theme } from '@wldd/tokens'

const KEY = 'wldd-docs-theme'

/** Runs before first paint (inlined in <head>) so a saved theme never flashes. Mirrors applyTheme. */
export const NO_FLASH = `(function(){try{var t=JSON.parse(localStorage.getItem('${KEY}')||'{}');var d=document.documentElement.dataset;var m=t.mode||'light';if(m==='system')m=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.theme=m;d.style=t.style||'khadi';delete d.buttons;if(d.style==='pop')d.tone=t.tone||'haldi';if(t.v===2&&t.corners&&t.corners!=='default')d.corners=t.corners;if(t.font)d.font=t.font;d.density=t.density||'comfortable';d.motion=t.motion||'full';if(t.accent){var s=document.documentElement.style;s.setProperty('--ink',t.accent);s.setProperty('--cta',t.accent);s.setProperty('--hl',t.accent)}}catch(e){}})()`

type Ctx = { theme: Theme; setTheme: (p: Partial<Theme>) => void }
const ThemeCtx = createContext<Ctx>({ theme: DEFAULT_THEME, setTheme: () => {} })
export const useTheme = () => useContext(ThemeCtx)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeRaw] = useState<Theme>(DEFAULT_THEME)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}')
      if (saved.v !== 2) delete saved.corners // older saves held Pop's old 6px default, not a choice
      delete saved.v
      setThemeRaw({ ...DEFAULT_THEME, ...saved })
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    applyTheme(theme)
    try { localStorage.setItem(KEY, JSON.stringify({ ...theme, v: 2 })) } catch {}
    if (theme.mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const on = () => applyTheme(theme)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [theme, ready])

  const setTheme = (p: Partial<Theme>) => setThemeRaw((t) => ({ ...t, ...p }))
  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>
}
