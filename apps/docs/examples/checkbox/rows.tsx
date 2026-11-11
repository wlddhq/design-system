'use client'
import { useState } from 'react'
import { Checkbox } from '@wldd/ui'

const ROWS = ['Lenskart × Wrapped', 'Zepto × Always-on Q4', 'District × Always-on Q4']

export default function Rows() {
  const [sel, setSel] = useState<string[]>([ROWS[1]!])
  const all = sel.length === ROWS.length
  return (
    <div className="grid gap-2.5">
      <label className="flex items-center gap-2.5 text-muted">
        <Checkbox label="Select all" checked={all} indeterminate={!all && sel.length > 0} onChange={() => setSel(all ? [] : ROWS)} />All
      </label>
      {ROWS.map((r) => (
        <label key={r} className="flex items-center gap-2.5">
          <Checkbox label={'Select ' + r} checked={sel.includes(r)} onChange={(on) => setSel(on ? [...sel, r] : sel.filter((x) => x !== r))} />{r}
        </label>
      ))}
    </div>
  )
}
