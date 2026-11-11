import { DocPage, H2 } from '@/components/Doc'
import { VarValue } from '@/components/LiveTokens'

export const metadata = { title: 'Typography' }

const SCALE = [
  { t: '--text-3xl', c: 'text-3xl', s: 'Big numbers' },
  { t: '--text-2xl', c: 'text-2xl', s: 'Metric values' },
  { t: '--text-xl', c: 'text-xl', s: 'Page titles' },
  { t: '--text-lg', c: 'text-lg', s: 'Sheet and dialog titles' },
  { t: '--text-md', c: 'text-md', s: 'Section titles' },
  { t: '--text-base', c: 'text-base', s: 'Body and controls — the default' },
  { t: '--text-sm', c: 'text-sm', s: 'Small buttons, dense rows' },
  { t: '--text-xs', c: 'text-xs', s: 'Labels, counts, meta' },
  { t: '--text-2xs', c: 'text-2xs', s: 'Tiny captions' },
]

export default function Page() {
  return (
    <DocPage href="/foundations/typography" lead="One body size, a short scale, and fonts that come from the theme.">
      <H2>Scale</H2>
      <p>The body is 13.5px. Titles use the display face; everything else uses the body face.</p>
      <div>
        {SCALE.map((r) => (
          <div key={r.t} className="type-row">
            <div className="meta">{r.c}<br /><VarValue name={r.t} /></div>
            <div className={r.c + ' text-fg ell'} style={{ fontFamily: ['--text-3xl', '--text-2xl', '--text-xl'].includes(r.t) ? 'var(--display)' : undefined, fontWeight: ['--text-3xl', '--text-2xl', '--text-xl', '--text-lg', '--text-md'].includes(r.t) ? 600 : 400, letterSpacing: ['--text-3xl', '--text-2xl', '--text-xl'].includes(r.t) ? '-0.025em' : undefined }}>{r.s}</div>
          </div>
        ))}
      </div>

      <H2>Fonts</H2>
      <div className="tbl-w">
        <table className="tbl">
          <thead><tr><th>Token</th><th>Tailwind</th><th>Now</th><th>Use for</th></tr></thead>
          <tbody>
            <tr><td className="m nm">--font</td><td className="m">font-sans</td><td className="m"><VarValue name="--font" /></td><td>Everything by default</td></tr>
            <tr><td className="m nm">--display</td><td className="m">font-display</td><td className="m"><VarValue name="--display" /></td><td>Page titles, big numbers</td></tr>
            <tr><td className="m nm">--mono</td><td className="m">font-mono</td><td className="m"><VarValue name="--mono" /></td><td>Codes, IDs, amounts in dense tables</td></tr>
          </tbody>
        </table>
      </div>

      <H2>Rules</H2>
      <ul>
        <li>Numbers that change or line up in columns use <code>tabular-nums</code>.</li>
        <li>Weights: 400 body, 500 labels and controls, 600 titles. Avoid 700 outside Pop.</li>
        <li>Titles tighten their letter spacing; body text never does.</li>
        <li>Don’t set a font family on a component. Pick the token.</li>
      </ul>
    </DocPage>
  )
}
