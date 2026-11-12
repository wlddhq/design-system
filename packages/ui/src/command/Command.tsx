'use client'
import { Children, createContext, isValidElement, useContext, useEffect, useRef, type ComponentType, type ReactNode } from 'react'
import { Command, useCommandState } from 'cmdk'
import { Check } from 'lucide-react'
import { cx } from '../cx'
import { Loader } from '../loader/Loader'
import { useKeys } from '../kbd/keys'

type Icon = ComponentType<{ size?: number | string; className?: string }>
const Ctx = createContext<{ close: () => void }>({ close: () => {} })
const GroupCtx = createContext<string | undefined>(undefined)

export type CommandMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Opens and closes with ⌘K on a Mac, Ctrl K on Windows, from anywhere. Pass false when the app binds the key itself. @default true */
  hotkey?: boolean
  /** Says what can be found: "Search campaigns, clients, or type a command…" @default 'Search or jump to…' */
  placeholder?: string
  /** Shown when nothing matches. Gets the query. @default q => `No results for “q”` */
  empty?: (query: string) => ReactNode
  /** The query, when you search yourself (a server, or thousands of records). Pair with onSearchChange and filter={false}. */
  search?: string
  onSearchChange?: (query: string) => void
  /** false: show the items exactly as given, already filtered by you. @default true */
  filter?: boolean
  /** Results are on their way: a small loader under the matches so far. */
  loading?: boolean
  /** For screen readers. @default 'Command menu' */
  label?: string
  /** Groups of CommandItems. */
  children: ReactNode
  className?: string
}

/** Ranks by words, not scattered letters: the label starts with it › a word in the label does › a keyword does › anywhere.
 *  Every word typed must match ("zep q4"). */
function rank(value: string, search: string, keywords: string[] = []) {
  const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (!words.length) return 1
  const label = value.toLowerCase(), keys = keywords.join(' ').toLowerCase()
  const starts = (t: string, w: string) => t.split(/[^\p{L}\p{N}]+/u).some((x) => x.startsWith(w))
  let score = 1
  for (const w of words) {
    const s = label.startsWith(w) ? 1 : starts(label, w) ? 0.9 : starts(keys, w) ? 0.75 : label.includes(w) ? 0.6 : keys.includes(w) ? 0.5 : 0
    if (!s) return 0
    score = Math.min(score, s)
  }
  return score
}

/**
 * The ⌘K menu: one box to jump anywhere and run any action, from the keyboard.
 * Opens instantly (no entrance; people open it many times a day), filters as you type, ↑↓ to move, ↵ to run, Esc to close.
 */
export function CommandMenu({ open, onOpenChange, hotkey = true, placeholder = 'Search or jump to…', empty = (q) => (q ? <>No results for “{q}”</> : 'Nothing here yet'), search, onSearchChange, filter = true, loading, label = 'Command menu', children, className }: CommandMenuProps) {
  useEffect(() => {
    if (!hotkey) return
    const on = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && !e.defaultPrevented) { e.preventDefault(); onOpenChange(!open) }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [hotkey, open, onOpenChange])

  // Closing returns focus to where it was (the search button, the row you were on).
  const back = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (open) { back.current = document.activeElement as HTMLElement | null; return }
    const el = back.current
    if (el && el !== document.body) { const t = setTimeout(() => { if (el.isConnected) el.focus({ preventScroll: true }) }, 0); return () => clearTimeout(t) }
  }, [open])

  return (
    <Command.Dialog open={open} onOpenChange={onOpenChange} label={label} loop shouldFilter={filter} filter={rank}
      className="w-cmd" overlayClassName="w-cmd-scrim" contentClassName={cx('w-cmd-panel', className)}>
      <Command.Input value={search} onValueChange={onSearchChange} placeholder={placeholder} />
      <Command.List>
        {!loading && <EmptyState empty={empty} search={search} />}
        <Ctx.Provider value={{ close: () => onOpenChange(false) }}>{children}</Ctx.Provider>
        {loading && <Command.Loading><span className="w-cmd-loading"><Loader size={14} label="Searching" /> Searching…</span></Command.Loading>}
      </Command.List>
    </Command.Dialog>
  )
}

/* cmdk's Empty only knows it is empty; the query comes from its state. */
function EmptyState({ empty, search }: { empty: (q: string) => ReactNode; search?: string }) {
  return <Command.Empty><QueryText render={empty} search={search} /></Command.Empty>
}
function QueryText({ render, search }: { render: (q: string) => ReactNode; search?: string }) {
  const q = useCommandState((s) => s.search)
  return <>{render(search ?? q)}</>
}

export type CommandGroupProps = {
  /** One or two words: "Go to", "Campaigns", "Actions". */
  heading: string
  children: ReactNode
}
/** A titled set of items; its heading also finds them ("theme" finds Light and Dark). Order groups by what people reach for most: Go to, then records, then actions, then settings. */
export function CommandGroup({ heading, children }: CommandGroupProps) {
  return <Command.Group heading={heading}><GroupCtx.Provider value={heading}>{children}</GroupCtx.Provider></Command.Group>
}

export type CommandItemProps = {
  /** What happens: "New campaign", "Toggle theme", or a record's name. */
  children: ReactNode
  /** Runs when picked by click or ↵. The menu closes afterwards unless keepOpen. */
  onSelect: () => void
  /** A lucide icon, or a node (Avatar, ProgressIcon, a swatch). */
  icon?: Icon | ReactNode
  /** Quiet text on the right: a client, a code, "Settings". */
  meta?: ReactNode
  /** Its own key, shown on the right, written for every platform: "c", "alt+1", "mod+shift+n". */
  shortcut?: string
  /** The current choice in a set (a theme, a layout): a check on the right. */
  checked?: boolean
  /** More words it should be found by: ids, codes, old names. */
  keywords?: string[]
  /** Unique text it is matched on, when two items read the same. Defaults to its text. */
  value?: string
  /** Stay open after running: for toggles people flip several times. */
  keepOpen?: boolean
  disabled?: boolean
}
/** The label's own words, so meta and shortcut text never affect matching. */
const textOf = (n: ReactNode): string => Children.toArray(n).map((c) => (typeof c === 'string' || typeof c === 'number' ? String(c) : isValidElement<{ children?: ReactNode }>(c) ? textOf(c.props.children) : '')).join('')

/** One row: icon, label, then meta, shortcut or a check on the right. */
export function CommandItem({ children, onSelect, icon: I, meta, shortcut, checked, keywords, value, keepOpen, disabled }: CommandItemProps) {
  const { close } = useContext(Ctx)
  const group = useContext(GroupCtx)
  const keys = useKeys()
  const icon = I == null ? null : isValidElement(I) ? I : (() => { const C = I as Icon; return <C size={15} /> })()
  return (
    <Command.Item value={value ?? (textOf(children) || undefined)} keywords={group ? [...(keywords ?? []), group] : keywords} disabled={disabled} onSelect={() => { onSelect(); if (!keepOpen) close() }}>
      {icon}
      <span className="w-cmd-t">{children}</span>
      {meta != null && <span className="w-cmd-meta">{meta}</span>}
      {shortcut && <kbd className="w-cmd-k">{keys(shortcut)}</kbd>}
      {checked && <Check size={14} className="w-cmd-check" aria-label="Current" />}
    </Command.Item>
  )
}
