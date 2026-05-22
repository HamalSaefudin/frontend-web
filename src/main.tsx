import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'
import { GlobalErrorDialog } from './components/GlobalErrorDialog'
import { TopLoadingBar } from './components/TopLoadingBar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: false, // No retry on error
      refetchOnWindowFocus: false, // Prevent refetch on alt+tab
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
