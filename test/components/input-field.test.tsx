import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import { InputField } from '@/components/ui/input-field'

describe('InputField', () => {
  it('renders label and required marker', () => {
    render(<InputField id="x" label="Name" required />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows error message and aria-invalid', () => {
    render(<InputField id="x" label="Name" error="Required" />)
    expect(screen.getByText('Required')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
  })

  it('toggles password visibility', async () => {
    render(<InputField id="pw" label="Password" type="password" defaultValue="secret" />)
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(input).toHaveAttribute('type', 'text')
  })

  it('number variant strips non-digits on paste', async () => {
    function Wrapper() {
      const [v, setV] = useState('')
      return <InputField id="n" variant="number" value={v} onChange={(e) => setV(e.target.value)} />
    }
    render(<Wrapper />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    await userEvent.click(input)
    await userEvent.paste('abc123def')
    expect(input.value).toBe('123')
  })

  it('alpha variant blocks digits via keydown', async () => {
    const onChange = vi.fn()
    render(<InputField id="a" variant="alpha" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '1')
    expect((input as HTMLInputElement).value).toBe('')
  })

  it('currency variant displays formatted value', () => {
    render(<InputField id="c" variant="currency" value="1000000" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('1,000,000')
  })
})
