import { DocPage, H2 } from '@/components/Doc'
import { Code } from '@/components/Code'

export const metadata = { title: 'Installation' }

export default function Page() {
  return (
    <DocPage href="/installation" lead="Add WLDD to a Next.js app with Tailwind v4.">
      <H2>Install</H2>
      <Code lang="bash" code={`npm install @wldd/ui @wldd/tokens @wldd/tailwind lucide-react motion`} />

      <H2>Styles</H2>
      <p>Import everything once, in your global stylesheet. The order matters: fonts first, then Tailwind, the WLDD theme, tokens and components.</p>
      <Code lang="css" code={`/* app/globals.css */
@import "@wldd/tokens/fonts.css";
@import "tailwindcss";
@import "@wldd/tailwind";
@import "@wldd/tokens/tokens.css";
@import "@wldd/ui/styles.css";`} />
      <p><code>@wldd/tailwind</code> removes Tailwind’s default colours, fonts, radii and shadows. Classes like <code>bg-blue-500</code> stop existing; use <code>bg-surface</code>, <code>text-muted</code>, <code>border-line</code> and the rest from <a href="/foundations/colours">Colours</a>.</p>

      <H2>Fonts</H2>
      <p>Themes can ask for Inter, Inter Tight, Geist, Geist Mono, IBM Plex Sans, Manrope and Bricolage Grotesque. <code>@wldd/tokens/fonts.css</code> brings them all, self-hosted: your build includes the font files, nothing is fetched from Google, and browsers download only the weights and scripts a page uses. Keep it as the first import.</p>

      <H2>Theme</H2>
      <p>Khadi in dark mode is the default and needs no setup. To change it, call <code>applyTheme</code> whenever the user’s setting changes. It writes attributes on <code>&lt;html&gt;</code> and every component follows.</p>
      <Code code={`'use client'
import { useEffect } from 'react'
import { applyTheme, type Theme } from '@wldd/tokens'

export function ThemeSync({ theme }: { theme: Partial<Theme> }) {
  useEffect(() => { applyTheme(theme) }, [theme])
  return null
}`} />
      <p>To avoid a flash of the default theme on load, set the same attributes from a small inline script in <code>&lt;head&gt;</code> before the page paints, and add <code>suppressHydrationWarning</code> to <code>&lt;html&gt;</code>.</p>

      <H2>Next.js</H2>
      <ul>
        <li>Button and Kbd work in server components, including <code>icon=&#123;Plus&#125;</code>. Components that need state will mark themselves <code>&apos;use client&apos;</code>.</li>
        <li>Icons come from <code>lucide-react</code> only. Pass them as components: <code>icon=&#123;Plus&#125;</code>.</li>
      </ul>
    </DocPage>
  )
}
