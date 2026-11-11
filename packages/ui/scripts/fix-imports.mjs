// Unbundled ESM output keeps extensionless relative imports ("./button/Button"). Bundlers treat
// files in a "type": "module" package as fully specified, so add the ".js" they expect.
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
let n = 0
for (const file of walk(dist).filter((f) => f.endsWith('.js'))) {
  const src = readFileSync(file, 'utf8')
  const out = src.replace(/(from\s+|import\s*\(\s*|import\s+)(['"])(\.{1,2}\/[^'"]+?)\2/g, (m, pre, q, spec) => {
    if (/\.(js|css|json)$/.test(spec)) return m
    const abs = resolve(dirname(file), spec)
    const target = existsSync(abs + '.js') ? spec + '.js' : existsSync(join(abs, 'index.js')) ? spec + '/index.js' : null
    if (!target) throw new Error(`Can't resolve ${spec} from ${file}`)
    n++
    return `${pre}${q}${target}${q}`
  })
  if (out !== src) writeFileSync(file, out)
}
console.log(`imports ← ${n} made fully specified`)
