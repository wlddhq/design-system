'use client'
import { useState } from 'react'
import { ListFilter } from 'lucide-react'
import { Button, Dot, MenuItem, MenuLabel, Popover } from '@wldd/ui'

const PODS = [{ id: 'Kulfi', tone: 'green' }, { id: 'Neon', tone: 'violet' }, { id: 'Masala', tone: 'yellow' }] as const

export default function Filter() {
  const [pod, setPod] = useState<string | null>(null)
  return (
    <Popover width={180} trigger={<Button size="sm" icon={ListFilter}>{pod ? `Pod ${pod}` : 'Filter'}</Button>}>
      <MenuLabel>Pod</MenuLabel>
      <MenuItem checked={pod === null} onSelect={() => setPod(null)}>Any</MenuItem>
      {PODS.map((p) => (
        <MenuItem key={p.id} lead={<Dot shape="square" tone={p.tone} />} checked={pod === p.id} onSelect={() => setPod(p.id)}>{p.id}</MenuItem>
      ))}
    </Popover>
  )
}
