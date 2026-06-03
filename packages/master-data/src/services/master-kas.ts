import type { IBaseResponse } from '@frontend/shared'
import { apiClient } from '@frontend/shared'
import type { MasterKas, MasterKasFilters, MasterKasResponse } from '../types/types-master-kas'

export type { MasterKas, MasterKasFilters, MasterKasResponse };

export const getMasterKasList = async (filters: MasterKasFilters = {}) => {
  const params: Record<string, string | number> = {}
  if (filters.page) params.page = filters.page
  if (filters.limit) params.limit = filters.limit
  if (filters.namaKas) params.namaKas = filters.namaKas
  if (filters.kodeKas) params.kodeKas = filters.kodeKas
  if (filters.cabangId) params.cabangId = filters.cabangId
  if (filters.status !== undefined) params.status = filters.status ? 1 : 0
  return await apiClient.get<IBaseResponse<MasterKasResponse>>('/api/v1/master-kas', { params })
}

export const createMasterKas = async (kasData: Omit<MasterKas, "id" | "createdAt" | "updatedAt">) => {
  return await apiClient.post<IBaseResponse<MasterKas>>('/api/v1/master-kas', kasData)
}

export const updateMasterKas = async (id: string, kasData: Partial<Omit<MasterKas, "id" | "createdAt" | "updatedAt">>) => {
  return await apiClient.put<IBaseResponse<MasterKas>>(`/api/v1/master-kas/${id}`, kasData)
}

export const deleteMasterKas = async (id: string) => {
  return await apiClient.delete<IBaseResponse<void>>(`/api/v1/master-kas/${id}`)
}

export const updateMasterKasStatus = async (id: string, status: boolean) => {
  return await apiClient.patch<IBaseResponse<MasterKas>>(`/api/v1/master-kas/${id}/status`, { status })
}

export const exportMasterKas = async (filters: MasterKasFilters = {}, format: "pdf" | "excel" = "excel") => {
  const params: Record<string, string | number> = { format }
  if (filters.page) params.page = filters.page
  if (filters.limit) params.limit = filters.limit
  if (filters.namaKas) params.namaKas = filters.namaKas
  if (filters.kodeKas) params.kodeKas = filters.kodeKas
  if (filters.cabangId) params.cabangId = filters.cabangId
  if (filters.status !== undefined) params.status = filters.status ? 1 : 0
  return await apiClient.get<IBaseResponse<Blob>>('/api/v1/master-kas/export', { params, responseType: 'blob' })
}