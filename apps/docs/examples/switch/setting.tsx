'use client'
import { useState } from 'react'
import { Switch } from '@wldd/ui'

export default function Setting() {
  const [on, setOn] = useState(true)
  return (
    <div className="flex w-64 items-center justify-between font-medium text-fg-2">
      Show completed
      <Switch label="Show completed" checked={on} onChange={setOn} />
    </div>
  )
}
