import { Inbox, Megaphone, CheckCheck, BookOpen, Wallet, Handshake, Plus, ArrowUpRight, Pin, X, Search, ListFilter, CalendarClock, Link2, Receipt, FileText, Users, Settings, House, Rocket } from 'lucide-react'
import { DocPage, H2 } from '@/components/Doc'
import { Code } from '@/components/Code'

export const metadata = { title: 'Icons' }

const ICONS = { Inbox, Megaphone, CheckCheck, BookOpen, Wallet, Handshake, Rocket, House, Plus, ArrowUpRight, Pin, X, Search, ListFilter, CalendarClock, Link2, Receipt, FileText, Users, Settings }

export default function Page() {
  return (
    <DocPage href="/foundations/icons" lead="Lucide, and only Lucide. Outline icons at the default stroke, sized to the text beside them.">
      <H2>Usage</H2>
      <Code code={`import { Plus } from 'lucide-react'
import { Button } from '@wldd/ui'

<Button icon={Plus}>New campaign</Button>   // components size it for you
<Plus size={15} />                           // on its own: match the text`} />

      <H2>Sizes</H2>
      <div className="tbl-w">
        <table className="tbl">
          <thead><tr><th>Size</th><th>Where</th></tr></thead>
          <tbody>
            <tr><td className="m nm">15</td><td>Buttons, nav items, top bar</td></tr>
            <tr><td className="m nm">14</td><td>Small buttons, menu items</td></tr>
            <tr><td className="m nm">13</td><td>Inside dense rows and chips</td></tr>
            <tr><td className="m nm">24 tile</td><td>Workspace icons: a 15px icon on a neutral 24px tile, stroke 2.25</td></tr>
          </tbody>
        </table>
      </div>

      <H2>Common icons</H2>
      <div className="icon-grid">
        {Object.entries(ICONS).map(([name, I]) => (
          <div key={name}><I size={18} /><span>{name}</span></div>
        ))}
      </div>

      <H2>Rules</H2>
      <ul>
        <li>No other icon sets, no emoji, no custom SVG icons.</li>
        <li>Keep the default stroke. Don’t fill outline icons.</li>
        <li>Icons inherit text colour. Colour an icon only when it carries status.</li>
        <li>An icon alone needs a label: <code>aria-label</code> on its button.</li>
      </ul>
    </DocPage>
  )
}
