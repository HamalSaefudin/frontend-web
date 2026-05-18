import { afterEach, describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { GlobalErrorDialog } from '@/components/GlobalErrorDialog'
import { useErrorStore } from '@/store/useErrorStore'

afterEach(() => {
  useErrorStore.getState().clearAllErrors()
})

describe('GlobalErrorDialog', () => {
  it('hides when no errors', () => {
    render(<GlobalErrorDialog />)
    expect(screen.queryByText(/Terjadi Kesalahan|something/i)).not.toBeInTheDocument()
  })

  it('shows error title and message from store', () => {
    useErrorStore.getState().setError({
      menuName: 'screen',
      errorMessage: 'Network error',
      title: 'Oops',
    })
    render(<GlobalErrorDialog />)
    expect(screen.getByText('Oops')).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  it('falls back to default title when none provided', () => {
    useErrorStore.getState().setError({ menuName: 'screen', errorMessage: 'fail' })
    render(<GlobalErrorDialog />)
    expect(screen.getByText('Terjadi Kesalahan')).toBeInTheDocument()
  })

  it('OK button clears the error', async () => {
    useErrorStore.getState().setError({ menuName: 'screen', errorMessage: 'fail' })
    render(<GlobalErrorDialog />)
    await userEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(useErrorStore.getState().errors).toEqual({})
  })
})
