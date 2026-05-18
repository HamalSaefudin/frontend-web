import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import { SelectField, type SelectOption } from '@/components/ui/select'

const options: SelectOption[] = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
  { value: 'c', label: 'Cherry' },
]

describe('SelectField', () => {
  it('renders label and required marker', () => {
    render(<SelectField id="x" label="Fruit" required options={options} />)
    expect(screen.getByText('Fruit')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<SelectField id="x" label="Fruit" error="Required" options={options} />)
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  describe('single mode', () => {
    it('opens and selects option', async () => {
      const onChange = vi.fn()
      render(<SelectField id="x" options={options} onChange={onChange} placeholder="Pick" />)
      await userEvent.click(screen.getByPlaceholderText('Pick'))
      await userEvent.click(screen.getByText('Banana'))
      expect(onChange).toHaveBeenCalledWith('b')
    })

    it('filters options by search', async () => {
      render(<SelectField id="x" options={options} placeholder="Pick" />)
      await userEvent.type(screen.getByPlaceholderText('Pick'), 'cher')
      expect(screen.getByText('Cherry')).toBeInTheDocument()
      expect(screen.queryByText('Apple')).not.toBeInTheDocument()
    })
  })

  describe('multi mode', () => {
    it('toggles values', async () => {
      function Wrapper() {
        const [v, setV] = useState<string[]>([])
        return <SelectField mode="multi" id="x" options={options} value={v} onChange={setV} placeholder="Pick" />
      }
      render(<Wrapper />)
      await userEvent.click(screen.getByPlaceholderText('Pick'))
      await userEvent.click(screen.getByText('Apple'))
      await userEvent.click(screen.getByText('Banana'))
      expect(screen.getAllByText('Apple').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Banana').length).toBeGreaterThan(0)
    })

    it('shows "No data" when options is empty', async () => {
      render(<SelectField mode="multi" id="x" options={[]} placeholder="Pick" />)
      await userEvent.click(screen.getByPlaceholderText('Pick'))
      expect(screen.getByText('No data')).toBeInTheDocument()
    })
  })

  describe('simple mode', () => {
    it('renders trigger', () => {
      render(<SelectField mode="simple" id="x" options={options} placeholder="Pick" />)
      expect(screen.getByText('Pick')).toBeInTheDocument()
    })
  })
})
