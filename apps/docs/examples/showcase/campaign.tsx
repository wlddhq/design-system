'use client'
import { useState } from 'react'
import { Megaphone, Pin, ArrowUpRight, Check, Pencil, Ellipsis, Trash2, FolderOpen, House, Rocket, Wallet, Handshake, Inbox, CheckCheck, BookOpen, Search, Bell } from 'lucide-react'
import {
  WlddLogo, AppShell, Sidebar, SidebarHeader, SidebarBody, SidebarGroup, SidebarItem, TopBar, TopBarTitle, TopBarActions, PageScroll, Page,
  RecordHeader, Stepper, Tabs, RecordLayout, Metrics, Metric, PropertyList, Property, PropertySeparator,
  Sheet, Dialog, Toaster, toast, Field, Input, Textarea, DateInput, MultiSelect, RadioGroup,
  Button, Tooltip, Popover, MenuItem, Logo, Avatar, AvatarGroup, TagList, Tag, Chip, Switch, Sparkline, TextMorph, DotLabel,
} from '@wldd/ui'
import { CAMPAIGNS, STAGES, SERVICES, PEOPLE, logo, inr } from '../data'

const STEPS = STAGES.slice(0, 6) as unknown as string[]
const iso = (d: Date) => d.toISOString().slice(0, 10)
const long = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
const PODS = [{ value: 'Kulfi', label: 'Kulfi', description: 'Food and quick commerce' }, { value: 'Neon', label: 'Neon', description: 'Music and entertainment' }, { value: 'Masala', label: 'Masala', description: 'Lifestyle and retail' }] as const

/** One campaign's page, built only from @wldd/ui: header, stages, tabs, numbers, properties, an edit sheet, a delete dialog and toasts. */
export default function CampaignRecord() {
  const [c, setC] = useState(() => ({ ...CAMPAIGNS[1]!, brief: 'Always-on creator programme for Q4: weekly memes and reels around late-night cravings, with two big moments around Diwali and the cricket final. Keep the tone cheeky, never mean.', pinned: false, vendors: true, deep: false }))
  const [tab, setTab] = useState('overview')
  const [moving, setMoving] = useState(false)
  const [edit, setEdit] = useState(false)
  const [del, setDel] = useState(false)
  const [draft, setDraft] = useState(c)
  const [err, setErr] = useState<string | null>(null)
  const planCost = Math.round(c.budget * 0.69)
  const margin = Math.round(((c.budget - planCost) / c.budget) * 100)

  const advance = () => {
    if (moving || c.stage >= 6) return
    setMoving(true)
    setTimeout(() => {
      const prev = c.stage, next = Math.min(6, c.stage + 1)
      setC((x) => ({ ...x, stage: next }))
      setMoving(false)
      toast(next === 6 ? 'Marked complete' : `Moved to ${STAGES[next]}`, { description: `${c.client} × ${c.activity}`, action: { label: 'Undo', onClick: () => setC((x) => ({ ...x, stage: prev })) } })
    }, 420)
  }
  const save = () => {
    if (!draft.activity.trim()) return setErr('Give the campaign a name, e.g. “Always-on Q4”')
    setC(draft); setEdit(false); setErr(null)
    toast('Saved', { description: `${draft.client} × ${draft.activity}` })
  }
  const nextLabel = c.stage === 5 ? 'Mark complete' : `Move to ${STAGES[c.stage + 1]}`

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
      </SidebarBody>
    </Sidebar>
  )

  return (
    <AppShell sidebar={sidebar} style={{ height: '100%' }}>
      <TopBar>
        <TopBarTitle icon={Megaphone} title="Campaigns" detail={c.code} href="#campaigns" />
        <TopBarActions>
          <Tooltip label="Search" kbd="mod+k"><Button variant="ghost" icon={Search} aria-label="Search" /></Tooltip>
          <Tooltip label="Notifications"><Button variant="ghost" icon={Bell} aria-label="Notifications" dot /></Tooltip>
        </TopBarActions>
      </TopBar>
      <PageScroll>
        <Page>
          <RecordHeader lead={<Logo name={c.client} src={logo(c.domain)} size={40} />} title={c.client} sub={`× ${c.activity}`}
            meta={<><DotLabel shape="square" tone="green">{c.pod}</DotLabel><TagList>{c.services.map((s) => <Tooltip key={s} label={SERVICES[s]}><Tag>{s}</Tag></Tooltip>)}</TagList></>}
            actions={<>
              <Tooltip label={c.pinned ? 'Unpin' : 'Pin'}><Button icon={Pin} aria-label={c.pinned ? 'Unpin' : 'Pin'} pressed={c.pinned} onClick={() => setC((x) => ({ ...x, pinned: !x.pinned }))} /></Tooltip>
              <Tooltip label="Edit"><Button icon={Pencil} aria-label="Edit" onClick={() => { setDraft(c); setErr(null); setEdit(true) }} /></Tooltip>
              <Popover width={180} trigger={<Button icon={Ellipsis} aria-label="More" />}>
                <MenuItem icon={FolderOpen} onSelect={() => toast('Opening Drive folder')}>Open Drive</MenuItem>
                <MenuItem icon={Trash2} danger onSelect={() => setDel(true)}>Delete…</MenuItem>
              </Popover>
              {c.stage < 6 && (
                <Button variant="primary" icon={moving ? Check : ArrowUpRight} onClick={advance}>
                  <TextMorph>{moving ? (c.stage === 5 ? 'Complete' : `In ${STAGES[c.stage + 1]}`) : nextLabel}</TextMorph>
                </Button>
              )}
            </>} />

          <Stepper steps={STEPS} value={c.stage} />
          <Tabs variant="underline" value={tab} onChange={setTab} items={[{ value: 'overview', label: 'Overview' }, { value: 'plan', label: 'Plan' }, { value: 'report', label: 'Report' }]} />

          <div className="mt-6">
            <RecordLayout side={
              <PropertyList>
                <Property label="Lead"><Avatar {...c.lead} size={20} />{c.lead.name}</Property>
                <Property label="Team"><AvatarGroup people={c.team} /></Property>
                <Property label="Started">{long(c.start)}</Property>
                <Property label="Drive"><a className="flex items-center gap-1.5 text-fg-2" href="#drive"><FolderOpen size={14} />{c.code}</a></Property>
                <PropertySeparator />
                <Property label="Tally"><Chip tone="green">Synced</Chip></Property>
                <PropertySeparator />
                <Property label="Vendor submissions"><Switch label="Vendor submissions" checked={c.vendors} onChange={(v) => setC((x) => ({ ...x, vendors: v }))} /></Property>
                <Property label="Deep report"><Switch label="Deep report" checked={c.deep} onChange={(v) => setC((x) => ({ ...x, deep: v }))} /></Property>
              </PropertyList>
            }>
              <p className="m-0 max-w-[62ch] text-[15px] leading-relaxed text-fg-2">{c.brief}</p>
              <Metrics className="mt-6">
                <Metric label="Budget" value={inr(c.budget)} />
                <Metric label="Plan cost" value={inr(planCost)} />
                <Metric label="Margin" value={`${margin}%`} tone={margin > 25 ? 'green' : undefined} />
              </Metrics>
              <div className="mt-4 rounded-card border border-line p-4">
                <div className="mb-3 flex justify-between text-sm"><span className="text-muted">Views, last 12 weeks</span><span className="tabular-nums text-fg-2">4.2M</span></div>
                <Sparkline data={c.trend} width={620} height={56} tone="green" className="w-full" />
              </div>
            </RecordLayout>
          </div>
        </Page>
      </PageScroll>

      <Sheet open={edit} onClose={() => setEdit(false)} label={`Edit ${c.client}`} width={560}>
        <RecordHeader lead={<Logo name={c.client} src={logo(c.domain)} size={32} />} title="Edit campaign" sub={c.client} />
        <div className="w-form mt-6">
          <Field label="Name" error={err}><Input value={draft.activity} onChange={(e) => { setDraft({ ...draft, activity: e.target.value }); setErr(null) }} placeholder="Always-on Q4" /></Field>
          <Field label="Brief" help="What the client wants, in a few lines. Creators read this."><Textarea value={draft.brief} onChange={(e) => setDraft({ ...draft, brief: e.target.value })} /></Field>
          <div className="w-form-row">
            <Field label="Start"><DateInput value={iso(draft.start)} onChange={(e) => e.target.value && setDraft({ ...draft, start: new Date(e.target.value) })} /></Field>
            <Field label="Budget" optional><Input value={String(draft.budget)} inputMode="numeric" onChange={(e) => setDraft({ ...draft, budget: Number(e.target.value.replace(/\D/g, '')) || 0 })} /></Field>
          </div>
          <Field label="Services"><MultiSelect value={draft.services} onChange={(services) => setDraft({ ...draft, services })} options={Object.entries(SERVICES).map(([k, v]) => ({ value: k, label: k, hint: v }))} /></Field>
          <Field label="Team"><MultiSelect value={draft.team.map((p) => p.name)} onChange={(names) => setDraft({ ...draft, team: Object.values(PEOPLE).filter((p) => names.includes(p.name)) })}
            options={Object.values(PEOPLE).map((p) => ({ value: p.name, label: p.name, lead: <Avatar {...p} size={18} /> }))} placeholder="Add people" /></Field>
          <Field label="Pod"><RadioGroup value={draft.pod} onChange={(pod) => setDraft({ ...draft, pod })} options={[...PODS]} /></Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setEdit(false)}>Cancel</Button>
            <Button variant="primary" onClick={save}>Save</Button>
          </div>
        </div>
      </Sheet>

      <Dialog open={del} onClose={() => setDel(false)} title="Delete campaign?" width={420}
        description={<>{c.client} × {c.activity} and its plan, tracker and report go for good. Invoices stay in Finance.</>}
        footer={<><Button onClick={() => setDel(false)}>Cancel</Button><Button variant="primary" icon={Trash2} onClick={() => { setDel(false); toast.error('Deleted', { description: `${c.client} × ${c.activity}` }) }}>Delete</Button></>} />

      <Toaster />
    </AppShell>
  )
}
