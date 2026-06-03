import type { IBaseResponse } from '@frontend/shared'
import { apiClient } from '@frontend/shared'
import type {Lead} from '@frontend/shared/types/index.ts'

export const fetchLeads = async () => {
  return await apiClient.get<IBaseResponse<Lead[]>>('/api/v1/leads')
}
