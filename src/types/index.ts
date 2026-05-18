export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: 'new' | 'contacted' | 'qualified' | 'converted'
  createdAt: string
}

export interface Stats {
  totalLeads: number
  convertedLeads: number
  pendingLeads: number
  conversionRate: number
}

export interface Report {
  id: string
  title: string
  createdAt: string
  author: string
  status: 'draft' | 'published'
}

export interface Settings {
  theme: 'light' | 'dark'
  notifications: boolean
  language: string
  timezone: string
}

export interface ApiError {
  status: number
  message: string
  code?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// PDI Types
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

// Master Kas Types
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
