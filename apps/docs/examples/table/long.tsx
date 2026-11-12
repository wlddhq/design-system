import { Megaphone, Hash, CircleDashed, IndianRupee, Clock } from 'lucide-react'
import { Table, Th, Td, Tr, RecordCell, Logo, ProgressIcon, Aggregate } from '@wldd/ui'
import { CAMPAIGNS, STAGES, stageTone, logo, inr } from '../data'

/** More rows than fit: the header and the footer stay put, and rows scroll between them. */
export default function LongTable() {
  return (
    <Table label="All campaigns" className="h-full w-full">
      <thead>
        <tr>
          <Th kind="primary" icon={Megaphone}>Campaign</Th>
          <Th icon={Hash}>ID</Th>
          <Th icon={CircleDashed}>Stage</Th>
          <Th icon={IndianRupee} align="right">Budget</Th>
          <Th icon={Clock}>Updated</Th>
          <Th kind="fill" />
        </tr>
      </thead>
      <tbody>
        {CAMPAIGNS.map((c) => (
          <Tr key={c.id}>
            <Td kind="primary"><RecordCell lead={<Logo name={c.client} src={logo(c.domain)} />} title={c.client} sub={`× ${c.activity}`} /></Td>
            <Td className="font-mono text-xs text-muted">{c.code}</Td>
            <Td><span className="flex items-center gap-1.5"><ProgressIcon value={c.stage} tone={stageTone(c.stage)} />{STAGES[c.stage]}</span></Td>
            <Td align="right" className="tabular-nums">{inr(c.budget)}</Td>
            <Td className="text-muted tabular-nums">{c.updated}</Td>
            <Td kind="fill" />
          </Tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <Td kind="primary"><Aggregate label="Count">{CAMPAIGNS.length}</Aggregate></Td>
          <Td /><Td />
          <Td align="right"><Aggregate label="Sum">{inr(CAMPAIGNS.reduce((a, c) => a + c.budget, 0))}</Aggregate></Td>
          <Td />
          <Td kind="fill" />
        </tr>
      </tfoot>
    </Table>
  )
}
