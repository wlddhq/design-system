import { cx } from '../cx'

const DIGITS = '0123456789'

export type TickerProps = {
  /** The number. When it changes, each digit rolls to its new value. */
  value: number
  /** How it reads: ₹ amounts, compact counts, percentages. @default n => n.toLocaleString('en-IN') */
  format?: (n: number) => string
  className?: string
}

/**
 * A number whose digits roll when it changes, like a counter. For metrics and totals that update in place.
 * Separators and units stay put; screen readers get the whole value at once. Reduced motion: it simply changes.
 */
export function Ticker({ value, format = (n) => Math.round(n).toLocaleString('en-IN'), className }: TickerProps) {
  const str = format(value)
  const chars = [...str]
  return (
    <span className={cx('w-roll', className)} role="text" aria-label={str}>
      {chars.map((ch, i) => {
        const key = chars.length - i // keyed from the right, so units stay units as the number grows
        const d = DIGITS.indexOf(ch)
        if (d === -1) return <span key={'s' + key + ch} aria-hidden>{ch}</span>
        return (
          <span key={key} className="w-roll-d" aria-hidden>
            <span className="w-roll-s" style={{ transform: `translateY(${-d * 10}%)` }}>
              {[...DIGITS].map((n) => <span key={n}>{n}</span>)}
            </span>
          </span>
        )
      })}
    </span>
  )
}
