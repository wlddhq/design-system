// Release check: does a brand-new Next.js app work with ONLY what we'd publish?
// Builds the packages, packs them as npm would, installs the tarballs into a blank app in a temp folder
// (latest Next.js, strict TypeScript, library types checked), follows the README's setup, and runs `next build`.
// It catches what a workspace hides: missing dependencies, files left out of "files", broken exports or types.
//   npm run smoke              before publishing: the packed tarballs
//   npm run smoke -- --registry  after publishing: the versions now on npm
import { execSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const run = (cmd, cwd) => { console.log(`\n$ ${cmd}`); execSync(cmd, { cwd, stdio: 'inherit' }) }
const root = join(import.meta.dirname, '..')
const dir = mkdtempSync(join(tmpdir(), 'wldd-smoke-'))
const pack = join(dir, 'pack'), app = join(dir, 'app')
mkdirSync(pack); mkdirSync(join(app, 'app'), { recursive: true })

let fromRegistry = false
try {
  fromRegistry = process.argv.includes('--registry')
  let tgz
  if (fromRegistry) {
    const v = JSON.parse(readFileSync(join(root, 'packages/ui/package.json'), 'utf8')).version
    tgz = ['tokens', 'tailwind', 'ui'].map((p) => `@wldd/${p}@${v}`).join(' ')
  } else {
    run('npm run build', root)
    run(`npm pack -w @wldd/tokens -w @wldd/tailwind -w @wldd/ui --pack-destination "${pack}"`, root)
    tgz = readdirSync(pack).map((f) => `"${join(pack, f)}"`).join(' ')
  }

  const files = {
    'package.json': JSON.stringify({ name: 'wldd-smoke', private: true }),
    'postcss.config.mjs': `export default { plugins: { '@tailwindcss/postcss': {} } }\n`,
    'tsconfig.json': JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['dom', 'esnext'], strict: true, noEmit: true, module: 'esnext', moduleResolution: 'bundler', jsx: 'react-jsx', isolatedModules: true, skipLibCheck: false, plugins: [{ name: 'next' }] }, include: ['**/*.ts', '**/*.tsx'], exclude: ['node_modules'] }),
    // Exactly the README's setup.
    'app/globals.css': `@import "@wldd/tokens/fonts.css";\n@import "tailwindcss";\n@import "@wldd/tailwind";\n@import "@wldd/tokens/tokens.css";\n@import "@wldd/ui/styles.css";\n`,
    'app/layout.tsx': `import './globals.css'\nimport type { ReactNode } from 'react'\nexport default function Layout({ children }: { children: ReactNode }) { return <html lang="en"><body>{children}</body></html> }\n`,
    'app/page.tsx': `'use client'
import { useState } from 'react'
import { Plus, House } from 'lucide-react'
import { Button, Kbd, Avatar, Chip, CommandMenu, CommandGroup, CommandItem, Loader, Toaster, toast, Dialog, Sheet, Tooltip, WlddLogo, Table, Tr, Th, Td } from '@wldd/ui'

export default function Page() {
  const [open, setOpen] = useState(false)
  const [d, setD] = useState(false)
  return (
    <main className="p-8 flex flex-wrap items-center gap-4">
      <WlddLogo />
      <Tooltip label="New" kbd="c"><Button variant="primary" icon={Plus} kbd="c" onClick={() => toast('Created')}>New campaign</Button></Tooltip>
      <Kbd>mod+k</Kbd><Avatar name="Sati" /><Chip>Live</Chip><Loader />
      <Button onClick={() => setD(true)}>Dialog</Button>
      <Dialog open={d} onClose={() => setD(false)} title="Hello" />
      <Sheet open={false} onClose={() => {}} label="Sheet">Sheet</Sheet>
      <Table label="Smoke"><thead><Tr><Th kind="primary">Name</Th></Tr></thead><tbody><Tr><Td>Zepto</Td></Tr></tbody></Table>
      <CommandMenu open={open} onOpenChange={setOpen}>
        <CommandGroup heading="Go to"><CommandItem icon={House} onSelect={() => {}}>Home</CommandItem></CommandGroup>
      </CommandMenu>
      <Toaster />
    </main>
  )
}
`,
  }
  for (const [f, c] of Object.entries(files)) writeFileSync(join(app, f), c)

  run(`npm install --no-audit --no-fund next@latest react@latest react-dom@latest tailwindcss@4 @tailwindcss/postcss@4 lucide-react motion typescript @types/react @types/react-dom @types/node ${tgz}`, app)
  run('npx next build', app)
  console.log('\n✓ smoke: a blank Next.js app builds with only the published packages')
} finally {
  rmSync(dir, { recursive: true, force: true })
}
