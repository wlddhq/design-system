// Builds the machine-readable side of the library, shipped inside the npm package:
//   dist/meta/components.json — every component page: summary, group, and props for each part (from TypeScript)
//   dist/rules/<id>.md        — each component's usage rules (the same text the docs site shows)
//   dist/AGENTS.md            — the entry point an AI tool reads first
// The docs site and the future MCP both read these files, so they can never disagree.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync, copyFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import docgen from 'react-docgen-typescript'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'src')
const dist = join(root, 'dist')
mkdirSync(join(dist, 'meta'), { recursive: true })
mkdirSync(join(dist, 'rules'), { recursive: true })

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
const files = walk(src)

const parser = docgen.withCustomConfig(join(root, 'tsconfig.json'), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // Keep our own props, plus `children`; drop the hundreds inherited from HTML attributes.
  propFilter: (p) => p.name === 'children' || !p.parent || !/node_modules/.test(p.parent.fileName),
})
const docs = new Map(parser.parse(files.filter((f) => f.endsWith('.tsx'))).map((d) => [d.displayName, d]))

const typeOf = (t) => (t.name === 'enum' && Array.isArray(t.value) ? t.value.map((v) => v.value.replace(/"/g, "'")).join(' | ') : t.name)
const propsOf = (name) => {
  const d = docs.get(name)
  if (!d) return null
  return {
    name, description: d.description,
    props: Object.values(d.props).map((p) => ({
      name: p.name, type: typeOf(p.type), required: p.required, default: p.defaultValue?.value ?? null, description: p.description,
    })).sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name)),
  }
}

function readRules(file) {
  const raw = readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/)
  const fm = Object.fromEntries((m?.[1] ?? '').split('\n').filter(Boolean).map((l) => {
    const i = l.indexOf(':'); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
  }))
  return { fm, body: m ? raw.slice(m[0].length) : raw }
}

const GROUPS = { primitives: 'Primitives', controls: 'Controls', data: 'Data display', views: 'Views (List, Board, Table, Timeline, Grid)', records: 'Records (pages, sheets, dialogs, forms, toasts)', shell: 'App shell', motion: 'Motion & loaders' }
const components = []
for (const md of files.filter((f) => f.endsWith('.md'))) {
  const id = basename(md, '.md')
  const { fm, body } = readRules(md)
  const names = [fm.component, ...(fm.parts ? fm.parts.split(',').map((s) => s.trim()) : [])]
  const parts = names.map(propsOf).filter(Boolean)
  const missing = names.filter((n) => !docs.has(n))
  if (missing.length) console.warn(`  ! ${id}: no TypeScript docs for ${missing.join(', ')}`)
  components.push({
    id, name: fm.name, component: fm.component, exports: names, summary: fm.summary, status: fm.status,
    group: fm.group ?? 'primitives', parts, props: parts[0]?.props ?? [],
  })
  writeFileSync(join(dist, 'rules', `${id}.md`), `# ${fm.name}\n\n${fm.summary}\n\nExports: ${names.map((n) => '`' + n + '`').join(', ')}\n\n${body.trim()}\n`)
}
components.sort((a, b) => a.name.localeCompare(b.name))
writeFileSync(join(dist, 'meta', 'components.json'), JSON.stringify({ components }, null, 2))

const byGroup = Object.entries(GROUPS).map(([g, label]) => {
  const list = components.filter((c) => c.group === g)
  return `### ${label}\n${list.map((c) => `- **${c.name}** (${c.exports.map((n) => '`' + n + '`').join(', ')}) — ${c.summary} Rules: \`rules/${c.id}.md\``).join('\n')}`
}).join('\n\n')

writeFileSync(join(dist, 'AGENTS.md'), `# Building with @wldd/ui

You are building UI for WLDD. Use only these components and tokens. Never invent styles.

## Rules
- Import components from \`@wldd/ui\` and icons from \`lucide-react\` only.
- Every screen sits in \`AppShell\` (Sidebar + TopBar + optional Toolbar + PageScroll). Never build your own frame.
- Colours, radii, shadows and fonts come from the theme. Use the Tailwind classes from \`@wldd/tailwind\` (bg-surface, text-muted, border-line, rounded-card…). Tailwind's default palette does not exist here.
- Say less: 1–2 word labels, no subtitles under titles, no helper paragraphs, no emoji. Counts sit beside labels.
- One primary action per view. Colour means status, never decoration.
- Motion only on state changes, never on page load. Keyboard actions are instant.
- Before writing a component, read its rules file below.

## Components
${byGroup}

Props for every component and part: \`meta/components.json\`. What changed in each version: \`CHANGELOG.md\`.
`)
// The changelog ships with the package, so tools can see what changed between versions.
copyFileSync(join(root, '../../CHANGELOG.md'), join(dist, 'CHANGELOG.md'))
console.log(`meta ← ${components.length} pages, ${components.reduce((n, c) => n + c.parts.length, 0)} documented exports`)
