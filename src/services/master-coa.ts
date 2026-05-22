import apiClient from './api-client';

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

export interface ApiResponse<T = unknown> {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
  errors: { field: string; message: string }[];
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

// Error codes
export const COA_ERRORS = {
  COA_NOT_FOUND: 'COA_NOT_FOUND',
  BRANCH_ALREADY_USED: 'BRANCH_ALREADY_USED',
  INVALID_STATE: 'INVALID_STATE',
  COA_ALREADY_USED: 'COA_ALREADY_USED',
  INVALID_COA_NAME: 'INVALID_COA_NAME',
  TRANSACTION_ALREADY_USED: 'TRANSACTION_ALREADY_USED',
} as const;

// API calls
export const fetchMasterCoas = async (
  keyword?: string,
  status?: string,
  page = 0,
  size = 10
): Promise<ApiResponse<PaginatedData<MasterCoa>>> => {
  const response = await apiClient.get<ApiResponse<PaginatedData<MasterCoa>>>('/api/v1/master-coas', {
    params: { keyword, status, page, size },
  });
  return response.data;
};

export const fetchMasterCoaById = async (
  coaId: string
): Promise<ApiResponse<MasterCoaDetail | null>> => {
  const response = await apiClient.get<ApiResponse<MasterCoaDetail | null>>(`/api/v1/master-coas/${coaId}`);
  return response.data;
};

export const createMasterCoa = async (
  data: CreateMasterCoaRequest
): Promise<ApiResponse<{ coaId: string; status: string }>> => {
  const response = await apiClient.post<ApiResponse<{ coaId: string; status: string }>>(
    '/api/v1/master-coas',
    data
  );
  return response.data;
};

export const updateMasterCoa = async (
  coaId: string,
  data: UpdateMasterCoaRequest
): Promise<ApiResponse<{ coaId: string }>> => {
  const response = await apiClient.put<ApiResponse<{ coaId: string }>>(
    `/api/v1/master-coas/${coaId}`,
    data
  );
  return response.data;
};

export const activateMasterCoa = async (
  coaId: string
): Promise<ApiResponse<{ coaId: string; status: string }>> => {
  const response = await apiClient.put<ApiResponse<{ coaId: string; status: string }>>(
    `/api/v1/master-coas/${coaId}/activate`
  );
  return response.data;
};

export const deactivateMasterCoa = async (
  coaId: string
): Promise<ApiResponse<{ coaId: string; status: string }>> => {
  const response = await apiClient.put<ApiResponse<{ coaId: string; status: string }>>(
    `/api/v1/master-coas/${coaId}/deactivate`
  );
  return response.data;
};

export const copyMasterCoa = async (
  coaId: string,
  data: CopyMasterCoaRequest
): Promise<ApiResponse<{ newCoaId: string }>> => {
  const response = await apiClient.put<ApiResponse<{ newCoaId: string }>>(
    `/api/v1/master-coas/${coaId}/copy`,
    data
  );
  return response.data;
};

export const deleteMasterCoa = async (
  coaId: string
): Promise<ApiResponse<{ coaId: string }>> => {
  const response = await apiClient.delete<ApiResponse<{ coaId: string }>>(`/api/v1/master-coas/${coaId}`);
  return response.data;
};