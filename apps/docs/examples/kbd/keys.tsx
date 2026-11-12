import { Kbd } from '@wldd/ui'

/** Written once; shown the way each platform reads it. On a Mac: ⌘K · ⌥1 · ⇧⌘B · C. On Windows: Ctrl K · Alt 1 · Ctrl Shift B · C. */
export default function Keys() {
  return (
    <div className="flex items-center gap-3">
      <Kbd>mod+k</Kbd>
      <Kbd>alt+1</Kbd>
      <Kbd>shift+mod+b</Kbd>
      <Kbd>c</Kbd>
    </div>
  )
}
