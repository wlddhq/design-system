'use client'
import { useEffect, useState } from 'react'
import { useHtmlTheme } from '@/lib/useHtmlTheme'

/** Current computed value of each CSS variable; refreshes when the theme changes. */
function useVars(names: string[]) {
  const { rev } = useHtmlTheme()
  const [vals, setVals] = useState<Record<string, string>>({})
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    setVals(Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(n).trim()])))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rev, names.join()])
  return vals
}

export type TokenRow = { v: string; cls: string; note?: string }

export function ColourTable({ rows }: { rows: TokenRow[] }) {
  const vals = useVars(rows.map((r) => r.v))
  return (
    <div className="tbl-w">
      <table className="tbl">
        <thead><tr><th style={{ width: 52 }} /><th>Token</th><th>Tailwind</th><th>Value</th><th>Use for</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.v}>
              <td><div className="sw" style={{ background: `var(${r.v})` }} /></td>
              <td className="m nm">{r.v}</td>
              <td className="m">{r.cls}</td>
              <td className="m">{vals[r.v] || '…'}</td>
              <td>{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function VarValue({ name }: { name: string }) {
  const vals = useVars([name])
  return <>{vals[name] || '…'}</>
}
