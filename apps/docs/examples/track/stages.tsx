import { Track, Tooltip } from '@wldd/ui'
import { STAGES } from '../data'

export default function Stages() {
  return (
    <div className="grid gap-3">
      {[0, 2, 4, 6].map((s) => (
        <div key={s} className="flex items-center gap-4">
          <Tooltip label={STAGES[s]}><Track value={s} label={STAGES[s]} /></Tooltip>
          <span className="text-sm text-fg-2">{STAGES[s]}</span>
        </div>
      ))}
    </div>
  )
}
