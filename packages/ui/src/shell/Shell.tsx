import type { CSSProperties, ElementType, ReactNode } from 'react'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { cx } from '../cx'
import type { Tone } from '../chip/Chip'

/** Sidebar counts are a nudge, not a ledger: 99+ past 99. */
const badge = (n: number) => (n > 99 ? '99+' : n)

const TONE: Record<Tone | 'fg', string> = { fg: 'var(--fg)', neutral: 'var(--muted)', green: 'var(--green)', violet: 'var(--violet)', pink: 'var(--pink)', yellow: 'var(--yellow)' }

/* ───────── Sidebar ───────── */

export function Sidebar({ children, className }: { children: ReactNode; className?: string }) {
  return <aside className={cx('w-side', className)}>{children}</aside>
}

/** Logo on the left, small ghost tools (theme, collapse) on the right. */
export function SidebarHeader({ logo, children }: { logo: ReactNode; children?: ReactNode }) {
  return <div className="w-side-head">{logo}{children && <span className="w-side-tools">{children}</span>}</div>
}

/** The scrolling middle. Header and footer stay put. */
export function SidebarBody({ children }: { children: ReactNode }) {
  return <div className="w-side-body"><nav className="w-side-nav">{children}</nav></div>
}

/** A workspace's icon: the lucide outline on a neutral tile, its colour only in the stroke. */
export function IconTile({ icon: Icon, tone = 'fg', size = 24 }: { icon: LucideIcon; tone?: Tone | 'fg'; size?: number }) {
  return (
    <span className="w-tile" style={{ '--rc': TONE[tone], width: size, height: size } as CSSProperties}>
      <Icon size={Math.round(size * 0.62)} strokeWidth={2.25} aria-hidden />
    </span>
  )
}

type Linkish = { href?: string; as?: ElementType; onClick?: () => void }

export type SidebarGroupProps = {
  icon: LucideIcon
  /** The workspace's colour. Pod green, Finance violet, Sales yellow, Creators pink. @default 'fg' */
  tone?: Tone | 'fg'
  label: ReactNode
  /** Shown when closed: the group's pending total. */
  count?: number
  /** Open groups show their pages as a tree. */
  open?: boolean
  /** Pages: SidebarItems. */
  children?: ReactNode
} & Linkish

/** A workspace in the stacked sidebar: icon tile, name, and its pages in a tree when open. */
export function SidebarGroup({ icon, tone = 'fg', label, count, open, children, href, as, onClick }: SidebarGroupProps) {
  const C: ElementType = as ?? (href ? 'a' : 'button')
  return (
    <div className="w-side-group" data-open={open || undefined}>
      <C className="w-side-head-btn" href={href} onClick={onClick} type={C === 'button' ? 'button' : undefined} aria-expanded={open}>
        <IconTile icon={icon} tone={tone} />
        <span className="w-side-label">{label}</span>
        {!open && count != null && count > 0 && <span className="w-side-n">{badge(count)}</span>}
      </C>
      {open && children && <div className="w-side-sub"><div className="w-side-tree">{children}</div></div>}
    </div>
  )
}

export type SidebarItemProps = {
  icon?: LucideIcon
  /** A visual instead of an icon: a 16px Logo for pinned records. */
  lead?: ReactNode
  active?: boolean
  count?: number
  children: ReactNode
} & Linkish

/** A page in the sidebar. Active is an instant fill; navigation never animates. */
export function SidebarItem({ icon: Icon, lead, active, count, children, href, as, onClick }: SidebarItemProps) {
  const C: ElementType = as ?? (href ? 'a' : 'button')
  return (
    <C className="w-side-item" href={href} onClick={onClick} type={C === 'button' ? 'button' : undefined}
      data-active={active || undefined} aria-current={active ? 'page' : undefined}>
      {Icon ? <Icon size={15} aria-hidden /> : lead}
      <span className="w-side-label">{children}</span>
      {count != null && count > 0 && <span className="w-side-n">{badge(count)}</span>}
    </C>
  )
}

/** A labelled block of items ("Pinned"). `bottom` pins it to the foot of the scroll area. */
export function SidebarSection({ label, bottom, children }: { label: ReactNode; bottom?: boolean; children: ReactNode }) {
  return (
    <div className="w-side-sec" data-bottom={bottom || undefined}>
      <div className="w-side-sec-l">{label}</div>
      {children}
    </div>
  )
}

/** Person and settings at the foot of the sidebar. */
export function SidebarFooter({ children }: { children: ReactNode }) {
  return <div className="w-side-foot">{children}</div>
}

/* ───────── Main panel ───────── */

/** The 44px bar at the top of the main panel. It owns the page title; pages don't repeat it. */
export function TopBar({ children }: { children: ReactNode }) {
  return <header className="w-top">{children}</header>
}

export type TopBarTitleProps = {
  icon?: LucideIcon
  title: ReactNode
  /** Live count beside the title: "Campaigns 28". */
  count?: number
  /** On a record page: the record's code after a chevron. The title then links back. */
  detail?: ReactNode
  href?: string
  as?: ElementType
}

export function TopBarTitle({ icon: Icon, title, count, detail, href, as }: TopBarTitleProps) {
  if (detail != null) {
    const C: ElementType = as ?? 'a'
    return (
      <div className="w-crumb">
        <C href={href} className="w-crumb-link">{Icon && <Icon size={15} aria-hidden />}<span className="w-crumb-t">{title}</span></C>
        <ChevronRight size={13} className="w-crumb-sep" aria-hidden />
        <span className="w-crumb-cur w-crumb-code">{detail}</span>
      </div>
    )
  }
  return (
    <div className="w-crumb">
      <span className="w-crumb-cur">{Icon && <Icon size={15} className="w-crumb-ic" aria-hidden />}<span className="w-crumb-t">{title}</span>{count != null && <span className="w-crumb-n">{count.toLocaleString('en-IN')}</span>}</span>
    </div>
  )
}

/** Right side of the TopBar: ghost icon buttons, then at most one primary. */
export function TopBarActions({ children }: { children: ReactNode }) {
  return <div className="w-top-r">{children}</div>
}

/** The 44px view bar under the TopBar: view tabs on the left, filter and display on the right. */
export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="w-toolbar">{children}</div>
}

/** Pushes what follows to the right edge of a TopBar or Toolbar. */
export const Spacer = () => <span className="w-spacer" />

/** The scrolling area of the main panel. Tables go straight in; pages go in a Page. */
export function PageScroll({ children }: { children: ReactNode }) {
  return <div className="w-scroll">{children}</div>
}

/** Centred page content. Max 1120px, or 1360px when wide. */
export function Page({ wide, children, className }: { wide?: boolean; children: ReactNode; className?: string }) {
  return <div className={cx('w-page', className)} data-wide={wide || undefined}>{children}</div>
}
