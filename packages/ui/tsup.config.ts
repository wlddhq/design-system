import { defineConfig } from 'tsup'

export default defineConfig({
  // One output file per source file (no bundling), so each component's own 'use client'
  // survives: Button, Table and the shell stay server-safe (icon={Plus} works from a
  // Next.js server component); Popover, Tooltip, Tabs and friends are client components.
  entry: ['src/**/*.ts', 'src/**/*.tsx'],
  bundle: false,
  format: ['esm'],
  dts: { entry: 'src/index.ts' },
  clean: true,
  outExtension: () => ({ js: '.js' }),
})
