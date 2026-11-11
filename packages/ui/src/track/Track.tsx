import { cx } from '../cx'

export type TrackProps = {
  /** Steps done, 0 to max. The current step glows green; at max every step turns green. */
  value: number
  /** @default 6 */
  max?: number
  /** Accessible name, e.g. the stage: "Pitch Details". Wrap in a Tooltip to show it on hover. */
  label?: string
  className?: string
}

/** Where a record is in its stages, as short bars: done, current, still to come. Fits a list row. */
export function Track({ value, max = 6, label, className }: TrackProps) {
  const v = Number.isFinite(value) ? Math.max(0, Math.min(value, max)) : 0
  const done = v >= max
  return (
    <span className={cx('w-track', className)} data-done={done || undefined} role="img" aria-label={label ?? `Step ${Math.min(v + 1, max)} of ${max}`}>
      {Array.from({ length: Math.max(1, max) }, (_, i) => <i key={i} data-s={i < v ? 'done' : i === v ? 'cur' : undefined} />)}
    </span>
  )
}
