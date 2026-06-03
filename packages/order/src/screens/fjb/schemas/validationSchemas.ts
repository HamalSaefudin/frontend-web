import { z } from "zod";

export const fjbFiltersSchema = z.object({
  cabangId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
});

export const fjbJobSchema = z.object({
  id: z.string().optional(),
  kodeJasa: z.string().min(1, "Kode jasa wajib diisi"),
  namaJasa: z.string().min(1, "Nama jasa wajib diisi"),
  serviceCategory: z.string().optional(),
  hargaSistem: z.number().optional(),
  hargaDiberikan: z.number().optional(),
  diskonPersen: z.number().optional(),
  estimasiWaktu: z.number().optional(),
  totalHarga: z.number().optional(),
  isSaved: z.boolean().optional(),
});

export const fjbPartSchema = z.object({
  id: z.string().optional(),
  kodePart: z.string().min(1, "Kode part wajib diisi"),
  namaPart: z.string().min(1, "Nama part wajib diisi"),
  qty: z.number().min(1, "Qty minimal 1").optional(),
  hargaSatuan: z.number().optional(),
  diskonPersen: z.number().optional(),
  totalHarga: z.number().optional(),
  isSaved: z.boolean().optional(),
});

export const fjbDetailSchema = z.object({
  // Header
  cabangId: z.string().min(1, "Cabang wajib diisi"),
  noBooking: z.string().optional(),
  noFjb: z.string().optional(),
  noProspect: z.string().optional(),
  tanggalFjb: z.string().min(1, "Tanggal FJB wajib diisi"),
  jenisProspect: z.string().optional(),
  tipeFjb: z.string().min(1, "Tipe FJB wajib diisi"),
  noHotline: z.string().optional(),
  workOrderType: z.enum(["work-order", "direct-sales"]),
  // Data Unit
  nomorPolisi: z.string().min(1, "Nomor Polisi wajib diisi"),
  namaVarian: z.string().min(1, "Nama Varian wajib diisi"),
  nomorRangka: z.string().min(1, "Nomor Rangka wajib diisi"),
  tahunMotor: z.number().optional(),
  nomorMesin: z.string().min(1, "Nomor Mesin wajib diisi"),
  informasiBensin: z.string().optional(),
  kodeVarian: z.string().min(1, "Kode Varian wajib diisi"),
  kmTerakhir: z.number().min(0, "KM Terakhir wajib diisi"),
  // Data Pemilik
  isPerusahaan: z.boolean().optional(),
  namaPemilik: z.string().min(1, "Nama Pemilik wajib diisi"),
  jenisKelamin: z.enum(["L", "P"]),
  nik: z.string().min(1, "NIK wajib diisi"),
  pekerjaan1: z.string().min(1, "Pekerjaan wajib diisi"),
  noHp1: z.string().min(1, "No HP wajib diisi"),
  pekerjaan2: z.string().optional(),
  noHp2: z.string().optional(),
  agama: z.string().min(1, "Agama wajib dipilih"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  // Data Pembawa
  pembawaIsPerusahaan: z.boolean().optional(),
  pembawaNama: z.string().optional(),
  pembawaJenisKelamin: z.enum(["L", "P"]).optional(),
  pembawaNik: z.string().optional(),
  pembawaPekerjaan1: z.string().optional(),
  pembawaNoHp1: z.string().optional(),
  pembawaPekerjaan2: z.string().optional(),
  pembawaNoHp2: z.string().optional(),
  pembawaAgama: z.string().optional(),
  pembawaEmail: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  // Analisa
  rekomendasiSa: z.string().min(1, "Rekomendasi SA wajib diisi"),
  keluhanKonsumen: z.string().optional(),
  // Data Transaksi
  jobs: z.array(fjbJobSchema).optional(),
  partsWithQr: z.array(fjbPartSchema).optional(),
  partsWithoutQr: z.array(fjbPartSchema).optional(),
  // Data Tambahan
  noWorkOrder: z.string().min(1, "No Work Order wajib diisi"),
  jenisPit: z.string().min(1, "Jenis Pit wajib dipilih"),
  tanggalService: z.string().min(1, "Tanggal Service wajib diisi"),
  waktuPendaftaran: z.string().optional(),
  waktuPkb: z.string().optional(),
  waktuSelesai: z.string().optional(),
  asalUnitEntry: z.string().optional(),
  totalFrt: z.number().optional(),
  namaMekanik: z.string().min(1, "Nama Mekanik wajib dipilih"),
  sa: z.string().min(1, "SA wajib dipilih"),
  finalCheck: z.string().optional(),
  adminFjb: z.string().optional(),
  // Keterangan
  keterangan: z.string().optional(),
});

export type FjbFiltersForm = z.infer<typeof fjbFiltersSchema>;
export type FjbDetailForm = z.infer<typeof fjbDetailSchema>;
export type FjbJobForm = z.infer<typeof fjbJobSchema>;
export type FjbPartForm = z.infer<typeof fjbPartSchema>;