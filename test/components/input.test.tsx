import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="email" />)
    expect(screen.getByPlaceholderText('email')).toBeInTheDocument()
  })

  it('fires onChange on typing', async () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'hi')
    expect(onChange).toHaveBeenCalled()
  })

  it('respects type prop', () => {
    render(<Input type="password" data-testid="pw" />)
    expect(screen.getByTestId('pw')).toHaveAttribute('type', 'password')
  })

  it('disabled blocks input', async () => {
    render(<Input disabled placeholder="x" />)
    const input = screen.getByPlaceholderText('x')
    expect(input).toBeDisabled()
  })
})
