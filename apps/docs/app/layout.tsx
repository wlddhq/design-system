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


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
      </head>
      <body>
        <FaviconCycle />
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
