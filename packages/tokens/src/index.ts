/* @wldd/tokens — theme catalogue and the one function that applies a theme to the page.
   Colours live in tokens.css. This file only names the options and writes the <html> attributes. */

export type Mode = 'light' | 'dark' | 'system'
export type Style = 'khadi' | 'kajal' | 'pop'
export type Tone =
  | 'haldi' | 'tulsi' | 'baingani' | 'gulabi' | 'neel' | 'kesar'
  | 'mor' | 'koyla' | 'jamun' | 'ujala' | 'drishti'
export type Corners = 'default' | '4' | '6' | '10' | '14'
export type Font = 'inter' | 'geist' | 'plex' | 'manrope' | 'bricolage' | 'system'
export type Density = 'comfortable' | 'compact'
export type Motion = 'full' | 'reduced'

export interface Theme {
  mode: Mode
  style: Style
  /** Pop only */
  tone: Tone
  /** Any style. 'default' keeps every element's own radius; a size rounds controls, cards and menus to that scale. */
  corners: Corners
  /** Any style. null = the default font. */
  font: Font | null
  density: Density
  motion: Motion
  /** Custom primary colour (hex). null = the theme's own. */
  accent: string | null
}

/** The approved default (buttons are always Lip): Khadi, light, comfortable, full motion. */
export const DEFAULT_THEME: Theme = {
  mode: 'light', style: 'khadi', tone: 'haldi', corners: 'default',
  font: null, density: 'comfortable', motion: 'full', accent: null,
}

type Swatch = { light: [bg: string, accent: string]; dark: [bg: string, accent: string] }

export const STYLES: { id: Style; label: string; swatch: Swatch }[] = [
  { id: 'khadi', label: 'Khadi', swatch: { light: ['#fafaf9', '#18181b'], dark: ['#0f0f10', '#ececee'] } },
  { id: 'kajal', label: 'Kajal', swatch: { light: ['#08080a', '#5fcf86'], dark: ['#08080a', '#5fcf86'] } },
  { id: 'pop', label: 'Pop', swatch: { light: ['#eeefe9', '#f2bd2f'], dark: ['#1d1f27', '#f2bd2f'] } },
]

export const TONES: { id: Tone; label: string; group: string; swatch: Swatch }[] = [
  { id: 'haldi', label: 'Haldi', group: 'WLDD colours', swatch: { light: ['#eeefe9', '#f2bd2f'], dark: ['#1d1f27', '#f2bd2f'] } },
  { id: 'tulsi', label: 'Tulsi', group: 'WLDD colours', swatch: { light: ['#e8ece6', '#1f7a4a'], dark: ['#121815', '#5fcf86'] } },
  { id: 'baingani', label: 'Baingani', group: 'WLDD colours', swatch: { light: ['#ecebf2', '#6d3fd0'], dark: ['#15141c', '#b994ef'] } },
  { id: 'gulabi', label: 'Gulabi', group: 'WLDD colours', swatch: { light: ['#f2ece8', '#d6395e'], dark: ['#1b1513', '#f07c97'] } },
  { id: 'neel', label: 'Neel', group: 'Fresh', swatch: { light: ['#eceef2', '#2f5fd0'], dark: ['#12151b', '#7aa2ff'] } },
  { id: 'kesar', label: 'Kesar', group: 'Fresh', swatch: { light: ['#f3eee6', '#e0621b'], dark: ['#1a1612', '#ff8a4c'] } },
  { id: 'mor', label: 'Mor', group: 'Fresh', swatch: { light: ['#e7eeee', '#0e8a85'], dark: ['#101818', '#3cc8c0'] } },
  { id: 'koyla', label: 'Koyla', group: 'Fresh', swatch: { light: ['#efefef', '#111111'], dark: ['#111111', '#ededed'] } },
  { id: 'jamun', label: 'Jamun', group: 'Best of both', swatch: { light: ['#3a1f4d', '#f2bd2f'], dark: ['#1f1029', '#f2bd2f'] } },
  { id: 'ujala', label: 'Ujala', group: 'Vision assistive', swatch: { light: ['#ffffff', '#000000'], dark: ['#000000', '#ffffff'] } },
  { id: 'drishti', label: 'Drishti', group: 'Vision assistive', swatch: { light: ['#f6f6f4', '#1f6fd1'], dark: ['#121316', '#6ea8ff'] } },
]

export const CORNERS: { id: Corners; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: '4', label: '4px' }, { id: '6', label: '6px' }, { id: '10', label: '10px' }, { id: '14', label: '14px' },
]
export const FONTS: { id: Font; label: string; family: string }[] = [
  { id: 'inter', label: 'Inter', family: "'Inter'" },
  { id: 'geist', label: 'Geist', family: "'Geist'" },
  { id: 'plex', label: 'Plex', family: "'IBM Plex Sans'" },
  { id: 'manrope', label: 'Manrope', family: "'Manrope'" },
  { id: 'bricolage', label: 'Bricolage', family: "'Bricolage Grotesque'" },
  { id: 'system', label: 'System', family: 'system-ui' },
]

/** Named Pop colours. A preset sets the tone only: corners and font stay as each person chose them. */
export const PRESETS: { id: string; label: string; theme: Pick<Theme, 'tone'> }[] = [
  { id: 'haldi', label: 'Haldi', theme: { tone: 'haldi' } },
  { id: 'tulsi', label: 'Tulsi', theme: { tone: 'tulsi' } },
  { id: 'baingani', label: 'Baingani', theme: { tone: 'baingani' } },
  { id: 'gulabi', label: 'Gulabi', theme: { tone: 'gulabi' } },
  { id: 'jamun', label: 'Jamun', theme: { tone: 'jamun' } },
]

/** Picks black or white text for a custom accent. */
export function readableOn(hex: string): '#000' | '#fff' {
  const h = hex.replace('#', '')
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  return L > 0.4 ? '#000' : '#fff'
}

export const resolveMode = (mode: Mode): 'light' | 'dark' =>
  mode !== 'system' ? mode
    : typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

/** Writes a theme onto <html>. Safe to call on every change; only touches what it owns. */
export function applyTheme(partial: Partial<Theme>, root: HTMLElement = document.documentElement): Theme {
  const t: Theme = { ...DEFAULT_THEME, ...partial }
  const d = root.dataset
  d.theme = resolveMode(t.mode)
  d.style = t.style
  delete d.buttons // buttons are always Lip; clears any value an older version wrote
  if (t.style === 'pop') d.tone = t.tone; else delete d.tone
  // Personal preferences, in every style. Colour themes never touch them.
  if (t.corners !== 'default') d.corners = t.corners; else delete d.corners
  if (t.font) d.font = t.font; else delete d.font
  d.density = t.density
  d.motion = t.motion

  const accentVars = ['--ink', '--ink-fg', '--cta', '--cta-fg', '--cta-lip', '--hl'] as const
  if (t.accent) {
    const fg = readableOn(t.accent)
    root.style.setProperty('--ink', t.accent); root.style.setProperty('--ink-fg', fg)
    root.style.setProperty('--cta', t.accent); root.style.setProperty('--cta-fg', fg)
    root.style.setProperty('--cta-lip', `color-mix(in oklab, ${t.accent} 72%, #000)`)
    root.style.setProperty('--hl', t.accent)
  } else accentVars.forEach((v) => root.style.removeProperty(v))
  return t
}
