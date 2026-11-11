'use client'
import { Check } from 'lucide-react'
import { Button } from '@wldd/ui'
import { STYLES, TONES, PRESETS, CORNERS, FONTS } from '@wldd/tokens'
import { useTheme } from '@/lib/theme'
import { useHtmlTheme } from '@/lib/useHtmlTheme'
import { Orb, Seg } from './Appearance'

const ACCENTS = ['#f2bd2f', '#2fa866', '#8e4fd0', '#d6395e', '#2f5fd0', '#e0621b', '#0e8a85', '#18181b']

export function StyleGallery() {
  const { theme, setTheme } = useTheme()
  const { dark } = useHtmlTheme()
  return (
    <div className="cards" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
      {STYLES.map((s) => (
        <button key={s.id} className="card-link" style={{ textAlign: 'left', boxShadow: theme.style === s.id ? '0 0 0 1.5px var(--fg)' : undefined }}
          onClick={() => setTheme({ style: s.id })}>
          <b><Orb sw={s.swatch[dark ? 'dark' : 'light']} size={18} />{s.label}{theme.style === s.id && <Check size={14} style={{ marginLeft: 'auto' }} />}</b>
          <span>{{ khadi: 'Default. Paper and ink.', kajal: 'Dark, sharp, mono numerals.', pop: 'Warm, tactile, tunable.' }[s.id]}</span>
        </button>
      ))}
    </div>
  )
}

export function ToneGallery() {
  const { theme, setTheme } = useTheme()
  const { dark } = useHtmlTheme()
  const groups = [...new Set(TONES.map((t) => t.group))]
  return (
    <div className="tbl-w" style={{ padding: '6px 14px 12px' }}>
      {groups.map((g) => (
        <div key={g}>
          <div className="pop-h" style={{ paddingLeft: 0 }}>{g}</div>
          <div className="flex flex-wrap gap-1.5">
            {TONES.filter((t) => t.group === g).map((t) => {
              const on = theme.style === 'pop' && theme.tone === t.id
              return (
                <Button key={t.id} size="sm" variant="ghost" pressed={on} onClick={() => setTheme({ style: 'pop', tone: t.id })}>
                  <Orb sw={t.swatch[dark ? 'dark' : 'light']} size={14} />{t.label}
                </Button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export function PresetRow() {
  const { theme, setTheme } = useTheme()
  const { dark } = useHtmlTheme()
  return (
    <div className="flex flex-wrap gap-2">
      {PRESETS.map((p) => {
        const on = theme.style === 'pop' && theme.tone === p.theme.tone && theme.corners === p.theme.corners && theme.font === p.theme.font
        return (
          <Button key={p.id} pressed={on} onClick={() => setTheme({ style: 'pop', ...p.theme })}>
            <Orb sw={TONES.find((t) => t.id === p.theme.tone)!.swatch[dark ? 'dark' : 'light']} size={14} />{p.label}
          </Button>
        )
      })}
    </div>
  )
}

export function DialRow() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="grid gap-3" style={{ maxWidth: 420 }}>
      <div className="grid gap-1.5"><span className="text-xs text-muted">Corners</span>
        <Seg value={theme.corners} options={CORNERS} onChange={(corners) => setTheme({ style: 'pop', corners })} /></div>
      <div className="flex flex-wrap gap-2 pt-2">
        <Button variant="primary">Approve</Button><Button>Reschedule</Button><Button variant="ghost">Skip</Button>
      </div>
    </div>
  )
}

export function FontRow() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button size="sm" variant="ghost" pressed={!theme.font} onClick={() => setTheme({ font: null })}>Style default</Button>
      {FONTS.map((f) => (
        <Button key={f.id} size="sm" variant="ghost" pressed={theme.font === f.id} onClick={() => setTheme({ font: f.id })}>
          <span style={{ fontFamily: f.family }}>{f.label}</span>
        </Button>
      ))}
    </div>
  )
}

export function AccentRow() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ACCENTS.map((a) => (
        <button key={a} aria-label={a} onClick={() => setTheme({ accent: a })} className="grid place-items-center" style={{ width: 26, height: 26 }}>
          <Orb sw={[a, a]} size={20} on={theme.accent === a} />
        </button>
      ))}
      {theme.accent && <Button size="sm" variant="ghost" onClick={() => setTheme({ accent: null })}>Reset</Button>}
      <span className="ml-2"><Button variant="primary">Approve</Button></span>
    </div>
  )
}
