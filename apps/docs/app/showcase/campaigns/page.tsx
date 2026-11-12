import { DocPage, H2 } from '@/components/Doc'
import { Example } from '@/components/ComponentDoc'

export const metadata = { title: 'Campaigns' }

export default function Page() {
  return (
    <DocPage wide href="/showcase/campaigns" lead="The DMS Campaigns screen, rebuilt with nothing but @wldd/ui. If this matches the prototype, the design system can build the product.">
      <H2>Live screen</H2>
      <p>Open Display to switch between List, Board, Table, Timeline and Grid, and to change grouping, ordering and properties. Click a campaign to peek at it. Drag cards on the Board; click a stage in the Table to change it; select rows to see the selection bar.</p>
      <Example id="showcase/campaigns" frame={720} />

      <H2>What it’s made of</H2>
      <ul>
        <li><strong>App shell:</strong> AppShell, Sidebar (SidebarGroup per workspace, SidebarItem per page, a Pinned SidebarSection, SidebarFooter), TopBar, Toolbar, PageScroll.</li>
        <li><strong>Views:</strong> List with ListGroup and ListRow; Board with BoardColumn and BoardCard; Table with RecordCell and CellButton; Timeline with TimelineRow; CardGroup with RecordCard.</li>
        <li><strong>Display:</strong> a Popover holding ViewPicker, Select, Switch and ToggleChips.</li>
        <li><strong>Peek:</strong> a Sheet with RecordHeader and PropertyList.</li>
        <li><strong>Primitives:</strong> Button, Tooltip, Checkbox, Logo, ProgressIcon, Track, Tag and TagList, AvatarGroup, Avatar, Dot, Chip, Sparkline, SelectionBar, Empty.</li>
      </ul>
    </DocPage>
  )
}
