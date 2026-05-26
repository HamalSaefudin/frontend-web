export interface MasterKas {
  id: string
  kodeKas: string
  namaCabang: string
  namaKas: string
  status: boolean
  createdAt: string
  updatedAt: string
}

export interface MasterKasFilters {
  page?: number
  limit?: number
  namaKas?: string
  kodeKas?: string
  cabangId?: string
  status?: boolean
}

export interface MasterKasResponse {
  data: MasterKas[]
  total: number
  page: number
  limit: number
}