// Fails when what we ship grows past its budget (gzipped). Run after `npm run build`: npm run size
// Budgets sit ~25% above the sizes at 0.1.5, so normal growth passes and a sudden jump (a dependency
// bundled in by mistake, a huge component) stops CI. Raising a budget is fine: do it on purpose, in the same PR.
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { gzipSync } from 'node:zlib'

const root = join(import.meta.dirname, '..')
const kb = (n) => `${(n / 1024).toFixed(1)} kB`
const gz = (f) => gzipSync(readFileSync(f)).length
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]))

const uiJs = walk(join(root, 'packages/ui/dist')).filter((f) => f.endsWith('.js')).map((f) => [f, gz(f)])
const largest = uiJs.reduce((a, b) => (b[1] > a[1] ? b : a))

const checks = [
  ['@wldd/ui: all JS', uiJs.reduce((a, [, n]) => a + n, 0), 55 * 1024],
  [`@wldd/ui: largest file (${relative(join(root, 'packages/ui/dist'), largest[0]).split('\\').join('/')})`, largest[1], 8 * 1024],
  ['@wldd/ui: styles.css', gz(join(root, 'packages/ui/dist/styles.css')), 18 * 1024],
  ['@wldd/tokens: tokens.css', gz(join(root, 'packages/tokens/dist/tokens.css')), 10 * 1024],
  ['@wldd/tailwind: theme.css', gz(join(root, 'packages/tailwind/theme.css')), 2 * 1024],
]

let failed = false
for (const [name, size, budget] of checks) {
  const ok = size <= budget
  failed ||= !ok
  console.log(`${ok ? '✓' : '✗'} ${name}: ${kb(size)} of ${kb(budget)}`)
}
if (failed) {
  console.error('\n✗ size check: over budget. If the growth is intended, raise the budget in scripts/size-check.mjs.\n')
  process.exit(1)
}
