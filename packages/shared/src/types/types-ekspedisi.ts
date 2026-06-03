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