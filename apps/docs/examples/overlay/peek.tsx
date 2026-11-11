'use client'
import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Button, Sheet, RecordHeader, PropertyList, Property, PropertySeparator, Logo, Avatar, AvatarGroup, ProgressIcon } from '@wldd/ui'
import { CAMPAIGNS, STAGES, stageTone, logo, inr } from '../data'

/** A record's peek: open it, look, close it, and you're back where you were. */
export default function Peek() {
  const [open, setOpen] = useState(false)
  const c = CAMPAIGNS[1]!
  return (
    <>
      <Button onClick={() => setOpen(true)}>Peek at {c.client}</Button>
      <Sheet open={open} onClose={() => setOpen(false)} label={`${c.client} × ${c.activity}`}>
        <RecordHeader lead={<Logo name={c.client} src={logo(c.domain)} size={32} />} title={c.client} sub={`× ${c.activity}`} meta={<span className="font-mono">{c.code}</span>} />
        <PropertyList className="mt-6">
          <Property label="Stage"><ProgressIcon value={c.stage} tone={stageTone(c.stage)} />{STAGES[c.stage]}</Property>
          <Property label="Lead"><Avatar {...c.lead} size={20} />{c.lead.name}</Property>
          <Property label="Team"><AvatarGroup people={c.team} /></Property>
          <PropertySeparator />
          <Property label="Budget">{inr(c.budget)}</Property>
        </PropertyList>
        <div className="mt-6"><Button href="#open" icon={ArrowUpRight}>Open campaign</Button></div>
      </Sheet>
    </>
  )
}
