# Tasks: add-master-kas

## 1. Setup & Structure

- [x] 1.1 Create module directory `src/modules/master-kas/`
- [x] 1.2 Create component subdirectories: `components/`, `hooks/`
- [x] 1.3 Create type definitions for MasterKas in `src/types/`

## 2. API Service Layer

- [x] 2.1 Add API functions in `src/services/master-kas.ts`:
  - getMasterKasList (paginated, searchable, filterable)
  - createMasterKas
  - updateMasterKas
  - deleteMasterKas
  - updateMasterKasStatus
  - exportMasterKas (print/print)

## 3. Hooks (Consolidated)

- [x] 3.1 Create `src/modules/master-kas/hooks/index.ts` with:
  - useMasterKasList (query with search/filter/pagination)
  - useMasterKasMutations (create, update, delete, updateStatus)

## 4. Components - List Screen

- [x] 4.1 Create `MasterKasScreen.tsx` main container
- [x] 4.2 Implement toolbar with search field and action buttons (Tambah, Cetak)
- [x] 4.3 Implement DataTable with columns: No, Kode Kas, Nama Cabrera, Nama Kas, Status, Aksi
- [x] 4.4 Implement pagination controls

## 5. Components - Filter Popup

- [x] 5.1 Create filter popup component with fields:
  - Kode Kas (text input)
  - Nama Cabrera (searchable select dropdown)
  - Nama Kas (text input)
  - Status (select: All, Aktif, Nonaktif)
- [x] 5.2 Implement Terapkan and Hapus buttons

## 6. Components - Create/Edit Modal

- [x] 6.1 Create `MasterKasFormModal.tsx` using AppModal
- [x] 6.2 Implement form with fields:
  - Kode Kas (text, mandatory) - read-only on edit
  - Nama Cabrera (searchable select, mandatory)
  - Nama Kas (text, mandatory)
  - Status (toggle switch)
- [x] 6.3 Add validation with Zod schema
- [x] 6.4 Implement React Hook Form integration

## 7. Components - Delete Confirmation

- [x] 7.1 Create delete confirmation using AlertDialog
- [x] 7.2 Handle delete API call on confirm

## 8. Row Actions

- [x] 8.1 Implement Edit action (opens edit modal)
- [x] 8.2 Implement Delete action (opens confirmation)
- [x] 8.3 Implement inline status toggle

## 9. Print/Export

- [x] 9.1 Implement print functionality (PDF/Excel export)
- [x] 9.2 Apply current filter to export

## 10. Integration

- [x] 10.1 Register MasterKasScreen in App.tsx routes
- [x] 10.2 Add navigation link in sidebar (if applicable)

## 11. Testing

- [x] 11.1 Create unit test for API service
- [x] 11.2 Create component tests for MasterKasScreen
- [x] 11.3 Test CRUD operations
