## 1. Feature Scaffold & Navigation

- [x] 1.1 Create module structure `src/modules/ekspedisi-inventory/` with `EkspedisiInventoryScreen.tsx`, `components/`, `hooks/`, `schemas/`, `types/`, and `constants/`
- [x] 1.2 Register Ekspedisi Inventory route in `src/App.tsx`
- [x] 1.3 Add navigation/menu entry for Ekspedisi Inventory in the appropriate layout constants

## 2. Data Contracts, Mock Data, and Service Layer

- [x] 2.1 Define TypeScript interfaces for list item, detail header, KSU item, filters, and process payload
- [x] 2.2 Create `src/services/ekspedisi-inventory.ts` with mock list, detail, and process/update functions
- [x] 2.3 Add service parameters for `status`, `keyword`, `page`, and `pageSize`
- [x] 2.4 Add adapter/helpers for mapping API detail response into modal form state

## 3. Validation Schema & Form State

- [x] 3.1 Create validation schema for list filters
- [x] 3.2 Create validation schema for KSU row fields, including required `kodeKsu`
- [x] 3.3 Enforce table-level validation for minimum one KSU item
- [x] 3.4 Enforce duplicate KSU prevention across rows
- [x] 3.5 Enforce business rule: if `Menyusul = false`, then `Scan` must be provided/checked

## 4. List Page UI

- [x] 4.1 Build list page header and toolbar based on `docs/inventory.html`
- [x] 4.2 Implement filter controls for Status dropdown and keyword search input
- [x] 4.3 Implement `Cari` button to refresh data table using active filters
- [x] 4.4 Render table columns: No, Tanggal FJ, No FJ, Nama Pembeli, Kode Varian, Nama Varian, Kode Warna, Nama Warna, Nomor Mesin, Nomor Rangka, Status, Aksi
- [x] 4.5 Add loading, empty, and error states for the list
- [x] 4.6 Add pagination support if data volume requires it in service/query contract

## 5. Edit Modal Shell & Header Section

- [x] 5.1 Create reusable modal for edit/process flow using project-standard modal component
- [x] 5.2 Render read-only header fields: Cabang, Tipe Unit, No FJ, No PDI, Warna Unit, No Rangka, No Ekspedisi, No Mesin, Nama Pembeli
- [x] 5.3 Prefill modal data from selected row detail response
- [x] 5.4 Implement footer actions for Refresh, Cetak, and Proses

## 6. Tab Navigation & Non-KSU Tab Scaffolding

- [x] 6.1 Implement tabs: KSU, Hadiah, Barang Lain, Part, Sopir, and Foto
- [x] 6.2 Set KSU as default active tab when modal opens
- [x] 6.3 Scaffold placeholder/container states for Hadiah, Barang Lain, Part, Sopir, and Foto tabs

## 7. KSU Table Management

- [x] 7.1 Render KSU table columns: No, Kode KSU, Nama KSU, Jenis KSU, QR Code, Scan, Menyusul, Aksi
- [x] 7.2 Implement `+ Tambah` action to append a new KSU row
- [x] 7.3 Implement row deletion and renumbering
- [x] 7.4 Support prefilled KSU items for existing inventory detail data
- [x] 7.5 Handle field editing for kode, nama, jenis, scan, and menyusul values

## 8. Process Submission Flow

- [x] 8.1 Validate header/detail prerequisites and all KSU business rules before submit
- [x] 8.2 Submit process/update payload through service mutation
- [x] 8.3 Show success and error feedback for process result
- [x] 8.4 Close modal after successful process
- [x] 8.5 Refresh list data after successful process

## 9. UX Polish & Error Handling

- [x] 9.1 Disable submit while processing request is in flight
- [x] 9.2 Surface inline validation messages on invalid KSU rows
- [x] 9.3 Preserve modal state when validation fails
- [x] 9.4 Ensure read-only header fields are visually distinct from editable fields

## 10. Testing & Verification

- [x] 10.1 Add tests for list rendering, filter interactions, and empty state
- [x] 10.2 Add tests for modal open/prefill behavior from Edit action
- [x] 10.3 Add tests for `+ Tambah`, delete row, and row renumbering in KSU table
- [ ] 10.4 Add tests for validation rules: required code, duplicate prevention, minimum one row, and scan requirement
- [x] 10.5 Add tests for successful `Proses` flow: validate, call service, close modal, and refresh list
- [ ] 10.6 Run lint/build/tests and resolve integration issues found during verification
