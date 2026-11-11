import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cx } from '../cx'
import { Kbd } from '../kbd/Kbd'

export type ButtonVariant = 'secondary' | 'primary' | 'ghost'
export type ButtonSize = 'md' | 'sm'

type Common = {
  /**
   * secondary for most actions · primary for the one main action on a view · ghost for toolbars
   * @default 'secondary'
   */
  variant?: ButtonVariant
  /**
   * md for page actions · sm inside rows, cards and dense toolbars
   * @default 'md'
   */
  size?: ButtonSize
  /** A lucide icon component, e.g. `icon={Plus}`. Placed before the label. */
  icon?: LucideIcon
  /** Keyboard shortcut hint shown after the label, e.g. `kbd="C"` */
  kbd?: ReactNode
  /** A small pink dot in the corner: something new (notifications). */
  dot?: boolean
  /** Toggle state for toolbar buttons (sets aria-pressed) */
  pressed?: boolean
  /** Renders an <a> instead of a <button>. */
  href?: string
  /** For layout only (margins, width). Never colours or radii. */
  className?: string
}

/** Icon-only buttons must say what they do. */
type Labelled = { children: ReactNode } | { children?: undefined; 'aria-label': string }

type AsButton = Common & Labelled & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { href?: undefined }
type AsLink = Common & Labelled & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { href: string }
export type ButtonProps = AsButton | AsLink

const ICON = { md: 15, sm: 14 } as const

/**
 * The only button in WLDD. Renders <a> when given `href`, otherwise <button type="button">.
 * Never style a raw <button>; pick a variant instead.
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(props, ref) {
  const { variant = 'secondary', size = 'md', icon: Icon, kbd, dot, pressed, className, children, ...rest } = props
  const iconOnly = children == null
  const cls = cx('w-btn', className)
  const data = {
    'data-variant': variant,
    'data-size': size,
    'data-icon-only': iconOnly || undefined,
    'aria-pressed': pressed,
  }
  const inner = (
    <>
      {Icon && <Icon size={ICON[size]} aria-hidden />}
      {typeof children === 'string' ? <span className="w-btn-t">{children}</span> : children}
      {kbd != null && <Kbd>{kbd}</Kbd>}
      {dot && <i className="w-btn-dot" aria-hidden />}
    </>
  )
  if ('href' in rest && rest.href != null) {
    return <a ref={ref as React.Ref<HTMLAnchorElement>} className={cls} {...data} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{inner}</a>
  }
  const { type = 'button', ...btn } = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return <button ref={ref as React.Ref<HTMLButtonElement>} type={type} className={cls} {...data} {...btn}>{inner}</button>
})
