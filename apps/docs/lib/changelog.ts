import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/*
  The changelog (CHANGELOG.md at the repo root) as data, for "What's new", the sidebar version
  and each component page. One file is the source; nothing about releases is written twice.
*/
export type Change = { kind: 'New' | 'Fixed' | 'Changed'; tag?: string; text: string }
export type Release = { version: string; date?: string; changes: Change[] }

const ROOT = join(process.cwd(), '../..')

export function releases(): Release[] {
  const raw = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8').replace(/\r\n/g, '\n')
  const out: Release[] = []
  for (const block of raw.split(/^## /m).slice(1)) {
    const [head = '', ...lines] = block.split('\n')
    const m = head.match(/^(\S+)(?:\s+[—-]\s+(\S+))?/)
    if (!m) continue
    const rel: Release = { version: m[1]!, date: m[2], changes: [] }
    let kind: Change['kind'] = 'Changed'
    for (const l of lines) {
      const h = l.match(/^### (New|Fixed|Changed)/)
      if (h) { kind = h[1] as Change['kind']; continue }
      const item = l.match(/^- (?:\[([a-z0-9-]+)\]\s*)?(.+)/)
      if (item) rel.changes.push({ kind, tag: item[1], text: item[2]!.trim() })
    }
    out.push(rel)
  }
  return out
}

/** The published versions, newest first (Unreleased left out). */
export const published = () => releases().filter((r) => r.version !== 'Unreleased')

/** The version the packages are at, from @wldd/ui's package.json. */
export const currentVersion = (): string => JSON.parse(readFileSync(join(ROOT, 'packages/ui/package.json'), 'utf8')).version

/** A component's own history: every published change tagged with its page id. */
export function historyOf(id: string) {
  return published().flatMap((r) => r.changes.filter((c) => c.tag === id).map((c) => ({ ...c, version: r.version, date: r.date })))
}

/** Did this component change in the latest release? Not for the first release, where everything is new. */
export function updatedIn(id: string): string | null {
  const [latest, prev] = published()
  if (!latest || !prev) return null
  return latest.changes.some((c) => c.tag === id) ? latest.version : null
}

/** Where a tag points: component pages, or the page that covers the package. */
export const tagHref = (tag: string) =>
  ({ fonts: '/installation#fonts', tokens: '/foundations/colours', tailwind: '/installation' } as Record<string, string>)[tag] ?? `/components/${tag}`
