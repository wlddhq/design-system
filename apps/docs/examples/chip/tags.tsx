import { Tag, TagList, Tooltip } from '@wldd/ui'
import { SERVICES } from '../data'

export default function ServiceTags() {
  return (
    <TagList>
      {['AMP', 'MEMD', 'CC'].map((s) => (
        <Tooltip key={s} label={SERVICES[s]}><Tag>{s}</Tag></Tooltip>
      ))}
    </TagList>
  )
}
