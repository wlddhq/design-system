'use client'
import { useState } from 'react'
import { Board, BoardColumn, BoardCard, ProgressIcon, Logo, Avatar, AvatarGroup, Chip, TagList, Tag } from '@wldd/ui'
import { CAMPAIGNS, STAGES, stageTone, logo, inr } from '../data'

/** Drag a card to another stage. */
export default function Stages() {
  const [rows, setRows] = useState(CAMPAIGNS.filter((c) => c.stage >= 2 && c.stage <= 4))
  return (
    <Board onMove={(id, col) => setRows((r) => r.map((c) => (c.id === id ? { ...c, stage: Number(col) } : c)))}>
      {[2, 3, 4].map((s) => {
        const items = rows.filter((c) => c.stage === s)
        return (
          <BoardColumn key={s} id={s} icon={<ProgressIcon value={s} tone={stageTone(s)} />} label={STAGES[s]} count={items.length}
            aside={items.length ? inr(items.reduce((a, c) => a + c.budget, 0)) : null}>
            {items.map((c) => (
              <BoardCard key={c.id} id={c.id} code={c.code} corner={<Avatar {...c.lead} size={18} />}
                lead={<Logo name={c.client} src={logo(c.domain)} size={24} />} title={c.client} sub={c.activity}
                meta={<><TagList>{c.services.map((x) => <Tag key={x}>{x}</Tag>)}</TagList><Chip>{inr(c.budget)}</Chip></>}
                footer={<AvatarGroup people={c.team} size={18} />} />
            ))}
          </BoardColumn>
        )
      })}
    </Board>
  )
}
