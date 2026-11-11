'use client'
import { Toaster as Sonner, toast } from 'sonner'

/**
 * Put one <Toaster /> at the root of the app (layout.tsx). Then call `toast()` from anywhere:
 *   toast('Moved to Activation', { description: 'Zepto × Always-on Q4', action: { label: 'Undo', onClick: undo } })
 *   toast.success('Campaign created')   toast.error('Couldn’t sync Tally')
 * Bottom right, three at most, gone after about three seconds. Hovering keeps them.
 */
export function Toaster() {
  return <Sonner position="bottom-right" offset={20} gap={8} visibleToasts={3} duration={3200} className="w-toaster" />
}

export { toast }
