import apiClient from './api-client';
import type { IBaseResponse } from '@/types';

export interface MasterCoa {
  id: string;
  coaId: string;
  coaName: string;
  branches: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CoaTransaction {
  transactionId: string;
  transactionName: string;
  category: 'TRX_IN' | 'TRX_OUT';
  subgroup: string;
  group: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface MasterCoaDetail extends MasterCoa {
  transactions: CoaTransaction[];
}

export interface CreateMasterCoaRequest {
  coaName: string;
  branches: string[];
  transactions: {
    transactionName: string;
    category: 'TRX_IN' | 'TRX_OUT';
    subgroup?: string;
    group?: string;
  }[];
}

export interface UpdateMasterCoaRequest {
  coaName: string;
  branches: string[];
  transactions: {
    transactionName: string;
    category: 'TRX_IN' | 'TRX_OUT';
    subgroup?: string;
    group?: string;
  }[];
}

export interface CopyMasterCoaRequest {
  branches: string[];
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
}

export const fetchMasterCoas = async (keyword?: string, status?: string, page = 0, size = 10) => {
  return await apiClient.get<IBaseResponse<PaginatedData<MasterCoa>>>('/api/v1/master-coas', {
    params: { keyword, status, page, size },
  })
}

export const fetchMasterCoaById = async (coaId: string) => {
  return await apiClient.get<IBaseResponse<MasterCoaDetail | null>>(`/api/v1/master-coas/${coaId}`)
}

export const createMasterCoa = async (data: CreateMasterCoaRequest) => {
  return await apiClient.post<IBaseResponse<{ coaId: string; status: string }>>('/api/v1/master-coas', data)
}

export const updateMasterCoa = async (coaId: string, data: UpdateMasterCoaRequest) => {
  return await apiClient.put<IBaseResponse<{ coaId: string }>>(`/api/v1/master-coas/${coaId}`, data)
}

export const activateMasterCoa = async (coaId: string) => {
  return await apiClient.put<IBaseResponse<{ coaId: string; status: string }>>(`/api/v1/master-coas/${coaId}/activate`)
}

export const deactivateMasterCoa = async (coaId: string) => {
  return await apiClient.put<IBaseResponse<{ coaId: string; status: string }>>(`/api/v1/master-coas/${coaId}/deactivate`)
}

export const copyMasterCoa = async (coaId: string, data: CopyMasterCoaRequest) => {
  return await apiClient.put<IBaseResponse<{ newCoaId: string }>>(`/api/v1/master-coas/${coaId}/copy`, data)
}

export const deleteMasterCoa = async (coaId: string) => {
  return await apiClient.delete<IBaseResponse<{ coaId: string }>>(`/api/v1/master-coas/${coaId}`)
}