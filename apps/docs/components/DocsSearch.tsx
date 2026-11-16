'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button, CommandMenu, CommandGroup, CommandItem } from '@wldd/ui'
import { NAV } from '@/lib/nav'

/** Words people use for a component that its name doesn't say. */
const ALSO: Record<string, string[]> = {
  '/components/popover': ['dropdown', 'menu', 'panel', 'filter'],
  '/components/dialog': ['modal', 'confirm', 'alert'],
  '/components/sheet': ['drawer', 'side panel', 'slide over'],
  '/components/toast': ['snackbar', 'notification', 'message'],
  '/components/command': ['search', 'palette', 'cmdk', 'ctrl k'],
  '/components/select': ['dropdown', 'picker', 'combobox'],
  '/components/input': ['text field', 'search', 'textbox'],
  '/components/form': ['field', 'label', 'validation'],
  '/components/chip': ['badge', 'pill', 'tag', 'label'],
  '/components/tabs': ['segmented', 'toggle', 'switcher'],
  '/components/table': ['grid', 'rows', 'data table'],
  '/components/card': ['tile', 'grid'],
  '/components/metric': ['kpi', 'stat', 'number'],
  '/components/chart': ['graph', 'bar', 'line', 'donut'],
  '/components/loader': ['spinner', 'loading'],
  '/components/skeleton': ['placeholder', 'loading'],
  '/components/shell': ['layout', 'sidebar', 'top bar', 'page'],
  '/components/switch': ['toggle'],
  '/components/progress': ['stage', 'status icon'],
  '/components/avatar': ['user', 'profile picture'],
  '/components/empty': ['no results', 'blank state'],
  '/components/selection': ['bulk', 'bar'],
  '/components/record': ['detail', 'page'],
}

export function DocsSearch() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  return (
    <>
      <Button size="sm" variant="ghost" icon={Search} kbd="mod+k" aria-label="Search the docs" onClick={() => setOpen(true)}>Search</Button>
      <CommandMenu open={open} onOpenChange={setOpen} placeholder="Search components, foundations, guides…" label="Search the docs">
        {NAV.map((g) => (
          <CommandGroup key={g.id} heading={g.label}>
            {g.pages.map((p) => (
              <CommandItem key={p.href} value={`${g.label} ${p.title}`} icon={g.icon} keywords={ALSO[p.href]} onSelect={() => router.push(p.href)}>
                {p.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandMenu>
    </>
  )
}
