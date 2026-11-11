import Link from 'next/link'
import type { ReactNode } from 'react'
import { ALL_PAGES, findPage } from '@/lib/nav'
import { Toc } from './Toc'

/** A docs page: title, one-line lead, body, then previous / next. "On this page" is built from the h2s. */
export function DocPage({ href, lead, wide, hero, children }: { href: string; lead?: ReactNode; wide?: boolean; hero?: ReactNode; children: ReactNode }) {
  const page = findPage(href)
  const i = ALL_PAGES.findIndex((p) => p.href === href)
  const prev = ALL_PAGES[i - 1]
  const next = ALL_PAGES[i + 1]
  return (
    <div className="d-page" style={wide ? { maxWidth: 1360 } : undefined}>
      <div className={'doc-grid' + (wide ? ' wide' : '')}>
        <article className="doc">
          {hero && <div className="doc-hero">{hero}</div>}
          <h1 className="d-h1">{page?.title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
          <nav className="pn" aria-label="Pages">
            {prev && <Link href={prev.href}><span>Previous</span>{prev.title}</Link>}
            {next && <Link href={next.href} className="nx"><span>Next</span>{next.title}</Link>}
          </nav>
        </article>
        <Toc />
      </div>
    </div>
  )
}

const slug = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function H2({ children, id }: { children: string; id?: string }) {
  return <h2 id={id ?? slug(children)}>{children}</h2>
}
