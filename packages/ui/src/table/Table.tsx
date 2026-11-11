import { Children, forwardRef, isValidElement, type ButtonHTMLAttributes, type ElementType, type HTMLAttributes, type ReactNode, type TdHTMLAttributes, type ThHTMLAttributes } from 'react'
import { ArrowDown, ArrowUp, Maximize2, type LucideIcon } from 'lucide-react'
import { cx } from '../cx'
import { Skeleton } from '../skeleton/Skeleton'
import { SkeletonRows } from './SkeletonRows'
import { MoreRows } from './MoreRows'

export type TableProps = {
  /** First load: skeleton rows instead of the body and footer. The header stays real, so nothing moves when data arrives. */
  loading?: boolean
  /** How many skeleton rows to show while loading. Roughly what fits on screen. @default 8 */
  rows?: number
  /**
   * More rows exist than are loaded. Three skeleton rows follow the last row; when they scroll into view,
   * `onLoadMore` runs. Leave false (or out) once everything is loaded. Client components only.
   */
  hasMore?: boolean
  /** Fetch and append the next batch (about 50 rows). Called once per batch; scrolling away and back retries a failed one. */
  onLoadMore?: () => void
  /** Shown in place of the rows when the body has none (and nothing is loading). Usually an <Empty>. */
  empty?: ReactNode
} & HTMLAttributes<HTMLTableElement>

type El = ReturnType<typeof Children.toArray>[number]
type Props = { children?: ReactNode; kind?: ColKind; align?: 'left' | 'right' }
const part = (children: ReactNode, tag: string) => Children.toArray(children).find((c) => isValidElement(c) && c.type === tag)

/**
 * A full-bleed grid of records: sticky header, sticky select + first column, hairlines between cells,
 * and a filler column so the grid always reaches the right edge. Compose it from the parts below.
 * One component covers every size: all rows at once, or batches loaded as people scroll (`hasMore`).
 */
export function Table({ loading, rows = 8, hasMore, onLoadMore, empty, children, className, ...rest }: TableProps) {
  const head = part(children, 'thead')
  const body = part(children, 'tbody')
  const cols = columnsOf(head)
  const rowCount = isValidElement<Props>(body) ? Children.toArray(body.props.children).length : 0
  const isEmpty = !loading && !hasMore && empty != null && rowCount === 0
  return (
    <div className={cx('w-table-wrap', className)}>
      <table className="w-table" aria-busy={loading || undefined} aria-rowcount={hasMore ? -1 : undefined} {...rest}>
        {loading ? <>{head}<SkeletonRows cols={cols} rows={rows} /></>
          : isEmpty ? <>{head}<tbody><tr><td className="w-table-empty" colSpan={Math.max(cols.length, 1)}>{empty}</td></tr></tbody></>
          : <>
              {children}
              {hasMore && onLoadMore && <MoreRows cols={cols} batch={rowCount} onLoadMore={onLoadMore} />}
            </>}
      </table>
    </div>
  )
}

type Col = { kind?: ColKind; align?: 'left' | 'right' }

/** Reads the columns off the real header: thead > tr > Th. */
function columnsOf(head: El | null | undefined): Col[] {
  if (!isValidElement<Props>(head)) return []
  const row = Children.toArray(head.props.children).find((c) => isValidElement(c))
  if (!isValidElement<Props>(row)) return []
  return Children.toArray(row.props.children).filter(isValidElement<Props>).map((th) => ({ kind: th.props.kind, align: th.props.align }))
}

/** Column kinds: `select` (checkbox, sticky), `primary` (the record, sticky), `fill` (stretches to the edge). */
export type ColKind = 'select' | 'primary' | 'fill'

export type ThProps = {
  /** lucide icon before the label */
  icon?: LucideIcon
  kind?: ColKind
  /** Clicking sorts by this column. */
  onSort?: () => void
  /** This column is the current sort. */
  sorted?: 'asc' | 'desc'
  /** Right-align numbers. */
  align?: 'left' | 'right'
} & ThHTMLAttributes<HTMLTableCellElement>

export function Th({ icon: Icon, kind, onSort, sorted, align, className, children, ...rest }: ThProps) {
  const Arrow = sorted === 'asc' ? ArrowUp : ArrowDown
  // The fill column is only a spacer: a plain cell hidden from screen readers, not a nameless column header.
  if (kind === 'fill') return <td className={cx('w-col-fill', className)} aria-hidden="true" />
  return (
    <th className={cx(kind && `w-col-${kind}`, onSort && 'w-sortable', className)} data-sorted={sorted} data-align={align}
      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined} onClick={onSort} {...rest}>
      {/* Sortable headers hold a real button, so keyboards can sort too. */}
      {onSort ? (
        <button type="button" className="w-th w-th-btn" onClick={(e) => { e.stopPropagation(); onSort() }}>{Icon && <Icon size={13} aria-hidden />}{children}{sorted && <Arrow size={12} aria-hidden />}</button>
      ) : (
        <span className="w-th">{Icon && <Icon size={13} aria-hidden />}{children}{sorted && <Arrow size={12} aria-hidden />}</span>
      )}
    </th>
  )
}

export type TdProps = { kind?: ColKind; align?: 'left' | 'right' } & TdHTMLAttributes<HTMLTableCellElement>

export function Td({ kind, align, className, ...rest }: TdProps) {
  return <td className={cx(kind && `w-col-${kind}`, className)} data-align={align} {...rest} />
}

export type TrProps = { selected?: boolean } & HTMLAttributes<HTMLTableRowElement>

export function Tr({ selected, className, ...rest }: TrProps) {
  return <tr className={className} data-selected={selected || undefined} aria-selected={selected} {...rest} />
}

export type RecordCellProps = {
  /** A Logo or Avatar */
  lead?: ReactNode
  /** Muted text after the title, e.g. "× Wrapped" */
  sub?: ReactNode
  /** Opens the record. Renders a link when given href. */
  href?: string
  as?: ElementType
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> & (
  | {
      /** The record's name, e.g. the client */
      title: ReactNode
      loading?: false
    }
  | {
      /** Show a logo circle and a name line instead. Needs no title. */
      loading: true
      title?: ReactNode
      /** Width of the name line while loading, px. @default 140 */
      titleWidth?: number
    }
)

/** The primary cell: logo, name and muted context. The whole cell opens the record; ⤢ appears on hover. */
export const RecordCell = forwardRef<HTMLElement, RecordCellProps>(function RecordCell(props, ref) {
  if (props.loading) {
    return (
      <span className={cx('w-record w-record-skel', props.className)} aria-hidden>
        <Skeleton shape="circle" size={20} /><Skeleton width={props.titleWidth ?? 140} />
      </span>
    )
  }
  const { lead, title, sub, href, as, className, loading: _loading, ...rest } = props
  const C: ElementType = as ?? (href ? 'a' : 'button')
  return (
    <C ref={ref} className={cx('w-record', className)} href={href} type={C === 'button' ? 'button' : undefined} {...rest}>
      {lead}
      <span className="w-record-t"><span className="w-record-title">{title}</span>{sub != null && <> <span className="w-record-sub">{sub}</span></>}</span>
      <Maximize2 size={12} className="w-record-open" aria-hidden />
    </C>
  )
})

/** An editable value inside a cell: shows the value, opens a Popover to change it. Use as a Popover trigger. */
export const CellButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function CellButton({ className, ...rest }, ref) {
  return <button ref={ref} type="button" className={cx('w-cell-btn', className)} {...rest} />
})

/** Footer aggregate: "Sum ₹1.2Cr", "Count 28". */
export function Aggregate({ label, children }: { label: ReactNode; children: ReactNode }) {
  return <span className="w-agg"><span>{label}</span> <b>{children}</b></span>
}
