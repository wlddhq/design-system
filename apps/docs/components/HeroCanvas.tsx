import type { CSSProperties } from 'react'
import { MousePointer2, PenTool, Pipette } from 'lucide-react'
import { GLYPHS } from '@/lib/wlddGlyphs'
import { WlddMark } from './WlddMark'

/*
  The landing hero: the grey WLDD mark on a little design canvas that's being worked on.
  One 10s loop, pure CSS (hero.css), so it costs nothing and needs no JavaScript:
    a cursor selects the mark → a pen draws a curve beside it → an eyedropper picks the D's yellow,
    all by Sati's cursor. Reduced motion holds a single composed frame.
  Geometry: the mark sits at (40, 56), 96px tall, viewBox "-10 -10 392 240" (scale 0.4).
*/
const PEN = 'M 250 160 C 290 60, 360 60, 400 120 S 480 175, 520 92'
const D2 = GLYPHS[3]!

export function HeroCanvas() {
  return (
    <div className="hero" aria-hidden>
      <div className="hero-grid" />

      {/* the mark, with the yellow the eyedropper picks */}
      <div className="hero-mark"><WlddMark height={96} /></div>
      <svg className="hero-fill" viewBox="-10 -10 392 240" width={157} height={96}>
        <path d={D2.d} fill={D2.c} fillRule="evenodd" />
      </svg>

      {/* selection frame, handles and size */}
      <div className="hero-sel">
        <i style={{ left: -3, top: -3 }} /><i style={{ right: -3, top: -3 }} />
        <i style={{ left: -3, bottom: -3 }} /><i style={{ right: -3, bottom: -3 }} />
        <span className="hero-size">157 × 96</span>
      </div>

      {/* pen: the curve draws itself; anchors and one handle pair */}
      <svg className="hero-pen" viewBox="0 0 560 210" width={560} height={210}>
        <path d={PEN} pathLength={1} className="hero-path" />
        <g className="hero-handles">
          <line x1="360" y1="62" x2="440" y2="178" />
          <circle cx="360" cy="62" r="2.5" /><circle cx="440" cy="178" r="2.5" />
        </g>
        {[[250, 160], [400, 120], [520, 92]].map(([x, y], i) => (
          <rect key={i} className="hero-anchor" x={x! - 3.5} y={y! - 3.5} width="7" height="7" style={{ '--i': i } as CSSProperties} />
        ))}
      </svg>
      <span className="hero-pen-tool" style={{ offsetPath: `path('${PEN}')` } as CSSProperties}><PenTool size={18} /></span>

      {/* eyedropper and the colour it picks */}
      <span className="hero-dropper"><Pipette size={18} /></span>
      <span className="hero-chip"><i style={{ background: D2.c }} />#F2C92D</span>

      {/* cursors */}
      <span className="hero-cursor"><MousePointer2 size={20} /><b>Sati</b></span>
    </div>
  )
}
