'use client'
import { useEffect, useState } from 'react'
import { Button, Loader, WlddLoader, Segmented, TextMorph, Tooltip, LOADERS, WLDD_MODES, type LoaderKind, type WlddMode } from '@wldd/ui'

type Group = 'general' | 'ai' | 'wldd'
const TITLES: Record<Group, string> = { general: 'Everyday', ai: 'AI', wldd: 'WLDD' }

/** Click a stage to finish or restart that one; the switch above does all of them. */
function Card({ name, tip, wide, all, render, inline }: {
  name: string; tip: string; wide?: boolean; all: boolean
  render: (done: boolean) => React.ReactNode; inline: (done: boolean) => React.ReactNode
}) {
  const [own, setOwn] = useState<boolean | null>(null)
  useEffect(() => setOwn(null), [all])
  const done = own ?? all
  return (
    <div className={'ld-card' + (wide ? ' ld-wide' : '')}>
      <button className="ld-stage" onClick={() => setOwn(!done)} aria-label={(done ? 'Restart ' : 'Finish ') + name}>{render(done)}</button>
      <div className="ld-foot">
        <Tooltip label={tip}><span className="ld-name">{name}</span></Tooltip>
        <span className="ld-inline">{inline(done)}</span>
      </div>
    </div>
  )
}

/** A real DMS moment for each animation: [while working, when done]. */
const MOMENTS: Record<string, [string, string]> = {
  // WLDD wordmark: brand moments
  press: ['Signing in', 'Signed in'], dance: ['Publishing report', 'Published'], drop: ['Importing creators', 'Imported'],
  build: ['Building deck', 'Deck ready'], cycle: ['Thinking', 'Answered'], travel: ['Moving to Activation', 'Moved'],
  portal: ['Connecting Instagram', 'Connected'],
  // Everyday: ring for a wait, notch for a step-by-step job
  ring: ['Saving', 'Saved'], notch: ['Syncing Tally', 'Synced'],
  // AI: the assistant thinking
  ai: ['Thinking', 'Answered'],
}
/** Wide cards first, three across: the grid fills with no gaps. */
const WLDD_ORDER = ['travel', 'press', 'portal', 'dance', 'drop', 'build', 'cycle']

function Moment({ id, done, loader, bubble }: { id: string; done: boolean; loader: React.ReactNode; bubble?: boolean }) {
  const [busy, ok] = MOMENTS[id] ?? ['Saving', 'Saved']
  const label = <TextMorph>{done ? ok : busy}</TextMorph>
  return bubble
    ? <span className="ld-bubble">{loader}{label}</span>
    : <Button size="sm" tabIndex={-1}>{loader}{label}</Button>
}

export function LoaderGallery({ groups }: { groups: Group[] }) {
  const [state, setState] = useState<'loading' | 'done'>('loading')
  const [size, setSize] = useState<'24' | '48' | '96'>('48')
  const all = state === 'done'
  const px = Number(size)
  return (
    <div className="ld-gallery">
      <div className="ld-bar-top">
        <Segmented size="sm" value={state} onChange={setState} items={[{ value: 'loading', label: 'Loading' }, { value: 'done', label: 'Done' }]} />
        <Segmented size="sm" value={size} onChange={setSize} items={[{ value: '24', label: '24' }, { value: '48', label: '48' }, { value: '96', label: '96' }]} />
      </div>
      {groups.map((g) => (
        <section key={g}>
          {groups.length > 1 && <h3 className="ex-t">{TITLES[g]}</h3>}
          <div className="ld-grid ld-grid-3">
            {g === 'wldd'
              ? WLDD_ORDER.map((id) => WLDD_MODES.find((m) => m.id === id)!).map((m) => (
                  <Card key={m.id} name={m.name} tip={m.tip} wide={m.wide} all={all}
                    render={(d) => <WlddLoader mode={m.id as WlddMode} size={px} done={d} />}
                    inline={(d) => <Moment id={m.id} done={d} bubble={m.id === 'cycle'}
                      loader={<WlddLoader mode={m.id as WlddMode} size={m.id === 'cycle' ? 16 : 18} tight={m.id === 'cycle'} done={d} />} />} />
                ))
              : LOADERS.filter((l) => l.group === g).map((l) => (
                  <Card key={l.id} name={l.name} tip={l.tip} all={all}
                    render={(d) => <Loader kind={l.id as LoaderKind} size={px} done={d} />}
                    inline={(d) => <Moment id={l.id} done={d} bubble={g === 'ai'}
                      loader={<Loader kind={l.id as LoaderKind} size={g === 'ai' ? 16 : 14} done={d} />} />} />
                ))}
          </div>
        </section>
      ))}
    </div>
  )
}
