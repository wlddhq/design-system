import type { CSSProperties } from 'react'
import { MousePointer2, PenTool, Pipette, WandSparkles, Sparkle } from 'lucide-react'
import { GLYPHS, EX, EY, OUT } from '@/lib/wlddGlyphs'

/*
  The landing hero: the WLDD logo being made, the way a designer builds it. One 19s loop, CSS only, centred.
    1 · Pen: four cursors build W, L, D, D apart, point by point, all at once. Click → an anchor lands;
        move → the segment stretches to the next point; curves get their handles; shapes close and deselect.
    2 · Move: each letter's cursor grabs it and drags it home into the logo.
    3 · Magic: a wand touches the logo; sparkles, and the 3D shadow grows in layer by layer.
    4 · Colour: a palette opens; the eyedropper picks each brand colour and drops it into its letter.
    5 · Sati selects the finished logo.
  The toolbar only appears when a tool changes. Every cursor moves like a hand: a slight arc, easing in and
  out, a small overshoot on arrival, a press on every click. Positions come from the real glyph paths.
  Reduced motion holds the finished logo.
*/
const T = 19 // seconds per loop
const W = 680, H = 240 // the stage, centred in the hero
const S = 0.64 // logo units → px
const LOGO_W = 392 * S
const L0 = Math.round((W - LOGO_W) / 2) - 20, T0 = 34 // logo viewBox origin (-10 -10), in stage px
const STEPS = 7
const r2 = (n: number) => +n.toFixed(2)
const px = (u: number) => r2(L0 + (u + 10) * S)
const py = (v: number) => r2(T0 + (v + 10) * S)

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
const tiny = (s: Seg) => !!s.arc && s.arc.r < 5 // a corner rounding: no anchor of its own, no click

/* ── Letters drawn apart: a row on one baseline, centred under the logo ── */
const GAP = 38, BASE = 196
const widths = GLYPHS.map((g) => g.box[2] - g.box[0])
const rowW = widths.reduce((a, w) => a + w, 0) + GAP * (GLYPHS.length - 1)
const rowX = 186 - rowW / 2
const APART = GLYPHS.map((g, i) => [r2(rowX + widths.slice(0, i).reduce((a, w) => a + w + GAP, 0) - g.box[0]), r2(BASE - g.box[3])] as P)

/* ── Timeline (% of the loop) ── */
const PEN = [[3.5, 29], [6, 25.5], [8.5, 37], [11, 40]] // each letter built, apart
const HOLD = 0.5 // a click
const grab = (i: number) => 44 + 2.6 * i
const drop = (i: number) => grab(i) + 5
const MAGIC = 61 // the wand touches the logo
const pick = (i: number) => [68 + 4.8 * i, 70.6 + 4.8 * i] // dropper at swatch i, then at letter i
const SEL = 91 // Sati selects the finished logo
// Tool changes: the toolbar pops up only around these, and the new tool gets pressed.
const SWITCH = [{ at: 1.2, tool: 1 }, { at: 42.2, tool: 0 }, { at: 58.6, tool: 2 }, { at: 65.6, tool: 3 }, { at: 88.6, tool: 0 }]
const TOOLS = [MousePointer2, PenTool, WandSparkles, Pipette]
const PAL = { x: Math.round(px(382) + 22), y: 40 }
const swatch = (i: number): P => [PAL.x + 18, PAL.y + 40 + i * 26]

/* ── Keyframe helpers ── */
type F = [number, string][]
const kf = (name: string, frames: F) => {
  const seen = new Map<number, string>()
  frames.forEach(([p, c]) => seen.set(r2(Math.min(100, Math.max(0, p))), c))
  return `@keyframes ${name}{${[...seen.entries()].sort((a, b) => a[0] - b[0]).map(([p, css]) => `${p}%{${css}}`).join('')}}`
}
const EASE_SEG = 'animation-timing-function:cubic-bezier(.45,.05,.3,1)' // a pen stroke: accelerate, then settle on the point

/** A hand-like move: a gentle arc (bend × distance, to one side), eased in and out, a little overshoot at the end. */
type K = { t: number; x: number; y: number; s?: number; o?: number }
function glide(a: P, b: P, t0: number, t1: number, bend = 0.14, overshoot = 0.035): K[] {
  const d: P = [b[0] - a[0], b[1] - a[1]], len = Math.hypot(d[0], d[1]) || 1
  const n: P = [-d[1] / len, d[0] / len] // a perpendicular: the arc bulges this way
  const c: P = [(a[0] + b[0]) / 2 + n[0] * bend * len, (a[1] + b[1]) / 2 + n[1] * bend * len]
  const ease = (x: number) => { const e = x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; return e + overshoot * Math.sin(Math.PI * x) * x } // ease-in-out, a touch past, back
  const out: K[] = []
  for (let k = 0; k <= 10; k++) {
    const tau = k / 10, u = Math.min(1.04, ease(tau))
    const q = (p0: number, p1: number, p2: number) => (1 - u) * (1 - u) * p0 + 2 * (1 - u) * u * p1 + u * u * p2
    out.push({ t: t0 + (t1 - t0) * tau, x: q(a[0], c[0], b[0]), y: q(a[1], c[1], b[1]) })
  }
  out[out.length - 1] = { t: t1, x: b[0], y: b[1] }
  return out
}
/** A click where the cursor already is: press down, release. */
const click = (p: P, t: number): K[] => [{ t, x: p[0], y: p[1], s: 1 }, { t: t + 0.22, x: p[0], y: p[1], s: 0.84 }, { t: t + 0.5, x: p[0], y: p[1], s: 1 }]
/** Rest, with a hand's faint drift. */
const rest = (p: P, t0: number, t1: number): K[] => [{ t: t0, x: p[0], y: p[1] }, { t: (t0 + t1) / 2, x: p[0] + 1.2, y: p[1] - 0.8 }, { t: t1, x: p[0], y: p[1] }]
const frames = (ks: K[], off: P = [0, 0]): F => ks.map((k) => [k.t, `transform:translate(${r2(k.x + off[0])}px,${r2(k.y + off[1])}px) scale(${k.s ?? 1});opacity:${k.o ?? 1}`])
const hidden = (p: P, t: number): K => ({ t, x: p[0], y: p[1], o: 0 })

type Plan = { segs: Seg[]; t: { s0: number; s1: number }[]; anchors: { p: P; t: number }[]; close: number; total: number }
function plan(gi: number): Plan {
  const segs = segments(GLYPHS[gi]!.d)
  const [start, end] = PEN[gi]!
  const total = segs.reduce((a, s) => a + s.len, 0)
  const clicks = segs.filter((s) => !tiny(s)).length + new Set(segs.map((s) => s.sub)).size
  const move = end - start - clicks * HOLD
  const t: Plan['t'] = [], anchors: Plan['anchors'] = []
  let now = start, sub = -1
  segs.forEach((s, k) => {
    if (s.sub !== sub) { sub = s.sub; anchors.push({ p: s.a, t: now }); now += HOLD }
    const s0 = now, s1 = now + (move * s.len) / total
    t.push({ s0, s1 })
    const last = k === segs.length - 1 || segs[k + 1]!.sub !== s.sub
    if (!last && !tiny(s)) anchors.push({ p: s.b, t: s1 })
    now = s1 + (tiny(s) ? 0 : HOLD)
  })
  return { segs, t, anchors, close: now, total }
}
const PLANS = GLYPHS.map((_, i) => plan(i))

function keyframes() {
  const out: string[] = []
  const OFF: P = [W + 30, H + 20] // off-stage, bottom right

  GLYPHS.forEach((g, i) => {
    const pl = PLANS[i]!, [dx, dy] = APART[i]!

    // Pen: segments stretch with the cursor (same easing), anchors land on each click, handles on curves.
    pl.segs.forEach((s, k) => {
      const { s0, s1 } = pl.t[k]!
      out.push(kf(`hc-seg-${i}-${k}`, [[0, 'stroke-dashoffset:1;opacity:0'], [s0 - 0.01, 'stroke-dashoffset:1;opacity:0'], [s0, `stroke-dashoffset:1;opacity:1;${tiny(s) ? '' : EASE_SEG}`], [s1, 'stroke-dashoffset:0;opacity:1'],
        [pl.close + 1.5, 'stroke-dashoffset:0;opacity:1'], [pl.close + 3, 'stroke-dashoffset:0;opacity:0'], [100, 'stroke-dashoffset:0;opacity:0']]))
    })
    pl.anchors.forEach((a, k) => {
      const next = pl.anchors[k + 1]?.t ?? pl.close
      out.push(kf(`hc-an-${i}-${k}`, [[0, 'opacity:0;transform:scale(0);fill:var(--sel)'], [a.t + 0.15, 'opacity:0;transform:scale(0);fill:var(--sel)'], [a.t + 0.35, 'opacity:1;transform:scale(1.35);fill:var(--sel)'],
        [a.t + 0.6, 'opacity:1;transform:scale(1);fill:var(--sel)'], [next, 'opacity:1;transform:scale(1);fill:var(--surface)'], [pl.close + 2, 'opacity:1;transform:scale(1);fill:var(--surface)'], [pl.close + 3.5, 'opacity:0;transform:scale(1);fill:var(--surface)'], [100, 'opacity:0;transform:scale(0);fill:var(--surface)']]))
    })
    pl.segs.forEach((s, k) => {
      if (!s.arc || tiny(s)) return
      const { s0, s1 } = pl.t[k]!
      out.push(kf(`hc-hd-${i}-${k}`, [[0, 'opacity:0;transform:scale(0)'], [s0 + (s1 - s0) * 0.5, 'opacity:0;transform:scale(0)'], [s1, 'opacity:1;transform:scale(1)'], [s1 + HOLD + 1.2, 'opacity:1;transform:scale(1)'], [s1 + HOLD + 2.2, 'opacity:0;transform:scale(1)'], [100, 'opacity:0;transform:scale(0)']]))
    })
    // The closed shape: a plain outline; the wand turns it into the mark's ink outline.
    const pen0 = 'stroke:var(--fg);stroke-width:2.2', ink = `stroke:var(--wl-ink);stroke-width:${OUT.toFixed(2)}`
    out.push(kf(`hc-line-${i}`, [[0, `${pen0};opacity:0`], [pl.close + 1, `${pen0};opacity:0`], [pl.close + 2.5, `${pen0};opacity:1`], [MAGIC + 0.6, `${pen0};opacity:1`], [MAGIC + 2.6, `${ink};opacity:1`], [96, `${ink};opacity:1`], [99, `${ink};opacity:0`], [100, `${pen0};opacity:0`]]))

    // The pen cursor rides its path: eased glide along each segment, a press on each click.
    const cur: F = [[0, 'offset-distance:0%;opacity:0;scale:1'], [pl.t[0]!.s0 - HOLD - 1.4, 'offset-distance:0%;opacity:0;scale:1.4'], [pl.t[0]!.s0 - HOLD - 0.3, 'offset-distance:0%;opacity:1;scale:1']]
    let dist = 0, sub = -1
    const press = (t: number, d: number) => { cur.push([t, `offset-distance:${r2(d)}%;opacity:1;scale:1`], [t + 0.2, `offset-distance:${r2(d)}%;opacity:1;scale:.84`], [t + HOLD - 0.02, `offset-distance:${r2(d)}%;opacity:1;scale:1`]) }
    pl.segs.forEach((s, k) => {
      const d0 = (dist / pl.total) * 100
      if (s.sub !== sub) { sub = s.sub; press(pl.t[k]!.s0 - HOLD, d0) }
      dist += s.len
      cur.push([pl.t[k]!.s0, `offset-distance:${r2(d0)}%;opacity:1;scale:1;${tiny(s) ? '' : EASE_SEG}`], [pl.t[k]!.s1, `offset-distance:${r2((dist / pl.total) * 100)}%;opacity:1;scale:1`])
      if (!tiny(s)) press(pl.t[k]!.s1, (dist / pl.total) * 100)
    })
    cur.push([pl.close + 1.4, 'offset-distance:100%;opacity:1;scale:1'], [pl.close + 3, 'offset-distance:100%;opacity:0;scale:1'], [100, 'offset-distance:100%;opacity:0;scale:1'])
    out.push(kf(`hc-pen-${i}`, cur))

    // Move: the letter waits apart, then is dragged home on the same eased path as its cursor.
    const [cx, cy] = [(g.box[0] + g.box[2]) / 2, g.box[1] + (g.box[3] - g.box[1]) * 0.4]
    const from: P = [px(cx + dx), py(cy + dy)], to: P = [px(cx), py(cy)]
    const drag = glide(from, to, grab(i) + 0.7, drop(i), 0.1, 0.02)
    out.push(kf(`hc-mv-${i}`, [[0, `transform:translate(${dx}px,${dy}px)`], ...drag.map((k): [number, string] => [k.t, `transform:translate(${r2((k.x - to[0]) / S)}px,${r2((k.y - to[1]) / S)}px)`]),
      [99, 'transform:translate(0px,0px)'], [99.5, `transform:translate(${dx}px,${dy}px)`]]))
    out.push(kf(`hc-held-${i}`, [[0, 'opacity:0'], [grab(i) + 0.2, 'opacity:0'], [grab(i) + 0.5, 'opacity:1'], [drop(i) + 0.9, 'opacity:1'], [drop(i) + 1.7, 'opacity:0'], [100, 'opacity:0']]))
    const enter: P = [from[0] + 70 - i * 10, from[1] + 70]
    const leave: P = [to[0] + 26, to[1] + 34]
    out.push(kf(`hc-mc-${i}`, frames([hidden(enter, 0), hidden(enter, grab(i) - 2.6), { t: grab(i) - 2.3, x: enter[0], y: enter[1], o: 1 },
      ...glide(enter, from, grab(i) - 2.3, grab(i) - 0.1), ...click(from, grab(i) - 0.1).slice(0, 2),
      ...drag.map((k) => ({ ...k, s: 0.84 })), { t: drop(i) + 0.3, x: to[0], y: to[1], s: 1 },
      ...glide(to, leave, drop(i) + 0.5, drop(i) + 2), { t: drop(i) + 2.8, x: leave[0], y: leave[1], o: 0 }, hidden(enter, 100)])))
  })

  // Magic: the wand arcs in, hovers, taps the logo; sparkles burst; the shadow grows layer by layer.
  const tap: P = [px(186), py(108)], wIn: P = [W - 60, H + 30], wOut: P = [px(330), py(250)]
  out.push(kf('hc-wand', frames([hidden(wIn, 0), hidden(wIn, MAGIC - 2.6), { t: MAGIC - 2.4, x: wIn[0], y: wIn[1] },
    ...glide(wIn, [tap[0] + 14, tap[1] - 18], MAGIC - 2.4, MAGIC - 0.7, -0.18), ...glide([tap[0] + 14, tap[1] - 18], tap, MAGIC - 0.7, MAGIC - 0.1, 0, 0),
    ...click(tap, MAGIC - 0.1), ...rest(tap, MAGIC + 0.5, MAGIC + 1.4), ...glide(tap, wOut, MAGIC + 1.4, MAGIC + 3), { t: MAGIC + 3.6, x: wOut[0], y: wOut[1], o: 0 }, hidden(wIn, 100)])))
  // The letters' faces, in the paper colour, so the new shadow reads as depth before any colour arrives.
  out.push(kf('hc-face', [[0, 'opacity:0'], [MAGIC + 0.2, 'opacity:0'], [MAGIC + 0.8, 'opacity:1'], [96, 'opacity:1'], [99, 'opacity:0'], [100, 'opacity:0']]))
  for (let k = 0; k < STEPS; k++) {
    const a = MAGIC + 0.4 + k * 0.32
    out.push(kf(`hc-ex-${k}`, [[0, 'opacity:0'], [a, 'opacity:0'], [a + 0.5, 'opacity:1'], [96, 'opacity:1'], [99, 'opacity:0'], [100, 'opacity:0']]))
  }
  SPARKS.forEach((sp, k) => {
    const a = MAGIC + 0.1 + sp.d
    out.push(kf(`hc-spk-${k}`, [[0, 'opacity:0;transform:translate(0,0) scale(0) rotate(0deg)'], [a, 'opacity:0;transform:translate(0,0) scale(0) rotate(0deg)'], [a + 0.5, `opacity:1;transform:translate(${sp.x * 0.6}px,${sp.y * 0.6}px) scale(1) rotate(45deg)`],
      [a + 1.6, `opacity:0;transform:translate(${sp.x}px,${sp.y}px) scale(.4) rotate(90deg)`], [100, 'opacity:0;transform:translate(0,0) scale(0) rotate(0deg)']]))
  })

  // Colour: palette, then the eyedropper from swatch to letter, four times.
  GLYPHS.forEach((g, i) => {
    const [ps, pl] = pick(i)
    out.push(kf(`hc-fill-${i}`, [[0, 'opacity:0'], [pl + 0.4, 'opacity:0'], [pl + 1.6, 'opacity:1'], [96, 'opacity:1'], [99, 'opacity:0'], [100, 'opacity:0']]))
    out.push(kf(`hc-sw-${i}`, [[0, 'box-shadow:0 0 0 0 transparent'], [ps - 0.2, 'box-shadow:0 0 0 0 transparent'], [ps + 0.2, 'box-shadow:0 0 0 2px var(--fg)'], [ps + 2.2, 'box-shadow:0 0 0 2px var(--fg)'], [ps + 3, 'box-shadow:0 0 0 0 transparent'], [100, 'box-shadow:0 0 0 0 transparent']]))
  })
  const tip: P = [-2, -17] // the dropper's nib is its bottom-left
  const dIn: P = [W - 40, H + 30]
  const dk: K[] = [hidden(dIn, 0), hidden(dIn, 66.4), { t: 66.6, x: dIn[0], y: dIn[1] }]
  let last = dIn
  GLYPHS.forEach((g, i) => {
    const [ps, pl] = pick(i), sw = swatch(i), lt: P = [px((g.box[0] + g.box[2]) / 2), py((g.box[1] + g.box[3]) / 2)]
    dk.push(...glide(last, sw, i === 0 ? 66.6 : pick(i - 1)[1] + 0.6, ps - 0.1, 0.12), ...click(sw, ps - 0.1), ...glide(sw, lt, ps + 0.5, pl - 0.1, -0.16), ...click(lt, pl - 0.1))
    last = lt
  })
  dk.push(...glide(last, dIn, pick(3)[1] + 0.6, 88), hidden(dIn, 88.4), hidden(dIn, 100))
  out.push(kf('hc-drop', frames(dk, tip)))

  // Sati selects the finished logo.
  const corner: P = [px(358), py(228)], sIn: P = [W - 50, H + 20]
  out.push(kf('hc-sati', frames([hidden(sIn, 0), hidden(sIn, SEL - 2.4), { t: SEL - 2.2, x: sIn[0], y: sIn[1] }, ...glide(sIn, corner, SEL - 2.2, SEL - 0.2, 0.12), ...click(corner, SEL - 0.2),
    ...rest(corner, SEL + 0.4, 96), { t: 97.5, x: corner[0], y: corner[1], o: 0 }, hidden(sIn, 100)])))
  out.push(kf('hc-sel', [[0, 'opacity:0'], [SEL + 0.1, 'opacity:0'], [SEL + 0.5, 'opacity:1'], [96, 'opacity:1'], [98, 'opacity:0'], [100, 'opacity:0']]))
  out.push(kf('hc-pal', [[0, 'opacity:0;transform:translateY(6px) scale(.96)'], [66.2, 'opacity:0;transform:translateY(6px) scale(.96)'], [67.2, 'opacity:1;transform:none'], [87, 'opacity:1;transform:none'], [88.5, 'opacity:0;transform:translateY(4px)'], [100, 'opacity:0;transform:translateY(6px) scale(.96)']]))

  // Toolbar: pops up only around a tool change; the new tool is pressed and lights up.
  const bar: F = [[0, 'opacity:1;transform:none']]
  SWITCH.forEach(({ at }) => bar.push([at - 1.6, 'opacity:0;transform:translateX(-6px)'], [at - 1, 'opacity:1;transform:none'], [at + 1.4, 'opacity:1;transform:none'], [at + 2.1, 'opacity:0;transform:translateX(-6px)']))
  bar.push([99.4, 'opacity:0;transform:translateX(-6px)'], [100, 'opacity:1;transform:none']) // stays hidden until the next loop's first change
  out.push(kf('hc-bar', bar.filter(([p]) => p >= 0)))
  TOOLS.forEach((_, ti) => {
    const on = 'background:var(--sel);color:#fff;transform:scale(1)', off = 'background:transparent;color:var(--muted);transform:scale(1)'
    const f: F = []
    SWITCH.forEach(({ at, tool }, si) => {
      const prev = SWITCH[(si - 1 + SWITCH.length) % SWITCH.length]!.tool
      if (tool === ti) f.push([at - 0.01, prev === ti ? on : off], [at + 0.15, 'background:var(--sel);color:#fff;transform:scale(.86)'], [at + 0.4, on])
      else if (prev === ti) f.push([at - 0.01, on], [at + 0.15, off])
    })
    const startOn = SWITCH[SWITCH.length - 1]!.tool === ti
    f.push([0, startOn ? on : off], [100, startOn ? on : off])
    out.push(kf(`hc-tool-${ti}`, f))
  })
  return out.join('\n')
}

/* Sparkles around the tap: direction (px) and a small delay each. */
const SPARKS = [[-46, -30], [40, -36], [58, 6], [-60, 10], [-22, 44], [30, 42], [6, -54], [70, -20]].map(([x, y], k) => ({ x: x!, y: y!, d: (k % 4) * 0.12 }))

const step = (k: number) => `translate(${r2((EX * (k + 1)) / STEPS)} ${r2((EY * (k + 1)) / STEPS)})`
const A = 9 / S

export function HeroCanvas() {
  const css = keyframes()
  const anim = (name: string): CSSProperties => ({ animation: `${name} ${T}s linear infinite` })
  const icon = 18 / S
  const tap: P = [px(186), py(108)]
  return (
    <div className="hero" aria-hidden>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="hc-stage" style={{ width: W, height: H }}>
        <div className="hero-grid" />

        <div className="hc-tools" style={{ ...anim('hc-bar'), left: px(rowX) - 58, top: 54 }}>
          {TOOLS.map((I, i) => <span key={i} className="hc-tool" style={anim(`hc-tool-${i}`)}><I size={14} /></span>)}
        </div>

        <svg className="hc-logo" viewBox="-10 -10 392 240" width={LOGO_W} height={240 * S} style={{ left: L0, top: T0 }}>
          {/* the shadow, grown in by the wand: one layer at a time */}
          <g className="hc-extrude">
            {Array.from({ length: STEPS }, (_, k) => (
              <g key={k} style={anim(`hc-ex-${STEPS - 1 - k}`)}>{GLYPHS.map((g, i) => <path key={i} d={g.d} transform={step(STEPS - 1 - k)} fillRule="evenodd" />)}</g>
            ))}
          </g>
          <g className="hc-face" style={anim('hc-face')}>{GLYPHS.map((g, i) => <path key={i} d={g.d} fillRule="evenodd" />)}</g>
          {GLYPHS.map((g, i) => <path key={'f' + i} d={g.d} fill={g.c} fillRule="evenodd" style={anim(`hc-fill-${i}`)} className="hc-fill" />)}

          {PLANS.map((pl, i) => {
            const g = GLYPHS[i]!
            return (
              <g key={'g' + i} className="hc-letter" style={anim(`hc-mv-${i}`)}>
                <path d={g.d} className="hc-line" style={anim(`hc-line-${i}`)} />
                {pl.segs.map((s, k) => <path key={`s${k}`} d={segD(s)} pathLength={1} className="hc-seg" style={anim(`hc-seg-${i}-${k}`)} />)}
                {pl.segs.map((s, k) => {
                  if (!s.arc || tiny(s)) return null
                  const prev = pl.segs[k - 1]
                  const t0 = prev ? unit([prev.b[0] - prev.a[0], prev.b[1] - prev.a[1]]) : unit([s.b[0] - s.a[0], 0])
                  const tEnd = unit([(s.b[0] - s.a[0]) / s.arc.r - t0[0], (s.b[1] - s.a[1]) / s.arc.r - t0[1]])
                  const h = 0.5523 * s.arc.r
                  const p1: P = [s.b[0] - tEnd[0] * h, s.b[1] - tEnd[1] * h], p2: P = [s.b[0] + tEnd[0] * h, s.b[1] + tEnd[1] * h]
                  return (
                    <g key={`h${k}`} className="hc-hd" style={anim(`hc-hd-${i}-${k}`)}>
                      <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />
                      <circle cx={p1[0]} cy={p1[1]} r={3.4 / S} /><circle cx={p2[0]} cy={p2[1]} r={3.4 / S} />
                    </g>
                  )
                })}
                {pl.anchors.map((a, k) => <rect key={`a${k}`} className="hc-an" x={a.p[0] - A / 2} y={a.p[1] - A / 2} width={A} height={A} style={anim(`hc-an-${i}-${k}`)} />)}
                <rect className="hc-held" x={g.box[0] - 6} y={g.box[1] - 6} width={g.box[2] - g.box[0] + 12} height={g.box[3] - g.box[1] + 12} style={anim(`hc-held-${i}`)} />
              </g>
            )
          })}

          <g className="hc-sel" style={anim('hc-sel')}>
            <rect x={-2} y={-6} width={362} height={232} />
            {[[-2, -6], [360, -6], [-2, 226], [360, 226]].map(([x, y], i) => <rect key={i} className="hc-handle" x={x! - 5} y={y! - 5} width={10} height={10} />)}
          </g>
        </svg>
        <span className="hc-size" style={{ ...anim('hc-sel'), left: px(174), top: py(234) }}>WLDD · {Math.round(372 * S)} × {Math.round(242 * S)}</span>

        {/* sparkles from the wand's touch */}
        {SPARKS.map((_, k) => <span key={k} className="hc-spark" style={{ ...anim(`hc-spk-${k}`), left: tap[0], top: tap[1], color: GLYPHS[k % 4]!.c }}><Sparkle size={k % 3 === 0 ? 14 : 10} /></span>)}

        <div className="hc-pens" style={{ left: L0, top: T0, transform: `scale(${S}) translate(10px, 10px)` }}>
          {GLYPHS.map((g, i) => (
            <span key={i} className="hc-pen" style={{ ...anim(`hc-pen-${i}`), offsetPath: `path('${g.d}')`, offsetAnchor: `${r2((icon * 2) / 24)}px ${r2((icon * 2) / 24)}px`, translate: `${APART[i]![0]}px ${APART[i]![1]}px`, color: g.c } as CSSProperties}>
              <PenTool size={icon} />
              {i === 0 && <b style={{ fontSize: 10.5 / S }}>Sati</b>}
            </span>
          ))}
        </div>

        {GLYPHS.map((g, i) => (
          <span key={'m' + i} className="hc-mc" style={{ ...anim(`hc-mc-${i}`), color: g.c }}><MousePointer2 size={18} />{i === 0 && <b>Sati</b>}</span>
        ))}

        <span className="hc-wand" style={anim('hc-wand')}><WandSparkles size={20} /><b>Sati</b></span>

        <div className="hc-pal" style={{ ...anim('hc-pal'), left: PAL.x, top: PAL.y }}>
          <div className="hc-pal-h">Fill</div>
          {GLYPHS.map((g, i) => <div key={i} className="hc-pal-r"><i style={{ background: g.c, ...anim(`hc-sw-${i}`) }} /><span>{g.c}</span><em>{g.ch}</em></div>)}
        </div>
        <span className="hc-drop" style={anim('hc-drop')}><Pipette size={18} /></span>

        <span className="hc-sati" style={anim('hc-sati')}><MousePointer2 size={20} /><b>Sati</b></span>
      </div>
    </div>
  )
}
