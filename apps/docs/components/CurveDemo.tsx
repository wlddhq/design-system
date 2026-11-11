'use client'
import { useState } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@wldd/ui'

const CURVES = [
  { t: '--ease-out', v: 'cubic-bezier(.23, 1, .32, 1)', s: 'Default for everything', d: 240 },
  { t: '--ease-drawer', v: 'cubic-bezier(.32, .72, 0, 1)', s: 'Sheets, trays, drawers', d: 360 },
]

/** Plays each curve on click — motion as a response to an action, as the rules say. */
export function CurveDemo() {
  const [on, setOn] = useState(false)
  return (
    <div className="grid gap-3">
      {CURVES.map((c) => (
        <div key={c.t} className="curve">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs text-fg">{c.t}</span>
            <span className="font-mono text-xs text-muted ell">{c.v}</span>
            <span className="ml-auto text-xs text-muted">{c.s}</span>
          </div>
          <div className="curve-track">
            <div className="curve-dot" style={{ transform: on ? 'translateX(calc(min(640px, 60vw) - 28px))' : 'none', transition: `transform ${c.d}ms var(${c.t})` }} />
          </div>
        </div>
      ))}
      <div><Button size="sm" icon={Play} onClick={() => setOn((x) => !x)}>Play</Button></div>
    </div>
  )
}
