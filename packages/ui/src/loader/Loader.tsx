'use client'
import { cx } from '../cx'
import { Ring, Notch } from './rings'
import { Wldd } from './wldd'

/**
 * The three loaders WLDD uses. Everything else waits with one of these.
 * - ring: the everyday wait (saving, fetching, inside a button)
 * - notch: a step-by-step job (syncing, scheduling, importing)
 * - ai: the assistant is thinking: the WLDD letters take turns in one slot (WlddLoader's cycle)
 */
export const LOADERS = [
  { id: 'ring', name: 'Ring', group: 'general', tip: 'Four arcs chase and stretch. The everyday wait.' },
  { id: 'notch', name: 'Notch', group: 'general', tip: 'Clicks a quarter turn on a spring; gaps breathe. For step-by-step jobs.' },
  { id: 'ai', name: 'AI', group: 'ai', tip: 'The WLDD letters take turns in one slot. The assistant is thinking.' },
] as const

export type LoaderKind = (typeof LOADERS)[number]['id']

export type LoaderProps = {
  /** ring for everyday waits · notch for step-by-step jobs · ai while the assistant thinks. @default 'ring' */
  kind?: LoaderKind
  /** Square size in px. 14 inside buttons, 16–20 inline, 48–96 for a whole panel. @default 16 */
  size?: number
  /** Finished: it settles (a green check for ring and notch; the letters land in the word for ai). Hold briefly, then swap content. */
  done?: boolean
  /** What is happening, for screen readers. @default 'Loading' */
  label?: string
  className?: string
}

/** Shows that something is in progress, and settles when it's done. */
export function Loader({ kind = 'ring', size = 16, done = false, label = 'Loading', className }: LoaderProps) {
  if (kind === 'ai') {
    return <span className={cx('w-loader', className)} role="status" aria-label={done ? 'Done' : label}><Wldd mode="cycle" tight size={size} done={done} label={done ? 'Done' : label} /></span>
  }
  const P = kind === 'notch' ? Notch : Ring
  return (
    <span className={cx('w-loader', className)} role="status" aria-label={done ? 'Done' : label}>
      <P size={size} done={done} />
    </span>
  )
}

export const WLDD_MODES = [
  { id: 'press', name: 'Press', wide: false, tip: 'Each letter presses into its own shadow, W → L → D → D.' },
  { id: 'dance', name: 'Dance', wide: false, tip: 'The logo’s uneven baseline passes from letter to letter.' },
  { id: 'drop', name: 'Drop', wide: false, tip: 'Letters drop in one by one, hold the logo, then fall away.' },
  { id: 'build', name: 'Build', wide: false, tip: 'Each letter pops up with a twist into its place, then all leave together.' },
  { id: 'cycle', name: 'Cycle', wide: false, tip: 'One slot; each letter takes its turn. Done sends them out into the word.' },
  { id: 'travel', name: 'Travel', wide: true, tip: 'A portal opens, WLDD comes out, another opens and takes it in.' },
  { id: 'portal', name: 'Portal', wide: true, tip: 'Letters spin out of a portal and get pulled back in; done closes it.' },
] as const

export type WlddMode = (typeof WLDD_MODES)[number]['id']

export type WlddLoaderProps = {
  /** The animation. press is the calm default; cycle fits inline (chat, buttons) with `tight`. @default 'press' */
  mode?: WlddMode
  /** Roughly the logo's height in px. @default 48 */
  size?: number
  /** Finished: every letter settles back into the logo. */
  done?: boolean
  /** Cycle only: crop to a square for inline use. */
  tight?: boolean
  /** @default 'Loading' */
  label?: string
}

/** The WLDD wordmark as a loader. For full-page and brand moments; use Loader for everyday waits. */
export function WlddLoader({ mode = 'press', size = 48, done = false, tight = false, label = 'Loading' }: WlddLoaderProps) {
  return <Wldd mode={mode} size={size} done={done} tight={tight} label={label} />
}
