import { TopLoadingBar, GlobalErrorDialog } from '@frontend/ui'
import { StrictMode } from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TopLoadingBar />
      <App />
      <GlobalErrorDialog />
    </QueryClientProvider>
  </StrictMode>,
)
