'use client'
import { useEffect } from 'react'
import { GLYPHS, EX, EY, OUT } from '@/lib/wlddGlyphs'

/*
  Animated favicon: the four WLDD letters, one at a time, each in its brand colour on the mark's dark extrusion.
  Browsers don't animate SVG/GIF favicons (Chrome shows frame one), so we swap the <link rel=icon> href instead.
  app/icon.svg stays the static icon: it's what shows before JS runs and under reduced motion.
*/
const INK = '#141414'
const STEP = 650
const LAYERS = 7

function frame(g: (typeof GLYPHS)[number]) {
  const [x0, y0, x1, y1] = g.box
  const w = x1 - x0 + EX, h = y1 - y0 + EY
  const pad = OUT * 2
  const side = Math.max(w, h) + pad * 2
  const vx = x0 - pad - (side - pad * 2 - w) / 2
  const vy = y0 - pad - (side - pad * 2 - h) / 2
  const depth = Array.from({ length: LAYERS }, (_, i) => {
    const t = (i + 1) / LAYERS
    return `<path d="${g.d}" transform="translate(${(EX * t).toFixed(2)} ${(EY * t).toFixed(2)})"/>`
  }).join('')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx.toFixed(2)} ${vy.toFixed(2)} ${side.toFixed(2)} ${side.toFixed(2)}">` +
    `<g fill="${INK}" stroke="${INK}" stroke-width="${OUT.toFixed(2)}" stroke-linejoin="round" fill-rule="evenodd">${depth}</g>` +
    `<path d="${g.d}" fill="${g.c}" fill-rule="evenodd" stroke="${INK}" stroke-width="${OUT.toFixed(2)}" stroke-linejoin="round"/>` +
    `</svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

export function FaviconCycle() {
  useEffect(() => {
    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.motion === 'reduced'
    if (reduced) return

    const frames = GLYPHS.map(frame)
    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/svg+xml'
    link.href = frames[0]!
    document.head.appendChild(link)

    // Park every other icon link (Next's static /icon.svg) so the tab only ever shows the sequence.
    // Next can re-insert its link on navigation, so this re-runs each tick.
    const parked: HTMLLinkElement[] = []
    const park = () => {
      document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]').forEach((l) => {
        if (l === link) return
        l.rel = 'wldd-parked-icon'
        parked.push(l)
      })
    }
    park()

    let i = 0
    const id = window.setInterval(() => {
      i = (i + 1) % frames.length
      park()
      link.href = frames[i]!
    }, STEP)
    return () => {
      window.clearInterval(id)
      link.remove()
      parked.forEach((l) => { l.rel = 'icon' })
    }
  }, [])
  return null
}
