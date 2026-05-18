import { useQuery } from '@tanstack/react-query'
import { fetchLeads } from '@/services/api'
import { fetchDataAsync } from '@/utils'
import { useErrorStore } from '@/store/useErrorStore'

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
