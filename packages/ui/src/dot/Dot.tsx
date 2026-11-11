import type { ReactNode } from 'react'
import { cx } from '../cx'
import type { Tone } from '../chip/Chip'

export type DotProps = {
  /** @default 'neutral' */
  tone?: Tone
  /** round for status, square for categories such as pods. @default 'round' */
  shape?: 'round' | 'square'
  className?: string
}

/** A small colour mark. Pair it with text; colour alone never carries meaning. */
export function Dot({ tone = 'neutral', shape = 'round', className }: DotProps) {
  return <span className={cx('w-dot', className)} data-tone={tone} data-shape={shape} aria-hidden />
}

export type DotLabelProps = DotProps & { children: ReactNode }

/** Dot + text, the quiet way to show a category in a dense row ("● Kulfi"). */
export function DotLabel({ children, className, ...dot }: DotLabelProps) {
  return <span className={cx('w-dot-label', className)}><Dot {...dot} />{children}</span>
}
