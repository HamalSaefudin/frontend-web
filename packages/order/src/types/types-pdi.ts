export type PdiStatus = 'BELUM_PDI' | 'SUDAH_PDI' | 'DITOLAK'

export interface PdiUnit {
  id: string
  noFj: string
  tanggalFj: string
  kodeVarian: string
  namaVarian: string
  kodeWarna: string
  namaWarna: string
  nomorMesin: string
  nomorRangka: string
  status: PdiStatus
  cabangId: string
  cabangName: string
  tipeUnit: string
  noPdi?: string
  keterangan?: string
}

export interface PdiPhysicalChecklistItem {
  id: string
  namaItem: string
  status: 'OK' | 'NOT_OK'
  notes?: string
}

export interface PdiKsuItem {
  id: string
  namaItem: string
  jumlah: number
  kondisi: 'BAIK' | 'DAMAGE' | 'RUSAK'
}

export interface PdiHadiahItem {
  id: string
  namaHadiah: string
  jumlah: number
  keterangan?: string
}

export interface PdiBarangLainItem {
  id: string
  namaBarang: string
  jumlah: number
  keterangan?: string
}

export interface PdiPartItem {
  id: string
  namaPart: string
  jumlah: number
  kondisi: 'BAIK' | 'DAMAGE' | 'RUSAK'
  keterangan?: string
}

export interface PdiPhoto {
  id: string
  url: string
  kategori: 'EXTERIOR' | 'INTERIOR' | 'DAMAGE' | 'LAINNYA'
  createdAt: string
}

export interface PdiData {
  unitId: string
  unit: PdiUnit
  checklist: PdiPhysicalChecklistItem[]
  ksu: PdiKsuItem[]
  hadiah: PdiHadiahItem[]
  barangLain: PdiBarangLainItem[]
  parts: PdiPartItem[]
  photos: PdiPhoto[]
}

export interface PdiFilters {
  cabangId?: string
  status?: 'BELUM_PDI' | 'SUDAH_PDI'
  filterBy?: 'NOMOR_MESIN' | 'KODE_VARIAN'
  search?: string
}
