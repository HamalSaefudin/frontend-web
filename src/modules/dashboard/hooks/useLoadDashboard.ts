import { useQueries } from '@tanstack/react-query'
import { fetchUsers, fetchStats, fetchReports, fetchSettings } from '@/services/api'
import { fetchDataAsync } from '@/utils'
import { useErrorStore } from '@/store/useErrorStore'
import type { User, Stats, Report, Settings } from '@/types'

interface DashboardData {
  users: User[]
  stats: Stats
  reports: Report[]
  settings: Settings
}

export function useLoadDashboard() {
  const setError = useErrorStore((s) => s.setError)

  const queries = useQueries({
    queries: [
      {
        queryKey: ['users'],
        queryFn: () =>
          fetchDataAsync({
            asyncFn: fetchUsers,
            setError,
            menuName: 'users',
          }),
      },
      {
        queryKey: ['stats'],
        queryFn: () =>
          fetchDataAsync({
            asyncFn: fetchStats,
            setError,
            menuName: 'stats',
          }),
      },
      {
        queryKey: ['reports'],
        queryFn: () =>
          fetchDataAsync({
            asyncFn: fetchReports,
            setError,
            menuName: 'reports',
          }),
      },
      {
        queryKey: ['settings'],
        queryFn: () =>
          fetchDataAsync({
            asyncFn: fetchSettings,
            setError,
            menuName: 'settings',
          }),
      },
    ],
  })

  const [usersQuery, statsQuery, reportsQuery, settingsQuery] = queries

  const isLoading = queries.some((q) => q.isPending)
  const isError = queries.some((q) => q.isError)

  const data: DashboardData = {
    users: usersQuery.data?.data?.data ?? [],
    stats: statsQuery.data?.data?.data ?? {
      totalLeads: 0,
      convertedLeads: 0,
      pendingLeads: 0,
      conversionRate: 0,
    },
    reports: reportsQuery.data?.data?.data ?? [],
    settings: settingsQuery.data?.data?.data ?? {
      theme: 'light',
      notifications: true,
      language: 'en',
      timezone: 'UTC',
    },
  }

  return { isLoading, isError, data }
}