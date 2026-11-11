import type { Tone } from '../chip/Chip'

export type ProgressIconProps = {
  /** Steps done, from 0 to max. 0 draws a dashed ring; max draws a filled check. */
  value: number
  /** @default 6 */
  max?: number
  /** Colour. Leave out for neutral. @default 'neutral' */
  tone?: Tone
  /** @default 14 */
  size?: number
}

const TONE: Record<Tone, string> = { neutral: 'var(--muted)', green: 'var(--green)', violet: 'var(--violet)', pink: 'var(--pink)', yellow: 'var(--yellow)' }

/**
 * How far something has moved through its stages, as a filling ring.
 * Pair it with the stage name: `<ProgressIcon value={2} /> Pitch Details`.
 */
export function ProgressIcon({ value, max = 6, tone = 'neutral', size = 14 }: ProgressIconProps) {
  const col = TONE[tone]
  const C = 2 * Math.PI * 2.5
  // Out-of-range or missing numbers clamp: below 0 is 0, above max is done, max ≤ 0 counts as done.
  const v = Number.isFinite(value) ? Math.max(0, value) : 0
  const done = max <= 0 || v >= max
  return (
    <svg className="w-progress" width={size} height={size} viewBox="0 0 14 14" aria-hidden>
      {done ? (
        <>
          <circle cx="7" cy="7" r="6" fill={col} />
          <path d="M4.3 7.2l1.9 1.9 3.5-3.7" stroke="var(--surface)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <circle cx="7" cy="7" r="5.5" fill="none" stroke={col} strokeWidth="1.5" strokeDasharray={v === 0 ? '1.6 1.7' : undefined} />
          <circle className="w-progress-fill" cx="7" cy="7" r="2.5" fill="none" stroke={col} strokeWidth="5"
            strokeDasharray={`${(C * v) / max} ${C}`} transform="rotate(-90 7 7)" />
        </>
      )}
    </svg>
  )
}
