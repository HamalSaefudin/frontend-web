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

const mockKsous: Array<Pick<EkspedisiInventoryKsuItem, "kodeKsu" | "namaKsu" | "jenisKsu">> = [
  { kodeKsu: "KSU-001", namaKsu: "KSU A", jenisKsu: "KACA" },
  { kodeKsu: "KSU-002", namaKsu: "KSU B", jenisKsu: "PLAT" },
  { kodeKsu: "KSU-003", namaKsu: "KSU C", jenisKsu: "LAMINASI" },
  { kodeKsu: "KSU-004", namaKsu: "KSU D", jenisKsu: "TEMPER" },
]

function buildKsuItem(i: number, overrides?: Partial<EkspedisiInventoryKsuItem>): EkspedisiInventoryKsuItem {
  const base = mockKsous[i % mockKsous.length]
  return {
    id: `ksu-${i}`,
    kodeKsu: base.kodeKsu,
    namaKsu: base.namaKsu,
    jenisKsu: base.jenisKsu,
    qrCode: `QR-${base.kodeKsu}`,
    scan: false,
    menyusul: false,
    ...overrides,
  }
}

const mockEkspedisiInventory: Array<EkspedisiInventoryDetail & { status: EkspedisiInventoryStatus; tanggalFj: string; noFj: string; kodeVarian: string; namaVarian: string; kodeWarna: string; namaWarna: string; noMesin: string; noRangka: string; namaPembeli: string }> =
  [
    {
      id: "inv-1",
      status: "DRAFT",
      tanggalFj: "2026-04-20",
      noFj: "FJ-001",
      namaPembeli: "John Doe",
      kodeVarian: "VAR-125",
      namaVarian: "Vario 125",
      kodeWarna: "W-RED",
      namaWarna: "Merah",
      noMesin: "ME-1001",
      noRangka: "RA-2001",
      cabang: "Jakarta Pusat",
      tipeUnit: "Scooter",
      noPdi: "PDI-001",
      warnaUnit: "Merah",
      noEkspedisi: "EXP-01",
      items: [buildKsuItem(0), buildKsuItem(1, { kodeKsu: "KSU-010" })],
    },
    {
      id: "inv-2",
      status: "DRAFT",
      tanggalFj: "2026-04-21",
      noFj: "FJ-002",
      namaPembeli: "Jane Smith",
      kodeVarian: "VAR-150",
      namaVarian: "Vario 150",
      kodeWarna: "W-BLK",
      namaWarna: "Hitam",
      noMesin: "ME-1002",
      noRangka: "RA-2002",
      cabang: "Bandung",
      tipeUnit: "Scooter",
      noPdi: "PDI-002",
      warnaUnit: "Hitam",
      noEkspedisi: "EXP-02",
      items: [buildKsuItem(2, { kodeKsu: "KSU-020" }), buildKsuItem(3, { kodeKsu: "KSU-021" })],
    },
    {
      id: "inv-3",
      status: "PROCESSED",
      tanggalFj: "2026-04-22",
      noFj: "FJ-003",
      namaPembeli: "Budi Santoso",
      kodeVarian: "VAR-160",
      namaVarian: "Vario 160",
      kodeWarna: "W-GRN",
      namaWarna: "Hijau",
      noMesin: "ME-1003",
      noRangka: "RA-2003",
      cabang: "Surabaya",
      tipeUnit: "Scooter",
      noPdi: "PDI-003",
      warnaUnit: "Hijau",
      noEkspedisi: "EXP-03",
      items: [buildKsuItem(0, { kodeKsu: "KSU-030", scan: true, menyusul: true })],
    },
  ]

// TODO: Replace with real API endpoint when backend is ready
export const fetchEkspedisiInventoryList = async (
  page: number = 1,
  pageSize: number = 5,
  filters?: EkspedisiInventoryFilters,
): Promise<{ data: EkspedisiInventoryListItem[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockEkspedisiInventory]

      if (filters) {
        if (filters.status) {
          filtered = filtered.filter((r) => r.status === filters.status)
        }
        if (filters.keyword) {
          const kw = filters.keyword.toLowerCase()
          filtered = filtered.filter((r) => {
            return (
              r.noFj.toLowerCase().includes(kw) ||
              r.namaPembeli.toLowerCase().includes(kw) ||
              r.kodeVarian.toLowerCase().includes(kw) ||
              r.noMesin.toLowerCase().includes(kw) ||
              r.noRangka.toLowerCase().includes(kw)
            )
          })
        }
      }

      const start = (page - 1) * pageSize
      const end = start + pageSize
      const total = filtered.length

      const data: EkspedisiInventoryListItem[] = filtered.slice(start, end).map((r) => ({
        id: r.id,
        tanggalFj: r.tanggalFj,
        noFj: r.noFj,
        namaPembeli: r.namaPembeli,
        kodeVarian: r.kodeVarian,
        namaVarian: r.namaVarian,
        kodeWarna: r.kodeWarna,
        namaWarna: r.namaWarna,
        noMesin: r.noMesin,
        noRangka: r.noRangka,
        status: r.status,
      }))

      resolve({ data, total })
    }, 500)
  })
}

// TODO: Replace with real API endpoint when backend is ready
export const fetchEkspedisiInventoryDetail = async (id: string): Promise<EkspedisiInventoryDetail> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const record = mockEkspedisiInventory.find((r) => r.id === id)
      if (!record) {
        reject(new Error("Inventory ekspedisi tidak ditemukan"))
        return
      }

      resolve({
        id: record.id,
        cabang: record.cabang,
        tipeUnit: record.tipeUnit,
        noFj: record.noFj,
        noPdi: record.noPdi,
        warnaUnit: record.warnaUnit,
        noRangka: record.noRangka,
        noEkspedisi: record.noEkspedisi,
        noMesin: record.noMesin,
        namaPembeli: record.namaPembeli,
        items: record.items.map((it) => ({ ...it })),
      })
    }, 400)
  })
}

export function mapEkspedisiInventoryDetailToProcessFormValues(detail: EkspedisiInventoryDetail): {
  cabang: string
  tipeUnit: string
  noFJ: string
  noPDI: string
  warnaUnit: string
  noRangka: string
  noEkspedisi: string
  noMesin: string
  namaPembeli: string
  items: Array<{
    kodeKsu: string
    namaKsu: string
    jenisKsu: string
    qrCode: string
    scan: boolean
    menyusul: boolean
  }>
} {
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

// TODO: Replace with real API endpoint when backend is ready
export const processEkspedisiInventory = async (payload: EkspedisiInventoryProcessPayload): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const record = mockEkspedisiInventory.find((r) => r.id === payload.id)
      if (!record) {
        reject(new Error("Inventory ekspedisi tidak ditemukan"))
        return
      }

      // Update KSU fields + set status processed.
      const updates = new Map(payload.items.map((it) => [it.kodeKsu.trim().toLowerCase(), it]))
      record.items = record.items.map((existing) => {
        const key = existing.kodeKsu.trim().toLowerCase()
        const update = updates.get(key)
        if (!update) return existing
        return {
          ...existing,
          scan: update.scan,
          menyusul: update.menyusul,
        }
      })

      record.status = "PROCESSED"
      resolve()
    }, 600)
  })
}

