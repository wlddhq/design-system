import { ProgressIcon } from '@wldd/ui'
import { STAGES, stageTone } from '../data'

export default function Stages() {
  return (
    <div className="grid gap-2">
      {STAGES.map((label, i) => (
        <span key={label} className="flex items-center gap-1.5 text-fg">
          <ProgressIcon value={i} tone={stageTone(i)} />{label}
        </span>
      ))}
    </div>
  )
}
