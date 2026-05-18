import { describe, expect, it } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, waitFor } from '@testing-library/react'
import { TopLoadingBar } from '@/components/TopLoadingBar'

function withClient(ui: React.ReactElement, client: QueryClient) {
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

describe('TopLoadingBar', () => {
  it('renders nothing when nothing is fetching', () => {
    const qc = new QueryClient()
    const { container } = withClient(<TopLoadingBar />, qc)
    expect(container.firstChild).toBeNull()
  })

  it('renders bar while a query is fetching', async () => {
    const qc = new QueryClient()
    let resolve!: (v: number) => void
    qc.fetchQuery({
      queryKey: ['x'],
      queryFn: () => new Promise<number>((r) => { resolve = r }),
    })
    const { container } = withClient(<TopLoadingBar />, qc)
    await waitFor(() => {
      expect(container.querySelector('.top-loading-bar--loading')).toBeTruthy()
    })
    resolve(1)
  })
})
