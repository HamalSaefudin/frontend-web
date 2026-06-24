import type { Report, Settings, Stats, User } from '../types'
import type { IBaseResponse } from '@/types'
import apiClient from './api-client'

export const fetchUsers = async () => {
  return await apiClient.get<IBaseResponse<User[]>>('/api/v1/users')
}

export const fetchStats = async () => {
  return await apiClient.get<IBaseResponse<Stats>>('/api/v1/stats')
}

export const fetchReports = async () => {
  return await apiClient.get<IBaseResponse<Report[]>>('/api/v1/reports')
}

export const fetchSettings = async () => {
  return await apiClient.get<IBaseResponse<Settings>>('/api/v1/settings')
}