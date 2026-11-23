// Every live example on the docs site, rendered and checked with axe. A new example is covered automatically.
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EXAMPLES } from '../../../apps/docs/examples'
import { a11y } from './axe'

describe('docs examples: no accessibility problems', () => {
  it.each(Object.entries(EXAMPLES))('%s', async (_id, Example) => {
    render(<Example />)
    expect(await a11y()).toEqual([])
  })
})
