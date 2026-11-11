import type { CSSProperties } from 'react'
import { cx } from '../cx'

export type SkeletonProps = {
  /** line for text, circle for avatars and logos, block for cards and images. @default 'line' */
  shape?: 'line' | 'circle' | 'block'
  /** px or any CSS length. Lines and blocks fill their container by default. */
  width?: number | string
  /** px or any CSS length. @default 10 for a line */
  height?: number | string
  /** Circle diameter in px. Match the Avatar or Logo it stands in for. @default 20 */
  size?: number
  className?: string
  style?: CSSProperties
}

/**
 * A placeholder in the shape of content that's still loading. Prefer a component's own `loading` prop
 * (Table, RecordCell, Avatar), which lays skeletons out exactly like the real thing.
 */
export function Skeleton({ shape = 'line', width, height, size = 20, className, style }: SkeletonProps) {
  const box: CSSProperties = shape === 'circle' ? { width: size, height: size } : { width, height }
  return <span className={cx('w-skel', className)} data-shape={shape} style={{ ...box, ...style }} aria-hidden />
}
