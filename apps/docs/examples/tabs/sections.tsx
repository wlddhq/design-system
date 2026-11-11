'use client'
import { useState } from 'react'
import { Tabs } from '@wldd/ui'

export default function Sections() {
  const [v, setV] = useState('overview')
  return (
    <Tabs variant="underline" className="w-full" value={v} onChange={setV} items={[
      { value: 'overview', label: 'Overview' },
      { value: 'deliverables', label: 'Deliverables', count: 12 },
      { value: 'payments', label: 'Payments', count: 3 },
    ]} />
  )
}
