import apiClient from './api-client'
import type { IBaseResponse } from '@/types'

export interface Branch {
  id: string;
  kodeCabang: string;
  namaCabang: string;
  namaLead: string;
}

export interface ImportBranchesResult {
  importedCount: number;
  failedCount: number;
  errors: Array<{ row: number; message: string }>;
}

export const fetchBranches = async () => {
  return await apiClient.get<IBaseResponse<Branch[]>>('/api/v1/cabang')
}

export const fetchBranchById = async (id: string) => {
  return await apiClient.get<IBaseResponse<Branch | null>>(`/api/v1/cabang/${id}`)
}

export const createBranch = async (branchData: Omit<Branch, 'id'>) => {
  return await apiClient.post<IBaseResponse<Branch>>('/api/v1/cabang', branchData)
}

export const updateBranch = async (id: string, branchData: Omit<Branch, 'id'>) => {
  return await apiClient.put<IBaseResponse<Branch>>(`/api/v1/cabang/${id}`, branchData)
}

export const deleteBranch = async (id: string) => {
  return await apiClient.delete<IBaseResponse<void>>(`/api/v1/cabang/${id}`)
}

export const importBranches = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return await apiClient.post<IBaseResponse<ImportBranchesResult>>('/api/v1/cabang/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}