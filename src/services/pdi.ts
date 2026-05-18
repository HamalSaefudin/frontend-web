import type {
  PdiUnit,
  PdiData,
  PdiPhysicalChecklistItem,
  PdiKsuItem,
  PdiHadiahItem,
  PdiBarangLainItem,
  PdiPartItem,
  PdiPhoto,
  PdiFilters,
} from "@/types";

// Mock data for PDI units
const mockPdiUnits: PdiUnit[] = [
  {
    id: "pdi-1",
    noFj: "FJ-2026-001",
    tanggalFj: "2026-04-20",
    kodeVarian: "VAR-125",
    namaVarian: "Vario 125",
    kodeWarna: "W-RED",
    namaWarna: "Merah",
    nomorMesin: "ME-1001",
    nomorRangka: "RA-2001",
    status: "BELUM_PDI",
    cabangId: "cb-1",
    cabangName: "Jakarta Pusat",
    tipeUnit: "Scooter",
    noPdi: "PDI-001",
    keterangan: "Unit baru",
  },
  {
    id: "pdi-2",
    noFj: "FJ-2026-002",
    tanggalFj: "2026-04-21",
    kodeVarian: "VAR-150",
    namaVarian: "Vario 150",
    kodeWarna: "W-BLK",
    namaWarna: "Hitam",
    nomorMesin: "ME-1002",
    nomorRangka: "RA-2002",
    status: "BELUM_PDI",
    cabangId: "cb-1",
    cabangName: "Jakarta Pusat",
    tipeUnit: "Scooter",
    noPdi: "PDI-002",
    keterangan: "Unit baru",
  },
  {
    id: "pdi-3",
    noFj: "FJ-2026-003",
    tanggalFj: "2026-04-22",
    kodeVarian: "VAR-160",
    namaVarian: "Vario 160",
    kodeWarna: "W-GRN",
    namaWarna: "Hijau",
    nomorMesin: "ME-1003",
    nomorRangka: "RA-2003",
    status: "SUDAH_PDI",
    cabangId: "cb-2",
    cabangName: "Bandung",
    tipeUnit: "Scooter",
    noPdi: "PDI-003",
    keterangan: "Selesai",
  },
  {
    id: "pdi-4",
    noFj: "FJ-2026-004",
    tanggalFj: "2026-04-23",
    kodeVarian: "VAR-125",
    namaVarian: "Vario 125",
    kodeWarna: "W-BLU",
    namaWarna: "Biru",
    nomorMesin: "ME-1004",
    nomorRangka: "RA-2004",
    status: "BELUM_PDI",
    cabangId: "cb-2",
    cabangName: "Bandung",
    tipeUnit: "Scooter",
    noPdi: "PDI-004",
    keterangan: "Unit baru",
  },
  {
    id: "pdi-5",
    noFj: "FJ-2026-005",
    tanggalFj: "2026-04-24",
    kodeVarian: "VAR-150",
    namaVarian: "Vario 150",
    kodeWarna: "W-RED",
    namaWarna: "Merah",
    nomorMesin: "ME-1005",
    nomorRangka: "RA-2005",
    status: "SUDAH_PDI",
    cabangId: "cb-3",
    cabangName: "Surabaya",
    tipeUnit: "Scooter",
    noPdi: "PDI-005",
    keterangan: "Selesai",
  },
];

// Mock physical checklist items
const mockChecklistItems: PdiPhysicalChecklistItem[] = [
  { id: "cl-1", namaItem: "Kondisi Body", status: "OK" },
  { id: "cl-2", namaItem: "Kondisi Mesin", status: "OK" },
  { id: "cl-3", namaItem: "Kondisi Ban", status: "OK" },
  { id: "cl-4", namaItem: "Lampu Depan", status: "OK" },
  { id: "cl-5", namaItem: "Lampu Belakang", status: "OK" },
  { id: "cl-6", namaItem: "Spion", status: "OK" },
  { id: "cl-7", namaItem: "Klakson", status: "OK" },
  { id: "cl-8", namaItem: "Kunci Kontak", status: "OK" },
  { id: "cl-9", namaItem: "Bensin", status: "OK" },
  { id: "cl-10", namaItem: "Oli Mesin", status: "OK" },
  { id: "cl-11", namaItem: "Rem Depan", status: "OK" },
  { id: "cl-12", namaItem: "Rem Belakang", status: "OK" },
  { id: "cl-13", namaItem: "Kompor", status: "OK" },
  { id: "cl-14", namaItem: "Toolkit", status: "OK" },
  { id: "cl-15", namaItem: "Helm", status: "OK" },
];

// TODO: Replace with real API endpoint when backend is ready
export const fetchPdiUnits = async (
  page: number = 1,
  pageSize: number = 10,
  filters?: PdiFilters
): Promise<{ data: PdiUnit[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockPdiUnits];

      if (filters) {
        if (filters.cabangId) {
          filtered = filtered.filter((r) => r.cabangId === filters.cabangId);
        }
        if (filters.status) {
          filtered = filtered.filter((r) => r.status === filters.status);
        }
        if (filters.filterBy && filters.search) {
          const search = filters.search.toLowerCase();
          if (filters.filterBy === "NOMOR_MESIN") {
            filtered = filtered.filter((r) =>
              r.nomorMesin.toLowerCase().includes(search)
            );
          } else if (filters.filterBy === "KODE_VARIAN") {
            filtered = filtered.filter((r) =>
              r.kodeVarian.toLowerCase().includes(search)
            );
          }
        }
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const total = filtered.length;

      resolve({
        data: filtered.slice(start, end),
        total,
      });
    }, 500);
  });
};

// TODO: Replace with real API endpoint when backend is ready
export const fetchPdiUnitById = async (id: string): Promise<PdiUnit> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const unit = mockPdiUnits.find((r) => r.id === id);
      if (!unit) {
        reject(new Error("Unit PDI tidak ditemukan"));
        return;
      }
      resolve({ ...unit });
    }, 400);
  });
};

// TODO: Replace with real API endpoint when backend is ready
export const fetchPdiData = async (unitId: string): Promise<PdiData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const unit = mockPdiUnits.find((r) => r.id === unitId);
      if (!unit) {
        reject(new Error("Unit PDI tidak ditemukan"));
        return;
      }
      resolve({
        unitId,
        unit: { ...unit },
        checklist: mockChecklistItems.map((item) => ({ ...item })),
        ksu: [],
        hadiah: [],
        barangLain: [],
        parts: [],
        photos: [],
      });
    }, 400);
  });
};

// TODO: Replace with real API endpoint when backend is ready
export const savePdiChecklist = async (
  _unitId: string,
  _checklist: PdiPhysicalChecklistItem[]
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

// TODO: Replace with real API endpoint when backend is ready
export const savePdiKsu = async (
  _unitId: string,
  _ksu: PdiKsuItem[]
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

// TODO: Replace with real API endpoint when backend is ready
export const savePdiHadiah = async (
  _unitId: string,
  _hadiah: PdiHadiahItem[]
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

// TODO: Replace with real API endpoint when backend is ready
export const savePdiBarangLain = async (
  _unitId: string,
  _barangLain: PdiBarangLainItem[]
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

// TODO: Replace with real API endpoint when backend is ready
export const savePdiPart = async (
  _unitId: string,
  _parts: PdiPartItem[]
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

// TODO: Replace with real API endpoint when backend is ready
export const uploadPdiPhoto = async (
  _unitId: string,
  photo: { file: File; kategori: PdiPhoto["kategori"] }
): Promise<PdiPhoto> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `photo-${Date.now()}`,
        url: URL.createObjectURL(photo.file),
        kategori: photo.kategori,
        createdAt: new Date().toISOString(),
      });
    }, 500);
  });
};

// TODO: Replace with real API endpoint when backend is ready
export const deletePdiPhoto = async (
  _unitId: string,
  _photoId: string
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

// TODO: Replace with real API endpoint when backend is ready
export const processPdi = async (
  unitId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const unit = mockPdiUnits.find((r) => r.id === unitId);
      if (!unit) {
        reject(new Error("Unit PDI tidak ditemukan"));
        return;
      }
      unit.status = "SUDAH_PDI";
      resolve();
    }, 600);
  });
};

// TODO: Replace with real API endpoint when backend is ready
export const rejectPdi = async (
  unitId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const unit = mockPdiUnits.find((r) => r.id === unitId);
      if (!unit) {
        reject(new Error("Unit PDI tidak ditemukan"));
        return;
      }
      unit.status = "DITOLAK";
      resolve();
    }, 600);
  });
};