import Link from 'next/link'
import { marked } from 'marked'
import { ALL_PAGES } from '@/lib/nav'
import { tagHref, type Change } from '@/lib/changelog'

const inline = (s: string) => ({ __html: marked.parseInline(s, { async: false }) as string })
const KIND: Record<Change['kind'], string> = { New: 'green', Fixed: 'violet', Changed: 'neutral' }

/** "Table", "Fonts": the name of the page a tag points to. */
const PACKAGES: Record<string, string> = { fonts: 'Fonts', tokens: 'Tokens', tailwind: 'Tailwind theme' }
function tagLabel(tag: string) {
  const href = tagHref(tag)
  if (PACKAGES[tag]) return { href, title: PACKAGES[tag]! }
  return { href, title: ALL_PAGES.find((p) => href.startsWith(p.href) && p.href !== '/')?.title ?? tag[0]!.toUpperCase() + tag.slice(1) }
}

/** One change: its kind, the component it touches (a link), and the line. */
export function ChangeLine({ c, showTag = true }: { c: Change; showTag?: boolean }) {
  const t = c.tag ? tagLabel(c.tag) : null
  return (
    <li className="chg">
      <span className="chg-k" data-tone={KIND[c.kind]}>{c.kind}</span>
      <span className="chg-t">
        {showTag && t && <><Link href={t.href} className="chg-tag">{t.title}</Link> </>}
        <span dangerouslySetInnerHTML={inline(c.text)} />
      </span>
    </li>
  )
}

/** "Updated in 0.1.2", under a component page's title, linking to that release. */
export function UpdatedBadge({ version }: { version: string }) {
  return <Link href={`/changelog#v${version.replace(/\./g, '-')}`} className="chg-badge">Updated in {version}</Link>
}
