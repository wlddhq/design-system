'use client'
import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Button, Toaster, toast, ProgressIcon } from '@wldd/ui'
import { STAGES, stageTone } from '../data'

/** Act at once, then offer Undo. One <Toaster /> lives at the app's root; it's here so the example works alone. */
export default function Undo() {
  const [stage, setStage] = useState(3)
  const move = () => {
    const prev = stage
    setStage(prev + 1)
    toast(`Moved to ${STAGES[prev + 1]}`, { description: 'Krafton India × Launch Week', action: { label: 'Undo', onClick: () => setStage(prev) } })
  }
  return (
    <div className="flex items-center gap-4">
      <span className="flex items-center gap-2"><ProgressIcon value={stage} tone={stageTone(stage)} />{STAGES[stage]}</span>
      <Button icon={ArrowUpRight} onClick={move} disabled={stage >= 5}>Next stage</Button>
      <Button onClick={() => toast.error('Couldn’t sync Tally', { description: 'Retrying in a minute' })}>Fail a sync</Button>
      <Toaster />
    </div>
  )
}
