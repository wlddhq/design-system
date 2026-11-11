import { Inbox, Plus } from 'lucide-react'
import { Button, Empty } from '@wldd/ui'

export default function Clear() {
  return (
    <div className="flex gap-16">
      <Empty icon={Inbox} title="Clear" />
      <Empty icon={Inbox} title="No campaigns" action={<Button size="sm" icon={Plus}>New campaign</Button>} />
    </div>
  )
}
