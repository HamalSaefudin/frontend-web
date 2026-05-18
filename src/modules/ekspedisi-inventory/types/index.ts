import type {
  EkspedisiInventoryDetail,
  EkspedisiInventoryFilters,
  EkspedisiInventoryKsuItem,
  EkspedisiInventoryListItem,
  EkspedisiInventoryProcessItemPayload,
  EkspedisiInventoryProcessPayload,
  EkspedisiInventoryStatus,
} from "@/services/ekspedisi-inventory";

export type {
  EkspedisiInventoryDetail,
  EkspedisiInventoryFilters,
  EkspedisiInventoryKsuItem,
  EkspedisiInventoryListItem,
  EkspedisiInventoryProcessItemPayload,
  EkspedisiInventoryProcessPayload,
  EkspedisiInventoryStatus,
};

export interface KsuRowFormValues {
  kodeKsu: string
  namaKsu?: string
  jenisKsu?: string
  qrCode?: string
  scan: boolean
  menyusul: boolean
}

export interface EkspedisiInventoryProcessFormValues {
  cabang: string
  tipeUnit: string
  noFJ: string
  noPDI: string
  warnaUnit: string
  noRangka: string
  noEkspedisi: string
  noMesin: string
  namaPembeli: string
  items: KsuRowFormValues[]
}