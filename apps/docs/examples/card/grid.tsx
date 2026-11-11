import { CalendarDays } from 'lucide-react'
import { CardGrid, RecordCard, Sparkline, Logo, Avatar, ProgressIcon, TagList, Tag } from '@wldd/ui'
import { CAMPAIGNS, STAGES, stageTone, logo, inr } from '../data'

export default function Grid() {
  return (
    <CardGrid className="w-full">
      {CAMPAIGNS.slice(1, 4).map((c) => (
        <RecordCard key={c.id} href={`#${c.code}`} lead={<Logo name={c.client} src={logo(c.domain)} size={32} />}
          title={c.client} sub={c.activity} caption={`${c.code} · ${c.pod}`} corner={<Avatar {...c.lead} size={22} />}
          footer={<>
            <ProgressIcon value={c.stage} tone={stageTone(c.stage)} /><span className="truncate">{STAGES[c.stage]}</span>
            <TagList>{c.services.map((s) => <Tag key={s}>{s}</Tag>)}</TagList><span className="ml-auto">{inr(c.budget)}</span>
          </>}
          meta={<><CalendarDays size={12} />{c.start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}<span className="ml-auto">Updated {c.updated} ago</span></>}>
          <Sparkline data={c.trend} width={320} height={44} tone={c.stage >= 4 ? 'green' : 'muted'} />
        </RecordCard>
      ))}
    </CardGrid>
  )
}
