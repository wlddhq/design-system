import type { NextConfig } from 'next'

const config: NextConfig = {
  // A second build (checks, CI) can use its own folder so it never disturbs a running dev server.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  devIndicators: false, // the floating badge sits on top of the sidebar footer
  // Example sources and component rules are read from disk at build time.
  // The section was called Patterns, then Screens; old links keep working.
  redirects: async () => [
    { source: '/patterns/:path*', destination: '/showcase/:path*', permanent: true },
    { source: '/screens/:path*', destination: '/showcase/:path*', permanent: true },
  ],
  outputFileTracingIncludes: { '/**': ['./examples/**/*', '../../packages/ui/dist/**/*'] },
}

export default config
