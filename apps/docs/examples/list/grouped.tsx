import { List, ListGroup, ListRow, ListTitle, ListCell, ProgressIcon, Logo, Track, AvatarGroup, Tooltip } from '@wldd/ui'
import { CAMPAIGNS, STAGES, stageTone, logo, inr } from '../data'

/** Grouped by stage, two rows each, then "Show 1 more". */
export default function Grouped() {
  const groups = [4, 3].map((s) => ({ s, items: CAMPAIGNS.filter((c) => c.stage === s) }))
  return (
    <List className="w-full">
      {groups.map(({ s, items }) => (
        <ListGroup key={s} icon={<ProgressIcon value={s} tone={stageTone(s)} />} label={STAGES[s]} count={items.length}
          aside={inr(items.reduce((a, c) => a + c.budget, 0))} limit={2}>
          {items.map((c) => (
            <ListRow key={c.id} href={`#${c.code}`}>
              <ListCell kind="code">{c.code}</ListCell>
              <Logo name={c.client} src={logo(c.domain)} size={20} />
              <ListTitle title={c.client} sub={`× ${c.activity}`} />
              <Tooltip label={STAGES[c.stage]}><Track value={c.stage} /></Tooltip>
              <ListCell kind="num">{inr(c.budget)}</ListCell>
              <ListCell kind="date">{c.updated}</ListCell>
              <AvatarGroup people={c.team} />
            </ListRow>
          ))}
        </ListGroup>
      ))}
    </List>
  )
}
