import { Avatar, AvatarGroup } from '@wldd/ui'
import { PEOPLE } from '../data'

export default function People() {
  const all = Object.values(PEOPLE)
  return (
    <>
      <Avatar {...PEOPLE.KM!} size={18} />
      <Avatar {...PEOPLE.ZK!} size={20} />
      <Avatar {...PEOPLE.DM!} size={28} />
      <span className="mx-3 text-faint">·</span>
      <AvatarGroup people={all.slice(0, 3)} />
      <AvatarGroup people={all} max={4} />
    </>
  )
}
