import { DocPage, H2 } from '@/components/Doc'
import { Example } from '@/components/ComponentDoc'

export const metadata = { title: 'Campaigns' }

export default function Page() {
  return (
    <DocPage wide href="/showcase/campaigns" lead="The DMS Campaigns screen, rebuilt with nothing but @wldd/ui. If this matches the prototype, the library can build the product.">
      <H2>Live screen</H2>
      <p>Select rows to see the selection bar. Click a stage to change it. Try Filter, Display, the tabs, and the theme switcher in the sidebar.</p>
      <Example id="showcase/campaigns" frame={720} />

      <H2>What it’s made of</H2>
      <ul>
        <li><strong>App shell:</strong> AppShell, Sidebar (SidebarGroup per workspace, SidebarItem per page, a Pinned SidebarSection, SidebarFooter), TopBar with TopBarTitle and TopBarActions, Toolbar, PageScroll.</li>
        <li><strong>Controls:</strong> Tabs for the views, Popover with MenuItems for Filter and the stage cell, Popover with Segmented, Select and Switch for Display.</li>
        <li><strong>Data:</strong> Table with Th, Td and Tr, RecordCell for the campaign, CellButton for editable stage, Aggregate in the footer, SelectionBar for bulk actions.</li>
        <li><strong>Primitives:</strong> Button, Tooltip, Checkbox, Logo, ProgressIcon, Tag and TagList, AvatarGroup, Avatar, Dot.</li>
      </ul>
    </DocPage>
  )
}
