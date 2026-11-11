'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import { LayoutGroup, MotionConfig, motion } from 'motion/react'
import { cx } from '../cx'

const fmt = (n: number) => n.toLocaleString('en-IN')
type Key = string | number
type Ctx = { drag: Key | null; setDrag: (k: Key | null) => void; over: Key | null; setOver: (k: Key | null) => void; onMove?: (card: Key, column: Key) => void }
const BoardCtx = createContext<Ctx>({ drag: null, setDrag: () => {}, over: null, setOver: () => {} })
const ColCtx = createContext<Key | null>(null)

export type BoardProps = {
  /** Dragging a card to another column calls this. Leave out for a read-only board. */
  onMove?: (card: Key, column: Key) => void
  /** BoardColumns. */
  children: ReactNode
  className?: string
}

/**
 * Records as cards in columns (kanban), one column per group: stage, pod, lead.
 * Drag a card to move it; it glides to its new place. Columns scroll sideways when they don't fit.
 */
export function Board({ onMove, children, className }: BoardProps) {
  const [drag, setDrag] = useState<Key | null>(null)
  const [over, setOver] = useState<Key | null>(null)
  return (
    <BoardCtx.Provider value={{ drag, setDrag, over, setOver, onMove }}>
      <MotionConfig reducedMotion="user">
        <LayoutGroup>
          <div className={cx('w-board', className)}>{children}</div>
        </LayoutGroup>
      </MotionConfig>
    </BoardCtx.Provider>
  )
}

export type BoardColumnProps = {
  /** The group's key: what onMove receives as the column. */
  id: Key
  icon?: ReactNode
  label: ReactNode
  count?: number
  /** Right side of the header, e.g. the column's budget. */
  aside?: ReactNode
  /** Cards: BoardCard. An empty column stays, so cards can be dropped into it. */
  children?: ReactNode
}

/** One column: a header, then its cards. */
export function BoardColumn({ id, icon, label, count, aside, children }: BoardColumnProps) {
  const b = useContext(BoardCtx)
  const can = !!b.onMove
  return (
    <ColCtx.Provider value={id}>
      <section className="w-board-col" data-over={b.over === id || undefined} aria-label={typeof label === 'string' ? label : undefined}
        onDragOver={(e) => { if (!can || b.drag == null) return; e.preventDefault(); if (b.over !== id) b.setOver(id) }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) b.setOver(null) }}
        onDrop={(e) => { e.preventDefault(); if (b.drag != null) b.onMove?.(b.drag, id); b.setDrag(null); b.setOver(null) }}>
        <header className="w-board-h">
          {icon}<span className="w-board-l">{label}</span>
          {count != null && <span className="w-board-n">{fmt(count)}</span>}
          {aside != null && <span className="w-board-a">{aside}</span>}
        </header>
        <div className="w-board-list">{children}</div>
      </section>
    </ColCtx.Provider>
  )
}

export type BoardCardProps = {
  /** The record's key: what onMove receives as the card. */
  id: Key
  /** Opens the record. */
  href?: string
  onClick?: () => void
  /** Top row, left: the record code ("WL-2421"). */
  code?: ReactNode
  /** Top row, right: usually the lead's Avatar. */
  corner?: ReactNode
  /** A Logo beside the title. */
  lead?: ReactNode
  title: ReactNode
  /** Muted line under the title: the activity. */
  sub?: ReactNode
  /** Small facts that wrap: Chips, a TagList, a ProgressIcon with the stage. */
  meta?: ReactNode
  /** Last line: an AvatarGroup. */
  footer?: ReactNode
}

/** One record on a Board. The whole card opens it; drag it to another column to move it. */
export function BoardCard({ id, href, onClick, code, corner, lead, title, sub, meta, footer }: BoardCardProps) {
  const b = useContext(BoardCtx)
  const C = href ? 'a' : 'button'
  return (
    <motion.div layout="position" layoutId={'w-bc-' + String(id)} transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}>
      <C className="w-bcard" href={href} onClick={onClick} type={C === 'button' ? 'button' : undefined}
        draggable={!!b.onMove} data-dragging={b.drag === id || undefined}
        onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; b.setDrag(id) }}
        onDragEnd={() => { b.setDrag(null); b.setOver(null) }}>
        {(code != null || corner != null) && <span className="w-bcard-top"><span className="w-bcard-code">{code}</span>{corner}</span>}
        <span className="w-bcard-main">
          {lead}
          <span className="w-bcard-t"><b>{title}</b>{sub != null && <span>{sub}</span>}</span>
        </span>
        {meta != null && <span className="w-bcard-meta">{meta}</span>}
        {footer}
      </C>
    </motion.div>
  )
}

/** The column a card sits in, for cards that want to hide what the column already says. */
export const useBoardColumn = () => useContext(ColCtx)
