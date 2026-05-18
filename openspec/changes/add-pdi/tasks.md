## 1. Project Setup

- [x] 1.1 Create new PDI module directory structure at src/modules/pdi/
- [x] 1.2 Add PDI types to src/types/index.ts for TypeScript interfaces
- [x] 1.3 Create PDI service file src/services/pdi.ts with mock data and API methods
- [x] 1.4 Add PDI route to src/App.tsx

## 2. PDI List Page

- [x] 2.1 Create PDI list page component src/modules/pdi/PDIListPage.tsx
- [x] 2.2 Implement branch dropdown selector at top of page
- [x] 2.3 Create tabs component for "Belum PDI" and "Sudah PDI"
- [x] 2.4 Create unit table with all required columns
- [x] 2.5 Implement pagination controls for the table
- [x] 2.6 Add "Proses PDI" action button in Actions column
- [x] 2.7 Implement filter dropdown (Nomor Mesin, Kode Varian)
- [x] 2.8 Implement search input and "Cari" button

## 3. PDI Process Modal

- [x] 3.1 Create PDI modal component with full-width layout
- [x] 3.2 Implement read-only header with 3-column grid (Cabang, Warna Unit, No. FJ, No. PDI, No. Mesin, Keterangan, Tipe Unit, No. Rangka)
- [x] 3.3 Create tab navigation component for 6 tabs
- [x] 3.4 Implement footer buttons (Refresh, Simpan, Tolak, Proses)
- [x] 3.5 Connect modal open/close with PDIListPage action button

## 4. Cek Fisik Unit Tab (Physical Checklist)

- [x] 4.1 Create physical checklist form component
- [x] 4.2 Implement checklist items with OK/Not OK selection
- [x] 4.3 Add notes field that appears when item is marked Not OK
- [x] 4.4 Implement save functionality for checklist data

## 5. KSU Tab (Accessories)

- [x] 5.1 Create KSU list component with CRUD operations
- [x] 5.2 Add "Tambah" button and form for new KSU items
- [x] 5.3 Implement edit functionality for existing KSU items
- [x] 5.4 Implement delete functionality with confirmation
- [x] 5.5 Add quantity input field
- [x] 5.6 Add condition dropdown (Baik/Damage/Rusak)

## 6. Hadiah Tab (Gifts)

- [x] 6.1 Create Hadiah list component with CRUD operations
- [x] 6.2 Add "Tambah" button and form for new gift items
- [x] 6.3 Implement edit functionality for existing gift items
- [x] 6.4 Implement delete functionality with confirmation
- [x] 6.5 Add quantity input field
- [x] 6.6 Add notes/keterangan field

## 7. Barang Lain Tab (Other Items)

- [x] 7.1 Create Barang Lain list component with CRUD operations
- [x] 7.2 Add "Tambah" button and form for new items
- [x] 7.3 Implement edit functionality for existing items
- [x] 7.4 Implement delete functionality with confirmation
- [x] 7.5 Add quantity input field
- [x] 7.6 Add notes/keterangan field

## 8. Part Tab

- [x] 8.1 Create Part list component with CRUD operations
- [x] 8.2 Add "Tambah" button and form for new parts
- [x] 8.3 Implement edit functionality for existing parts
- [x] 8.4 Implement delete functionality with confirmation
- [x] 8.5 Add quantity input field
- [x] 8.6 Add condition dropdown (Baik/Damage/Rusak)
- [x] 8.7 Add notes/keterangan field

## 9. Foto Tab (Photo Upload)

- [x] 9.1 Create photo upload component with file input
- [x] 9.2 Implement thumbnail display for uploaded photos
- [x] 9.3 Add photo preview modal on thumbnail click
- [x] 9.4 Implement photo deletion with confirmation
- [x] 9.5 Add photo type categorization dropdown
- [x] 9.6 Support multiple photo uploads

## 10. Modal Actions & Integration

- [x] 10.1 Implement Refresh button to reload all PDI data
- [x] 10.2 Implement Simpan (Save) button to persist current state
- [x] 10.3 Implement Tolak (Reject) button to mark unit as rejected
- [x] 10.4 Implement Proses (Process) button to complete PDI with validation
- [x] 10.5 Connect modal data to React Query mutations
- [x] 10.6 Implement optimistic UI updates for status changes

## 11. Backend Integration (Deferred)

- [x] 11.1 [DEFERRED] Replace mock data with actual API integration
- [x] 11.2 [DEFERRED] Add API error handling and retry logic
- [x] 11.3 [DEFERRED] Implement file upload API for photos
- [x] 11.4 [DEFERRED] Add real-time status updates via WebSocket

## 12. Testing

- [x] 12.1 Add unit tests for PDIListPage component
- [x] 12.2 Add unit tests for PDI modal components
- [x] 12.3 Add unit tests for each tab component
- [x] 12.4 Add integration tests for PDI workflow
- [x] 12.5 Test pagination and filtering functionality
