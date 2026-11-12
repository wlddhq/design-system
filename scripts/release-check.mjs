// Runs before every `npm publish` (prepublishOnly in each package). Stops a release that:
//   · has the three packages at different versions, or
//   · has no "## <version> — <date>" entry in CHANGELOG.md (so the docs' What's new would miss it).
// Run it yourself any time: node scripts/release-check.mjs
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const versions = ['tokens', 'tailwind', 'ui'].map((p) => [p, JSON.parse(readFileSync(join(root, 'packages', p, 'package.json'), 'utf8')).version])
const fail = (msg) => { console.error(`\n✗ release check: ${msg}\n`); process.exit(1) }

const v = versions[0][1]
if (versions.some(([, x]) => x !== v)) fail(`the packages must share one version: ${versions.map(([p, x]) => `@wldd/${p} ${x}`).join(', ')}`)

const log = readFileSync(join(root, 'CHANGELOG.md'), 'utf8').replace(/\r\n/g, '\n')
const esc = v.replace(/\./g, '\\.')
const entry = log.match(new RegExp(`^## ${esc}\\s+[—-]\\s+(\\d{4}-\\d{2}-\\d{2})\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, 'm'))
if (!entry) fail(`CHANGELOG.md has no "## ${v} — YYYY-MM-DD" entry. Move the lines under "## Unreleased" into it, then publish.`)
if (!/^- /m.test(entry[2])) fail(`the ${v} entry in CHANGELOG.md lists no changes.`)

console.log(`✓ release check: ${v}, dated ${entry[1]}, ${entry[2].match(/^- /gm).length} change(s) in CHANGELOG.md`)
