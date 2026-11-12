import { Metrics, Metric } from '@wldd/ui'
import { MONTHLY, money, views } from '../data'

/** Beside the work on Home: stacked, no frame. */
export default function Side() {
  return (
    <div className="w-64">
      <Metrics stacked label="This month">
        <Metric label="Views" value={455} format={views} series={MONTHLY.views} />
        <Metric label="Billing" value={38} format={money} series={MONTHLY.billing} />
        <Metric label="Margin" value="31%" tone="green" note="Plan was 25%" />
      </Metrics>
    </div>
  )
}
