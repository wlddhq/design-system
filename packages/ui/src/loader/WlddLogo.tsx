'use client'
import { useState } from 'react'
import { WlddLoader } from './Loader'

export type WlddLogoProps = {
  /** Height in px. 30 in the sidebar; 26 in compact sidebars; 20 in a rail. @default 30 */
  height?: number
  className?: string
}

/**
 * The WLDD wordmark, drawn in code (never an image). At rest it is the logo; on hover the letters
 * press into their shadows. Same as the DMS sidebar.
 */
export function WlddLogo({ height = 30, className }: WlddLogoProps) {
  const [on, setOn] = useState(false)
  return (
    <span className={'w-wlogo' + (className ? ' ' + className : '')} style={{ height }}
      onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}>
      <WlddLoader mode="press" done={!on} size={height} label="WLDD" />
    </span>
  )
}
