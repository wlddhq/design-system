'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Check, Palette } from 'lucide-react'
import { Button } from '@wldd/ui'
import { STYLES, TONES, CORNERS, FONTS, type Theme } from '@wldd/tokens'
import { useTheme } from '@/lib/theme'
import { useHtmlTheme } from '@/lib/useHtmlTheme'

/** Same idea as the prototype's Appearance menu: mode, style, and the Pop dials. */
export function Appearance() {
  const { theme, setTheme } = useTheme()
  const [at, setAt] = useState<{ left: number; bottom: number } | null>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!at) return
    const down = (e: MouseEvent) => {
      const t = e.target as Node
      if (!panel.current?.contains(t) && !btn.current?.contains(t)) setAt(null)
    }
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setAt(null)
    document.addEventListener('mousedown', down)
    window.addEventListener('keydown', key)
    return () => { document.removeEventListener('mousedown', down); window.removeEventListener('keydown', key) }
  }, [at])

  const toggle = () => {
    if (at) return setAt(null)
    const r = btn.current!.getBoundingClientRect()
    setAt({ left: Math.max(8, r.left - 6), bottom: window.innerHeight - r.top + 6 })
  }
  const { dark } = useHtmlTheme()

  return (
    <>
      <Button ref={btn} size="sm" variant="ghost" icon={Palette} aria-label="Appearance" pressed={!!at} onClick={toggle} />
      {at && (
        <div ref={panel} className="pop" style={{ left: at.left, bottom: at.bottom }} role="dialog" aria-label="Appearance">
          <div className="pop-h">Mode</div>
          <div className="pop-pad">
            <Seg value={theme.mode} options={[{ id: 'light', label: 'Light' }, { id: 'dark', label: 'Dark' }, { id: 'system', label: 'System' }]} onChange={(mode) => setTheme({ mode })} />
          </div>
          <div className="pop-sep" />
          <div className="pop-h">Theme</div>
          {STYLES.map((s) => (
            <button key={s.id} className={'pop-row' + (theme.style === s.id ? ' on' : '')} onClick={() => setTheme({ style: s.id })}>
              <Orb sw={s.id === 'pop' ? TONES.find((t) => t.id === theme.tone)!.swatch[dark ? 'dark' : 'light'] : s.swatch[dark ? 'dark' : 'light']} />
              {s.label}
              {theme.style === s.id && <Check size={14} className="chk" />}
            </button>
          ))}
          {theme.style === 'pop' && (
            <>
              <div className="pop-sep" />
              <div className="pop-h">Tone · {TONES.find((t) => t.id === theme.tone)?.label}</div>
              <div className="tones">
                {TONES.map((t) => (
                  <button key={t.id} title={t.label} aria-label={t.label} onClick={() => setTheme({ tone: t.id })}>
                    <Orb sw={t.swatch[dark ? 'dark' : 'light']} on={theme.tone === t.id} />
                  </button>
                ))}
              </div>
            </>
          )}
          {/* Personal preferences, in every theme. Colour themes never change them. */}
          <div className="pop-sep" />
          <div className="pop-h">Corners</div>
          <div className="pop-pad"><Seg value={theme.corners} options={CORNERS.map((c) => ({ ...c, label: c.id === 'default' ? 'Default' : c.id }))} onChange={(corners) => setTheme({ corners })} /></div>
          <div className="pop-h">Type</div>
          <div className="pop-pad">
            <Seg value={theme.font ?? 'default'} options={[{ id: 'default', label: 'Default' }, ...FONTS.filter((f) => ['geist', 'plex', 'manrope'].includes(f.id)).map((f) => ({ id: f.id, label: f.label }))]}
              onChange={(font) => setTheme({ font: font === 'default' ? null : (font as Theme['font']) })} />
          </div>
        </div>
      )}
    </>
  )
}

export function Seg<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="seg" role="radiogroup">
      {options.map((o) => (
        <button key={o.id} role="radio" aria-checked={value === o.id} className={value === o.id ? 'on' : ''} onClick={() => onChange(o.id)}>{o.label}</button>
      ))}
    </div>
  )
}

export function Orb({ sw, on, size = 16 }: { sw: [string, string]; on?: boolean; size?: number }) {
  return <span className={'orb' + (on ? ' on' : '')} style={{ '--a': sw[0], '--b': sw[1], width: size, height: size } as CSSProperties} />
}

export type { Theme }
