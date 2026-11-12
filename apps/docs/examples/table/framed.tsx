import { Receipt, Megaphone, IndianRupee, CircleDashed } from 'lucide-react'
import { Table, Th, Td, Tr, Chip } from '@wldd/ui'

const ROWS = [
  { id: 'INV-2291', vendor: 'Kulfi Films', campaign: 'Zepto × Always-on Q4', amount: '₹4.2L', stage: 'To approve', tone: 'yellow' },
  { id: 'INV-2288', vendor: 'Neon Studio', campaign: 'Krafton × Launch Week', amount: '₹2.8L', stage: 'Scheduled', tone: 'violet' },
  { id: 'INV-2284', vendor: 'Masala Media', campaign: 'Swiggy × New Album', amount: '₹6.1L', stage: 'Paid', tone: 'green' },
] as const

/** Inside a padded page (a dashboard, under the charts): framed, all four edges. */
export default function Framed() {
  return (
    <Table framed label="Invoices" className="w-full">
      <thead><Tr><Th kind="primary" icon={Receipt}>Invoice</Th><Th icon={Megaphone}>Campaign</Th><Th icon={IndianRupee} align="right">Amount</Th><Th icon={CircleDashed}>Stage</Th></Tr></thead>
      <tbody>
        {ROWS.map((r) => (
          <Tr key={r.id}>
            <Td>{r.vendor} <span className="text-muted">{r.id}</span></Td>
            <Td>{r.campaign}</Td>
            <Td align="right">{r.amount}</Td>
            <Td><Chip tone={r.tone}>{r.stage}</Chip></Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  )
}
