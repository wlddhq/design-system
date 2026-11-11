import Link from 'next/link'
import { DocPage, H2 } from '@/components/Doc'
import { Code } from '@/components/Code'
import { HeroCanvas } from '@/components/HeroCanvas'

export const metadata = { title: 'Introduction' }

export default function Page() {
  return (
    <DocPage href="/" hero={<HeroCanvas />} lead="The components, tokens and rules behind WLDD’s products. Build with it and the result looks like the DMS: same type, same spacing, same themes.">
      <Code code={`import { Button } from '@wldd/ui'
import { Plus } from 'lucide-react'

export function CampaignsHead() {
  return (
    <div className="flex items-center gap-2">
      <Button>Export</Button>
      <Button variant="primary" icon={Plus} kbd="C">New campaign</Button>
    </div>
  )
}`} />

      <H2>What’s included</H2>
      <div className="cards">
        <Link className="card-link" href="/foundations/colours"><b>@wldd/tokens</b><span>Every theme as CSS variables: colour, type, radius, motion. Plus applyTheme().</span></Link>
        <Link className="card-link" href="/installation"><b>@wldd/tailwind</b><span>A Tailwind v4 theme with only WLDD values. Off-brand classes don’t compile.</span></Link>
        <Link className="card-link" href="/components/button"><b>@wldd/ui</b><span>React components that read the tokens. One stylesheet, works in Next.js.</span></Link>
        <Link className="card-link" href="/ai"><b>Rules for AI</b><span>Each component’s rules and props ship inside the package, so AI tools build on-brand.</span></Link>
      </div>

      <H2>Principles</H2>
      <ul>
        <li><strong>Say less.</strong> Labels are one or two words. No subtitles, helper paragraphs or emoji on screens.</li>
        <li><strong>Colour is meaning.</strong> The four WLDD colours mark modules and status. Chrome stays neutral.</li>
        <li><strong>One primary action</strong> per view, at most.</li>
        <li><strong>Motion on change, never on load.</strong> Ease-out, under 300ms. Keyboard actions are instant.</li>
        <li><strong>The theme owns the look.</strong> Components never set their own colours, radii or shadows.</li>
      </ul>

      <H2>Status</H2>
      <p>Ready now: tokens for every theme, the Tailwind theme, and everything to build a DMS work area: the app shell, all five record views (list, board, table, timeline, grid), record pages, sheets, dialogs, forms and toasts. See them assembled in <Link href="/showcase/campaigns">Showcase › Campaigns</Link> and <Link href="/showcase/campaign">Showcase › Campaign</Link>. Next: the command menu, dashboard metrics and charts.</p>
    </DocPage>
  )
}
