// Collects every component's CSS into dist/styles.css.
// Deliberately NOT inside a cascade layer: layered rules lose to any unlayered rule, so an app's own reset
// (`button { padding: 0 }`, `* { padding: 0 }`) would strip the padding from buttons, tabs, chips and menus.
// Unlayered, our class selectors beat element resets. To adjust a component from Tailwind, use the `!` modifier.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'src')
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
const files = walk(src).filter((f) => f.endsWith('.css')).sort()

const body = files.map((f) => `/* ${relative(src, f).replace(/\\/g, '/')} */\n` + readFileSync(f, 'utf8')).join('\n')
mkdirSync(join(root, 'dist'), { recursive: true })
writeFileSync(join(root, 'dist/styles.css'), body + '\n')
console.log(`styles.css ← ${files.length} files`)
