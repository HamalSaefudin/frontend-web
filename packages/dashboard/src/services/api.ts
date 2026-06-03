import type { IBaseResponse } from '@frontend/shared'
import { apiClient } from '@frontend/shared'

export const fetchUsers = async () => {
  return await apiClient.get<IBaseResponse>('/api/v1/users')
}

export const fetchStats = async () => {
  return await apiClient.get<IBaseResponse>('/api/v1/stats')
}

export const fetchReports = async () => {
  return await apiClient.get<IBaseResponse>('/api/v1/reports')
}

export const fetchSettings = async () => {
  return await apiClient.get<IBaseResponse>('/api/v1/settings')
}
