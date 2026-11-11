'use client'
import { useState } from 'react'
import { Rows3, Columns3, Table2, GanttChart, LayoutGrid, SlidersHorizontal } from 'lucide-react'
import { Button, Popover, PopoverSection, PopoverRow, MenuLabel, Select, Switch, ViewPicker, ToggleChips } from '@wldd/ui'

const LAYOUTS = [
  { value: 'list', label: 'List', icon: Rows3 }, { value: 'board', label: 'Board', icon: Columns3 }, { value: 'table', label: 'Table', icon: Table2 },
  { value: 'timeline', label: 'Timeline', icon: GanttChart }, { value: 'grid', label: 'Grid', icon: LayoutGrid },
]
const PROPS = [
  { value: 'code', label: 'ID' }, { value: 'stage', label: 'Stage' }, { value: 'services', label: 'Services' },
  { value: 'team', label: 'Team' }, { value: 'budget', label: 'Budget' }, { value: 'updated', label: 'Updated' },
]

/** The Display popover from the Campaigns toolbar. Open it. */
export default function Menu() {
  const [layout, setLayout] = useState('list')
  const [group, setGroup] = useState('stage')
  const [done, setDone] = useState(true)
  const [props, setProps] = useState(['code', 'stage', 'team', 'budget'])
  return (
    <Popover width={340} align="start" trigger={<Button size="sm" icon={SlidersHorizontal}>Display</Button>}>
      <ViewPicker value={layout} onChange={setLayout} items={LAYOUTS} />
      <PopoverSection>
        <PopoverRow label="Grouping"><Select value={group} onChange={setGroup} options={[{ value: 'stage', label: 'Stage' }, { value: 'pod', label: 'Pod' }, { value: 'none', label: 'No grouping' }]} /></PopoverRow>
        <PopoverRow label="Show completed"><Switch label="Show completed" checked={done} onChange={setDone} /></PopoverRow>
      </PopoverSection>
      <PopoverSection>
        <MenuLabel>Properties</MenuLabel>
        <ToggleChips label="Properties" value={props} onChange={setProps} items={PROPS} />
      </PopoverSection>
    </Popover>
  )
}
