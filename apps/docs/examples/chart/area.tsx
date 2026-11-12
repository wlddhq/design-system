'use client'
import { useState } from 'react'
import { AreaChart, ChartPanel, Segmented } from '@wldd/ui'
import { MONTHS, MONTHLY, money } from '../data'

/** One measure over time, in a panel with its total. Hover, or focus it and use ←/→. */
export default function Area() {
  const [n, setN] = useState('12')
  const data = MONTHLY.closed.slice(-Number(n)), labels = MONTHS.slice(-Number(n))
  return (
    <ChartPanel className="w-full" title="Closed by month" total={data.reduce((a, b) => a + b, 0)} format={money}
      actions={<Segmented size="sm" value={n} onChange={setN} items={[{ value: '6', label: '6M' }, { value: '12', label: '12M' }]} />}>
      <AreaChart data={data} labels={labels} label="Closed by month" format={money} />
    </ChartPanel>
  )
}
