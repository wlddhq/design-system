'use client'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cx } from '../cx'

const EASE = [0.23, 1, 0.32, 1] as const

export type TextMorphProps = {
  /** The text. When it changes, letters the two words share stay put and the rest blur in and out. */
  children: string | number
  className?: string
}

/** A label that morphs when it changes: "Saving" → "Saved", "Approve" → "Approved". Static on first render. */
export function TextMorph({ children, className }: TextMorphProps) {
  const text = String(children)
  // Reduced motion (the OS setting, or the app's own data-motion): the new label just appears.
  const osReduce = useReducedMotion()
  const reduce = osReduce || (typeof document !== 'undefined' && document.documentElement.dataset.motion === 'reduced')
  const seen: Record<string, number> = {}
  const chars = [...text].map((ch) => { seen[ch] = (seen[ch] || 0) + 1; return { ch, key: ch + seen[ch] } })
  return (
    <span className={cx('w-morph', className)} aria-label={text}>
      <AnimatePresence mode="popLayout" initial={false}>
        {chars.map((c) => (
          <motion.span key={c.key} aria-hidden layout="position"
            initial={{ opacity: 0, filter: 'blur(3px)', y: 2 }} animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }} exit={{ opacity: 0, filter: 'blur(3px)', y: -2 }}
            transition={reduce ? { duration: 0 } : { duration: 0.22, ease: EASE }} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
            {c.ch}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  )
}
