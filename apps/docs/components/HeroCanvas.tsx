import type { CSSProperties } from 'react'
import { MousePointer2, PenTool, Pipette, Square } from 'lucide-react'
import { GLYPHS, EX, EY, OUT } from '@/lib/wlddGlyphs'

/*
  The landing hero: the WLDD logo being made, on a little design canvas. One 14s loop, CSS only.
    1 · Move → Rectangle: Sati draws a construction frame for each letter.
    2 · Pen: four cursors, one per letter, trace W, L, D, D at once (they overlap, like a team).
    3 · Eyedropper: a palette opens; the dropper picks each brand colour and fills its letter.
    4 · The extrusion lands, the outline thickens to the mark's ⅓x, Sati selects the finished logo.
  Every position is computed from the real glyph geometry (lib/wlddGlyphs), so the story matches the logo.
  Reduced motion holds the finished logo.
*/
const T = 14 // seconds per loop
const S = 0.6 // logo units → px
const L0 = 56, T0 = 38 // where the logo's viewBox (-10 -10 392 240) starts, in px
const STEPS = 7
const px = (u: number) => +(L0 + (u + 10) * S).toFixed(1)
const py = (v: number) => +(T0 + (v + 10) * S).toFixed(1)
const center = (b: number[]) => [px((b[0]! + b[2]!) / 2), py((b[1]! + b[3]!) / 2)] as const

// Palette panel: four swatch rows.
const PAL = { x: 352, y: 40 }
const swatch = (i: number) => [PAL.x + 18, PAL.y + 40 + i * 26] as const

// Timeline, in % of the loop.
const box = (i: number) => [6 + 3 * i, 8 + 3 * i] // frame i drawn
const pen = (i: number) => [20 + 7 * i, 34 + 7 * i] // letter i traced
const pick = (i: number) => [59 + 6 * i, 62.5 + 6 * i] // dropper at swatch i, then at letter i

type F = [number, string][]
const kf = (name: string, frames: F) => `@keyframes ${name}{${frames.map(([p, css]) => `${+p.toFixed(2)}%{${css}}`).join('')}}`
const at = (x: number, y: number, extra = '') => `transform:translate(${x}px,${y}px)${extra};`

function keyframes() {
  const out: string[] = []
  // Sati: frames each letter's box, rests, then comes back to select the logo.
  const sati: F = [[0, at(520, 200) + 'opacity:0'], [3, at(520, 200) + 'opacity:1']]
  GLYPHS.forEach((g, i) => {
    const [a, b] = box(i)
    sati.push([a, at(px(g.box[0]), py(g.box[1])) + 'opacity:1'], [b, at(px(g.box[2]), py(g.box[3])) + 'opacity:1'])
  })
  sati.push([18, at(px(GLYPHS[0]!.box[0]) - 8, py(GLYPHS[0]!.box[1]) - 10) + 'opacity:1'], [20, at(px(GLYPHS[0]!.box[0]) - 8, py(GLYPHS[0]!.box[1]) - 10) + 'opacity:0'],
    [83, at(520, 200) + 'opacity:0'], [84, at(520, 200) + 'opacity:1'], [87, at(px(352), py(205)) + 'opacity:1'], [88, at(px(352), py(205), ' scale(.86)') + 'opacity:1'],
    [89, at(px(352), py(205)) + 'opacity:1'], [95, at(px(352), py(205)) + 'opacity:1'], [97, at(px(352), py(205)) + 'opacity:0'], [100, at(520, 200) + 'opacity:0'])
  out.push(kf('hc-sati', sati))

  GLYPHS.forEach((_, i) => {
    const [ba, bb] = box(i), [pa, pb] = pen(i), [, pl] = pick(i)
    out.push(kf(`hc-box-${i}`, [[0, 'opacity:0;transform:scale(0)'], [ba, 'opacity:1;transform:scale(0)'], [bb, 'opacity:1;transform:scale(1)'], [58, 'opacity:1;transform:scale(1)'], [63, 'opacity:0;transform:scale(1)'], [100, 'opacity:0;transform:scale(1)']]))
    // The pen draws in the text colour (visible in any theme); the finished mark takes the logo's ink outline.
    const pen0 = 'stroke:var(--fg);stroke-width:2.6', ink = `stroke:var(--wl-ink);stroke-width:${OUT.toFixed(2)}`
    out.push(kf(`hc-line-${i}`, [[0, `stroke-dashoffset:1;${pen0};opacity:0`], [pa - 0.5, `stroke-dashoffset:1;${pen0};opacity:1`], [pb, `stroke-dashoffset:0;${pen0};opacity:1`],
      [84, `stroke-dashoffset:0;${pen0};opacity:1`], [87, `stroke-dashoffset:0;${ink};opacity:1`], [95, `stroke-dashoffset:0;${ink};opacity:1`], [99, `stroke-dashoffset:0;${ink};opacity:0`], [100, `stroke-dashoffset:1;${pen0};opacity:0`]]))
    out.push(kf(`hc-pen-${i}`, [[0, 'offset-distance:0%;opacity:0'], [pa - 1.5, 'offset-distance:0%;opacity:0'], [pa, 'offset-distance:0%;opacity:1'], [pb, 'offset-distance:100%;opacity:1'], [pb + 2, 'offset-distance:100%;opacity:0'], [100, 'offset-distance:100%;opacity:0']]))
    out.push(kf(`hc-fill-${i}`, [[0, 'opacity:0'], [pl + 0.5, 'opacity:0'], [pl + 1.8, 'opacity:1'], [95, 'opacity:1'], [99, 'opacity:0'], [100, 'opacity:0']]))
    out.push(kf(`hc-sw-${i}`, [[0, 'box-shadow:0 0 0 0 transparent'], [pick(i)[0] - 0.5, 'box-shadow:0 0 0 0 transparent'], [pick(i)[0], 'box-shadow:0 0 0 2px var(--fg)'], [pick(i)[0] + 2.5, 'box-shadow:0 0 0 2px var(--fg)'], [pick(i)[0] + 3.5, 'box-shadow:0 0 0 0 transparent'], [100, 'box-shadow:0 0 0 0 transparent']]))
  })

  // Eyedropper: palette → letter, four times. The tip (bottom-left of the icon) lands on the point.
  const tip = (x: number, y: number, extra = '') => at(x - 2, y - 17, extra)
  const drop: F = [[0, tip(530, 200) + 'opacity:0'], [56, tip(530, 200) + 'opacity:0'], [57, tip(530, 200) + 'opacity:1']]
  GLYPHS.forEach((g, i) => {
    const [ps, pl] = pick(i), [sx, sy] = swatch(i), [lx, ly] = center(g.box)
    drop.push([ps, tip(sx, sy)], [ps + 0.6, tip(sx, sy, ' scale(.88)')], [ps + 1.3, tip(sx, sy)], [pl, tip(lx, ly)], [pl + 0.6, tip(lx, ly, ' scale(.88)')], [pl + 1.3, tip(lx, ly)])
  })
  drop.push([84, tip(530, 200) + 'opacity:1'], [85, tip(530, 200) + 'opacity:0'], [100, tip(530, 200) + 'opacity:0'])
  out.push(kf('hc-drop', drop))
  return out.join('\n')
}

/** Toolbar: which tool is in use, in step with the story. */
const TOOLS = [
  { icon: MousePointer2, on: [[0, 6], [84, 100]] },
  { icon: Square, on: [[6, 19]] },
  { icon: PenTool, on: [[19, 57]] },
  { icon: Pipette, on: [[57, 84]] },
]
const toolKf = (i: number) => {
  const f: F = [[0, 'background:transparent;color:var(--muted)']]
  for (const [a, b] of TOOLS[i]!.on) f.push([Math.max(0, a - 0.01), 'background:transparent;color:var(--muted)'], [a, 'background:var(--sel);color:#fff'], [b - 0.01, 'background:var(--sel);color:#fff'], [b, 'background:transparent;color:var(--muted)'])
  f.push([100, i === 0 ? 'background:var(--sel);color:#fff' : 'background:transparent;color:var(--muted)'])
  return kf(`hc-tool-${i}`, f.sort((a, b) => a[0] - b[0]))
}

const step = (k: number) => `translate(${((EX * (k + 1)) / STEPS).toFixed(2)} ${((EY * (k + 1)) / STEPS).toFixed(2)})`

export function HeroCanvas() {
  const css = keyframes() + '\n' + TOOLS.map((_, i) => toolKf(i)).join('\n')
  const anim = (name: string): CSSProperties => ({ animation: `${name} ${T}s linear infinite` })
  return (
    <div className="hero" aria-hidden>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="hero-grid" />

      <div className="hc-tools">
        {TOOLS.map((t, i) => <span key={i} className="hc-tool" style={anim(`hc-tool-${i}`)}><t.icon size={14} /></span>)}
      </div>

      <svg className="hc-logo" viewBox="-10 -10 392 240" width={392 * S} height={240 * S} style={{ left: L0, top: T0 }}>
        {/* construction frames */}
        {GLYPHS.map((g, i) => (
          <rect key={'b' + i} className="hc-box" x={g.box[0]} y={g.box[1]} width={g.box[2] - g.box[0]} height={g.box[3] - g.box[1]} style={anim(`hc-box-${i}`)} />
        ))}
        {/* extrusion: lands after the fills */}
        <g className="hc-extrude" style={anim('hc-extrude')}>
          {GLYPHS.map((g, i) => Array.from({ length: STEPS }, (_, k) => <path key={i + '-' + k} d={g.d} transform={step(k)} fillRule="evenodd" />))}
        </g>
        {/* colour fills, picked by the eyedropper */}
        {GLYPHS.map((g, i) => <path key={'f' + i} d={g.d} fill={g.c} fillRule="evenodd" style={anim(`hc-fill-${i}`)} className="hc-fill" />)}
        {/* pen outlines, drawn as the cursors trace them */}
        {GLYPHS.map((g, i) => <path key={'l' + i} d={g.d} pathLength={1} className="hc-line" style={anim(`hc-line-${i}`)} />)}
        {/* the finished logo, selected */}
        <g className="hc-sel" style={anim('hc-sel')}>
          <rect x={-2} y={-6} width={362} height={232} />
          {[[-2, -6], [360, -6], [-2, 226], [360, 226]].map(([x, y], i) => <rect key={i} className="hc-handle" x={x! - 5} y={y! - 5} width={10} height={10} />)}
        </g>
      </svg>
      <span className="hc-size" style={{ ...anim('hc-sel'), left: px(174) , top: py(232) }}>WLDD · {Math.round(372 * S)} × {Math.round(242 * S)}</span>

      {/* pen cursors ride the letters' own outlines, in logo units */}
      <div className="hc-pens" style={{ left: L0, top: T0, transform: `scale(${S}) translate(10px, 10px)` }}>
        {GLYPHS.map((g, i) => (
          <span key={i} className="hc-pen" style={{ ...anim(`hc-pen-${i}`), offsetPath: `path('${g.d}')`, color: g.c } as CSSProperties}>
            <PenTool size={18 / S} />
            {i === 0 && <b style={{ fontSize: 10.5 / S }}>Sati</b>}
          </span>
        ))}
      </div>

      {/* palette and eyedropper */}
      <div className="hc-pal" style={{ ...anim('hc-pal'), left: PAL.x, top: PAL.y }}>
        <div className="hc-pal-h">Fill</div>
        {GLYPHS.map((g, i) => (
          <div key={i} className="hc-pal-r"><i style={{ background: g.c, ...anim(`hc-sw-${i}`) }} /><span>{g.c}</span><em>{g.ch}</em></div>
        ))}
      </div>
      <span className="hc-drop" style={anim('hc-drop')}><Pipette size={18} /></span>

      <span className="hc-sati" style={anim('hc-sati')}><MousePointer2 size={20} /><b>Sati</b></span>
    </div>
  )
}
