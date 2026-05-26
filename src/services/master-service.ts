import apiClient from './api-client'
import type { IBaseResponse } from '@/types'

export interface Branch {
  id: string;
  kodeCabang: string;
  namaCabang: string;
}

export interface Service {
  id: string;
  kodeJasa: string;
  namaJasa: string;
  servisCategory: string;
  kodeHarian: string;
  namaVarian: string;
  kodeVarian: string;
  branchId: string;
}

export const fetchBranches = async () => {
  return await apiClient.get<IBaseResponse<Branch[]>>('/api/v1/branches')
}

export const fetchServices = async (branchId?: string) => {
  const params = branchId ? { branchId } : {}
  return await apiClient.get<IBaseResponse<Service[]>>('/api/v1/services', { params })
}

export const createService = async (serviceData: Omit<Service, 'id'>) => {
  return await apiClient.post<IBaseResponse<Service>>('/api/v1/services', serviceData)
}

export const updateService = async (id: string, serviceData: Omit<Service, 'id'>) => {
  return await apiClient.put<IBaseResponse<Service>>(`/api/v1/services/${id}`, serviceData)
}

export const deleteService = async (id: string) => {
  return await apiClient.delete<IBaseResponse<void>>(`/api/v1/services/${id}`)
}