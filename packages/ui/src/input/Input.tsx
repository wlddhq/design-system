import { forwardRef, type InputHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cx } from '../cx'
import { Kbd } from '../kbd/Kbd'

export type InputProps = {
  /** Leading lucide icon, e.g. `icon={Search}` */
  icon?: LucideIcon
  /** Shortcut that focuses it, shown at the end, e.g. "/" */
  kbd?: string
  /** Class for the outer field (layout only: width, flex). */
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'>

/** A text field. Sunken at rest, lifts onto the surface when focused. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ icon: Icon, kbd, className, ...rest }, ref) {
  return (
    <label className={cx('w-input', className)}>
      {Icon && <Icon size={15} aria-hidden />}
      <input ref={ref} {...rest} />
      {kbd && <Kbd>{kbd}</Kbd>}
    </label>
  )
})
