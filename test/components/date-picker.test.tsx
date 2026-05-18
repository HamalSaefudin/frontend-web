import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { DatePicker } from '@/components/ui/date-picker'

describe('DatePicker', () => {
  it('renders label and required marker', () => {
    render(<DatePicker id="d" label="Date" required />)
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('formats existing value for display', () => {
    render(<DatePicker id="d" value={new Date('2026-04-27')} />)
    expect(screen.getByDisplayValue('27 April 2026')).toBeInTheDocument()
  })

  it('shows placeholder when no value', () => {
    render(<DatePicker id="d" placeholder="Pick" />)
    expect(screen.getByPlaceholderText('Pick')).toBeInTheDocument()
  })

  it('opens calendar on icon button click', async () => {
    render(<DatePicker id="d" />)
    await userEvent.click(screen.getByRole('button', { name: 'Open calendar' }))
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('shows error message and aria-invalid', () => {
    render(<DatePicker id="d" label="Date" error="Required" />)
    expect(screen.getByText('Required')).toBeInTheDocument()
    expect(screen.getByLabelText('Date')).toHaveAttribute('aria-invalid', 'true')
  })

  it('button disabled when disabled prop set', () => {
    render(<DatePicker id="d" disabled />)
    expect(screen.getByRole('button', { name: 'Open calendar' })).toBeDisabled()
  })

  it('clears value when input emptied', async () => {
    const onChange = vi.fn()
    render(<DatePicker id="d" value={new Date('2026-01-01')} onChange={onChange} />)
    const input = screen.getByDisplayValue('01 January 2026')
    await userEvent.clear(input)
    expect(onChange).toHaveBeenCalledWith(undefined)
  })
})
