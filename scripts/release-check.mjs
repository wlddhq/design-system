// Runs before every `npm publish` (prepublishOnly in each package). Stops a release that:
//   · has the three packages at different versions, or
//   · has no "## <version> — <date>" entry in CHANGELOG.md (so the docs' What's new would miss it),
//   · asks for an @wldd/tokens peer range that the version being released doesn't satisfy, or
//   · (in the Release workflow) was started by a tag that isn't v<version>.
// Run it yourself any time: node scripts/release-check.mjs
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const versions = ['tokens', 'tailwind', 'ui'].map((p) => [p, JSON.parse(readFileSync(join(root, 'packages', p, 'package.json'), 'utf8')).version])
const fail = (msg) => { console.error(`\n✗ release check: ${msg}\n`); process.exit(1) }

const v = versions[0][1]
if (versions.some(([, x]) => x !== v)) fail(`the packages must share one version: ${versions.map(([p, x]) => `@wldd/${p} ${x}`).join(', ')}`)

// "^0.1.0" covers 0.1.x only; "^1.2.0" covers 1.x from 1.2.0. Moving to 0.2.0 means updating these ranges.
const caret = (range, ver) => {
  const m = /^\^(\d+)\.(\d+)\.(\d+)$/.exec(range)
  if (!m) return false
  const [a, b, c] = m.slice(1).map(Number), [x, y, z] = ver.split('.').map(Number)
  if (a === 0) return x === 0 && y === b && z >= c
  return x === a && (y > b || (y === b && z >= c))
}
for (const p of ['tailwind', 'ui']) {
  const range = JSON.parse(readFileSync(join(root, 'packages', p, 'package.json'), 'utf8')).peerDependencies?.['@wldd/tokens']
  if (range && !caret(range, v)) fail(`@wldd/${p} asks for @wldd/tokens "${range}", which ${v} doesn't satisfy. Set it to "^${v.replace(/\.\d+$/, '.0')}".`)
}

if (process.env.GITHUB_REF_TYPE === 'tag' && process.env.GITHUB_REF_NAME !== `v${v}`) fail(`the tag is ${process.env.GITHUB_REF_NAME} but the packages are at ${v}. Tag v${v} instead.`)

const log = readFileSync(join(root, 'CHANGELOG.md'), 'utf8').replace(/\r\n/g, '\n')
const esc = v.replace(/\./g, '\\.')
const entry = log.match(new RegExp(`^## ${esc}\\s+[—-]\\s+(\\d{4}-\\d{2}-\\d{2})\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, 'm'))
if (!entry) fail(`CHANGELOG.md has no "## ${v} — YYYY-MM-DD" entry. Move the lines under "## Unreleased" into it, then publish.`)
if (!/^- /m.test(entry[2])) fail(`the ${v} entry in CHANGELOG.md lists no changes.`)

console.log(`✓ release check: ${v}, dated ${entry[1]}, ${entry[2].match(/^- /gm).length} change(s) in CHANGELOG.md`)
