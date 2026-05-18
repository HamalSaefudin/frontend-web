import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'

describe('InputGroup', () => {
  it('renders input with addon button', () => {
    render(
      <InputGroup>
        <InputGroupInput placeholder="search" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="go">Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    )
    expect(screen.getByPlaceholderText('search')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'go' })).toBeInTheDocument()
  })

  it('renders text addon', () => {
    render(
      <InputGroup>
        <InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon>
        <InputGroupInput />
      </InputGroup>,
    )
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('renders textarea variant', () => {
    render(
      <InputGroup>
        <InputGroupTextarea placeholder="notes" />
      </InputGroup>,
    )
    expect(screen.getByPlaceholderText('notes')).toBeInTheDocument()
  })
})
