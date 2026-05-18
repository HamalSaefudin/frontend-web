import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { ErrorFallback } from '@/components/ErrorFallback'

describe('ErrorFallback', () => {
  it('renders one alert per error', () => {
    render(<ErrorFallback errors={['a', 'b']} />)
    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(2)
    expect(screen.getByText('a')).toBeInTheDocument()
    expect(screen.getByText('b')).toBeInTheDocument()
  })

  it('hides retry button when no onRetry given', () => {
    render(<ErrorFallback errors={['x']} />)
    expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument()
  })

  it('fires onRetry when button clicked', async () => {
    const onRetry = vi.fn()
    render(<ErrorFallback errors={['x']} onRetry={onRetry} />)
    await userEvent.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(onRetry).toHaveBeenCalled()
  })
})
