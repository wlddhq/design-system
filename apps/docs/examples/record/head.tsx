import { ArrowUpRight, Pin } from 'lucide-react'
import { RecordHeader, Stepper, Metrics, Metric, RecordLayout, PropertyList, Property, PropertySeparator, Button, Logo, Avatar, AvatarGroup, TagList, Tag, Chip, DotLabel } from '@wldd/ui'
import { CAMPAIGNS, STAGES, logo, inr } from '../data'

/** The top of a record page: header, stages, numbers and properties. */
export default function Head() {
  const c = CAMPAIGNS[1]!
  return (
    <div className="w-full">
      <RecordHeader lead={<Logo name={c.client} src={logo(c.domain)} size={40} />} title={c.client} sub={`× ${c.activity}`}
        meta={<><DotLabel shape="square" tone="green">{c.pod}</DotLabel><TagList>{c.services.map((s) => <Tag key={s}>{s}</Tag>)}</TagList></>}
        actions={<><Button icon={Pin} aria-label="Pin" /><Button variant="primary" icon={ArrowUpRight}>Move to {STAGES[c.stage + 1]}</Button></>} />
      <Stepper steps={STAGES.slice(0, 6) as unknown as string[]} value={c.stage} />
      <RecordLayout side={
        <PropertyList>
          <Property label="Lead"><Avatar {...c.lead} size={20} />{c.lead.name}</Property>
          <Property label="Team"><AvatarGroup people={c.team} /></Property>
          <PropertySeparator />
          <Property label="Tally"><Chip tone="green">Synced</Chip></Property>
        </PropertyList>
      }>
        <Metrics>
          <Metric label="Budget" value={inr(c.budget)} />
          <Metric label="Plan cost" value={inr(Math.round(c.budget * 0.69))} />
          <Metric label="Margin" value="31%" tone="green" />
        </Metrics>
      </RecordLayout>
    </div>
  )
}
