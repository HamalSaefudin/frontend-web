import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

describe('Popover', () => {
  it('opens content on trigger click', async () => {
    render(
      <Popover>
        <PopoverTrigger>Toggle</PopoverTrigger>
        <PopoverContent>Hello</PopoverContent>
      </Popover>,
    )
    expect(screen.queryByText('Hello')).not.toBeInTheDocument()
    await userEvent.click(screen.getByText('Toggle'))
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('closes on outside click', async () => {
    render(
      <Popover>
        <PopoverTrigger>Toggle</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>,
    )
    await userEvent.click(screen.getByText('Toggle'))
    expect(screen.getByText('Body')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByText('Body')).not.toBeInTheDocument()
  })
})
