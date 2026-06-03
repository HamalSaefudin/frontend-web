import { useQuery } from '@tanstack/react-query'
import { fetchStats } from '../services/api'
import { fetchDataAsync } from '@frontend/shared'
import { useErrorStore } from '@frontend/shared/store/useErrorStore'

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
