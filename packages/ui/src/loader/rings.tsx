// @ts-nocheck — ported verbatim from the dms-play loaders (Ring and Notch; the rest were retired) so the motion stays identical. The typed API is Loader.tsx.
'use client'
import { useEffect, useState } from 'react'
import { motion, animate, useMotionValue } from 'motion/react'

const EASE = [0.23, 1, 0.32, 1]

/* Brand sequence, in logo order: W L D D. */
export const C = ['#72CE85', '#D37AF4', '#ED4C6F', '#F2C92D']
const G = C[0]
const MORPH = { duration: 0.5, ease: EASE }

function useTick(ms, on) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) return
    const t = setInterval(() => setN((x) => x + 1), ms)
    return () => clearInterval(t)
  }, [ms, on])
  return n
}

const Svg = ({ size, children }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className="ld-svg">{children}</svg>

/* ─────────────────── Ring ─────────────────── */

/** Ring — four arcs chase round a circle, stretching and shrinking; done closes them into one green ring. */
function Ring({ size, done }) {
  const rot = useMotionValue(0)
  useEffect(() => {
    if (done) { animate(rot, Math.ceil(rot.get() / 90) * 90 + 90, { duration: 0.6, ease: EASE }); return }
    rot.set(rot.get() % 360)
    const c = animate(rot, [rot.get(), rot.get() + 360], { duration: 1.3, ease: 'linear', repeat: Infinity })
    return () => c.stop()
  }, [done, rot])
  return (
    <Svg size={size}>
      <motion.g style={{ rotate: rot, originX: '12px', originY: '12px', transformBox: 'view-box' }}>
        {C.map((c, i) => (
          <motion.circle key={i} cx="12" cy="12" r="8" pathLength="100" strokeWidth="2.6" strokeLinecap="round"
            transform={`rotate(${i * 90 - 90} 12 12)`} initial={{ strokeDasharray: '3 97', stroke: c }}
            animate={done ? { strokeDasharray: '25 75', stroke: G } : { strokeDasharray: ['3 97', '17 83', '3 97'], stroke: c }}
            transition={done ? MORPH : { strokeDasharray: { duration: 1.3, ease: 'easeInOut', repeat: Infinity, delay: i * 0.16 }, stroke: MORPH }} />
        ))}
      </motion.g>
      <motion.path d="M8 12.4l2.7 2.7L16 9.6" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={false} animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }} transition={{ duration: 0.32, ease: EASE, delay: done ? 0.3 : 0 }} />
    </Svg>
  )
}

const ORIGIN = { originX: '12px', originY: '12px', transformBox: 'view-box' }
const RingCheck = ({ done, delay = 0.3 }) => (
  <motion.path d="M8 12.4l2.7 2.7L16 9.6" stroke={G} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    initial={false} animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }} transition={{ duration: 0.32, ease: EASE, delay: done ? delay : 0 }} />
)
/** Arc on the r=8 track, starting at 12 o'clock. pathLength 100 so dash values are percentages. */
const arc = { cx: 12, cy: 12, r: 8, pathLength: 100, strokeWidth: 2.6, strokeLinecap: 'round', transform: 'rotate(-90 12 12)' }

/** Notch — four fixed segments; the ring clicks round a quarter at a time and the gaps breathe on each click. */
function Notch({ size, done }) {
  const n = useTick(560, !done)
  const len = done ? 25 : n % 2 ? 13 : 19
  return (
    <Svg size={size}>
      <motion.g initial={false} animate={{ rotate: n * 90 }} transition={{ type: 'spring', stiffness: 320, damping: 17 }} style={ORIGIN}>
        {C.map((c, i) => (
          <motion.circle key={i} {...arc} transform={`rotate(${i * 90 - 90} 12 12)`} initial={false}
            animate={{ strokeDasharray: `${len} ${100 - len}`, strokeDashoffset: done ? 0 : -(25 - len) / 2, stroke: done ? G : c }}
            transition={MORPH} />
        ))}
      </motion.g>
      <RingCheck done={done} />
    </Svg>
  )
}

export { Ring, Notch }
