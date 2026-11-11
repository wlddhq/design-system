'use client'
import { ArrowUpRight, Pin } from 'lucide-react'
import { Button, SelectionBar } from '@wldd/ui'

export default function Bar() {
  return (
    <SelectionBar count={3} total={1240} onSelectAll={() => {}} onClear={() => {}}>
      <Button size="sm" icon={ArrowUpRight}>Next stage</Button>
      <Button size="sm" icon={Pin}>Pin</Button>
    </SelectionBar>
  )
}
