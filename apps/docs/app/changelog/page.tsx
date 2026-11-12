import { DocPage } from '@/components/Doc'
import { Code } from '@/components/Code'
import { ChangeLine } from '@/components/Changes'
import { releases } from '@/lib/changelog'

export const metadata = { title: 'What’s new' }

const day = (d?: string) => (d ? new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '')

/** Every release, from CHANGELOG.md. Newest first; Unreleased on top while work is waiting to ship. */
export default function Page() {
  const all = releases()
  const latest = all.find((r) => r.version !== 'Unreleased')
  return (
    <DocPage href="/changelog" lead="Every release of @wldd/ui, @wldd/tokens and @wldd/tailwind. The three always share one version.">
      {latest && <Code lang="bash" code={`npm install @wldd/ui@${latest.version} @wldd/tokens@${latest.version} @wldd/tailwind@${latest.version}`} />}
      {all.map((r) => {
        const unreleased = r.version === 'Unreleased'
        const id = unreleased ? 'unreleased' : 'v' + r.version.replace(/\./g, '-')
        return (
          <section key={r.version} className="rel" aria-labelledby={id}>
            <div className="rel-h">
              <h2 id={id}>{unreleased ? 'Not released yet' : r.version}</h2>
              {r === latest && <span className="rel-pill">Latest</span>}
              {r.date && <time dateTime={r.date}>{day(r.date)}</time>}
            </div>
            {unreleased && <p className="ex-d">Merged, waiting for the next release.</p>}
            <ul className="chg-list">{r.changes.map((c, i) => <ChangeLine key={i} c={c} />)}</ul>
          </section>
        )
      })}
    </DocPage>
  )
}
