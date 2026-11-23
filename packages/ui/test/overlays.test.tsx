import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { House, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  Button, CommandGroup, CommandItem, CommandMenu, Dialog, MenuItem, Popover, Select, Sheet, Tooltip,
} from '@wldd/ui'
import { a11y } from './axe'

function ConfirmDelete({ onDelete = () => {} }: { onDelete?: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete campaign</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Delete campaign?" description="It goes for good."
        footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => { onDelete(); setOpen(false) }}>Delete</Button></>} />
    </>
  )
}

describe('Dialog', () => {
  it('opens as a named, described modal dialog and takes focus', async () => {
    render(<ConfirmDelete />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete campaign' }))
    const dialog = screen.getByRole('dialog', { name: 'Delete campaign?' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription('It goes for good.')
    await waitFor(() => expect(dialog).toHaveFocus())
    expect(await a11y()).toEqual([])
  })

  it('Escape closes it and focus goes back to the button that opened it', async () => {
    render(<ConfirmDelete />)
    const opener = screen.getByRole('button', { name: 'Delete campaign' })
    await userEvent.click(opener)
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus())
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(opener).toHaveFocus()
  })

  it('the × and the dimmed page both close it', async () => {
    render(<ConfirmDelete />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete campaign' }))
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Delete campaign' }))
    fireEvent.click(document.querySelector('.w-scrim-l')!)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('stops the page behind from scrolling while open, and restores it after', async () => {
    render(<ConfirmDelete />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete campaign' }))
    expect(document.documentElement.style.overflow).toBe('hidden')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(document.documentElement.style.overflow).toBe(''))
  })

  it('runs the footer action', async () => {
    const onDelete = vi.fn()
    render(<ConfirmDelete onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete campaign' }))
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalledOnce()
  })
})

describe('Sheet', () => {
  function PeekWithConfirm() {
    const [sheet, setSheet] = useState(false)
    const [dialog, setDialog] = useState(false)
    return (
      <>
        <Button onClick={() => setSheet(true)}>Open Zepto</Button>
        <Sheet open={sheet} onClose={() => setSheet(false)} label="Zepto">
          <Button onClick={() => setDialog(true)}>Archive</Button>
          <Dialog open={dialog} onClose={() => setDialog(false)} title="Archive Zepto?" />
        </Sheet>
      </>
    )
  }

  it('is a named dialog panel', async () => {
    render(<PeekWithConfirm />)
    await userEvent.click(screen.getByRole('button', { name: 'Open Zepto' }))
    expect(screen.getByRole('dialog', { name: 'Zepto' })).toHaveAttribute('aria-modal', 'true')
    expect(await a11y()).toEqual([])
  })

  it('with a dialog open on top, Escape closes only the dialog', async () => {
    render(<PeekWithConfirm />)
    await userEvent.click(screen.getByRole('button', { name: 'Open Zepto' }))
    await userEvent.click(screen.getByRole('button', { name: 'Archive' }))
    expect(screen.getByRole('dialog', { name: 'Archive Zepto?' })).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Archive Zepto?' })).not.toBeInTheDocument())
    expect(screen.getByRole('dialog', { name: 'Zepto' })).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Zepto' })).not.toBeInTheDocument())
  })
})

function Actions({ onRename = () => {}, onPin = () => {} }) {
  return (
    <>
      <Popover trigger={<Button>Actions</Button>}>
        <MenuItem onSelect={onRename}>Rename</MenuItem>
        <MenuItem onSelect={onPin} keepOpen>Pin</MenuItem>
        <MenuItem disabled>Delete</MenuItem>
      </Popover>
      <Button>Elsewhere</Button>
    </>
  )
}

describe('Popover menu', () => {
  it('the trigger says whether it is open', async () => {
    render(<Actions />)
    const trigger = screen.getByRole('button', { name: 'Actions' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(await a11y()).toEqual([])
  })

  it('arrow keys move through the items that can be used, wrapping around', async () => {
    render(<Actions />)
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }))
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Rename' })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Pin' })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(screen.getByRole('button', { name: 'Rename' })).toHaveFocus() // Delete is disabled: skipped
    await userEvent.keyboard('{ArrowUp}')
    expect(screen.getByRole('button', { name: 'Pin' })).toHaveFocus()
  })

  it('Escape closes it and puts focus back on the trigger', async () => {
    render(<Actions />)
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }))
    await userEvent.keyboard('{ArrowDown}{Escape}')
    expect(screen.queryByRole('button', { name: 'Rename' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus()
  })

  it('a click outside closes it', async () => {
    render(<Actions />)
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }))
    await userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }))
    expect(screen.queryByRole('button', { name: 'Rename' })).not.toBeInTheDocument()
  })

  it('picking an item runs it and closes; keepOpen items stay open', async () => {
    const onRename = vi.fn(), onPin = vi.fn()
    render(<Actions onRename={onRename} onPin={onPin} />)
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }))
    await userEvent.click(screen.getByRole('button', { name: 'Pin' }))
    expect(onPin).toHaveBeenCalledOnce()
    await userEvent.click(screen.getByRole('button', { name: 'Rename' }))
    expect(onRename).toHaveBeenCalledOnce()
    expect(screen.queryByRole('button', { name: 'Rename' })).not.toBeInTheDocument()
  })
})

describe('Select', () => {
  const OPTIONS = [{ value: 'new', label: 'Newest' }, { value: 'old', label: 'Oldest' }] as const

  it('shows the current choice and changes it', async () => {
    const onChange = vi.fn()
    render(<Select value="new" onChange={onChange} options={[...OPTIONS]} label="Sort" />)
    const button = screen.getByRole('button', { name: 'Sort' })
    expect(button).toHaveTextContent('Newest')
    await userEvent.click(button)
    expect(screen.getByRole('button', { name: /Newest/ })).toContainElement(screen.getByLabelText('Selected'))
    await userEvent.click(screen.getByRole('button', { name: 'Oldest' }))
    expect(onChange).toHaveBeenCalledWith('old')
  })

  it('an unknown value shows the placeholder, never a wrong option', () => {
    render(<Select value={'gone' as 'new'} onChange={() => {}} options={[...OPTIONS]} placeholder="Sort by" />)
    expect(screen.getByRole('button')).toHaveTextContent('Sort by')
  })

  it('with no options it is disabled', () => {
    render(<Select value="" onChange={() => {}} options={[]} label="Owner" />)
    expect(screen.getByRole('button', { name: 'Owner' })).toBeDisabled()
  })
})

describe('Tooltip', () => {
  it('names the control on hover, with its shortcut, and Escape hides it', async () => {
    render(<Tooltip label="New campaign" kbd="c" delay={0}><Button icon={House} aria-label="New" /></Tooltip>)
    await userEvent.hover(screen.getByRole('button', { name: 'New' }))
    const tip = await screen.findByRole('tooltip')
    expect(tip).toHaveTextContent('New campaign')
    expect(tip).toHaveTextContent(/C/)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('hides when the pointer leaves', async () => {
    render(<Tooltip label="Home" delay={0}><Button icon={House} aria-label="Home" /></Tooltip>)
    await userEvent.hover(screen.getByRole('button'))
    await screen.findByRole('tooltip')
    await userEvent.unhover(screen.getByRole('button'))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('with no label, renders just the child', () => {
    const { container } = render(<Tooltip label=""><Button>Go</Button></Tooltip>)
    expect(container.querySelector('.w-tipw')).toBeNull()
  })
})

function Palette({ onHome = () => {}, onDark = () => {} }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button>Search</Button>
      <CommandMenu open={open} onOpenChange={setOpen}>
        <CommandGroup heading="Go to">
          <CommandItem icon={House} onSelect={onHome}>Home</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Theme">
          <CommandItem icon={Sun} onSelect={() => {}} checked>Light</CommandItem>
          <CommandItem icon={Moon} onSelect={onDark} keepOpen>Dark</CommandItem>
        </CommandGroup>
      </CommandMenu>
    </>
  )
}

describe('CommandMenu', () => {
  it('Ctrl K opens and closes it', async () => {
    render(<Palette />)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    await userEvent.keyboard('{Control>}k{/Control}')
    expect(await screen.findByRole('combobox')).toBeInTheDocument()
    expect(await a11y()).toEqual([])
    await userEvent.keyboard('{Control>}k{/Control}')
    await waitFor(() => expect(screen.queryByRole('combobox')).not.toBeInTheDocument())
  })

  it('a group name finds its items ("theme" finds Light and Dark), and nothing else', async () => {
    render(<Palette />)
    await userEvent.keyboard('{Control>}k{/Control}')
    await userEvent.type(await screen.findByRole('combobox'), 'theme')
    await waitFor(() => expect(screen.queryByRole('option', { name: /Home/ })).not.toBeInTheDocument())
    expect(screen.getByRole('option', { name: /Light/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Dark/ })).toBeInTheDocument()
  })

  it('says when nothing matches, quoting the search', async () => {
    render(<Palette />)
    await userEvent.keyboard('{Control>}k{/Control}')
    await userEvent.type(await screen.findByRole('combobox'), 'zzz')
    expect(await screen.findByText(/No results for “zzz”/)).toBeInTheDocument()
  })

  it('Enter runs the highlighted item and closes the menu', async () => {
    const onHome = vi.fn()
    render(<Palette onHome={onHome} />)
    await userEvent.keyboard('{Control>}k{/Control}')
    await userEvent.type(await screen.findByRole('combobox'), 'home')
    await userEvent.keyboard('{Enter}')
    expect(onHome).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('combobox')).not.toBeInTheDocument())
  })

  it('keepOpen items run and leave the menu open', async () => {
    const onDark = vi.fn()
    render(<Palette onDark={onDark} />)
    await userEvent.keyboard('{Control>}k{/Control}')
    await userEvent.type(await screen.findByRole('combobox'), 'dark')
    await userEvent.keyboard('{Enter}')
    expect(onDark).toHaveBeenCalledOnce()
    await act(() => new Promise((r) => setTimeout(r, 50)))
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('closing returns focus to where it was', async () => {
    render(<Palette />)
    screen.getByRole('button', { name: 'Search' }).focus()
    await userEvent.keyboard('{Control>}k{/Control}')
    await screen.findByRole('combobox')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Search' })).toHaveFocus())
  })
})
