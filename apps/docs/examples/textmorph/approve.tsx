'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button, TextMorph } from '@wldd/ui'

export default function Approve() {
  const [done, setDone] = useState(false)
  return (
    <Button variant={done ? 'secondary' : 'primary'} icon={Check} onClick={() => setDone(!done)}>
      <TextMorph>{done ? 'Approved' : 'Approve'}</TextMorph>
    </Button>
  )
}
