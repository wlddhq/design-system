'use client'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@wldd/ui'

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  return (
    <Button className="copy" size="sm" variant="ghost" icon={done ? Check : Copy} aria-label={done ? 'Copied' : 'Copy'}
      onClick={async () => {
        try { await navigator.clipboard.writeText(text) } catch { return }
        setDone(true)
        setTimeout(() => setDone(false), 1400)
      }} />
  )
}
