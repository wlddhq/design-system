'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button, Loader, TextMorph } from '@wldd/ui'

/** Click: the button works, settles into a check, then says so. */
export default function Save() {
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const save = () => {
    if (state !== 'idle') return setState('idle')
    setState('saving')
    setTimeout(() => setState('saved'), 1400)
  }
  return (
    <Button onClick={save}>
      {state === 'idle' ? <Check size={15} aria-hidden /> : <Loader kind="ring" size={14} done={state === 'saved'} label="Saving" />}
      <TextMorph>{state === 'saving' ? 'Saving' : state === 'saved' ? 'Saved' : 'Save'}</TextMorph>
    </Button>
  )
}
