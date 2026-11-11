'use client'
import { useState } from 'react'
import { SlidersHorizontal, List, Columns3, Table2 } from 'lucide-react'
import { Button, Popover, PopoverRow, PopoverSection, Segmented, Select, Switch } from '@wldd/ui'

export default function Display() {
  const [layout, setLayout] = useState('table')
  const [group, setGroup] = useState('stage')
  const [done, setDone] = useState(false)
  return (
    <Popover width={320} trigger={<Button size="sm" icon={SlidersHorizontal}>Display</Button>}>
      <PopoverSection>
        <Segmented value={layout} onChange={setLayout} items={[
          { value: 'list', label: 'List', icon: List }, { value: 'board', label: 'Board', icon: Columns3 }, { value: 'table', label: 'Table', icon: Table2 },
        ]} />
      </PopoverSection>
      <PopoverSection>
        <PopoverRow label="Grouping">
          <Select value={group} onChange={setGroup} options={[{ value: 'none', label: 'None' }, { value: 'stage', label: 'Stage' }, { value: 'pod', label: 'Pod' }]} />
        </PopoverRow>
        <PopoverRow label="Show completed"><Switch label="Show completed" checked={done} onChange={setDone} /></PopoverRow>
      </PopoverSection>
    </Popover>
  )
}
