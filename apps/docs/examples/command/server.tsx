'use client'
import { useEffect, useState } from 'react'
import { Search, Megaphone } from 'lucide-react'
import { Button, CommandMenu, CommandGroup, CommandItem } from '@wldd/ui'
import { CAMPAIGNS } from '../data'

/** Searching on a server: filter={false}, the query is yours, only matches are passed in, loading while they arrive. */
export default function Server() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [hits, setHits] = useState(CAMPAIGNS.slice(0, 5))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => { // stands in for fetch(`/api/search?q=${q}`)
      const s = q.trim().toLowerCase()
      setHits(CAMPAIGNS.filter((c) => !s || `${c.client} ${c.activity} ${c.code}`.toLowerCase().includes(s)).slice(0, 8))
      setLoading(false)
    }, 450)
    return () => clearTimeout(t)
  }, [q])

  return (
    <>
      <Button icon={Search} onClick={() => setOpen(true)}>Search all campaigns</Button>
      <CommandMenu open={open} onOpenChange={setOpen} hotkey={false} filter={false} search={q} onSearchChange={setQ} loading={loading} placeholder="Search 2,400 campaigns…">
        {hits.length > 0 && (
          <CommandGroup heading={q ? 'Matches' : 'Recent'}>
            {hits.map((c) => <CommandItem key={c.id} value={c.id} icon={Megaphone} meta={c.code} onSelect={() => {}}>{c.client} × {c.activity}</CommandItem>)}
          </CommandGroup>
        )}
      </CommandMenu>
    </>
  )
}
