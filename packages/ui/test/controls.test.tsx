import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Button, Checkbox, Segmented, Switch, Tabs, type TabItem } from '@wldd/ui'

describe('Button', () => {
  it('is a plain button by default, so it never submits a form by accident', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
  })

  it('renders a link when given href', () => {
    render(<Button href="/campaigns">Campaigns</Button>)
    expect(screen.getByRole('link', { name: 'Campaigns' })).toHaveAttribute('href', '/campaigns')
  })

  it('names an icon-only button from aria-label', () => {
    render(<Button icon={Plus} aria-label="New campaign" />)
    expect(screen.getByRole('button', { name: 'New campaign' })).toBeInTheDocument()
  })

  it('reports a toggle state with aria-pressed', () => {
    render(<Button pressed>Bold</Button>)
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('does nothing when disabled', async () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Send</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('Checkbox', () => {
  it('toggles, and its click never reaches the row it sits in', async () => {
    const onChange = vi.fn()
    const onRow = vi.fn()
    render(<div onClick={onRow}><Checkbox checked={false} onChange={onChange} label="Select Zepto" /></div>)
    const box = screen.getByRole('checkbox', { name: 'Select Zepto' })
    expect(box).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(box)
    expect(onChange).toHaveBeenCalledWith(true)
    expect(onRow).not.toHaveBeenCalled()
  })

  it('reads as mixed when some rows are selected', () => {
    render(<Checkbox checked={false} indeterminate onChange={() => {}} label="Select all" />)
    expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute('aria-checked', 'mixed')
  })

  it('works from the keyboard', async () => {
    const onChange = vi.fn()
    render(<Checkbox checked onChange={onChange} label="Select Zepto" />)
    screen.getByRole('checkbox').focus()
    await userEvent.keyboard(' ')
    expect(onChange).toHaveBeenCalledWith(false)
  })
})

describe('Switch', () => {
  it('is a named switch that flips its value', async () => {
    const onChange = vi.fn()
    render(<Switch checked={false} onChange={onChange} label="Show completed" />)
    const sw = screen.getByRole('switch', { name: 'Show completed' })
    expect(sw).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(sw)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('does nothing when disabled', async () => {
    const onChange = vi.fn()
    render(<Switch checked={false} onChange={onChange} label="Show completed" disabled />)
    await userEvent.click(screen.getByRole('switch'))
    expect(onChange).not.toHaveBeenCalled()
  })
})

const VIEWS: TabItem<'all' | 'active' | 'done'>[] = [
  { value: 'all', label: 'All', count: 12 },
  { value: 'active', label: 'Active' },
  { value: 'done', label: 'Done' },
]

function ViewTabs({ start = 'all' as 'all' | 'active' | 'done' }) {
  const [v, setV] = useState(start)
  return <Tabs value={v} onChange={setV} items={VIEWS} />
}

describe('Tabs', () => {
  it('marks the current tab and makes it the only tab stop', () => {
    render(<ViewTabs start="active" />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((t) => t.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false'])
    expect(tabs.map((t) => t.tabIndex)).toEqual([-1, 0, -1])
  })

  it('arrow keys move, select and wrap; Home and End jump', async () => {
    render(<ViewTabs />)
    screen.getByRole('tab', { name: /All/ }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Active' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Active' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Done' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: /All/ })).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Done' })).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: /All/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('with nothing selected, the first tab is still reachable', () => {
    render(<Tabs value={'none' as 'all'} onChange={() => {}} items={VIEWS} />)
    expect(screen.getAllByRole('tab').map((t) => t.tabIndex)).toEqual([0, -1, -1])
  })

  it('shows the count beside its label', () => {
    render(<ViewTabs />)
    expect(screen.getByRole('tab', { name: /All/ })).toHaveTextContent('All12')
  })
})

describe('Segmented', () => {
  it('is a radio group that arrow keys move through', async () => {
    function Theme() {
      const [v, setV] = useState<'light' | 'dark'>('light')
      return <Segmented value={v} onChange={setV} items={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
    }
    render(<Theme />)
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    screen.getByRole('radio', { name: 'Light' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Dark' })).toHaveFocus()
  })
})
