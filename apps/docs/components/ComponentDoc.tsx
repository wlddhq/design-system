import { marked } from 'marked'
import { Check, X } from 'lucide-react'
import { componentMeta, componentRules, exampleSource, type PropMeta } from '@/lib/library'
import { EXAMPLES } from '@/examples'
import { Code } from './Code'
import { DocPage, H2 } from './Doc'

const md = (s: string) => ({ __html: marked.parse(s, { async: false }) as string })

/** One live example: the stage renders the file, the code shows the same file. */
export async function Example({ id, title, note, frame }: { id: keyof typeof EXAMPLES; title?: string; note?: string; frame?: number }) {
  const Comp = EXAMPLES[id]
  return (
    <>
      {title && <h3 className="ex-t">{title}</h3>}
      {note && <p className="ex-d">{note}</p>}
      <div className="ex">
        <div className={'ex-stage' + (frame ? ' framed' : '')} style={frame ? { height: frame } : undefined}><Comp /></div>
        <Code code={exampleSource(id)} />
      </div>
    </>
  )
}

export function PropsTable({ props }: { props: PropMeta[] }) {
  if (!props.length) return <p className="ex-d">No props of its own. Takes the standard HTML attributes of its element.</p>
  return (
    <div className="tbl-w">
      <table className="tbl">
        <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name}>
              <td className="m nm">{p.name}{p.required && <span className="req" title="Required">*</span>}</td>
              <td className="m ty">{p.type}</td>
              <td className="m">{p.default ?? '—'}</td>
              <td>{p.description || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * A full component page, built from what the package ships:
 * import line → examples → rules (When to use, Do / Don't, …) → props for every part, from TypeScript.
 */
export async function ComponentDoc({ id, href, examples, children }: {
  id: string; href: string; children?: React.ReactNode
  examples: { id: keyof typeof EXAMPLES; title: string; note?: string; frame?: number }[]
}) {
  const meta = componentMeta(id)
  const rules = componentRules(id)
  const get = (t: string) => rules.find((r) => r.title === t)
  const doR = get('Do'); const dontR = get("Don't")
  const lead = rules.filter((r) => ['When to use', 'Anatomy'].includes(r.title))
  const rest = rules.filter((r) => !['Do', "Don't", 'When to use', 'Anatomy'].includes(r.title))
  const many = meta.parts.length > 1

  return (
    <DocPage href={href} lead={meta.summary}>
      <Code code={`import { ${meta.exports.join(', ')} } from '@wldd/ui'`} />

      <H2>Examples</H2>
      {examples.map((e) => <Example key={e.id} {...e} />)}
      {children}

      {lead.map((r) => (
        <section key={r.title}><H2>{r.title}</H2><div dangerouslySetInnerHTML={md(r.body)} /></section>
      ))}

      {(doR || dontR) && (
        <>
          <H2 id="do-and-dont">Do and don’t</H2>
          <div className="dd">
            {doR && <div className="dd-c dd-do"><div className="dd-h"><span className="dd-i"><Check size={12} strokeWidth={2.5} /></span>Do</div><div dangerouslySetInnerHTML={md(doR.body)} /></div>}
            {dontR && <div className="dd-c dd-dont"><div className="dd-h"><span className="dd-i"><X size={12} strokeWidth={2.5} /></span>Don’t</div><div dangerouslySetInnerHTML={md(dontR.body)} /></div>}
          </div>
        </>
      )}

      <H2>Props</H2>
      {many
        ? meta.parts.map((p) => (
            <section key={p.name}>
              <h3 className="ex-t" id={'props-' + p.name.toLowerCase()}><code>{p.name}</code></h3>
              {p.description && <p className="ex-d">{p.description}</p>}
              <PropsTable props={p.props} />
            </section>
          ))
        : <PropsTable props={meta.props} />}

      {rest.map((r) => (
        <section key={r.title}><H2>{r.title}</H2><div dangerouslySetInnerHTML={md(r.body)} /></section>
      ))}
    </DocPage>
  )
}
