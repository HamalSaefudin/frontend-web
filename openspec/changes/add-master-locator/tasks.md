# Tasks: add-master-locator

## 1. Setup & Structure

- [x] 1.1 Create module directory `src/modules/master-locator/`
- [x] 1.2 Create component subdirectories: `components/`, `hooks/`, `utils/`
- [x] 1.3 Add type definitions for LokasiWarehouse in `src/services/master-locator.ts`

## 2. API Service Layer

- [x] 2.1 Create `src/services/master-locator.ts` with API functions:
  - getLokasiList (paginated, searchable, filterable)
  - createLokasi
  - updateLokasi
  - deleteLokasi
  - getLokasiDetail
  - updateLokasiStatus

## 3. Hooks (Consolidated)

- [x] 3.1 Create `src/modules/master-locator/hooks/index.ts` with:
  - useLokasiList (query with search/filter/pagination)
  - useLokasiMutations (create, update, delete, getDetail, updateStatus)

## 4. Components - List Screen

- [x] 4.1 Create `MasterLocatorScreen.tsx` main container
- [x] 4.2 Implement toolbar with search field and action buttons (Tambah, Filter)
- [x] 4.3 Implement DataTable with columns: No, Kode Lokasi, Kode Cabrera, Nama Lokasi, Status, Aksi
- [x] 4.4 Implement pagination controls

## 5. Components - Filter Popup

- [x] 5.1 Create filter popup component with fields:
  - Kode Lokasi (text input with wildcard support)
  - Kode Cabrera (text input with wildcard support)
  - Nama Lokasi (text input with wildcard support)
- [x] 5.2 Implement Terapkan and Hapus buttons

## 6. Components - Create/Edit Modal

- [x] 6.1 Create `LokasiFormModal.tsx` using AppModal
- [x] 6.2 Implement form with fields:
  - Kode Lokasi (text, mandatory) - read-only on edit
  - Kode Cabrera (searchable select, mandatory)
  - Nama Lokasi (text, mandatory)
- [x] 6.3 Add validation with Zod schema
- [x] 6.4 Implement React Hook Form integration

## 7. Components - Detail View

- [x] 7.1 Create `LokasiDetailModal.tsx` using AppModal
- [x] 7.2 Display all fields in read-only mode using disabled InputField
- [x] 7.3 Show createdAt and updatedAt timestamps (using dayjs)

## 8. Components - Delete Confirmation

- [x] 8.1 Create delete confirmation using AlertDialog
- [x] 8.2 Handle delete API call on confirm

## 9. Row Actions

- [x] 9.1 Implement Edit action (opens edit modal)
- [x] 9.2 Implement Delete action (opens confirmation)
- [x] 9.3 Implement View Detail action (opens detail modal)
- [x] 9.4 Implement Status toggle action (activate/deactivate)

## 10. Integration

- [x] 10.1 Register MasterLocatorScreen in App.tsx routes at `/master-locator`
- [x] 10.2 Add navigation link in sidebar (NAV_GROUPS in layouts/Constants.ts)

## 11. Testing

- [ ] 11.1 Create unit test for API service
- [x] 11.2 Create component tests for MasterLocatorScreen
- [ ] 11.3 Test CRUD operations and status toggle
