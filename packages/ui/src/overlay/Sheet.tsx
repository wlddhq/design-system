'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cx } from '../cx'
import { Button } from '../button/Button'
import { useLayer } from './useLayer'

const EASE = [0.23, 1, 0.32, 1] as const
const DRAWER = [0.32, 0.72, 0, 1] as const

export type SheetProps = {
  open: boolean
  onClose: () => void
  /** Names the panel for screen readers. Usually the record's name. */
  label: string
  /** px. 460 for a record peek, 560 for a form. Phones use the whole screen. @default 460 */
  width?: number
  children: ReactNode
  className?: string
}

/**
 * A panel that slides in from the right over the page: a record's peek, a quick form.
 * The page stays where it was underneath. Escape, the ×, or a click on the dimmed page closes it.
 */
export function Sheet({ open, onClose, label, width = 460, children, className }: SheetProps) {
  const panel = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  useLayer(open, onClose, panel)
  if (!mounted) return null
  return createPortal(
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <div className="w-layer">
            <motion.div className="w-scrim-l" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} aria-hidden />
            <motion.aside ref={panel} className={cx('w-sheet', className)} style={{ width }} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%', transition: { duration: 0.22, ease: EASE } }} transition={{ duration: 0.36, ease: DRAWER }}>
              <Button size="sm" variant="ghost" icon={X} aria-label="Close" className="w-sheet-x" onClick={onClose} />
              {children}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </MotionConfig>,
    document.body,
  )
}
