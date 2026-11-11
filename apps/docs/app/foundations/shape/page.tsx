import { DocPage, H2 } from '@/components/Doc'
import { VarValue } from '@/components/LiveTokens'

export const metadata = { title: 'Shape & depth' }

const RADII = [
  { t: '--radius-control', c: 'rounded-control', s: 'Buttons, inputs' },
  { t: '--radius-chip', c: 'rounded-chip', s: 'Chips, tags' },
  { t: '--radius-card', c: 'rounded-card', s: 'Cards, wells' },
  { t: '--radius-pop', c: 'rounded-pop', s: 'Menus, dialogs' },
]
const SHADOWS = [
  { t: '--shadow-1', c: 'shadow-1', s: 'A hint of lift on controls (light only)' },
  { t: '--shadow-pop', c: 'shadow-pop', s: 'Everything that floats' },
]

export default function Page() {
  return (
    <DocPage href="/foundations/shape" lead="Radii and shadows come from the theme. Pop’s corner dial rescales every radius at once.">
      <H2>Radius</H2>
      <div className="shape-grid">
        {RADII.map((r) => (
          <div key={r.t} className="shape">
            <div className="box" style={{ borderRadius: `var(${r.t})` }} />
            <div className="meta">{r.c} · <VarValue name={r.t} /><br />{r.s}</div>
          </div>
        ))}
      </div>

      <H2>Shadows</H2>
      <p>Depth is rare. Separate things with hairlines first; use shadow only for what floats above the page.</p>
      <div className="shape-grid">
        {SHADOWS.map((r) => (
          <div key={r.t} className="shape">
            <div className="box" style={{ borderRadius: 'var(--radius-card)', boxShadow: `var(${r.t})`, background: 'var(--pop)' }} />
            <div className="meta">{r.c}<br />{r.s}</div>
          </div>
        ))}
      </div>

      <H2>Rules</H2>
      <ul>
        <li>One layer per element: a soft fill or a ring, never both.</li>
        <li>Never put a ringed thing inside another ringed thing.</li>
        <li>Prefer lists and tables with hairlines over cards. Cards are for metrics and boards.</li>
      </ul>
    </DocPage>
  )
}
