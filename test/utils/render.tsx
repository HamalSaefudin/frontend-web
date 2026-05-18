/* eslint-disable react-refresh/only-export-components */
import { type ReactElement, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { render, type RenderOptions } from '@testing-library/react'
import { ModalProvider } from '@/components/ModalProvider'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  })
}

interface ProvidersProps {
  children: ReactNode
  client?: QueryClient
  initialEntries?: string[]
}

export function AllProviders({ children, client, initialEntries = ['/'] }: ProvidersProps) {
  const qc = client ?? createTestQueryClient()
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={initialEntries}>
        <ModalProvider>{children}</ModalProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

interface CustomOptions extends Omit<RenderOptions, 'wrapper'> {
  client?: QueryClient
  initialEntries?: string[]
}

export function renderWithProviders(ui: ReactElement, options: CustomOptions = {}) {
  const { client, initialEntries, ...rest } = options
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders client={client} initialEntries={initialEntries}>
        {children}
      </AllProviders>
    ),
    ...rest,
  })
}

export * from '@testing-library/react'
