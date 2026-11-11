import { Plus, ArrowUpRight, Pin } from 'lucide-react'
import { Button } from '@wldd/ui'

export default function WithIcons() {
  return (
    <>
      <Button variant="primary" icon={Plus}>New campaign</Button>
      <Button icon={ArrowUpRight}>Open</Button>
      <Button variant="ghost" icon={Pin}>Pin</Button>
    </>
  )
}
