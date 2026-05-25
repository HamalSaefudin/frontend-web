import type { PdiUnit, PdiData, PdiPhysicalChecklistItem, PdiKsuItem, PdiHadiahItem, PdiBarangLainItem, PdiPartItem, PdiPhoto, PdiFilters } from "@/types";
import type { IBaseResponse } from '@/types'
import apiClient from './api-client'

export const fetchPdiUnits = async (page: number = 1, pageSize: number = 10, filters?: PdiFilters) => {
  const params: Record<string, string | number> = { page, pageSize }
  if (filters?.cabangId) params.cabangId = filters.cabangId
  if (filters?.status) params.status = filters.status
  if (filters?.filterBy && filters.search) {
    params.filterBy = filters.filterBy
    params.search = filters.search
  }
  return await apiClient.get<IBaseResponse<{ data: PdiUnit[]; total: number }>>('/api/v1/pdi-units', { params })
}

export const fetchPdiUnitById = async (id: string) => {
  return await apiClient.get<IBaseResponse<PdiUnit>>(`/api/v1/pdi-units/${id}`)
}

export const fetchPdiData = async (unitId: string) => {
  return await apiClient.get<IBaseResponse<PdiData>>(`/api/v1/pdi-units/${unitId}/data`)
}

export const savePdiChecklist = async (unitId: string, checklist: PdiPhysicalChecklistItem[]) => {
  return await apiClient.post<IBaseResponse<void>>(`/api/v1/pdi-units/${unitId}/checklist`, { checklist })
}

export const savePdiKsu = async (unitId: string, ksu: PdiKsuItem[]) => {
  return await apiClient.post<IBaseResponse<void>>(`/api/v1/pdi-units/${unitId}/ksu`, { ksu })
}

export const savePdiHadiah = async (unitId: string, hadiah: PdiHadiahItem[]) => {
  return await apiClient.post<IBaseResponse<void>>(`/api/v1/pdi-units/${unitId}/hadiah`, { hadiah })
}

export const savePdiBarangLain = async (unitId: string, barangLain: PdiBarangLainItem[]) => {
  return await apiClient.post<IBaseResponse<void>>(`/api/v1/pdi-units/${unitId}/barang-lain`, { barangLain })
}

export const savePdiPart = async (unitId: string, parts: PdiPartItem[]) => {
  return await apiClient.post<IBaseResponse<void>>(`/api/v1/pdi-units/${unitId}/parts`, { parts })
}

export const uploadPdiPhoto = async (unitId: string, photo: { file: File; kategori: PdiPhoto["kategori"] }) => {
  const formData = new FormData()
  formData.append('file', photo.file)
  formData.append('kategori', photo.kategori)
  return await apiClient.post<IBaseResponse<PdiPhoto>>(`/api/v1/pdi-units/${unitId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deletePdiPhoto = async (unitId: string, photoId: string) => {
  return await apiClient.delete<IBaseResponse<void>>(`/api/v1/pdi-units/${unitId}/photos/${photoId}`)
}

export const processPdi = async (unitId: string) => {
  return await apiClient.post<IBaseResponse<void>>(`/api/v1/pdi-units/${unitId}/process`)
}

export const rejectPdi = async (unitId: string) => {
  return await apiClient.post<IBaseResponse<void>>(`/api/v1/pdi-units/${unitId}/reject`)
}