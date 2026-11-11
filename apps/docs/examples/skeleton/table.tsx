'use client'
import { useEffect, useState } from 'react'
import { Megaphone, Hash, CircleDashed, Users, IndianRupee, Clock, RotateCw } from 'lucide-react'
import { Button, Table, Th, Td, Tr, RecordCell, Checkbox, Logo, ProgressIcon, AvatarGroup } from '@wldd/ui'
import { CAMPAIGNS, STAGES, stageTone, logo, inr } from '../data'

/** The header is real from the first frame; only the rows are skeletons. Click Reload to see it again. */
export default function LoadingTable() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoading(false), 1600) // stands in for the fetch
    return () => clearTimeout(t)
  }, [loading])
  const rows = CAMPAIGNS.slice(0, 5)
  return (
    <div className="grid w-full gap-3">
      <div className="px-3 pt-3"><Button size="sm" icon={RotateCw} onClick={() => setLoading(true)} disabled={loading}>Reload</Button></div>
      <Table loading={loading} rows={5} className="w-full">
        <thead>
          <tr>
            <Th kind="select"><Checkbox label="Select all" checked={false} onChange={() => {}} /></Th>
            <Th kind="primary" icon={Megaphone}>Campaign</Th>
            <Th icon={Hash}>ID</Th>
            <Th icon={CircleDashed}>Stage</Th>
            <Th icon={Users}>Team</Th>
            <Th icon={IndianRupee} align="right">Budget</Th>
            <Th icon={Clock}>Updated</Th>
            <Th kind="fill" />
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <Tr key={c.id}>
              <Td kind="select"><Checkbox label={'Select ' + c.client} checked={false} onChange={() => {}} /></Td>
              <Td kind="primary"><RecordCell lead={<Logo name={c.client} src={logo(c.domain)} />} title={c.client} sub={`× ${c.activity}`} /></Td>
              <Td className="font-mono text-xs text-muted">{c.code}</Td>
              <Td><span className="flex items-center gap-1.5"><ProgressIcon value={c.stage} tone={stageTone(c.stage)} />{STAGES[c.stage]}</span></Td>
              <Td><AvatarGroup people={c.team} /></Td>
              <Td align="right" className="tabular-nums">{inr(c.budget)}</Td>
              <Td className="text-muted tabular-nums">{c.updated}</Td>
              <Td kind="fill" />
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
