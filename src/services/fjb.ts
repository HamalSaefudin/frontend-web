import type { FjbListItem, FjbDetail, FjbFilters } from "./fjb-types";

export type { FjbListItem, FjbDetail, FjbFilters };

// TODO: Replace with real API endpoint
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFjbList = async (_filters: FjbFilters): Promise<FjbListItem[]> => {
  // Mock data
  return [
    {
      id: "1",
      tanggalFjb: "2026-04-29",
      noFjb: "FJB-2026-0001",
      noPolisi: "B 1234 XYZ",
      namaPemilik: "John Doe",
      namaPembawa: "Jane Doe",
      noMesin: "NM123456789",
      noRangka: "NR987654321",
      kodeVarian: "VAR001",
      kodeWarna: "WR001",
      namaWarna: "Hitam",
      status: "DRAFT",
    },
  ];
};

// TODO: Replace with real API endpoint
export const getFjbDetail = async (id: string): Promise<FjbDetail> => {
  return {
    id,
    cabangId: "1",
    noBooking: "BK-2026-0001",
    noFjb: "FJB-2026-0001",
    noProspect: "PR-001",
    tanggalFjb: "2026-04-29",
    jenisProspect: "INDIVIDU",
    tipeFjb: "REGULER",
    noHotline: "0800123456",
    workOrderType: "work-order",
    nomorPolisi: "B 1234 XYZ",
    namaVarian: "Beat CBS",
    nomorRangka: "NR987654321",
    tahunMotor: 2024,
    nomorMesin: "NM123456789",
    informasiBensin: "Full",
    kodeVarian: "VAR001",
    kmTerakhir: 15000,
    isPerusahaan: false,
    namaPemilik: "John Doe",
    jenisKelamin: "L",
    nik: "1234567890123456",
    pekerjaan1: "PNS",
    noHp1: "081234567890",
    pekerjaan2: undefined,
    noHp2: undefined,
    agama: "Islam",
    email: "john@example.com",
    pembawaIsPerusahaan: false,
    pembawaNama: "Jane Doe",
    pembawaJenisKelamin: "P",
    pembawaNik: "9876543210987654",
    pembawaPekerjaan1: "Wiraswasta",
    pembawaNoHp1: "089876543210",
    pembawaPekerjaan2: undefined,
    pembawaNoHp2: undefined,
    pembawaAgama: "Islam",
    pembawaEmail: "jane@example.com",
    rekomendasiSa: "Servis rutin",
    keluhanKonsumen: "Mesin tidak nyala",
    jobs: [],
    partsWithQr: [],
    partsWithoutQr: [],
    noWorkOrder: "WO-001",
    jenisPit: "FAST",
    tanggalService: "2026-04-29",
    waktuPendaftaran: "2026-04-29T08:00:00Z",
    waktuPkb: "2026-04-29T09:00:00Z",
    waktuSelesai: "2026-04-29T12:00:00Z",
    asalUnitEntry: "SHOWROOM",
    totalFrt: 120,
    namaMekanik: "Mekanik 1",
    sa: "SA 1",
    finalCheck: "FC 1",
    adminFjb: "Admin 1",
    keterangan: undefined,
  };
};

// TODO: Replace with real API endpoint
export const createFjb = async (data: FjbDetail): Promise<FjbDetail> => {
  console.log("Creating FJB:", data);
  return { ...data, id: `fjb-${Date.now()}` };
};

// TODO: Replace with real API endpoint
export const updateFjb = async (id: string, data: FjbDetail): Promise<FjbDetail> => {
  console.log("Updating FJB:", id, data);
  return data;
};

// TODO: Replace with real API endpoint
export const deleteFjb = async (id: string): Promise<void> => {
  console.log("Deleting FJB:", id);
};

// TODO: Replace with real API endpoint
export const validateNomorMesin = async (nomorMesin: string): Promise<boolean> => {
  console.log("Validating nomor mesin:", nomorMesin);
  return nomorMesin.length >= 5;
};

// TODO: Replace with real API endpoint
export const getMasterCabang = async () => {
  return [
    { value: "1", label: "Naga Mas Klaten Tengah" },
    { value: "2", label: "Naga Mas Yogyakarta" },
  ];
};

// TODO: Replace with real API endpoint
export const getMasterTipeFjb = async () => {
  return [
    { value: "REGULER", label: "Reguler" },
    { value: "Khusus", label: "Khusus" },
  ];
};

// TODO: Replace with real API endpoint
export const getMasterVarian = async () => {
  return [
    { value: "VAR001", label: "Beat CBS" },
    { value: "VAR002", label: "Beat Pop" },
    { value: "VAR003", label: "Vario 125" },
  ];
};

// TODO: Replace with real API endpoint
export const getMasterWarna = async () => {
  return [
    { value: "WR001", label: "Hitam" },
    { value: "WR002", label: "Putih" },
    { value: "WR003", label: "Merah" },
  ];
};

// TODO: Replace with real API endpoint
export const getMasterPekerjaan = async () => {
  return [
    { value: "PNS", label: "PNS" },
    { value: "Wiraswasta", label: "Wiraswasta" },
    { value: "Pelajar", label: "Pelajar/Mahasiswa" },
  ];
};

// TODO: Replace with real API endpoint
export const getMasterAgama = async () => {
  return [
    { value: "Islam", label: "Islam" },
    { value: "Kristen", label: "Kristen" },
    { value: "Katholik", label: "Katholik" },
    { value: "Hindu", label: "Hindu" },
    { value: "Buddha", label: "Buddha" },
  ];
};

// TODO: Replace with real API endpoint
export const getMasterJenisKelamin = async () => {
  return [
    { value: "L", label: "Laki-laki" },
    { value: "P", label: "Perempuan" },
  ];
};

// TODO: Replace with real API endpoint
export const getMasterJenisPit = async () => {
  return [
    { value: "FAST", label: "Fast Service" },
    { value: "NORMAL", label: "Normal" },
    { value: "HEAVY", label: "Heavy Service" },
  ];
};

// TODO: Replace with real API endpoint
export const getMasterMekanik = async () => {
  return [
    { value: "MK001", label: "Mekanik 1" },
    { value: "MK002", label: "Mekanik 2" },
  ];
};

// TODO: Replace with real API endpoint
export const getMasterSa = async () => {
  return [
    { value: "SA001", label: "SA 1" },
    { value: "SA002", label: "SA 2" },
  ];
};

// TODO: Replace with real API endpoint
export const getMasterJasa = async () => {
  return [
    { kode: "JS001", nama: "Ganti Oli", kategori: "Service Ringan", harga: 35000 },
    { kode: "JS002", nama: "Tune Up", kategori: "Service Ringan", harga: 50000 },
    { kode: "JS003", nama: "Ganti Kampas Rem", kategori: "Service Berat", harga: 75000 },
  ];
};

// TODO: Replace with real API endpoint
export const getMasterPart = async () => {
  return [
    { kode: "PT001", nama: "Oli Motor 1L", harga: 45000 },
    { kode: "PT002", nama: "Kampas Rem Depan", harga: 35000 },
    { kode: "PT003", nama: "Busi", harga: 25000 },
  ];
};