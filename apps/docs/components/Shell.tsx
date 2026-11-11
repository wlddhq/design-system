'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Menu, Moon, Sun } from 'lucide-react'
import { Button } from '@wldd/ui'
import { NAV, findPage } from '@/lib/nav'
import { ThemeProvider, useTheme } from '@/lib/theme'
import { useHtmlTheme } from '@/lib/useHtmlTheme'
import { Appearance } from './Appearance'
import { WlddMark } from './WlddMark'

const OPEN_KEY = 'wldd-docs-open-groups'

export function Shell({ children }: { children: ReactNode }) {
  return <ThemeProvider><Frame>{children}</Frame></ThemeProvider>
}

function Frame({ children }: { children: ReactNode }) {
  const path = usePathname()
  const page = findPage(path)
  const [open, setOpen] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)

  // New page: close the drawer and start at the top (the scroller is ours, not the window).
  useEffect(() => {
    setOpen(false)
    if (!window.location.hash) scroller.current?.scrollTo({ top: 0 })
  }, [path])

  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])

  const G = page?.group
  return (
    <div className="d">
      <Sidebar path={path} open={open} />
      <div className={'m-scrim' + (open ? ' open' : '')} onClick={() => setOpen(false)} />
      <main className="d-main">
        <header className="d-top">
          <Button className="m-menu" variant="ghost" icon={Menu} aria-label="Menu" onClick={() => setOpen(true)} />
          {G && (
            <Link href={G.pages[0].href} className="d-crumb">
              <G.icon size={15} />
              <span className="cur">{G.label}</span>
            </Link>
          )}
        </header>
        <div className="d-scroll" ref={scroller} id="scroller">{children}</div>
      </main>
    </div>
  )
}

function Sidebar({ path, open }: { path: string; open: boolean }) {
  const { setTheme } = useTheme()
  const { dark } = useHtmlTheme()
  const current = findPage(path)?.group.id
  // Groups open and close independently. The current page's group always opens; the rest is remembered.
  const [expanded, setExpanded] = useState<string[]>(current ? [current] : [])
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(OPEN_KEY) || '[]') as string[]
      if (saved.length) setExpanded((e) => [...new Set([...saved, ...e])])
    } catch {}
  }, [])
  useEffect(() => { if (current) setExpanded((e) => (e.includes(current) ? e : [...e, current])) }, [current])
  const toggle = (id: string) => setExpanded((e) => {
    const next = e.includes(id) ? e.filter((x) => x !== id) : [...e, id]
    try { localStorage.setItem(OPEN_KEY, JSON.stringify(next)) } catch {}
    return next
  })

  return (
    <aside className={'d-side sb-stack' + (open ? ' open' : '')}>
      <div className="d-brand">
        <Link href="/" aria-label="WLDD Library home">
          <WlddMark height={26} />
        </Link>
        <span className="sb-tools">
          <Button size="sm" variant="ghost" icon={dark ? Sun : Moon} aria-label={dark ? 'Light mode' : 'Dark mode'}
            onClick={() => setTheme({ mode: dark ? 'light' : 'dark' })} />
        </span>
      </div>

      <div className="sb-scroll">
        <nav className="d-nav">
          {NAV.map((g) => {
            const on = expanded.includes(g.id)
            return (
              <div key={g.id} className={'sb-ws-g' + (on ? ' on' : '')} style={{ '--rc': g.color } as CSSProperties}>
                <button type="button" className="sb-wsh" aria-expanded={on} onClick={() => toggle(g.id)}>
                  <span className="role-ic"><g.icon size={15} strokeWidth={2.25} /></span>
                  <span className="grow ell">{g.label}</span>
                  {!on && <span className="n num">{g.pages.length}</span>}
                </button>
                {on && (
                  <div className="sb-sub">
                    <div className="sb-tree">
                      {g.pages.map((p) => (
                        <Link key={p.href} href={p.href} className={'d-item' + (p.href === path ? ' on' : '')} aria-current={p.href === path ? 'page' : undefined}>
                          <span className="ell">{p.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      <div className="d-side-f">
        <span className="d-ver grow">v0.0.1</span>
        <Appearance />
      </div>
    </aside>
  )
}
