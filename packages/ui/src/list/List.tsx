'use client'
import { Children, useState, type ElementType, type KeyboardEvent, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cx } from '../cx'
import { Skeleton } from '../skeleton/Skeleton'

const fmt = (n: number) => n.toLocaleString('en-IN')

export type ListProps = {
  children?: ReactNode
  /** First load: skeleton rows instead of the groups. */
  loading?: boolean
  /** Skeleton rows while loading. @default 8 */
  rows?: number
  /** Shown when there are no groups or rows (and nothing is loading). Usually an <Empty>. */
  empty?: ReactNode
  className?: string
}

/**
 * Records as rows, usually grouped (by stage, pod, lead). Full-bleed bands for group headers, hairlines between rows.
 * The calm default view for a work queue. Arrow keys (or j / k) move between rows; Enter opens one.
 */
export function List({ children, loading, rows = 8, empty, className }: ListProps) {
  const isEmpty = !loading && empty != null && Children.toArray(children).length === 0
  const move = (e: KeyboardEvent<HTMLDivElement>) => {
    const k = e.key
    if (!['ArrowDown', 'ArrowUp', 'j', 'k'].includes(k)) return
    const t = e.target as HTMLElement
    if (t.closest('input, textarea')) return
    const rowsEls = [...e.currentTarget.querySelectorAll<HTMLElement>('.w-li')]
    if (!rowsEls.length) return
    e.preventDefault()
    const i = rowsEls.indexOf(t.closest('.w-li') as HTMLElement)
    const next = k === 'ArrowDown' || k === 'j' ? Math.min(rowsEls.length - 1, i + 1) : Math.max(0, i - 1)
    rowsEls[next]!.focus()
    rowsEls[next]!.scrollIntoView({ block: 'nearest' })
  }
  return (
    <div className={cx('w-list', className)} onKeyDown={move} aria-busy={loading || undefined}>
      {loading ? (
        <div aria-hidden>
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="w-li w-li-skel">
              <Skeleton shape="circle" size={14} /><Skeleton shape="circle" size={20} />
              <Skeleton width={[170, 120, 200, 140, 180, 110][i % 6]} /><span className="w-li-grow" /><Skeleton width={48} />
            </div>
          ))}
        </div>
      ) : isEmpty ? empty : children}
    </div>
  )
}

export type ListGroupProps = {
  /** A small leading visual: ProgressIcon for a stage, a square Dot for a pod, an Avatar for a lead. */
  icon?: ReactNode
  label: ReactNode
  /** How many rows the group holds (all of them, not just the shown ones). */
  count?: number
  /** Right side of the header, e.g. the group's budget: "₹1.71Cr". */
  aside?: ReactNode
  /** Collapsed groups show only their header. Uncontrolled by default. */
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * Show this many rows, then "Show N more". Big groups stay scannable; one click shows the rest.
   * Leave out to always show every row.
   */
  limit?: number
  /** Rows: ListRow. */
  children: ReactNode
}

/** A group in a List: a header band you can collapse, then its rows. */
export function ListGroup({ icon, label, count, aside, defaultOpen = true, open, onOpenChange, limit, children }: ListGroupProps) {
  const [own, setOwn] = useState(defaultOpen)
  const [all, setAll] = useState(false)
  const isOpen = open ?? own
  const set = (v: boolean) => { if (open == null) setOwn(v); onOpenChange?.(v) }
  const items = Children.toArray(children)
  const shown = limit != null && !all ? items.slice(0, limit) : items
  const hidden = items.length - shown.length
  return (
    <div className="w-lgroup" data-open={isOpen || undefined}>
      <button type="button" className="w-lgroup-h" aria-expanded={isOpen} onClick={() => set(!isOpen)}>
        <ChevronRight size={13} className="w-lgroup-c" aria-hidden />
        {icon}<span className="w-lgroup-l">{label}</span>
        {count != null && <span className="w-lgroup-n">{fmt(count)}</span>}
        {aside != null && <span className="w-lgroup-a">{aside}</span>}
      </button>
      {isOpen && (
        <div className="w-lgroup-rows">
          {shown}
          {hidden > 0 && (
            <button type="button" className="w-li w-li-more" onClick={() => setAll(true)}>
              Show {fmt(hidden)} more
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export type ListRowProps = {
  /** Opens the record. A link when given href. */
  href?: string
  onClick?: () => void
  as?: ElementType
  /** Keyboard cursor or bulk selection. */
  selected?: boolean
  /** Left to right: ProgressIcon, Logo, ListTitle, then ListCells and small visuals (TagList, Track, AvatarGroup). */
  children: ReactNode
  className?: string
}

/** One record in a List. The whole row opens it. */
export function ListRow({ href, onClick, as, selected, children, className }: ListRowProps) {
  const C: ElementType = as ?? (href ? 'a' : 'button')
  return (
    <C className={cx('w-li', className)} href={href} onClick={onClick} type={C === 'button' ? 'button' : undefined} data-selected={selected || undefined}>
      {children}
    </C>
  )
}

/** The row's name: bold title and muted context, truncating together. "Lenskart × Wrapped". Takes the free space. */
export function ListTitle({ title, sub }: { title: ReactNode; sub?: ReactNode }) {
  return <span className="w-li-title"><b>{title}</b>{sub != null && <> <span className="w-li-sub">{sub}</span></>}</span>
}

export type ListCellProps = {
  /** code: a fixed 58px mono ID · num: 60px right-aligned number · date: 44px right-aligned age or date. Fixed widths keep columns aligned down the list. */
  kind: 'code' | 'num' | 'date'
  children: ReactNode
  className?: string
}

/** A fixed-width value in a row, so values line up from row to row like a quiet table. */
export function ListCell({ kind, children, className }: ListCellProps) {
  return <span className={cx('w-li-cell', className)} data-kind={kind}>{children}</span>
}
