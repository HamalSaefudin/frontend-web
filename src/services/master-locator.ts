// Master Lokasi Warehouse API functions

import apiClient from './api-client'

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

interface ApiResponse<T = unknown> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
  errors: Array<{ field: string; message: string }>;
}

interface MutationResponse<T = unknown> {
  success: boolean;
  code: string;
  message: string;
  data?: T;
  errors: Array<{ field: string; message: string }>;
}

// List Lokasi Warehouse
export const getLokasiList = async (params?: LokasiFilterParams): Promise<MutationResponse<{ items: LokasiWarehouse[]; total: number }>> => {
  try {
    const response = await apiClient.get<ApiResponse<{ items: LokasiWarehouse[]; total: number }>>('/api/v1/master-locator', { params });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      code: error.response?.data?.code || 'ERROR',
      message: error.response?.data?.message || 'Failed to fetch lokasi list',
      data: undefined,
      errors: error.response?.data?.errors || [],
    };
  }
};

// Get Lokasi Detail
export const getLokasiDetail = async (id: string): Promise<MutationResponse<LokasiWarehouse>> => {
  try {
    const response = await apiClient.get<ApiResponse<LokasiWarehouse>>(`/api/v1/master-locator/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      code: error.response?.data?.code || 'LOKASI_NOT_FOUND',
      message: error.response?.data?.message || 'Lokasi warehouse not found',
      data: undefined,
      errors: error.response?.data?.errors || [{ field: 'id', message: 'Lokasi warehouse not found' }],
    };
  }
};

// Create Lokasi Warehouse
export const createLokasi = async (data: Omit<LokasiWarehouse, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<MutationResponse<{ id: string }>> => {
  try {
    const response = await apiClient.post<ApiResponse<{ id: string }>>('/api/v1/master-locator', data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      code: error.response?.data?.code || 'ERROR',
      message: error.response?.data?.message || 'Failed to create lokasi',
      data: undefined,
      errors: error.response?.data?.errors || [],
    };
  }
};

// Update Lokasi Warehouse
export const updateLokasi = async (id: string, data: Omit<LokasiWarehouse, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<MutationResponse<{ lokasiId: string }>> => {
  try {
    const response = await apiClient.put<ApiResponse<{ lokasiId: string }>>(`/api/v1/master-locator/${id}`, data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      code: error.response?.data?.code || 'ERROR',
      message: error.response?.data?.message || 'Failed to update lokasi',
      data: undefined,
      errors: error.response?.data?.errors || [],
    };
  }
};

// Delete Lokasi Warehouse
export const deleteLokasi = async (id: string): Promise<MutationResponse<{ lokasiId: string }>> => {
  try {
    const response = await apiClient.delete<ApiResponse<{ lokasiId: string }>>(`/api/v1/master-locator/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      code: error.response?.data?.code || 'ERROR',
      message: error.response?.data?.message || 'Failed to delete lokasi',
      data: undefined,
      errors: error.response?.data?.errors || [],
    };
  }
};

// Update Lokasi Status (PUT as per new API contract)
export const updateLokasiStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<MutationResponse<{ lokasiId: string; status: string }>> => {
  try {
    const response = await apiClient.put<ApiResponse<{ lokasiId: string; status: string }>>(`/api/v1/master-locator/${id}/status`, { status });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      code: error.response?.data?.code || 'ERROR',
      message: error.response?.data?.message || 'Failed to update status',
      data: undefined,
      errors: error.response?.data?.errors || [],
    };
  }
};

// Filter Lokasi Warehouse
export const filterLokasi = async (params: LokasiFilterParams): Promise<MutationResponse<{ items: LokasiWarehouse[]; total: number }>> => {
  try {
    const response = await apiClient.get<ApiResponse<{ items: LokasiWarehouse[]; total: number }>>('/api/v1/master-locator/filter', { params });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      code: error.response?.data?.code || 'ERROR',
      message: error.response?.data?.message || 'Failed to filter lokasi',
      data: undefined,
      errors: error.response?.data?.errors || [],
    };
  }
};