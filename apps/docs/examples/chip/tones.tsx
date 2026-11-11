import { Check, Clock } from 'lucide-react'
import { Chip } from '@wldd/ui'

export default function Tones() {
  return (
    <>
      <Chip>Draft</Chip>
      <Chip tone="green" icon={Check}>Paid</Chip>
      <Chip tone="yellow" icon={Clock}>Due soon</Chip>
      <Chip tone="violet">In review</Chip>
      <Chip tone="pink">Overdue</Chip>
    </>
  )
}
