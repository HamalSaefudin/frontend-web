import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingOverlay } from '@/components/LoadingOverlay'

describe('LoadingOverlay', () => {
  it('renders default message', () => {
    render(<LoadingOverlay />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders custom message', () => {
    render(<LoadingOverlay message="Saving..." />)
    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })
})
