import { useQuery } from '@tanstack/react-query'
import { fetchStats } from '@/services/api'
import { fetchDataAsync } from '@/utils'
import { useErrorStore } from '@/store/useErrorStore'

export function useStatsQuery() {
  const setError = useErrorStore((s) => s.setError)

  return useQuery({
    queryKey: ['stats'],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: fetchStats,
        setError,
        menuName: 'stats',
      }),
  })
}
