import { useQuery } from '@tanstack/react-query'
import { fetchLeads } from '../services/leads'
import { fetchDataAsync } from '@frontend/shared'
import { useErrorStore } from '@frontend/shared/store/useErrorStore.ts'

export function useLeadsQuery() {
  const setError = useErrorStore((s) => s.setError)

  return useQuery({
    queryKey: ['leads'],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: fetchLeads,
        setError,
        menuName: 'leads',
      }),
  })
}
