import { Avatar, RecordCell, Skeleton } from '@wldd/ui'

export default function Pieces() {
  return (
    <div className="grid w-full max-w-md gap-5">
      {/* Components with a loading prop: same size and layout as the real thing */}
      <div className="flex items-center gap-4">
        <Avatar loading size={18} />
        <Avatar loading size={20} />
        <Avatar loading size={28} />
        <div className="w-56"><RecordCell loading /></div>
      </div>

      {/* Skeleton directly, for content without a loading prop yet: a metric card */}
      <div className="grid gap-2.5 rounded-card border border-line p-4">
        <Skeleton width={84} />
        <Skeleton width={140} height={22} />
        <Skeleton shape="block" height={48} />
      </div>
    </div>
  )
}
