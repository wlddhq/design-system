// Concatenates src/css/NN-*.css in order into dist/tokens.css, and copies fonts.css.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'src/css')
const dist = join(root, 'dist')
mkdirSync(dist, { recursive: true })

const layers = readdirSync(src).filter((f) => /^\d\d-.*\.css$/.test(f)).sort()
const out = layers.map((f) => `/* ${f} */\n` + readFileSync(join(src, f), 'utf8')).join('\n')
writeFileSync(join(dist, 'tokens.css'), out)
copyFileSync(join(src, 'fonts.css'), join(dist, 'fonts.css'))
console.log(`tokens.css ← ${layers.join(', ')}`)
