import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Label } from '@/components/ui/label'

describe('Label', () => {
  it('renders text', () => {
    render(<Label>Email</Label>)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('associates with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="x">Name</Label>
        <input id="x" />
      </>,
    )
    expect(screen.getByText('Name')).toHaveAttribute('for', 'x')
  })
})
