import type { NextConfig } from 'next'

const config: NextConfig = {
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
