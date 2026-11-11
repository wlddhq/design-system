import { Sparkline } from '@wldd/ui'

export default function Trend() {
  return (
    <div className="flex items-center gap-8">
      <div className="grid gap-1"><span className="text-xs text-muted">Views · live</span><Sparkline data={[12, 18, 15, 26, 31, 29, 44, 52]} width={140} height={36} tone="green" /></div>
      <div className="grid gap-1"><span className="text-xs text-muted">Replies · quiet</span><Sparkline data={[9, 8, 10, 7, 8, 6, 7, 6]} width={140} height={36} /></div>
    </div>
  )
}
