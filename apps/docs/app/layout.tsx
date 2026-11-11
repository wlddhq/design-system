import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Shell } from '@/components/Shell'
import { NO_FLASH } from '@/lib/theme'
import { FaviconCycle } from '@/components/FaviconCycle'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'WLDD Library', template: '%s · WLDD Library' },
  description: 'Components, tokens and rules for building WLDD products.',
}

const FONTS = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:opsz,wght@14..32,400..700&family=Inter+Tight:wght@500;600;700&family=Geist:wght@400..700&family=Geist+Mono:wght@400;500&family=Manrope:wght@400..800&family=Bricolage+Grotesque:opsz,wght@12..96,500..800&display=swap'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <FaviconCycle />
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
