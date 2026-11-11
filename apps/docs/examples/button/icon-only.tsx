import { X, CalendarClock, Palette } from 'lucide-react'
import { Button } from '@wldd/ui'

export default function IconOnly() {
  return (
    <>
      <Button size="sm" icon={X} aria-label="Reject" />
      <Button size="sm" icon={CalendarClock} aria-label="Reschedule" />
      <Button size="sm" variant="ghost" icon={Palette} aria-label="Appearance" />
    </>
  )
}
