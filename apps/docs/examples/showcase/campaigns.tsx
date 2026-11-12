'use client'
import { useMemo, useState, type ReactNode } from 'react'
import {
  House, Rocket, Wallet, Handshake, Inbox, Megaphone, CheckCheck, BookOpen, Search, Bell, Plus, ListFilter,
  SlidersHorizontal, Hash, CircleDashed, Layers, Users, IndianRupee, Clock, ArrowUpRight, Pin, Palette, Settings,
  Rows3, Columns3, Table2, GanttChart, LayoutGrid, User, Tag as TagIcon, CalendarDays,
} from 'lucide-react'
import {
  WlddLogo, AppShell, Sidebar, SidebarHeader, SidebarBody, SidebarGroup, SidebarItem, SidebarSection, SidebarFooter,
  TopBar, TopBarTitle, TopBarActions, Toolbar, Spacer, PageScroll,
  Table, Th, Td, Tr, RecordCell, CellButton, Aggregate,
  List, ListGroup, ListRow, ListTitle, ListCell,
  Board, BoardColumn, BoardCard, Timeline, TimelineGroup, TimelineRow, CardGroup, RecordCard, Sparkline,
  ViewPicker, ToggleChips, Sheet, RecordHeader, PropertyList, Property, PropertySeparator,
  Button, Tooltip, Tabs, Popover, MenuItem, MenuLabel, PopoverSection, PopoverRow, Select, Switch,
  Checkbox, Logo, ProgressIcon, Track, AvatarGroup, Avatar, Tag, TagList, Dot, DotLabel, Chip, SelectionBar, Empty,
} from '@wldd/ui'
import { CAMPAIGNS, STAGES, SERVICES, TODAY, stageTone, logo, inr, type Campaign } from '../data'

/* ── The Display model, as the prototype's ── */
type Layout = 'list' | 'board' | 'table' | 'timeline' | 'grid'
type Group = 'stage' | 'pod' | 'lead' | 'none'
type Order = 'updated' | 'budget' | 'start' | 'name'
type Prop = 'code' | 'stage' | 'services' | 'pod' | 'lead' | 'team' | 'budget' | 'start' | 'updated'
const LAYOUTS = [
  { value: 'list', label: 'List', icon: Rows3 }, { value: 'board', label: 'Board', icon: Columns3 }, { value: 'table', label: 'Table', icon: Table2 },
  { value: 'timeline', label: 'Timeline', icon: GanttChart }, { value: 'grid', label: 'Grid', icon: LayoutGrid },
] as const
const GROUPS = [{ value: 'stage', label: 'Stage' }, { value: 'pod', label: 'Pod' }, { value: 'lead', label: 'Lead' }, { value: 'none', label: 'No grouping' }] as const
const ORDERS = [{ value: 'updated', label: 'Last updated' }, { value: 'budget', label: 'Budget' }, { value: 'start', label: 'Start date' }, { value: 'name', label: 'Name' }] as const
const ZOOMS = [{ value: 'week', label: 'Weeks' }, { value: 'month', label: 'Months' }, { value: 'quarter', label: 'Quarter' }] as const
const PROPS: { value: Prop; label: string; icon: typeof Hash }[] = [
  { value: 'code', label: 'ID', icon: Hash }, { value: 'stage', label: 'Stage', icon: CircleDashed }, { value: 'services', label: 'Services', icon: Layers },
  { value: 'pod', label: 'Pod', icon: TagIcon }, { value: 'lead', label: 'Lead', icon: User }, { value: 'team', label: 'Team', icon: Users },
  { value: 'budget', label: 'Budget', icon: IndianRupee }, { value: 'start', label: 'Start', icon: CalendarDays }, { value: 'updated', label: 'Updated', icon: Clock },
]
const DEFAULTS = { layout: 'list' as Layout, group: 'stage' as Group, order: 'updated' as Order, done: true, zoom: 'week' as 'week' | 'month' | 'quarter', props: ['code', 'services', 'stage', 'team', 'budget', 'updated'] as Prop[] }

const SCOPES = [
  { value: 'all', label: 'All', test: () => true },
  { value: 'active', label: 'Active', test: (c: Campaign) => c.stage >= 4 && c.stage < 6 },
  { value: 'pipeline', label: 'Pipeline', test: (c: Campaign) => c.stage < 4 },
] as const
type Scope = (typeof SCOPES)[number]['value']
const PODS = [{ id: 'Kulfi', tone: 'green' }, { id: 'Neon', tone: 'violet' }, { id: 'Masala', tone: 'yellow' }] as const
const podTone = (p: string) => PODS.find((x) => x.id === p)!.tone

const hours = (s: string) => (s === 'now' ? 0 : parseFloat(s) * ({ h: 1, d: 24, w: 168 }[s.slice(-1)] ?? 1))
const SORT: Record<Order, (a: Campaign, b: Campaign) => number> = {
  updated: (a, b) => hours(a.updated) - hours(b.updated), budget: (a, b) => b.budget - a.budget,
  start: (a, b) => a.start.getTime() - b.start.getTime(), name: (a, b) => a.client.localeCompare(b.client),
}
const date = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const sum = (rows: Campaign[]) => inr(rows.reduce((a, c) => a + c.budget, 0))

type G = { key: string | number; label: ReactNode; icon?: ReactNode; items: Campaign[] }
function groupsFor(by: Group, rows: Campaign[], keepEmpty: boolean): G[] {
  let defs: { key: string | number; label: ReactNode; icon?: ReactNode; test: (c: Campaign) => boolean }[]
  if (by === 'stage') defs = STAGES.map((s, i) => ({ key: i, label: s, icon: <ProgressIcon value={i} tone={stageTone(i)} />, test: (c) => c.stage === i }))
  else if (by === 'pod') defs = PODS.map((p) => ({ key: p.id, label: p.id, icon: <Dot shape="square" tone={p.tone} />, test: (c) => c.pod === p.id }))
  else if (by === 'lead') {
    const leads = [...new Map(CAMPAIGNS.map((c) => [c.lead.name, c.lead])).values()].sort((a, b) => a.name.localeCompare(b.name))
    defs = leads.map((p) => ({ key: p.name, label: p.name.split(' ')[0], icon: <Avatar {...p} size={16} />, test: (c) => c.lead.name === p.name }))
  } else defs = [{ key: 'all', label: null, test: () => true }]
  const out = defs.map((g) => ({ ...g, items: rows.filter(g.test) }))
  return keepEmpty ? out : out.filter((g) => g.items.length)
}

/** The DMS Campaigns screen in all five layouts, built only from @wldd/ui. */
export default function CampaignsScreen() {
  const [rows, setRows] = useState(CAMPAIGNS)
  const [scope, setScope] = useState<Scope>('all')
  const [pod, setPod] = useState<string | null>(null)
  const [sel, setSel] = useState<string[]>([])
  const [d, setDisplay] = useState(DEFAULTS)
  const set = (p: Partial<typeof DEFAULTS>) => setDisplay((x) => ({ ...x, ...p }))
  const has = (p: Prop) => d.props.includes(p)

  const base = rows.filter((c) => (!pod || c.pod === pod) && (d.done || c.stage < 6))
  const shown = useMemo(() => base.filter(SCOPES.find((s) => s.value === scope)!.test).sort(SORT[d.order]), [base, scope, d.order])
  const groupBy: Group = d.layout === 'board' && d.group === 'none' ? 'stage' : d.group
  const groups = groupsFor(groupBy, shown, d.layout === 'board')
  const all = shown.length > 0 && shown.every((c) => sel.includes(c.id))
  const toggle = (id: string, on: boolean) => setSel((s) => (on ? [...s, id] : s.filter((x) => x !== id)))
  const patch = (id: string, p: Partial<Campaign>) => setRows((r) => r.map((c) => (c.id === id ? { ...c, ...p, updated: 'now' } : c)))
  const [peek, setPeek] = useState<string | null>(null)
  const open = (c: Campaign) => setPeek(c.id)
  const pc = rows.find((c) => c.id === peek)
  const none = <Empty icon={Megaphone} title="No campaigns">Nothing matches these filters.</Empty>

  const stageMenu = (c: Campaign) => (
    <Popover align="start" width={210} trigger={<CellButton><ProgressIcon value={c.stage} tone={stageTone(c.stage)} />{STAGES[c.stage]}</CellButton>}>
      {STAGES.map((s, i) => <MenuItem key={s} lead={<ProgressIcon value={i} tone={stageTone(i)} />} checked={c.stage === i} onSelect={() => patch(c.id, { stage: i })}>{s}</MenuItem>)}
    </Popover>
  )
  const services = (c: Campaign) => <TagList>{c.services.map((s) => <Tooltip key={s} label={SERVICES[s]}><Tag>{s}</Tag></Tooltip>)}</TagList>

  /* ── The five layouts ── */
  const list = (
    <List empty={none}>
      {groups.map((g) => (
        <ListGroup key={g.key} icon={g.icon} label={g.label ?? 'All'} count={g.items.length} aside={sum(g.items)} limit={10}>
          {g.items.map((c) => (
            <ListRow key={c.id} onClick={() => open(c)}>
              {has('code') && <ListCell kind="code">{c.code}</ListCell>}
              <Tooltip label={STAGES[c.stage]}><ProgressIcon value={c.stage} tone={stageTone(c.stage)} /></Tooltip>
              <Logo name={c.client} src={logo(c.domain)} size={20} />
              <ListTitle title={c.client} sub={`× ${c.activity}`} />
              {has('services') && services(c)}
              {has('pod') && <DotLabel shape="square" tone={podTone(c.pod)}>{c.pod}</DotLabel>}
              {has('stage') && <Tooltip label={STAGES[c.stage]}><Track value={c.stage} label={STAGES[c.stage]} /></Tooltip>}
              {has('budget') && <ListCell kind="num">{inr(c.budget)}</ListCell>}
              {has('start') && <ListCell kind="date">{date(c.start)}</ListCell>}
              {has('updated') && <ListCell kind="date">{c.updated}</ListCell>}
              {has('lead') && <Tooltip label={c.lead.name}><Avatar {...c.lead} size={20} /></Tooltip>}
              {has('team') && <AvatarGroup people={c.team} />}
            </ListRow>
          ))}
        </ListGroup>
      ))}
    </List>
  )

  const board = (
    <Board onMove={(id, col) => {
      const k = groupBy === 'stage' ? { stage: Number(col) } : groupBy === 'pod' ? { pod: col as Campaign['pod'] } : { lead: CAMPAIGNS.find((c) => c.lead.name === col)!.lead }
      patch(String(id), k)
    }}>
      {groups.map((g) => (
        <BoardColumn key={g.key} id={g.key} icon={g.icon} label={g.label} count={g.items.length} aside={g.items.length ? sum(g.items) : null}>
          {g.items.map((c) => (
            <BoardCard key={c.id} id={c.id} onClick={() => open(c)}
              code={has('code') ? c.code : null} corner={has('lead') ? <Avatar {...c.lead} size={18} /> : null}
              lead={<Logo name={c.client} src={logo(c.domain)} size={24} />} title={c.client} sub={c.activity}
              meta={<>
                {groupBy !== 'stage' && has('stage') && <Chip><ProgressIcon value={c.stage} tone={stageTone(c.stage)} size={12} />{STAGES[c.stage]}</Chip>}
                {has('services') && services(c)}
                {groupBy !== 'pod' && has('pod') && <DotLabel shape="square" tone={podTone(c.pod)}>{c.pod}</DotLabel>}
                {has('budget') && <Chip>{inr(c.budget)}</Chip>}
                {has('start') && <Chip icon={CalendarDays}>{date(c.start)}</Chip>}
                {has('updated') && <span className="ml-auto text-xs text-muted tabular-nums">{c.updated}</span>}
              </>}
              footer={has('team') ? <AvatarGroup people={c.team} size={18} /> : null} />
          ))}
        </BoardColumn>
      ))}
    </Board>
  )

  const cols = PROPS.filter((p) => has(p.value))
  const table = (
    <Table empty={none}>
      <thead>
        <tr>
          <Th kind="select"><Checkbox label="Select all" checked={all} indeterminate={!all && sel.length > 0} onChange={() => setSel(all ? [] : shown.map((c) => c.id))} /></Th>
          <Th kind="primary" icon={Megaphone}>Campaign</Th>
          {cols.map((p) => <Th key={p.value} icon={p.icon} align={p.value === 'budget' ? 'right' : undefined}
            sorted={(p.value === 'updated' && d.order === 'updated') || (p.value === 'budget' && d.order === 'budget') || (p.value === 'start' && d.order === 'start') ? 'desc' : undefined}
            onSort={['updated', 'budget', 'start'].includes(p.value) ? () => set({ order: p.value as Order }) : undefined}>{p.label}</Th>)}
          <Th kind="fill" />
        </tr>
      </thead>
      <tbody>
        {shown.map((c) => (
          <Tr key={c.id} selected={sel.includes(c.id)}>
            <Td kind="select"><Checkbox label={`Select ${c.client}`} checked={sel.includes(c.id)} onChange={(on) => toggle(c.id, on)} /></Td>
            <Td kind="primary"><RecordCell lead={<Logo name={c.client} src={logo(c.domain)} />} title={c.client} sub={`× ${c.activity}`} onClick={() => open(c)} /></Td>
            {cols.map((p) => (
              <Td key={p.value} align={p.value === 'budget' ? 'right' : undefined} className={p.value === 'code' ? 'font-mono text-xs text-muted' : p.value === 'updated' || p.value === 'start' ? 'tabular-nums text-muted' : 'tabular-nums'}>
                {p.value === 'code' ? c.code : p.value === 'stage' ? stageMenu(c) : p.value === 'services' ? services(c)
                  : p.value === 'pod' ? <DotLabel shape="square" tone={podTone(c.pod)}>{c.pod}</DotLabel>
                  : p.value === 'lead' ? <span className="flex items-center gap-1.5"><Avatar {...c.lead} size={18} />{c.lead.name.split(' ')[0]}</span>
                  : p.value === 'team' ? <AvatarGroup people={c.team} /> : p.value === 'budget' ? inr(c.budget)
                  : p.value === 'start' ? date(c.start) : c.updated}
              </Td>
            ))}
            <Td kind="fill" />
          </Tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <Td kind="select" />
          <Td kind="primary"><Aggregate label="Count">{shown.length}</Aggregate></Td>
          {cols.map((p) => <Td key={p.value} align={p.value === 'budget' ? 'right' : undefined}>{p.value === 'budget' && <Aggregate label="Sum">{sum(shown)}</Aggregate>}</Td>)}
          <Td kind="fill" />
        </tr>
      </tfoot>
    </Table>
  )

  const timeline = shown.length === 0 ? none : (
    <Timeline start={new Date(TODAY.getTime() - 63 * 864e5)} days={d.zoom === 'quarter' ? 280 : 168} zoom={d.zoom} today={TODAY}>
      {groups.map((g) => (
        <div key={g.key}>
          {g.label != null && <TimelineGroup icon={g.icon} label={g.label} count={g.items.length} />}
          {g.items.map((c) => (
            <TimelineRow key={c.id} onClick={() => open(c)} start={c.start} end={c.end} tone={stageTone(c.stage)} progress={c.stage / 6}
              label={c.client} detail={has('budget') ? inr(c.budget) : undefined}
              name={<><ProgressIcon value={c.stage} tone={stageTone(c.stage)} /><Logo name={c.client} src={logo(c.domain)} size={20} /><ListTitle title={c.client} sub={`× ${c.activity}`} /></>} />
          ))}
        </div>
      ))}
    </Timeline>
  )

  const grid = shown.length === 0 ? none : (
    <div className="px-[18px] py-4">
      {groups.map((g) => (
        <CardGroup key={g.key} icon={g.icon} label={g.label ?? undefined} count={g.label != null ? g.items.length : undefined}>
          {g.items.map((c) => (
            <RecordCard key={c.id} onClick={() => open(c)} lead={<Logo name={c.client} src={logo(c.domain)} size={32} />}
              title={c.client} sub={c.activity} caption={`${has('code') ? c.code + ' · ' : ''}${c.pod}`}
              corner={has('lead') ? <Avatar {...c.lead} size={22} /> : null}
              footer={<>
                <ProgressIcon value={c.stage} tone={stageTone(c.stage)} /><span className="truncate">{STAGES[c.stage]}</span>
                {has('services') && services(c)}
                {has('budget') && <span className="ml-auto">{inr(c.budget)}</span>}
              </>}
              meta={has('start') || has('updated') ? <>
                {has('start') && <><CalendarDays size={12} />{date(c.start)}</>}
                {has('updated') && <span className={has('start') ? 'ml-auto' : ''}>{c.updated === 'now' ? 'Updated just now' : `Updated ${c.updated} ago`}</span>}
              </> : null}>
              <Sparkline data={c.trend} width={320} height={44} tone={c.stage >= 4 ? 'green' : 'muted'} />
            </RecordCard>
          ))}
        </CardGroup>
      ))}
    </div>
  )

  const sidebar = (
    <Sidebar>
      <SidebarHeader logo={<WlddLogo />} />
      <SidebarBody>
        <SidebarGroup icon={House} label="Home" />
        <SidebarGroup icon={Rocket} tone="green" label="Pod" open>
          <SidebarItem icon={Inbox}>Inbox</SidebarItem>
          <SidebarItem icon={Megaphone} active>Campaigns</SidebarItem>
          <SidebarItem icon={CheckCheck} count={3}>Approvals</SidebarItem>
          <SidebarItem icon={BookOpen}>Knowledge base</SidebarItem>
        </SidebarGroup>
        <SidebarGroup icon={Wallet} tone="violet" label="Finance" count={22} />
        <SidebarGroup icon={Handshake} tone="yellow" label="Sales" count={6} />
        <SidebarSection label="Pinned" bottom>
          <SidebarItem lead={<Logo name="Netflix India" src={logo('netflix.com')} size={16} />}>Netflix India</SidebarItem>
          <SidebarItem lead={<Logo name="District" src={logo('district.in')} size={16} />}>District</SidebarItem>
          <SidebarItem lead={<Logo name="JioHotstar" src={logo('jiohotstar.com')} size={16} />}>JioHotstar</SidebarItem>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        <Avatar name="Satish Hebbal" hue={330} size={24} />
        <span className="min-w-0 flex-1 truncate">Satish Hebbal</span>
        <Tooltip label="Appearance"><Button size="sm" variant="ghost" icon={Palette} aria-label="Appearance" /></Tooltip>
        <Tooltip label="Settings"><Button size="sm" variant="ghost" icon={Settings} aria-label="Settings" /></Tooltip>
      </SidebarFooter>
    </Sidebar>
  )

  return (
    <AppShell sidebar={sidebar} style={{ height: '100%' }}>
      <TopBar>
        <TopBarTitle icon={Megaphone} title="Campaigns" count={base.length} />
        <TopBarActions>
          <Tooltip label="Search" kbd="mod+k"><Button variant="ghost" icon={Search} aria-label="Search" /></Tooltip>
          <Tooltip label="Notifications"><Button variant="ghost" icon={Bell} aria-label="Notifications" dot /></Tooltip>
          <Tooltip label="New campaign" kbd="C"><Button variant="primary" icon={Plus}>New</Button></Tooltip>
        </TopBarActions>
      </TopBar>

      <Toolbar>
        <Tabs value={scope} onChange={setScope} items={SCOPES.map((s) => ({ value: s.value, label: s.label, count: base.filter(s.test).length }))} />
        <Spacer />
        <Popover width={180} trigger={<Button size="sm" icon={ListFilter} aria-label="Filter" />}>
          <MenuLabel>Pod</MenuLabel>
          <MenuItem checked={!pod} onSelect={() => setPod(null)}>Any</MenuItem>
          {PODS.map((p) => <MenuItem key={p.id} lead={<Dot shape="square" tone={p.tone} />} checked={pod === p.id} onSelect={() => setPod(p.id)}>{p.id}</MenuItem>)}
        </Popover>
        <Popover width={340} trigger={<Button size="sm" icon={SlidersHorizontal}>Display</Button>}>
          <ViewPicker value={d.layout} onChange={(layout) => set({ layout })} items={[...LAYOUTS]} />
          <PopoverSection>
            <PopoverRow label="Grouping"><Select value={d.group} onChange={(group) => set({ group })} options={[...GROUPS]} /></PopoverRow>
            <PopoverRow label="Ordering"><Select value={d.order} onChange={(order) => set({ order })} options={[...ORDERS]} /></PopoverRow>
          </PopoverSection>
          <PopoverSection>
            <PopoverRow label="Show completed"><Switch label="Show completed" checked={d.done} onChange={(done) => set({ done })} /></PopoverRow>
          </PopoverSection>
          {d.layout === 'timeline' && (
            <PopoverSection>
              <PopoverRow label="Zoom"><Select value={d.zoom} onChange={(zoom) => set({ zoom })} options={[...ZOOMS]} /></PopoverRow>
            </PopoverSection>
          )}
          <PopoverSection>
            <MenuLabel>Properties</MenuLabel>
            <ToggleChips label="Properties" value={d.props} onChange={(props) => set({ props })} items={PROPS} />
          </PopoverSection>
          <PopoverSection>
            <div className="flex justify-end"><Button size="sm" variant="ghost" onClick={() => setDisplay(DEFAULTS)}>Reset</Button></div>
          </PopoverSection>
        </Popover>
      </Toolbar>

      <PageScroll>
        {d.layout === 'list' && list}
        {d.layout === 'board' && board}
        {d.layout === 'table' && table}
        {d.layout === 'timeline' && timeline}
        {d.layout === 'grid' && grid}
      </PageScroll>

      <Sheet open={!!pc} onClose={() => setPeek(null)} label={pc ? `${pc.client} × ${pc.activity}` : 'Campaign'}>
        {pc && (
          <>
            <RecordHeader lead={<Logo name={pc.client} src={logo(pc.domain)} size={32} />} title={pc.client} sub={`× ${pc.activity}`}
              meta={<span className="font-mono">{pc.code}</span>} />
            <PropertyList className="mt-6">
              <Property label="Stage"><ProgressIcon value={pc.stage} tone={stageTone(pc.stage)} />{STAGES[pc.stage]}</Property>
              <Property label="Pod"><DotLabel shape="square" tone={podTone(pc.pod)}>{pc.pod}</DotLabel></Property>
              <Property label="Lead"><Avatar {...pc.lead} size={20} />{pc.lead.name}</Property>
              <Property label="Team"><AvatarGroup people={pc.team} /></Property>
              <Property label="Services">{services(pc)}</Property>
              <PropertySeparator />
              <Property label="Budget"><span className="tabular-nums">{inr(pc.budget)}</span></Property>
              <Property label="Dates">{date(pc.start)} → {date(pc.end)}</Property>
              <Property label="Updated">{pc.updated === 'now' ? 'Just now' : `${pc.updated} ago`}</Property>
            </PropertyList>
            <div className="mt-6"><Button href="/showcase/campaign" icon={ArrowUpRight}>Open campaign</Button></div>
          </>
        )}
      </Sheet>

      <SelectionBar count={sel.length} onClear={() => setSel([])}>
        <Button size="sm" icon={ArrowUpRight} onClick={() => { sel.forEach((id) => patch(id, { stage: Math.min(6, rows.find((r) => r.id === id)!.stage + 1) })); setSel([]) }}>Next stage</Button>
        <Button size="sm" icon={Pin} onClick={() => setSel([])}>Pin</Button>
      </SelectionBar>
    </AppShell>
  )
}
