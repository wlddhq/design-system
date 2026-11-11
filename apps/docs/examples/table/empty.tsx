import { Megaphone, Hash, CircleDashed, Clock, Search } from 'lucide-react'
import { Table, Th, Empty } from '@wldd/ui'

/** Nothing matches: the header stays, one quiet line sits where the rows would be. */
export default function EmptyTable() {
  return (
    <Table className="w-full" empty={<Empty icon={Search} title="No campaigns">Nothing matches these filters.</Empty>}>
      <thead>
        <tr>
          <Th kind="primary" icon={Megaphone}>Campaign</Th>
          <Th icon={Hash}>ID</Th>
          <Th icon={CircleDashed}>Stage</Th>
          <Th icon={Clock}>Updated</Th>
          <Th kind="fill" />
        </tr>
      </thead>
      <tbody>{[]}</tbody>
    </Table>
  )
}
