import type { Ref } from 'react'
import { Skeleton } from '../skeleton/Skeleton'

export type SkeletonCol = { kind?: 'select' | 'primary' | 'fill'; align?: 'left' | 'right' }

/* Varied, repeatable widths so rows read like text, not a barcode. */
const TEXT = [72, 48, 96, 60, 84, 40, 66]
const NAME = [150, 112, 176, 128, 160, 96]

/** Skeleton rows shaped like the real columns. Used for the first load and for "loading more". */
export function SkeletonRows({ cols, rows, from = 0, tbodyRef }: { cols: SkeletonCol[]; rows: number; from?: number; tbodyRef?: Ref<HTMLTableSectionElement> }) {
  return (
    <tbody ref={tbodyRef} className="w-table-skel" aria-hidden>
      {Array.from({ length: rows }, (_, i) => {
        const r = from + i
        return (
          <tr key={i}>
            {cols.map(({ kind, align }, c) => (
              <td key={c} className={kind && `w-col-${kind}`} data-align={align}>
                {kind === 'select' ? <Skeleton shape="block" className="w-skel-check" />
                  : kind === 'primary' ? <span className="w-record w-record-skel"><Skeleton shape="circle" size={20} /><Skeleton width={NAME[r % NAME.length]} /></span>
                  : kind === 'fill' ? null
                  : <Skeleton width={TEXT[(r * 3 + c * 5) % TEXT.length]} />}
              </td>
            ))}
          </tr>
        )
      })}
    </tbody>
  )
}
