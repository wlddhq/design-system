/* The WLDD mark, quiet: the grey line drawing from the DMS Home page (dms-play shared/WlddMark.jsx).
   Static on purpose. Geometry is the master's: every measure derives from x, the stem width.
   Outline = the contour of each letter (with its ⅓x outline) and of its 1x → 1x extrusion, nothing filled.
   Built by knocking out: a wider shape in the line colour, then the shape itself in the background colour. */

const X = 20.5
const CAP = 5.5 * X
const R = 1.5 * X
const RI = 0.5 * X
const OUT = X / 3
const EX = X, EY = X
const r0 = X / 8
const TOP = 3.5, LEFT = 9
const STEPS = 7

type Pt = [number, number]
function rr(x0: number, y0: number, x1: number, y1: number, [tl, tr, br, bl]: number[]) {
  return `M${x0 + tl} ${y0}H${x1 - tr}A${tr} ${tr} 0 0 1 ${x1} ${y0 + tr}V${y1 - br}A${br} ${br} 0 0 1 ${x1 - br} ${y1}` +
    `H${x0 + bl}A${bl} ${bl} 0 0 1 ${x0} ${y1 - bl}V${y0 + tl}A${tl} ${tl} 0 0 1 ${x0 + tl} ${y0}Z`
}
const poly = (pts: Pt[]) => 'M' + pts.map((p) => p.join(' ')).join('L') + 'Z'
const at = (x0: number, y0: number, uv: Pt[]): Pt[] => uv.map(([u, v]) => [x0 + u * X, y0 + v * X])
const dPath = ([x0, y0]: Pt) => {
  const x1 = x0 + 3 * X, y1 = y0 + CAP
  return rr(x0, y0, x1, y1, [r0, R, R, r0]) + rr(x0 + X, y0 + X, x1 - X, y1 - X, [r0, RI, RI, r0])
}

const W0: Pt = [LEFT, TOP + X]
const L0: Pt = [LEFT + 7.5 * X, TOP + 3 * X]
const D10: Pt = [L0[0] + 2 * X, TOP]
const D20: Pt = [D10[0] + 3.5 * X, TOP + 4 * X]
const W_UV: Pt[] = [[0, 0], [1, 0], [2, 3.5], [3, 0], [4, 0], [5, 3.5], [6, 0], [7, 0], [5.75, 5.5], [4.5, 5.5], [3.5, 2.5], [2.5, 5.5], [1.25, 5.5]]
const L_UV: Pt[] = [[0, 0], [1, 0], [1, 4.5], [3, 4.5], [3, 5.5], [0, 5.5]]
const GLYPHS = [poly(at(W0[0], W0[1], W_UV)), poly(at(L0[0], L0[1], L_UV)), dPath(D10), dPath(D20)]

const step = (k: number) => `translate(${(EX * (k + 1)) / STEPS} ${(EY * (k + 1)) / STEPS})`

export function WlddMark({ height = 26, className = '' }: { height?: number; className?: string }) {
  const lw = (1.25 * 232) / height // ~1.25px line at any size
  const sweep = (d: string, cls: string, w: number) => Array.from({ length: STEPS }, (_, k) => (
    <path key={k} d={d} className={cls} strokeWidth={w} strokeLinejoin="round" transform={step(k)} />
  ))
  return (
    <svg className={'wm wm-outline ' + className} viewBox="-10 -10 392 240" height={height} width={(height * 392) / 240} fill="none" role="img" aria-label="WLDD">
      {GLYPHS.map((d, i) => (
        <g key={i}>
          <g>{sweep(d, 'wm-line', OUT + lw * 2)}</g>
          <g>{sweep(d, 'wm-bg', OUT)}</g>
          <path d={d} className="wm-line" fillRule="evenodd" strokeWidth={OUT + lw * 2} strokeLinejoin="round" />
          <path d={d} className="wm-bg" fillRule="evenodd" strokeWidth={OUT} strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  )
}
