import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/** Reads what @wldd/ui ships for machines: component meta and rules. The docs show exactly that. */
const UI_DIST = join(process.cwd(), '../../packages/ui/dist')

export type PropMeta = { name: string; type: string; required: boolean; default: string | null; description: string }
export type PartMeta = { name: string; description: string; props: PropMeta[] }
export type ComponentMeta = {
  id: string; name: string; component: string; exports: string[]; summary: string; status: string; group: string
  parts: PartMeta[]; props: PropMeta[]
}

export function componentMeta(id: string): ComponentMeta {
  const all = JSON.parse(readFileSync(join(UI_DIST, 'meta/components.json'), 'utf8')) as { components: ComponentMeta[] }
  const c = all.components.find((x) => x.id === id)
  if (!c) throw new Error(`No component "${id}" in @wldd/ui meta. Did you run the build?`)
  return c
}

/** Rule sections ("## When to use", "## Do", …) from the shipped rules file. */
export function componentRules(id: string): { title: string; body: string }[] {
  const raw = readFileSync(join(UI_DIST, `rules/${id}.md`), 'utf8').replace(/\r\n/g, '\n')
  return raw.split(/^## /m).slice(1).map((s) => {
    const nl = s.indexOf('\n')
    return { title: s.slice(0, nl).trim(), body: s.slice(nl + 1).trim() }
  })
}

export const exampleSource = (id: string) =>
  readFileSync(join(process.cwd(), 'examples', `${id}.tsx`), 'utf8').replace(/\r\n/g, '\n')
