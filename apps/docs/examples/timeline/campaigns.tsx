import { Timeline, TimelineGroup, TimelineRow, ProgressIcon, Logo, ListTitle } from '@wldd/ui'
import { CAMPAIGNS, STAGES, TODAY, stageTone, logo, inr } from '../data'

/** Live and reporting campaigns on a calendar. Hover a bar for its dates. */
export default function Campaigns() {
  return (
    <Timeline start={new Date(TODAY.getTime() - 63 * 864e5)} today={TODAY}>
      {[4, 5].map((s) => (
        <div key={s}>
          <TimelineGroup icon={<ProgressIcon value={s} tone={stageTone(s)} />} label={STAGES[s]} count={CAMPAIGNS.filter((c) => c.stage === s).length} />
          {CAMPAIGNS.filter((c) => c.stage === s).map((c) => (
            <TimelineRow key={c.id} start={c.start} end={c.end} tone={stageTone(c.stage)} progress={c.stage / 6} label={c.client} detail={inr(c.budget)}
              name={<><Logo name={c.client} src={logo(c.domain)} size={20} /><ListTitle title={c.client} sub={`× ${c.activity}`} /></>} />
          ))}
        </div>
      ))}
    </Timeline>
  )
}
