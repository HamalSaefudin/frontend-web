import type { FjbListItem, FjbDetail, FjbFilters } from "@frontend/shared";
import type { IBaseResponse } from '@frontend/shared'
import { apiClient } from "@frontend/shared";

export type { FjbListItem, FjbDetail, FjbFilters };

export const getFjbList = async (filters: FjbFilters) => {
  const params: Record<string, string | number> = {}
  if (filters.cabangId) params.cabangId = filters.cabangId
  if (filters.startDate) params.startDate = filters.startDate
  if (filters.endDate) params.endDate = filters.endDate
  if (filters.search) params.search = filters.search
  if (filters.page) params.page = filters.page
  if (filters.pageSize) params.pageSize = filters.pageSize
  return await apiClient.get<IBaseResponse<FjbListItem[]>>("/api/v1/fjb", { params })
}

export const getFjbDetail = async (id: string) => {
  return await apiClient.get<IBaseResponse<FjbDetail>>(`/api/v1/fjb/${id}`)
}

export const createFjb = async (data: FjbDetail) => {
  return await apiClient.post<IBaseResponse<FjbDetail>>("/api/v1/fjb", data)
}

export const updateFjb = async (id: string, data: FjbDetail) => {
  return await apiClient.put<IBaseResponse<FjbDetail>>(`/api/v1/fjb/${id}`, data)
}

export const deleteFjb = async (id: string) => {
  return await apiClient.delete<IBaseResponse<void>>(`/api/v1/fjb/${id}`)
}

export const validateNomorMesin = async (nomorMesin: string) => {
  return await apiClient.get<IBaseResponse<{ valid: boolean }>>("/api/v1/fjb/validate-nomor-mesin", {
    params: { nomorMesin },
  })
}

export const getMasterCabang = async () => {
  return await apiClient.get<IBaseResponse<Array<{ value: string; label: string }>>>("/api/v1/master-cabang")
}

export const getMasterTipeFjb = async () => {
  return await apiClient.get<IBaseResponse<Array<{ value: string; label: string }>>>("/api/v1/master-tipe-fjb")
}

export const getMasterVarian = async () => {
  return await apiClient.get<IBaseResponse<Array<{ value: string; label: string }>>>("/api/v1/master-varian")
}

export const getMasterWarna = async () => {
  return await apiClient.get<IBaseResponse<Array<{ value: string; label: string }>>>("/api/v1/master-warna")
}

export const getMasterPekerjaan = async () => {
  return await apiClient.get<IBaseResponse<Array<{ value: string; label: string }>>>("/api/v1/master-pekerjaan")
}

export const getMasterAgama = async () => {
  return await apiClient.get<IBaseResponse<Array<{ value: string; label: string }>>>("/api/v1/master-agama")
}

export const getMasterJenisKelamin = async () => {
  return await apiClient.get<IBaseResponse<Array<{ value: string; label: string }>>>("/api/v1/master-jenis-kelamin")
}

export const getMasterJenisPit = async () => {
  return await apiClient.get<IBaseResponse<Array<{ value: string; label: string }>>>("/api/v1/master-jenis-pit")
}

export const getMasterMekanik = async () => {
  return await apiClient.get<IBaseResponse<Array<{ value: string; label: string }>>>("/api/v1/master-mekanik")
}

export const getMasterSa = async () => {
  return await apiClient.get<IBaseResponse<Array<{ value: string; label: string }>>>("/api/v1/master-sa")
}

export const getMasterJasa = async () => {
  return await apiClient.get<IBaseResponse<Array<{ kode: string; nama: string; kategori: string; huegia: number }>>>("/api/v1/master-jasa")
}

export const getMasterPart = async () => {
  return await apiClient.get<IBaseResponse<Array<{ kode: string; nama: string; price: number }>>>("/api/v1/master-part")
}