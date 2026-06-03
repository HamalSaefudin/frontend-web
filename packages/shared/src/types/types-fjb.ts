export type FjbStatus = "COMPLETED" | "DRAFT" | "DELETED";

export interface FjbListItem {
  id: string;
  tanggalFjb: string;
  noFjb: string;
  noPolisi: string;
  namaPemilik: string;
  namaPembawa: string;
  noMesin: string;
  noRangka: string;
  kodeVarian: string;
  kodeWarna: string;
  namaWarna: string;
  status: FjbStatus;
}

export interface FjbJob {
  id?: string;
  kodeJasa: string;
  namaJasa: string;
  serviceCategory: string;
  hargaSistem: number;
  hargaDiberikan: number;
  diskonPersen: number;
  estimasiWaktu: number;
  totalHarga: number;
  isSaved?: boolean;
}

export interface FjbPart {
  id?: string;
  kodePart: string;
  namaPart: string;
  qty: number;
  hargaSatuan: number;
  diskonPersen: number;
  totalHarga: number;
  isSaved?: boolean;
}

export interface FjbDetail {
  id?: string;
  cabangId: string;
  noBooking?: string;
  noFjb?: string;
  noProspect?: string;
  tanggalFjb: string;
  jenisProspect?: string;
  tipeFjb: string;
  noHotline?: string;
  workOrderType: "work-order" | "direct-sales";
  // Tab: Data Unit
  nomorPolisi: string;
  namaVarian: string;
  nomorRangka: string;
  tahunMotor?: number;
  nomorMesin: string;
  informasiBensin?: string;
  kodeVarian: string;
  kmTerakhir: number;
  // Tab: Data Pemilik
  isPerusahaan: boolean;
  namaPemilik: string;
  jenisKelamin: "L" | "P";
  nik: string;
  pekerjaan1: string;
  noHp1: string;
  pekerjaan2?: string;
  noHp2?: string;
  agama: string;
  email: string;
  // Tab: Data Pembawa
  pembawaIsPerusahaan: boolean;
  pembawaNama: string;
  pembawaJenisKelamin: "L" | "P";
  pembawaNik: string;
  pembawaPekerjaan1: string;
  pembawaNoHp1: string;
  pembawaPekerjaan2?: string;
  pembawaNoHp2?: string;
  pembawaAgama: string;
  pembawaEmail: string;
  // Tab: Analisa
  rekomendasiSa: string;
  keluhanKonsumen: string;
  // Tab: Data Transaksi
  jobs: FjbJob[];
  partsWithQr: FjbPart[];
  partsWithoutQr: FjbPart[];
  // Tab: Data Tambahan
  noWorkOrder: string;
  jenisPit: string;
  tanggalService: string;
  waktuPendaftaran?: string;
  waktuPkb?: string;
  waktuSelesai?: string;
  asalUnitEntry: string;
  totalFrt?: number;
  namaMekanik: string;
  sa: string;
  finalCheck: string;
  adminFjb?: string;
  // Tab: Keterangan
  keterangan?: string;
}

export interface FjbFilters {
  cabangId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface MasterJasaItem {
  kode: string;
  nama: string;
  kategori: string;
  harga: number;
}

export interface MasterPartItem {
  kode: string;
  nama: string;
  harga: number;
}