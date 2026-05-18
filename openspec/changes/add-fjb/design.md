## Context

Fitur Faktur Jual Bengkel (FJB) mengelola transaksi bengkel di NOS. Berdasarkan `docs/fjb/REQUIREMENT_FJB.md`, user harus dapat melihat list FJB, filter berdasarkan periode/cabang, membuat/edit FJB via modal multi-tab, dan aksi print. Prototype `docs/fjb/prototype.html` menjadi acuan utama untuk struktur visual: toolbar filter, tabel list, modal form, dan tab-tab operasional (Data Unit, Data Pemilik, Data Pembawa, Analisa, Data Transaksi, Data Tambahan, Keterangan).

Arsitektur aplikasi saat ini menggunakan React, TypeScript, feature-based modules, service layer terpisah, hooks untuk query/mutation, dan komponen UI reusable. Fitur FJB perlu mengikuti pola yang sama agar mudah dirawat dan konsisten dengan modul lain seperti master data dan ekspedisi inventory.

Constraints:
- HTML mockup adalah reference only — rebuild dengan reusable components dari `@/components/ui/*`
- Multi-tab forms harus split ke files (`tabs/<TabName>Tab.tsx`)
- Dates gunakan Day.js (`@/lib/dayjs`), bukan `new Date()`
- Form menggunakan React Hook Form dengan Zod validation
- API calls hanya di `/src/services/`, tidak di components
- Hooks di `/src/modules/fjb/hooks/`, maksimal 1-2 files

## Goals / Non-Goals

**Goals:**
- Menyediakan halaman list FJB dengan filter periode, cabang, dan search.
- Menyediakan tabel data dengan kolom sesuai requirement (No, Tanggal FJB, No FJB, No Polisi, Nama Pemilik, dll).
- Menyediakan modal create/edit FJB dengan 7 tab sesuai prototype.
- Menyediakan form validation untuk field mandatory dan aturan bisnis.
- Menyediakan aksi View, Edit, Delete, dan Print.

**Non-Goals:**
- Membangun workflow approval atau multi-step process.
- Backend integration penuh — service layer dengan mock data dan TODO marker.
- Print PDF generation — hanya trigger print action placeholder.

## Decisions

### Decision 1: Gunakan List Page + Modal Form Sebagai Alur Utama
**Approach**: User bekerja dari satu halaman list, lalu melakukan create/edit melalui modal multi-tab.

**Rationale**:
- Sesuai requirement dan prototype.
- Mempercepat alur operasional tanpa perpindahan halaman.
- Konsisten dengan pola UI modul lain.

**Alternative Considered**: Halaman detail terpisah → ditolak karena tidak sesuai prototype.

### Decision 2: Multi-Tab Form dengan Split Files
**Approach**: Setiap tab panel berada di file terpisah (`tabs/<TabName>Tab.tsx`). Orchestrator (`FjbFormModal.tsx`) hanya menangani modal wrapper, RHF setup, dan tab routing.

**Rationale**:
- Sesuai CLAUDE.md rule: "Multi-tab forms split tabs into files"
- Memudahkan maintenance dan readability
- Tab files own `<TabsContent>` wrapper dan tab-local state

**Alternative Considered**: Semua tab dalam satu file → ditolak karena melanggar CLAUDE.md rule dan sulit maintenance.

### Decision 3: Form State Management dengan React Hook Form + Zod
**Approach**: Gunakan `useForm`, `FormProvider`, dan `zodResolver` untuk form state dan validation.

**Rationale**:
- Standar project yang sudah berlaku
- Mendukung mode create/edit/view dalam satu component
- Validation rules terpusat di schema

**Alternative Considered**: Local state per field → ditolak karena tidak konsisten dengan pola project.

### Decision 4: Tab Data Transaksi dengan Nested Line Items
**Approach**: Job/Jasa Bengkel dan Part menggunakan `useFieldArray` untuk dynamic rows. Setiap row punya `isSaved: boolean` untuk inline editing.

**Rationale**:
- Sesuai CLAUDE.md `isSaved` pattern untuk inline row editing
- Mendukung multiple simultaneous edits
- Fleksibel untuk prefilled data dari mode edit

**Alternative Considered**: Static rows dengan fixed quantity → ditolak karena tidak mengakomodasi dynamic items.

### Decision 5: Service Layer dengan Mock Data dan TODO Markers
**Approach**: Service functions menggunakan mock data dengan `// TODO: Replace with real API endpoint` comment.

**Rationale**:
- Sesuai CLAUDE.md rule
- Memudahkan development sebelum backend ready
- Contract interface tetap jelas

**Alternative Considered**: Hardcoded data tanpa TODO → ditolak karena tidak memberi signal untuk integration.

## Data Models

### FJB List Item
```typescript
interface FjbListItem {
  id: string;
  tanggalFjb: string; // ISO date
  noFjb: string;
  noPolisi: string;
  namaPemilik: string;
  namaPembawa: string;
  noMesin: string;
  noRangka: string;
  kodeVarian: string;
  kodeWarna: string;
  namaWarna: string;
  status: "COMPLETED" | "DRAFT" | "DELETED";
}
```

### FJB Detail (Header)
```typescript
interface FjbDetail {
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
```

### Transaction Line Items
```typescript
interface FjbJob {
  id?: string;
  kodeJasa: string;
  namaJasa: string;
  serviceCategory: string;
  hargaSistem: number;
  hargaDiberikan: number;
  diskonPersen: number;
  estimasiWaktu: number;
  totalHarga: number;
  isSaved?: boolean; // frontend-only flag
}

interface FjbPart {
  id?: string;
  kodePart: string;
  namaPart: string;
  qty: number;
  hargaSatuan: number;
  diskonPersen: number;
  totalHarga: number;
  isSaved?: boolean; // frontend-only flag
}
```

## Risks / Trade-offs

**[HTML Mockup Layout vs Component-Based Rebuild]** → Risk mismatch dengan prototype visual. Mitigasi: gunakan struktur HTML mockup sebagai reference untuk field placement dan tab structure, rebuild dengan UI components.

**[Multi-Tab Form Complexity]** → Risk form state management complexity dengan banyak tabs. Mitigasi: gunakan `FormProvider` untuk share state, split tabs ke files, local state per tab.

**[Validation Rules Across Tabs]** → Risk validasi tidak catch error antar tab. Mitigasi: run validation on submit, aggregate errors, scroll to first error.

## Migration Plan

**Phase 1: Foundation**
1. Buat module `fjb` dengan struktur sesuai CLAUDE.md
2. Buat service `fjb.ts` dengan mock data dan TODO markers
3. Definisikan TypeScript interfaces dan validation schemas

**Phase 2: List Page**
1. Implementasi list page dengan filter controls (Cabang, Periode, Search)
2. Implementasi data table dengan kolom sesuai requirement
3. Add pagination support

**Phase 3: Form Modal Shell**
1. Buat `FjbFormModal.tsx` sebagai orchestrator
2. Setup RHF dengan `FormProvider`
3. Implement tab navigation
4. Buat tab files: `tabs/DataUnitTab.tsx`, `tabs/DataPemilikTab.tsx`, dll.

**Phase 4: Transaction Tab with Line Items**
1. Implementasi `useFieldArray` untuk jobs dan parts
2. Implementasi inline row editing dengan `isSaved` pattern
3. Add dynamic row add/remove functionality

**Phase 5: Validation & Submission**
1. Complete Zod validation schemas
2. Implement submit flow dengan validation
3. Connect to service mutation
4. Handle success/error feedback

**Phase 6: Actions**
1. Implement View mode (read-only, hide submit)
2. Implement Delete confirmation (AlertDialog)
3. Add Print action placeholder

**Rollback Strategy**: Sembunyikan route/menu modul FJB dan isolate changes di module baru bila perlu ditunda.

## Open Questions

1. Apakah No FJB auto-generated oleh backend atau perlu generate di frontend?
2. Apakah CEK button (validasi nomor mesin) calling API atau hanya client-side check?
3. Apakah dropdown fields (Cabang, Tipe FJB, Varian, Warna, dll) menggunakan master data service atau local options?
4. Bagaimana alur Print FJB — generate PDF di frontend atau call backend endpoint?
5. Apakah status FJB bisa diubah dari DRAFT ke COMPLETED melalui edit form?
6. Apakah field "Jenis Pit" harus dari dropdown master data atau free text?