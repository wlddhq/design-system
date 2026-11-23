import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Tests run against the source (src/), and the docs examples import '@wldd/ui', so point that at the source too.
export default defineConfig({
  resolve: { alias: { '@wldd/ui': fileURLToPath(new URL('./src/index.ts', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.test.tsx'],
    css: false,
  },
})
