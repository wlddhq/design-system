import { ShareBar, ChartPanel } from '@wldd/ui'

/** How one whole splits. Colours follow the fixed order; the legend names every part. */
export default function Share() {
  const outreach = [{ label: 'Proposal', value: 14 }, { label: 'Lead', value: 23 }, { label: 'Disqualified', value: 6, color: 'var(--chart-other)' }]
  const proposals = [{ label: 'Converted', value: 4 }, { label: 'Approved', value: 6 }, { label: 'Mapped', value: 3 }, { label: 'Cancelled', value: 2 }]
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <ChartPanel title="Outreach" total={43}><ShareBar parts={outreach} label="Outreach by status" /></ChartPanel>
      <ChartPanel title="Proposals" total={15}><ShareBar parts={proposals} label="Proposals by status" /></ChartPanel>
    </div>
  )
}
