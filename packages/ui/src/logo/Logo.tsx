'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../cx'

export type LogoProps = {
  /** Company or brand name. The first letter is the fallback mark. */
  name: string
  /** Logo image URL. Falls back to the letter mark if missing or broken. */
  src?: string
  /** Square size in px. 16 in the sidebar, 20 in lists, 24 in tables, 40 in headers. @default 24 */
  size?: number
  /** Hue for the letter mark, 0–360. Derived from the name when left out. */
  hue?: number
  className?: string
}

const hueOf = (name: string) => ((name.trim().codePointAt(0) ?? 63) * 37 + name.length * 13) % 360

/** A company: its real logo on a white tile, or a letter mark when there's none. */
export function Logo({ name, src, size = 24, hue, className }: LogoProps) {
  // Remember which src failed, so a new src gets a fresh try.
  const [failed, setFailed] = useState<string | null>(null)
  // An image that failed before React hydrated never fires onError for us; check it on mount.
  const img = useRef<HTMLImageElement>(null)
  useEffect(() => { const i = img.current; if (src && i?.complete && i.naturalWidth === 0) setFailed(src) }, [src])
  const style = { width: size, height: size, '--logo-r': `${Math.round(size * 0.29)}px` } as CSSProperties
  if (src && failed !== src) {
    return (
      <span className={cx('w-logo w-logo-img', className)} style={style}>
        <img ref={img} src={src} alt="" loading="lazy" decoding="async" draggable={false} onError={() => setFailed(src)} />
      </span>
    )
  }
  return (
    <span className={cx('w-logo', className)} role="img" aria-label={name}
      style={{ ...style, background: `oklch(0.6 0.12 ${hue ?? hueOf(name)})`, fontSize: Math.round(size * 0.44) }}>
      {[...name.trim()][0]?.toLocaleUpperCase() || '?'}
    </span>
  )
}
