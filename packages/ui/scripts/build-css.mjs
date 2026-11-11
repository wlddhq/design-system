// Collects every component's CSS into dist/styles.css, inside @layer components
// so Tailwind utilities in the app can still adjust layout (margins, widths) around them.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'src')
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
const files = walk(src).filter((f) => f.endsWith('.css')).sort()

const body = files.map((f) => `/* ${relative(src, f).replace(/\\/g, '/')} */\n` + readFileSync(f, 'utf8')).join('\n')
mkdirSync(join(root, 'dist'), { recursive: true })
writeFileSync(join(root, 'dist/styles.css'), `@layer components {\n${body}\n}\n`)
console.log(`styles.css ← ${files.length} files`)
