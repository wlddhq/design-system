'use client'
import { useState } from 'react'
import { List, Columns3 } from 'lucide-react'
import { Segmented } from '@wldd/ui'

export default function Layout() {
  const [v, setV] = useState('list')
  const [m, setM] = useState('light')
  return (
    <>
      <Segmented value={v} onChange={setV} items={[{ value: 'list', label: 'List', icon: List }, { value: 'board', label: 'Board', icon: Columns3 }]} />
      <Segmented size="sm" value={m} onChange={setM} items={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }]} />
    </>
  )
}
