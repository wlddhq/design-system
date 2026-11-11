'use client'
import { useState } from 'react'
import { Clock, ArrowUpDown, IndianRupee } from 'lucide-react'
import { Select } from '@wldd/ui'

export default function Order() {
  const [v, setV] = useState('updated')
  return (
    <Select value={v} onChange={setV} options={[
      { value: 'updated', label: 'Updated', icon: Clock },
      { value: 'stage', label: 'Stage', icon: ArrowUpDown },
      { value: 'budget', label: 'Budget', icon: IndianRupee },
    ]} />
  )
}
