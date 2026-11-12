'use client'
import { useCallback, useEffect, useState } from 'react'
import { Receipt, Hash, IndianRupee, Clock, Pin, ArrowUpRight } from 'lucide-react'
import { Table, Th, Td, Tr, RecordCell, Checkbox, Logo, Aggregate, SelectionBar, Button } from '@wldd/ui'
import { CAMPAIGNS, logo, inr } from '../data'

/* A pretend server: 240 invoices, 40 per request. In the product this is your API. */
const ALL = Array.from({ length: 240 }, (_, i) => {
  const c = CAMPAIGNS[i % CAMPAIGNS.length]!
  return { id: `INV-${3000 + i}`, client: c.client, domain: c.domain, amount: (c.budget * 7 + i * 13) % 90 + 4, age: `${(i % 28) + 1}d` }
})
const fetchPage = (from: number) => new Promise<typeof ALL>((ok) => setTimeout(() => ok(ALL.slice(from, from + 40)), 700))
const TOTALS = { count: ALL.length, sum: ALL.reduce((a, r) => a + r.amount, 0) } // the server sends these with page one

export default function InfiniteTable() {
  const [rows, setRows] = useState<typeof ALL>([])
  const [loading, setLoading] = useState(true)
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [everything, setEverything] = useState(false) // "Select all 240", including rows not loaded yet

  useEffect(() => { fetchPage(0).then((r) => { setRows(r); setLoading(false) }) }, [])
  const more = useCallback(() => { fetchPage(rows.length).then((r) => setRows((cur) => [...cur, ...r])) }, [rows.length])

  const count = everything ? TOTALS.count : sel.size
  const allLoaded = rows.length > 0 && rows.every((r) => everything || sel.has(r.id))
  const toggle = (id: string, on: boolean) => {
    setEverything(false)
    setSel((s) => { const n = new Set(everything ? rows.map((r) => r.id) : s); on ? n.add(id) : n.delete(id); return n })
  }
  const clear = () => { setSel(new Set()); setEverything(false) }

  return (
    <>
      <Table label="All invoices" className="h-full w-full" loading={loading} rows={8} hasMore={rows.length < TOTALS.count} onLoadMore={more}>
        <thead>
          <tr>
            <Th kind="select"><Checkbox label="Select loaded" checked={allLoaded} indeterminate={!allLoaded && count > 0}
              onChange={() => (allLoaded ? clear() : setSel(new Set(rows.map((r) => r.id))))} /></Th>
            <Th kind="primary" icon={Receipt}>Invoice</Th>
            <Th icon={Hash}>Number</Th>
            <Th icon={IndianRupee} align="right">Amount</Th>
            <Th icon={Clock}>Age</Th>
            <Th kind="fill" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const on = everything || sel.has(r.id)
            return (
              <Tr key={r.id} selected={on}>
                <Td kind="select"><Checkbox label={`Select ${r.id}`} checked={on} onChange={(v) => toggle(r.id, v)} /></Td>
                <Td kind="primary"><RecordCell lead={<Logo name={r.client} src={logo(r.domain)} />} title={r.client} /></Td>
                <Td className="font-mono text-xs text-muted">{r.id}</Td>
                <Td align="right" className="tabular-nums">{inr(r.amount)}</Td>
                <Td className="text-muted tabular-nums">{r.age}</Td>
                <Td kind="fill" />
              </Tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <Td kind="select" />
            <Td kind="primary"><Aggregate label="Count">{TOTALS.count}</Aggregate></Td>
            <Td />
            <Td align="right"><Aggregate label="Sum">{inr(TOTALS.sum)}</Aggregate></Td>
            <Td />
            <Td kind="fill" />
          </tr>
        </tfoot>
      </Table>
      <SelectionBar count={count} noun="selected" total={TOTALS.count} onSelectAll={() => setEverything(true)} onClear={clear}>
        <Button size="sm" icon={ArrowUpRight}>Send reminder</Button>
        <Button size="sm" icon={Pin}>Pin</Button>
      </SelectionBar>
    </>
  )
}
