import { apiClient } from '@frontend/shared'
import type { IBaseResponse } from '@frontend/shared'

export interface LokasiWarehouse {
  id: string;
  kodeLokasi: string;
  kodeCabang: string;
  namaLokasi: string;
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface LokasiFilterParams {
  kodeLokasi?: string;
  kodeCabang?: string;
  namaLokasi?: string;
  page?: number;
  size?: number;
}

export const getLokasiList = async (params?: LokasiFilterParams) => {
  return await apiClient.get<IBaseResponse<{ items: LokasiWarehouse[]; totalElements: number }>>('/api/v1/master-locator', { params })
}

export const getLokasiDetail = async (id: string) => {
  return await apiClient.get<IBaseResponse<LokasiWarehouse>>(`/api/v1/master-locator/${id}`)
}

export const createLokasi = async (data: Omit<LokasiWarehouse, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
  return await apiClient.post<IBaseResponse<{ id: string }>>('/api/v1/master-locator', data)
}

export const updateLokasi = async (id: string, data: Omit<LokasiWarehouse, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
  return await apiClient.put<IBaseResponse<{ lokasiId: string }>>(`/api/v1/master-locator/${id}`, data)
}

export const deleteLokasi = async (id: string) => {
  return await apiClient.delete<IBaseResponse<{ lokasiId: string }>>(`/api/v1/master-locator/${id}`)
}

export const updateLokasiStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE') => {
  return await apiClient.put<IBaseResponse<{ lokasiId: string; status: string }>>(`/api/v1/master-locator/${id}/status`, { status })
}

export const filterLokasi = async (params: LokasiFilterParams) => {
  return await apiClient.get<IBaseResponse<{ items: LokasiWarehouse[]; totalElements: number }>>('/api/v1/master-locator/filter', { params })
}