'use client'
import { useSyncExternalStore } from 'react'

/*
  Shortcuts are written once, the same everywhere: "mod+k", "alt+1", "shift+mod+b", "c".
  mod is ⌘ on a Mac and Ctrl everywhere else. Mac shows symbols run together (⌘K, ⇧⌘B);
  Windows and Linux show words (Ctrl K, Shift Ctrl B). Mac-style strings ("⌘K", "⌥1") are understood too.
*/
const GLYPH: Record<string, string> = { '⌘': 'mod', '⌥': 'alt', '⇧': 'shift', '⌃': 'ctrl' }
const MAC: Record<string, string> = { mod: '⌘', cmd: '⌘', meta: '⌘', alt: '⌥', option: '⌥', shift: '⇧', ctrl: '⌃', enter: '↵', return: '↵', esc: 'Esc', escape: 'Esc', backspace: '⌫', tab: '⇥', up: '↑', down: '↓', left: '←', right: '→', space: 'Space' }
const PC: Record<string, string> = { mod: 'Ctrl', cmd: 'Ctrl', meta: 'Ctrl', alt: 'Alt', option: 'Alt', shift: 'Shift', ctrl: 'Ctrl', enter: 'Enter', return: 'Enter', esc: 'Esc', escape: 'Esc', backspace: 'Backspace', tab: 'Tab', up: '↑', down: '↓', left: '←', right: '→', space: 'Space' }

/** "mod+k" or "⌘K" → ['mod', 'k']. */
export function parseKeys(s: string): string[] {
  const t = s.trim()
  if (t.length > 1 && t.includes('+')) return t.split('+').map((x) => x.trim()).filter(Boolean)
  const out: string[] = []
  let rest = t
  while (rest.length > 1 && GLYPH[rest[0]!]) { out.push(GLYPH[rest[0]!]!); rest = rest.slice(1) }
  if (rest) out.push(rest)
  return out
}

/** The keys as people on this platform read them. */
export function formatKeys(s: string, mac: boolean): string {
  const map = mac ? MAC : PC
  // Modifiers in each platform's own order (Mac ⌃⌥⇧⌘, Windows Ctrl Alt Shift), then the key.
  const ORDER = mac ? ['ctrl', 'alt', 'shift', 'mod'] : ['mod', 'ctrl', 'alt', 'shift']
  const norm = (k: string) => ({ cmd: 'mod', meta: 'mod', option: 'alt' } as Record<string, string>)[k.toLowerCase()] ?? k.toLowerCase()
  const at = (k: string) => { const i = ORDER.indexOf(norm(k)); return i < 0 ? 99 : i }
  const keys = parseKeys(s).sort((x, y) => at(x) - at(y)).map((k) => map[k.toLowerCase()] ?? (k.length === 1 ? k.toUpperCase() : k[0]!.toUpperCase() + k.slice(1)))
  return keys.join(mac ? '' : ' ')
}

const detect = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test((navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform || navigator.userAgent)
const none = () => () => {}

/** True on a Mac or iPad. The server renders the Windows form; Macs switch on load. */
export function useIsMac(): boolean {
  return useSyncExternalStore(none, detect, () => false)
}

/** Formats shortcuts for this platform: const keys = useKeys(); keys('mod+k') → "⌘K" or "Ctrl K". */
export function useKeys(): (s: string) => string {
  const mac = useIsMac()
  return (s) => formatKeys(s, mac)
}
