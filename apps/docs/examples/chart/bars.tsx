'use client'
import { Bars, ChartPanel } from '@wldd/ui'
import { MONTHS, MONTHLY, money } from '../data'

/** Amounts side by side. The current month is full colour; hover any bar to read it. */
export default function BarsEx() {
  return (
    <ChartPanel className="w-full" title="Paid out by month">
      <Bars data={MONTHLY.paid} labels={MONTHS} label="Paid out by month" format={money} />
    </ChartPanel>
  )
}
