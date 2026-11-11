'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

/** "On this page": the page's h2s, with the one you're reading marked. Instant, no sliding marker. */
export function Toc() {
  const path = usePathname()
  const [items, setItems] = useState<{ id: string; text: string }[]>([])
  const [active, setActive] = useState('')

  useEffect(() => {
    const hs = [...document.querySelectorAll<HTMLHeadingElement>('.doc h2[id]')]
    setItems(hs.map((h) => ({ id: h.id, text: h.textContent ?? '' })))
    const scroller = document.getElementById('scroller')
    if (!scroller) return
    const onScroll = () => {
      const top = scroller.getBoundingClientRect().top + 96
      let cur = hs[0]?.id ?? ''
      for (const h of hs) if (h.getBoundingClientRect().top <= top) cur = h.id
      if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4) cur = hs[hs.length - 1]?.id ?? cur
      setActive(cur)
    }
    onScroll()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [path])

  if (items.length < 2) return <aside className="toc" />
  return (
    <aside className="toc" aria-label="On this page">
      <div className="toc-h">On this page</div>
      {items.map((it) => (
        <a key={it.id} href={'#' + it.id} className={active === it.id ? 'on' : ''}
          onClick={(e) => { e.preventDefault(); document.getElementById(it.id)?.scrollIntoView({ block: 'start' }); history.replaceState(null, '', '#' + it.id) }}>
          {it.text}
        </a>
      ))}
    </aside>
  )
}
