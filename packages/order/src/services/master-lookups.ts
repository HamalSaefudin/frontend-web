import { apiClient } from '@frontend/shared'
import type { IBaseResponse } from '@frontend/shared'

export interface Branch {
  id: string;
  kodeCabang: string;
  namaCabang: string;
  namaLead: string;
}

export const fetchBranches = async () => {
  return await apiClient.get<IBaseResponse<Branch[]>>('/api/v1/cabang')
}
