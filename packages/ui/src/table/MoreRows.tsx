'use client'
import { useEffect, useRef } from 'react'
import { SkeletonRows, type SkeletonCol } from './SkeletonRows'

/**
 * Three skeleton rows after the last real row. When they scroll into view, the next batch loads.
 * - Asks once per batch: `batch` (the row count) changing re-arms it.
 * - Still in view after a batch lands (a short page)? It asks again straight away, until the view is full.
 * - A failed request leaves the row count unchanged; scrolling away and back asks again.
 */
export function MoreRows({ cols, batch, onLoadMore }: { cols: SkeletonCol[]; batch: number; onLoadMore: () => void }) {
  const ref = useRef<HTMLTableSectionElement>(null)
  const asked = useRef(false)
  const load = useRef(onLoadMore)
  load.current = onLoadMore

  useEffect(() => {
    asked.current = false
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e) return
      if (!e.isIntersecting) { asked.current = false; return }
      if (asked.current) return
      asked.current = true
      load.current()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [batch])

  return <SkeletonRows tbodyRef={ref} cols={cols} rows={3} from={batch} />
}
