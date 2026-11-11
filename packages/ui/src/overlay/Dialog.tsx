'use client'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cx } from '../cx'
import { Button } from '../button/Button'
import { useLayer } from './useLayer'

const EASE = [0.23, 1, 0.32, 1] as const

export type DialogProps = {
  open: boolean
  onClose: () => void
  /** A few words: "Delete campaign?", "New campaign". */
  title: string
  /** One or two sentences under the title: what happens, and whether it can be undone. */
  description?: ReactNode
  /** The form or content. Leave out for a plain confirmation. */
  children?: ReactNode
  /** Buttons, right-aligned: secondary first, then one primary. */
  footer?: ReactNode
  /** px. 420 for a confirmation, 560 for a form. @default 440 */
  width?: number
  className?: string
}

/**
 * A focused question or short form in the centre of the screen, near the top so it grows downward and never jumps.
 * For anything people work in for a while, use a Sheet or a page instead.
 */
export function Dialog({ open, onClose, title, description, children, footer, width = 440, className }: DialogProps) {
  const panel = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const id = useId()
  useEffect(() => setMounted(true), [])
  useLayer(open, onClose, panel)
  if (!mounted) return null
  return createPortal(
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <div className="w-layer w-layer-center">
            <motion.div className="w-scrim-l" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} aria-hidden />
            <motion.div ref={panel} className={cx('w-dialog', className)} style={{ width }} role="dialog" aria-modal="true"
              aria-labelledby={id + 't'} aria-describedby={description ? id + 'd' : undefined} tabIndex={-1}
              initial={{ opacity: 0, scale: 0.97, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.14 } }} transition={{ duration: 0.2, ease: EASE }}>
              <header className="w-dialog-h">
                <h2 id={id + 't'}>{title}</h2>
                <Button size="sm" variant="ghost" icon={X} aria-label="Close" onClick={onClose} />
              </header>
              {description != null && <p id={id + 'd'} className="w-dialog-d">{description}</p>}
              {children != null && <div className="w-dialog-b">{children}</div>}
              {footer != null && <footer className="w-dialog-f">{footer}</footer>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MotionConfig>,
    document.body,
  )
}
