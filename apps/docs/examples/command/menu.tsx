'use client'
import { useState } from 'react'
import { House, Megaphone, Building2, ListChecks, Settings, Plus, Moon, Sun, Users, Search } from 'lucide-react'
import { Button, CommandMenu, CommandGroup, CommandItem, Kbd, ProgressIcon, Logo, toast, Toaster } from '@wldd/ui'
import { CAMPAIGNS, stageTone, logo } from '../data'

/** The app's one menu (⌘K on a Mac, Ctrl K on Windows). In an app, leave hotkey on; this page keeps the key for its own search. */
export default function Menu() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const go = (to: string) => toast(`Opened ${to}`)
  return (
    <>
      <Button icon={Search} onClick={() => setOpen(true)}>Search <Kbd>mod+k</Kbd></Button>
      <CommandMenu open={open} onOpenChange={setOpen} hotkey={false} placeholder="Search campaigns, clients, or type a command…">
        <CommandGroup heading="Go to">
          <CommandItem icon={House} shortcut="alt+0" onSelect={() => go('Home')}>Home</CommandItem>
          <CommandItem icon={Megaphone} shortcut="alt+1" onSelect={() => go('Campaigns')}>Campaigns</CommandItem>
          <CommandItem icon={ListChecks} shortcut="alt+2" onSelect={() => go('Tasks')}>Tasks</CommandItem>
          <CommandItem icon={Building2} shortcut="alt+3" onSelect={() => go('Clients')}>Clients</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Campaigns">
          {CAMPAIGNS.map((c) => (
            <CommandItem key={c.id} keywords={[c.code]} icon={<ProgressIcon value={c.stage} tone={stageTone(c.stage)} />} meta={c.code} onSelect={() => go(`${c.client} × ${c.activity}`)}>
              {c.client} × {c.activity}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Clients">
          {CAMPAIGNS.slice(0, 6).map((c) => (
            <CommandItem key={c.id} value={'client ' + c.client} icon={<Logo name={c.client} src={logo(c.domain)} size={16} />} onSelect={() => go(c.client)}>{c.client}</CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem icon={Plus} shortcut="C" onSelect={() => go('New campaign')}>New campaign</CommandItem>
          <CommandItem icon={Users} onSelect={() => go('Switch to BD')}>Switch to BD</CommandItem>
          <CommandItem icon={Settings} meta="Settings" onSelect={() => go('Notifications')}>Notifications</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Theme">
          <CommandItem icon={Sun} checked={theme === 'light'} keepOpen onSelect={() => setTheme('light')}>Light</CommandItem>
          <CommandItem icon={Moon} checked={theme === 'dark'} keepOpen onSelect={() => setTheme('dark')}>Dark</CommandItem>
        </CommandGroup>
      </CommandMenu>
      <Toaster />
    </>
  )
}
