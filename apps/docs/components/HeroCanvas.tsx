import type { CSSProperties } from 'react'
import { MousePointer2, PenTool, Pipette, Square } from 'lucide-react'
import { GLYPHS, EX, EY, OUT } from '@/lib/wlddGlyphs'

/*
  The landing hero: the WLDD logo being made, the way a designer builds it. One 18s loop, CSS only.
    1 · Rectangle: Sati frames each letter.
    2 · Pen: four cursors build W, L, D, D point by point, at once. Click → an anchor lands; move → the
        segment stretches to the next point; click → the next anchor. Curves get their bézier handles dragged
        out; each shape closes on its first anchor, then the path deselects into an outline. D's counter is a
        second shape.
    3 · Eyedropper: a palette opens; each brand colour is picked and dropped into its letter.
    4 · The extrusion lands, the outline thickens to the mark's ⅓x, Sati selects the finished logo.
  Every point, length and timing is computed from the real glyph paths (lib/wlddGlyphs).
  Reduced motion holds the finished logo.
*/
const T = 18 // seconds per loop
const S = 0.64 // logo units → px
const L0 = 54, T0 = 30 // where the logo's viewBox (-10 -10 392 240) starts, in px
const STEPS = 7
const px = (u: number) => +(L0 + (u + 10) * S).toFixed(1)
const py = (v: number) => +(T0 + (v + 10) * S).toFixed(1)
const center = (b: number[]) => [px((b[0]! + b[2]!) / 2), py((b[1]! + b[3]!) / 2)] as const
const r2 = (n: number) => +n.toFixed(2)

/* ── Paths → segments ── */
type P = [number, number]
type Seg = { a: P; b: P; arc?: { r: number; sweep: number }; len: number; sub: number }
function segments(d: string): Seg[] {
  const tok = d.match(/[MLHVAZ]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? []
  const out: Seg[] = []
  let i = 0, cur: P = [0, 0], start: P = [0, 0], sub = -1
  const num = () => parseFloat(tok[i++]!)
  const line = (b: P) => { const len = Math.hypot(b[0] - cur[0], b[1] - cur[1]); if (len > 0.01) out.push({ a: cur, b, len, sub }); cur = b }
  while (i < tok.length) {
    const c = tok[i++]!
    if (c === 'M') { cur = start = [num(), num()]; sub++ }
    else if (c === 'L') line([num(), num()])
    else if (c === 'H') line([num(), cur[1]])
    else if (c === 'V') line([cur[0], num()])
    else if (c === 'A') {
      const r = num(); num(); num(); num(); const sweep = num(); const b: P = [num(), num()]
      out.push({ a: cur, b, arc: { r, sweep }, len: (Math.PI * r) / 2, sub }); cur = b
    } else if (c === 'Z' || c === 'z') line(start)
  }
  return out
}
const segD = (s: Seg) => s.arc ? `M${r2(s.a[0])} ${r2(s.a[1])}A${r2(s.arc.r)} ${r2(s.arc.r)} 0 0 ${s.arc.sweep} ${r2(s.b[0])} ${r2(s.b[1])}` : `M${r2(s.a[0])} ${r2(s.a[1])}L${r2(s.b[0])} ${r2(s.b[1])}`
const unit = (v: P): P => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/* ── Timeline (% of the loop) ── */
const box = (i: number) => [2 + 2.6 * i, 4 + 2.6 * i] // Sati frames letter i
const PEN = [[13, 39], [17.5, 37.5], [22, 52], [26.5, 57]] // when each letter is built
const pick = (i: number) => [60 + 6 * i, 63.5 + 6 * i] // dropper at swatch i, then at letter i
const HOLD = 0.5 // a click, in %
/** A corner rounding too small to need its own anchor: the pen runs through it without a click. */
const tiny = (s: Seg) => !!s.arc && s.arc.r < 5
const PAL = { x: 368, y: 34 }
const swatch = (i: number) => [PAL.x + 18, PAL.y + 40 + i * 26] as const

type F = [number, string][]
const kf = (name: string, frames: F) => `@keyframes ${name}{${frames.sort((a, b) => a[0] - b[0]).map(([p, css]) => `${r2(Math.min(100, Math.max(0, p)))}%{${css}}`).join('')}}`
const at = (x: number, y: number, extra = '') => `transform:translate(${x}px,${y}px)${extra};`

type Plan = { segs: Seg[]; t: { s0: number; s1: number }[]; anchors: { p: P; t: number; until: number; corner: boolean }[]; close: number; total: number }

/** When every click and move of a letter happens. Moves take time in proportion to their length. */
function plan(gi: number): Plan {
  const segs = segments(GLYPHS[gi]!.d)
  const [start, end] = PEN[gi]!
  const total = segs.reduce((a, s) => a + s.len, 0)
  const clicks = segs.filter((s) => !tiny(s)).length + new Set(segs.map((s) => s.sub)).size // one per anchor, plus each shape's first
  const move = end - start - clicks * HOLD
  const t: Plan['t'] = []
  const anchors: Plan['anchors'] = []
  let now = start, sub = -1
  segs.forEach((s, k) => {
    if (s.sub !== sub) { sub = s.sub; anchors.push({ p: s.a, t: now, until: 0, corner: true }); now += HOLD } // first anchor of a shape
    const s0 = now, s1 = now + (move * s.len) / total
    t.push({ s0, s1 })
    const last = k === segs.length - 1 || segs[k + 1]!.sub !== s.sub
    if (!last && !tiny(s)) anchors.push({ p: s.b, t: s1, until: 0, corner: !s.arc })
    now = s1 + (tiny(s) ? 0 : HOLD)
  })
  const close = now
  anchors.forEach((a) => (a.until = close + 2))
  return { segs, t, anchors, close, total }
}
const PLANS = GLYPHS.map((_, i) => plan(i))

function keyframes() {
  const out: string[] = []

  // Sati frames each letter, rests, then comes back to select the finished logo.
  const sati: F = [[0, at(530, 220) + 'opacity:0'], [1, at(530, 220) + 'opacity:1']]
  GLYPHS.forEach((g, i) => { const [a, b] = box(i); sati.push([a, at(px(g.box[0]), py(g.box[1])) + 'opacity:1'], [b, at(px(g.box[2]), py(g.box[3])) + 'opacity:1']) })
  const sel = [px(358), py(228)]
  sati.push([12, at(px(GLYPHS[3]!.box[2]) + 30, py(GLYPHS[3]!.box[3])) + 'opacity:1'], [13, at(px(GLYPHS[3]!.box[2]) + 30, py(GLYPHS[3]!.box[3])) + 'opacity:0'],
    [84, at(530, 220) + 'opacity:0'], [85, at(530, 220) + 'opacity:1'], [87.5, at(sel[0]!, sel[1]!) + 'opacity:1'], [88.2, at(sel[0]!, sel[1]!, ' scale(.86)') + 'opacity:1'],
    [89, at(sel[0]!, sel[1]!) + 'opacity:1'], [95, at(sel[0]!, sel[1]!) + 'opacity:1'], [97, at(sel[0]!, sel[1]!) + 'opacity:0'], [100, at(530, 220) + 'opacity:0'])
  out.push(kf('hc-sati', sati))

  GLYPHS.forEach((g, i) => {
    const [ba, bb] = box(i), pl = PLANS[i]!, [, pk] = pick(i)
    out.push(kf(`hc-box-${i}`, [[0, 'opacity:0;transform:scale(0)'], [ba, 'opacity:1;transform:scale(0)'], [bb, 'opacity:1;transform:scale(1)'], [58, 'opacity:1;transform:scale(1)'], [62, 'opacity:0;transform:scale(1)'], [100, 'opacity:0;transform:scale(1)']]))

    // Segments: each one stretches out with the cursor, in the selection colour while the path is being edited.
    pl.segs.forEach((_, k) => {
      const { s0, s1 } = pl.t[k]!
      out.push(kf(`hc-seg-${i}-${k}`, [[0, 'stroke-dashoffset:1;opacity:0'], [s0 - 0.01, 'stroke-dashoffset:1;opacity:0'], [s0, 'stroke-dashoffset:1;opacity:1'], [s1, 'stroke-dashoffset:0;opacity:1'],
        [pl.close + 1.5, 'stroke-dashoffset:0;opacity:1'], [pl.close + 3, 'stroke-dashoffset:0;opacity:0'], [100, 'stroke-dashoffset:0;opacity:0']]))
    })
    // Anchors: land on the click (filled while it's the one being edited), go hollow, vanish when the path deselects.
    pl.anchors.forEach((a, k) => {
      const next = pl.anchors[k + 1]?.t ?? pl.close
      out.push(kf(`hc-an-${i}-${k}`, [[0, 'opacity:0;transform:scale(0);fill:var(--sel)'], [a.t - 0.01, 'opacity:0;transform:scale(0);fill:var(--sel)'], [a.t + 0.25, 'opacity:1;transform:scale(1.35);fill:var(--sel)'],
        [a.t + 0.5, 'opacity:1;transform:scale(1);fill:var(--sel)'], [next, 'opacity:1;transform:scale(1);fill:var(--surface)'], [a.until, 'opacity:1;transform:scale(1);fill:var(--surface)'], [a.until + 1.5, 'opacity:0;transform:scale(1);fill:var(--surface)'], [100, 'opacity:0;transform:scale(0);fill:var(--surface)']]))
    })
    // Bézier handles: dragged out as each curve's end anchor is placed, then they settle and disappear.
    pl.segs.forEach((s, k) => {
      if (!s.arc || s.arc.r < 5) return
      const { s0, s1 } = pl.t[k]!
      const pull = s0 + (s1 - s0) * 0.55
      out.push(kf(`hc-hd-${i}-${k}`, [[0, 'opacity:0;transform:scale(0)'], [pull, 'opacity:0;transform:scale(0)'], [s1, 'opacity:1;transform:scale(1)'], [s1 + HOLD + 1.2, 'opacity:1;transform:scale(1)'], [s1 + HOLD + 2.2, 'opacity:0;transform:scale(1)'], [100, 'opacity:0;transform:scale(0)']]))
    })
    // The closed shape: the deselected outline, then the mark's ink outline.
    const pen0 = 'stroke:var(--fg);stroke-width:2.2', ink = `stroke:var(--wl-ink);stroke-width:${OUT.toFixed(2)}`
    out.push(kf(`hc-line-${i}`, [[0, `${pen0};opacity:0`], [pl.close + 1, `${pen0};opacity:0`], [pl.close + 2.5, `${pen0};opacity:1`], [84, `${pen0};opacity:1`], [87, `${ink};opacity:1`], [95, `${ink};opacity:1`], [99, `${ink};opacity:0`], [100, `${pen0};opacity:0`]]))

    // The pen cursor rides the path: hold on each click (a little press), glide along each segment.
    const cur: F = [[0, 'offset-distance:0%;opacity:0'], [pl.t[0]!.s0 - HOLD - 1.2, 'offset-distance:0%;opacity:0'], [pl.t[0]!.s0 - HOLD - 0.2, 'offset-distance:0%;opacity:1']]
    let dist = 0
    const press = (t: number, d: number) => { cur.push([t, `offset-distance:${r2(d)}%;opacity:1;scale:1`], [t + HOLD / 2, `offset-distance:${r2(d)}%;opacity:1;scale:.86`], [t + HOLD - 0.01, `offset-distance:${r2(d)}%;opacity:1;scale:1`]) }
    let sub = -1
    pl.segs.forEach((s, k) => {
      const d0 = (dist / pl.total) * 100
      if (s.sub !== sub) { sub = s.sub; press(pl.t[k]!.s0 - HOLD, d0) }
      dist += s.len
      cur.push([pl.t[k]!.s0, `offset-distance:${r2(d0)}%;opacity:1;scale:1`], [pl.t[k]!.s1, `offset-distance:${r2((dist / pl.total) * 100)}%;opacity:1;scale:1`])
      if (!tiny(s)) press(pl.t[k]!.s1, (dist / pl.total) * 100)
    })
    cur.push([pl.close + 1.5, 'offset-distance:100%;opacity:1'], [pl.close + 3, 'offset-distance:100%;opacity:0'], [100, 'offset-distance:100%;opacity:0'])
    // keep only the last frame for any repeated time (a press can land on a segment boundary)
    const seen = new Map<number, string>(); cur.forEach(([p, c]) => seen.set(r2(p), c))
    out.push(kf(`hc-pen-${i}`, [...seen.entries()]))

    out.push(kf(`hc-fill-${i}`, [[0, 'opacity:0'], [pk + 0.5, 'opacity:0'], [pk + 1.8, 'opacity:1'], [95, 'opacity:1'], [99, 'opacity:0'], [100, 'opacity:0']]))
    out.push(kf(`hc-sw-${i}`, [[0, 'box-shadow:0 0 0 0 transparent'], [pick(i)[0] - 0.5, 'box-shadow:0 0 0 0 transparent'], [pick(i)[0], 'box-shadow:0 0 0 2px var(--fg)'], [pick(i)[0] + 2.5, 'box-shadow:0 0 0 2px var(--fg)'], [pick(i)[0] + 3.5, 'box-shadow:0 0 0 0 transparent'], [100, 'box-shadow:0 0 0 0 transparent']]))
  })

  // Eyedropper: palette → letter, four times. The tip (bottom-left of the icon) lands on the point.
  const tip = (x: number, y: number, extra = '') => at(x - 2, y - 17, extra)
  const drop: F = [[0, tip(540, 220) + 'opacity:0'], [57, tip(540, 220) + 'opacity:0'], [58, tip(540, 220) + 'opacity:1']]
  GLYPHS.forEach((g, i) => {
    const [ps, pl] = pick(i), [sx, sy] = swatch(i), [lx, ly] = center(g.box)
    drop.push([ps, tip(sx, sy)], [ps + 0.6, tip(sx, sy, ' scale(.88)')], [ps + 1.3, tip(sx, sy)], [pl, tip(lx, ly)], [pl + 0.6, tip(lx, ly, ' scale(.88)')], [pl + 1.3, tip(lx, ly)])
  })
  drop.push([84, tip(540, 220) + 'opacity:1'], [85, tip(540, 220) + 'opacity:0'], [100, tip(540, 220) + 'opacity:0'])
  out.push(kf('hc-drop', drop))
  return out.join('\n')
}

/** Toolbar: which tool is in use, in step with the story. */
const TOOLS = [
  { icon: MousePointer2, on: [[0, 1.5], [84, 100]] },
  { icon: Square, on: [[1.5, 12.5]] },
  { icon: PenTool, on: [[12.5, 58]] },
  { icon: Pipette, on: [[58, 84]] },
]
const toolKf = (i: number) => {
  const off = 'background:transparent;color:var(--muted)', on = 'background:var(--sel);color:#fff'
  const f: F = []
  for (const [a, b] of TOOLS[i]!.on) f.push([a, on], [b - 0.01, on], [b, off], [Math.max(0, a - 0.01), off])
  if (!f.some(([p]) => p === 0)) f.push([0, i === 0 ? on : off])
  if (!f.some(([p]) => p === 100)) f.push([100, i === 0 ? on : off])
  return kf(`hc-tool-${i}`, f)
}

const step = (k: number) => `translate(${r2((EX * (k + 1)) / STEPS)} ${r2((EY * (k + 1)) / STEPS)})`
const A = 9 / S // anchor square, in logo units (≈9px... drawn at 6px with the stroke)

export function HeroCanvas() {
  const css = keyframes() + '\n' + TOOLS.map((_, i) => toolKf(i)).join('\n')
  const anim = (name: string): CSSProperties => ({ animation: `${name} ${T}s linear infinite` })
  const icon = 18 / S
  return (
    <div className="hero" aria-hidden>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="hero-grid" />

      <div className="hc-tools">
        {TOOLS.map((t, i) => <span key={i} className="hc-tool" style={anim(`hc-tool-${i}`)}><t.icon size={14} /></span>)}
      </div>

      <svg className="hc-logo" viewBox="-10 -10 392 240" width={392 * S} height={240 * S} style={{ left: L0, top: T0 }}>
        {GLYPHS.map((g, i) => <rect key={'b' + i} className="hc-box" x={g.box[0]} y={g.box[1]} width={g.box[2] - g.box[0]} height={g.box[3] - g.box[1]} style={anim(`hc-box-${i}`)} />)}
        <g className="hc-extrude" style={anim('hc-extrude')}>
          {GLYPHS.map((g, i) => Array.from({ length: STEPS }, (_, k) => <path key={i + '-' + k} d={g.d} transform={step(k)} fillRule="evenodd" />))}
        </g>
        {GLYPHS.map((g, i) => <path key={'f' + i} d={g.d} fill={g.c} fillRule="evenodd" style={anim(`hc-fill-${i}`)} className="hc-fill" />)}
        {GLYPHS.map((g, i) => <path key={'l' + i} d={g.d} className="hc-line" style={anim(`hc-line-${i}`)} />)}

        {/* the path being edited: segments, bézier handles, anchors */}
        {PLANS.map((pl, i) => pl.segs.map((s, k) => <path key={`s${i}-${k}`} d={segD(s)} pathLength={1} className="hc-seg" style={anim(`hc-seg-${i}-${k}`)} />))}
        {PLANS.map((pl, i) => pl.segs.map((s, k) => {
          if (!s.arc || s.arc.r < 5) return null
          // tangent at the curve's end, from the quarter-circle geometry
          const prev = pl.segs[k - 1]
          const t0 = prev ? unit([prev.b[0] - prev.a[0], prev.b[1] - prev.a[1]]) : unit([s.b[0] - s.a[0], 0])
          const tEnd = unit([(s.b[0] - s.a[0]) / s.arc.r - t0[0], (s.b[1] - s.a[1]) / s.arc.r - t0[1]])
          const h = 0.5523 * s.arc.r
          const p1: P = [s.b[0] - tEnd[0] * h, s.b[1] - tEnd[1] * h], p2: P = [s.b[0] + tEnd[0] * h, s.b[1] + tEnd[1] * h]
          return (
            <g key={`h${i}-${k}`} className="hc-hd" style={anim(`hc-hd-${i}-${k}`)}>
              <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />
              <circle cx={p1[0]} cy={p1[1]} r={3.4 / S} /><circle cx={p2[0]} cy={p2[1]} r={3.4 / S} />
            </g>
          )
        }))}
        {PLANS.map((pl, i) => pl.anchors.map((a, k) => (
          <rect key={`a${i}-${k}`} className="hc-an" x={a.p[0] - A / 2} y={a.p[1] - A / 2} width={A} height={A} style={anim(`hc-an-${i}-${k}`)} />
        )))}

        <g className="hc-sel" style={anim('hc-sel')}>
          <rect x={-2} y={-6} width={362} height={232} />
          {[[-2, -6], [360, -6], [-2, 226], [360, 226]].map(([x, y], i) => <rect key={i} className="hc-handle" x={x! - 5} y={y! - 5} width={10} height={10} />)}
        </g>
      </svg>
      <span className="hc-size" style={{ ...anim('hc-sel'), left: px(174), top: py(234) }}>WLDD · {Math.round(372 * S)} × {Math.round(242 * S)}</span>

      {/* pen cursors ride each letter's own path, in logo units; the tip sits on the point */}
      <div className="hc-pens" style={{ left: L0, top: T0, transform: `scale(${S}) translate(10px, 10px)` }}>
        {GLYPHS.map((g, i) => (
          <span key={i} className="hc-pen" style={{ ...anim(`hc-pen-${i}`), offsetPath: `path('${g.d}')`, offsetAnchor: `${r2((icon * 2) / 24)}px ${r2((icon * 2) / 24)}px`, color: g.c } as CSSProperties}>
            <PenTool size={icon} />
            {i === 0 && <b style={{ fontSize: 10.5 / S }}>Sati</b>}
          </span>
        ))}
      </div>

      <div className="hc-pal" style={{ ...anim('hc-pal'), left: PAL.x, top: PAL.y }}>
        <div className="hc-pal-h">Fill</div>
        {GLYPHS.map((g, i) => <div key={i} className="hc-pal-r"><i style={{ background: g.c, ...anim(`hc-sw-${i}`) }} /><span>{g.c}</span><em>{g.ch}</em></div>)}
      </div>
      <span className="hc-drop" style={anim('hc-drop')}><Pipette size={18} /></span>

      <span className="hc-sati" style={anim('hc-sati')}><MousePointer2 size={20} /><b>Sati</b></span>
    </div>
  )
}
