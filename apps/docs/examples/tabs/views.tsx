'use client'
import { useState } from 'react'
import { Tabs } from '@wldd/ui'

export default function Views() {
  const [v, setV] = useState('all')
  return (
    <Tabs value={v} onChange={setV} items={[
      { value: 'all', label: 'All', count: 28 },
      { value: 'active', label: 'Active', count: 17 },
      { value: 'pipeline', label: 'Pipeline', count: 7 },
    ]} />
  )
}
