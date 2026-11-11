'use client'
import { Bell, Search, SlidersHorizontal } from 'lucide-react'
import { Button, Tooltip } from '@wldd/ui'

export default function Icons() {
  return (
    <>
      <Tooltip label="Search" kbd="⌘K"><Button variant="ghost" icon={Search} aria-label="Search" /></Tooltip>
      <Tooltip label="Notifications"><Button variant="ghost" icon={Bell} aria-label="Notifications" dot /></Tooltip>
      <Tooltip label="Display options" kbd="⇧⌘B"><Button size="sm" icon={SlidersHorizontal}>Display</Button></Tooltip>
    </>
  )
}
