'use client'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cx } from '../cx'
import { Skeleton } from '../skeleton/Skeleton'

export type Person = {
  /** Full name; initials come from it */
  name: string
  /** Colour hue 0–360. Derived from the name when left out. */
  hue?: number
  /** Photo URL. Initials show when there's none. */
  src?: string
}

const hueOf = (name: string) => [...name].reduce((h, c) => (h * 31 + c.codePointAt(0)!) % 360, 7)
/** First letter of the first two words. Works for any script and emoji (whole characters, not halves). */
const initials = (name: string) => name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => [...p][0]!.toLocaleUpperCase()).join('') || '?'

export type AvatarProps = {
  /** Diameter in px. 18 in rows, 20 in tables, 22–28 in headers. @default 20 */
  size?: number
  className?: string
} & (
  | (Person & { loading?: false })
  | (Partial<Person> & {
      /** Show a same-size skeleton circle instead. Needs no name. */
      loading: true
    })
)

/** A person: photo or initials on their colour. The colour is deep enough that white initials pass 4.5:1 for every hue. */
export function Avatar(props: AvatarProps) {
  if (props.loading) return <Skeleton shape="circle" size={props.size ?? 20} className={props.className} />
  return <AvatarFace {...props} />
}

/** Photo, or initials when there's no photo or it fails to load (a broken image never shows). */
function AvatarFace({ name, hue, src, size = 20, className }: Person & { size?: number; className?: string }) {
  const [failed, setFailed] = useState<string | null>(null)
  const photo = src && failed !== src
  // An image that failed before React hydrated never fires onError for us; check it on mount.
  const img = useRef<HTMLImageElement>(null)
  useEffect(() => { const i = img.current; if (src && i?.complete && i.naturalWidth === 0) setFailed(src) }, [src])
  const style = {
    width: size, height: size, fontSize: Math.max(8, size * 0.42),
    background: photo ? undefined : `oklch(0.52 0.12 ${hue ?? hueOf(name)})`,
  } as CSSProperties
  return (
    <span className={cx('w-av', className)} style={style} title={name} role="img" aria-label={name}>
      {photo ? <img ref={img} src={src} alt="" onError={() => setFailed(src)} /> : initials(name)}
    </span>
  )
}

export type AvatarGroupProps = {
  people: Person[]
  /** @default 20 */
  size?: number
  /** Show at most this many, then "+n". */
  max?: number
  className?: string
}

/** A team, overlapping. Each avatar is ringed in the surface colour so the overlap reads. */
export function AvatarGroup({ people, size = 20, max, className }: AvatarGroupProps) {
  // Never hide everyone: max={0} still shows one face, then "+n".
  const shown = max != null ? people.slice(0, Math.max(1, max)) : people
  const extra = people.length - shown.length
  return (
    <span className={cx('w-av-group', className)}>
      {shown.map((p, i) => <Avatar key={p.name + i} {...p} size={size} />)}
      {extra > 0 && <span className="w-av w-av-more" style={{ width: size, height: size, fontSize: Math.max(8, size * 0.42) }}>+{extra}</span>}
    </span>
  )
}
