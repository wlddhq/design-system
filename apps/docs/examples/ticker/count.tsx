'use client'
import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { Button, Ticker } from '@wldd/ui'
import { money } from '../data'

/** Approve an invoice: the total rolls up. Only the digits move; ₹ and L stay put. */
export default function Count() {
  const [total, setTotal] = useState(38.4)
  const [n, setN] = useState(6)
  return (
    <div className="flex items-center gap-6">
      <span className="text-3xl font-semibold tracking-tight"><Ticker value={total} format={money} /></span>
      <span className="text-fg-2"><Ticker value={n} /> to approve</span>
      <Button icon={Check} disabled={n === 0} onClick={() => { setN(n - 1); setTotal(Math.round((total + 1.7) * 10) / 10) }}>Approve one</Button>
      <Button variant="ghost" icon={Plus} onClick={() => { setN(6); setTotal(38.4) }}>Reset</Button>
    </div>
  )
}
