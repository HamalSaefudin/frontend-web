import { apiClient } from '@frontend/shared'
import type { IBaseResponse } from '@frontend/shared'

export type EkspedisiInventoryStatus = "DRAFT" | "PROCESSED" | "CANCELLED"

export interface EkspedisiInventoryKsuItem {
  id?: string
  kodeKsu: string
  namaKsu: string
  jenisKsu: string
  qrCode: string
  scan: boolean
  menyusul: boolean
}

export interface EkspedisiInventoryListItem {
  id: string
  tanggalFj: string
  noFj: string
  namaPembeli: string
  kodeVarian: string
  namaVarian: string
  kodeWarna: string
  namaWarna: string
  noMesin: string
  noRangka: string
  status: EkspedisiInventoryStatus
}

export interface EkspedisiInventoryDetail {
  id: string
  cabang: string
  tipeUnit: string
  noFj: string
  noPdi: string
  warnaUnit: string
  noRangka: string
  noEkspedisi: string
  noMesin: string
  namaPembeli: string
  items: EkspedisiInventoryKsuItem[]
}

export interface EkspedisiInventoryFilters {
  status: EkspedisiInventoryStatus | ""
  keyword: string
}

export interface EkspedisiInventoryProcessItemPayload {
  kodeKsu: string
  scan: boolean
  menyusul: boolean
}

export interface EkspedisiInventoryProcessPayload {
  id: string
  items: EkspedisiInventoryProcessItemPayload[]
}

export const fetchEkspedisiInventoryList = async (
  page: number = 1,
  pageSize: number = 5,
  filters?: EkspedisiInventoryFilters,
) => {
  const params: Record<string, string | number> = { page, pageSize }
  if (filters?.status) params.status = filters.status
  if (filters?.keyword) params.keyword = filters.keyword
  return await apiClient.get<IBaseResponse<{ data: EkspedisiInventoryListItem[]; total: number }>>('/api/v1/ekspedisi-inventory', { params })
}

export const fetchEkspedisiInventoryDetail = async (id: string) => {
  return await apiClient.get<IBaseResponse<EkspedisiInventoryDetail>>(`/api/v1/ekspedisi-inventory/${id}`)
}

export function mapEkspedisiInventoryDetailToProcessFormValues(detail: EkspedisiInventoryDetail) {
  return {
    cabang: detail.cabang,
    tipeUnit: detail.tipeUnit,
    noFJ: detail.noFj,
    noPDI: detail.noPdi,
    warnaUnit: detail.warnaUnit,
    noRangka: detail.noRangka,
    noEkspedisi: detail.noEkspedisi,
    noMesin: detail.noMesin,
    namaPembeli: detail.namaPembeli,
    items: detail.items.map((it) => ({
      kodeKsu: it.kodeKsu,
      namaKsu: it.namaKsu,
      jenisKsu: it.jenisKsu,
      qrCode: it.qrCode,
      scan: it.scan,
      menyusul: it.menyusul,
    })),
  }
}

export const processEkspedisiInventory = async (payload: EkspedisiInventoryProcessPayload) => {
  return await apiClient.put<IBaseResponse<void>>(`/api/v1/ekspedisi-inventory/${payload.id}`, payload)
}