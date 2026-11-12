'use client'
import { useState } from 'react'
import { Megaphone, Hash, CircleDashed, Users, IndianRupee, Clock } from 'lucide-react'
import { Table, Th, Td, Tr, RecordCell, Checkbox, Logo, ProgressIcon, AvatarGroup, Aggregate } from '@wldd/ui'
import { CAMPAIGNS, STAGES, stageTone, logo, inr } from '../data'

export default function CampaignTable() {
  const rows = CAMPAIGNS.slice(0, 5)
  const [sel, setSel] = useState<string[]>([])
  const all = sel.length === rows.length
  return (
    <Table label="Campaigns" className="w-full">
      <thead>
        <tr>
          <Th kind="select"><Checkbox label="Select all" checked={all} indeterminate={!all && sel.length > 0} onChange={() => setSel(all ? [] : rows.map((r) => r.id))} /></Th>
          <Th kind="primary" icon={Megaphone}>Campaign</Th>
          <Th icon={Hash}>ID</Th>
          <Th icon={CircleDashed}>Stage</Th>
          <Th icon={Users}>Team</Th>
          <Th icon={IndianRupee}>Budget</Th>
          <Th icon={Clock} sorted="desc" onSort={() => {}}>Updated</Th>
          <Th kind="fill" />
        </tr>
      </thead>
      <tbody>
        {rows.map((c) => (
          <Tr key={c.id} selected={sel.includes(c.id)}>
            <Td kind="select"><Checkbox label={'Select ' + c.client} checked={sel.includes(c.id)} onChange={(on) => setSel(on ? [...sel, c.id] : sel.filter((x) => x !== c.id))} /></Td>
            <Td kind="primary"><RecordCell lead={<Logo name={c.client} src={logo(c.domain)} />} title={c.client} sub={`× ${c.activity}`} /></Td>
            <Td className="font-mono text-xs text-muted">{c.code}</Td>
            <Td><span className="flex items-center gap-1.5"><ProgressIcon value={c.stage} tone={stageTone(c.stage)} />{STAGES[c.stage]}</span></Td>
            <Td><AvatarGroup people={c.team} /></Td>
            <Td className="tabular-nums">{inr(c.budget)}</Td>
            <Td className="text-muted tabular-nums">{c.updated}</Td>
            <Td kind="fill" />
          </Tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <Td kind="select" />
          <Td kind="primary"><Aggregate label="Count">{rows.length}</Aggregate></Td>
          <Td /><Td /><Td />
          <Td><Aggregate label="Sum">{inr(rows.reduce((a, c) => a + c.budget, 0))}</Aggregate></Td>
          <Td />
          <Td kind="fill" />
        </tr>
      </tfoot>
    </Table>
  )
}
