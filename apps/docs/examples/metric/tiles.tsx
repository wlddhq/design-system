'use client'
import { useState } from 'react'
import { Metrics, Metric, Segmented } from '@wldd/ui'
import { MONTHLY, money } from '../data'

/** The top of a Finance dashboard. Switch the range: the numbers roll. Tiles are buttons that pick what the chart below shows. */
export default function Tiles() {
  const [range, setRange] = useState('month')
  const [pick, setPick] = useState('billing')
  const k = { month: 1, quarter: 2.9, year: 10.6 }[range]!
  return (
    <div className="flex w-full flex-col gap-3">
      <Segmented size="sm" value={range} onChange={setRange} items={[{ value: 'month', label: 'Month' }, { value: 'quarter', label: 'Quarter' }, { value: 'year', label: 'Year' }]} />
      <Metrics label="Finance this period">
        <Metric label="To approve" value={6} />
        <Metric label="Scheduled" value={Math.round(4.2 * k * 10) / 10} format={money} onClick={() => setPick('scheduled')} pressed={pick === 'scheduled'} />
        <Metric label="Paid" value={Math.round(28 * k)} format={money} series={MONTHLY.paid} onClick={() => setPick('paid')} pressed={pick === 'paid'} />
        <Metric label="Billing" value={Math.round(38 * k)} format={money} series={MONTHLY.billing} onClick={() => setPick('billing')} pressed={pick === 'billing'} />
      </Metrics>
    </div>
  )
}
