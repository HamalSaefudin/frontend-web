## 1. Feature Scaffold & Navigation

- [x] 1.1 Create module structure `src/modules/fjb/` with `FjbScreen.tsx`, `components/`, `hooks/`, `schemas/`, `constants/`, and `types/`
- [x] 1.2 Register FJB route in `src/App.tsx`
- [x] 1.3 Add navigation/menu entry for FJB in `src/layouts/Constants.ts` (`NAV_GROUPS`)

## 2. Data Contracts, Mock Data, and Service Layer

- [x] 2.1 Define TypeScript interfaces: `FjbListItem`, `FjbDetail`, `FjbJob`, `FjbPart`, `FjbFilters`
- [x] 2.2 Create `src/services/fjb.ts` with mock list, detail, create, update, delete functions
- [x] 2.3 Add service parameters for `cabangId`, `startDate`, `endDate`, `search`, `page`, `pageSize`
- [x] 2.4 Add adapter/helpers for mapping API responses into form state
- [x] 2.5 Mark all mock API calls with `// TODO: Replace with real API endpoint`

## 3. Validation Schema & Form State

- [x] 3.1 Create validation schema for list filters (`FjbFilters`)
- [x] 3.2 Create validation schema for FJB form (all tabs)
- [x] 3.3 Create schema for job/transaction line items with `isSaved` flag
- [x] 3.4 Enforce field-level validation for mandatory fields (marked with *)
- [x] 3.5 Enforce business rules: unique nomor polisi, valid nomor mesin (CEK button)

## 4. List Page UI

- [x] 4.1 Build list page header and toolbar based on `docs/fjb/REQUIREMENT_FJB.md`
- [x] 4.2 Implement filter controls: dropdown cabang, date range picker, search input
- [x] 4.3 Implement `Cari` button to refresh data table using active filters
- [x] 4.4 Render table columns: No, Tanggal FJB, No FJB, No Polisi, Nama Pemilik, Nama Pembawa, No Mesin, No Rangka, Kode Varian, Kode Warna, Nama Warna, Status, Aksi
- [x] 4.5 Add status badge for COMPLETED/DRAFT/DELETED
- [x] 4.6 Add aksi buttons: View, Edit, Delete, Print
- [x] 4.7 Add loading, empty, and error states for the list
- [x] 4.8 Add pagination support

## 5. Form Modal Shell & Header Section

- [x] 5.1 Create `FjbFormModal.tsx` as modal orchestrator
- [x] 5.2 Setup React Hook Form with `FormProvider` and `zodResolver`
- [x] 5.3 Implement form modes: create, edit, view
- [x] 5.4 Render header fields: Cabang, No Booking, No Faktur, No Prospect, Tanggal, Jenis Prospect, Tipe FJB, No Hotline
- [x] 5.5 Implement radio buttons: Work Order / Direct Sales
- [x] 5.6 Implement footer actions: Clear, Confirm Order

## 6. Tab Navigation & Tab Files Structure

- [x] 6.1 Create `components/tabs/` directory
- [x] 6.2 Create `DataUnitTab.tsx` - Nomor Polisi, Nama Varian, Nomor Rangka, Tahun Motor, Nomor Mesin (dengan CEK button), Informasi Bensin, Kode Varian, KM Terakhir
- [x] 6.3 Create `DataPemilikTab.tsx` - checkbox perusahaan, nama, jenis kelamin, NIK, pekerjaan, no HP, agama, email
- [x] 6.4 Create `DataPembawaTab.tsx` - similar structure to Data Pemilik
- [x] 6.5 Create `AnalisaTab.tsx` - rekomendasi SA, keluhan konsumen
- [x] 6.6 Create `DataTransaksiTab.tsx` - jobs table, parts with QR table, parts without QR table, summary
- [x] 6.7 Create `DataTambahanTab.tsx` - work order info, mechanic, SA, timestamps
- [x] 6.8 Create `KeteranganTab.tsx` - free text optional field

## 7. Data Transaksi Tab - Line Items Management

- [x] 7.1 Implement `useFieldArray` for jobs, parts with QR, parts without QR
- [x] 7.2 Render job table columns: Kode Jasa, Nama Jasa, Service Category, Harga Sistem, Harga Diberikan, Diskon %, Estimasi Waktu, Total Harga
- [x] 7.3 Render part table columns: Kode, Nama, Qty, Harga, Total
- [x] 7.4 Implement `+ Tambah` button for each table
- [x] 7.5 Implement inline row editing with `isSaved` pattern
- [x] 7.6 Implement row deletion and renumbering
- [x] 7.7 Calculate and display summary: Total Estimasi Waktu, Total Sebelum Diskon, Diskon, Total Setelah Diskon

## 8. View/Edit/Delete Actions

- [x] 8.1 Implement View mode: all fields disabled, hide submit button, show "Close" button
- [x] 8.2 Implement Edit mode: prefill form with existing data, show submit button
- [x] 8.3 Implement Delete confirmation using `AlertDialog`
- [x] 8.4 Add Print action placeholder

## 9. Form Submission Flow

- [x] 9.1 Run validation for all tabs before submit
- [x] 9.2 Submit create/update payload through service mutation
- [x] 9.3 Show success and error feedback
- [x] 9.4 Close modal after successful operation
- [x] 9.5 Refresh list data after successful create/update

## 10. UX Polish & Error Handling

- [x] 10.1 Disable submit while processing request is in flight
- [x] 10.2 Surface inline validation messages on invalid fields
- [x] 10.3 Preserve modal state when validation fails
- [x] 10.4 Show "Simpan" / "Saving..." text based on `isSubmitting` state

## 11. Testing & Verification

- [x] 11.1 Add tests for list rendering, filter interactions, and empty state
- [x] 11.2 Add tests for modal open/prefill behavior from Edit action
- [x] 11.3 Add tests for tab navigation and tab content switching
- [x] 11.4 Add tests for `+ Tambah`, delete row, and row renumbering in transaction tables
- [x] 11.5 Add tests for validation rules: required fields, unique constraints
- [x] 11.6 Add tests for successful create/edit flow: validate, call service, close modal, refresh list
- [x] 11.7 Run `npm run build` and resolve any TypeScript errors
- [x] 11.8 Run `npm run lint` and resolve any linting errors

## Notes

- All TypeScript errors in FJB module have been resolved
- Pre-existing errors in `ekspedisi-inventory` module are not part of this change
- Test file created at `test/modules/fjb-screen.test.tsx`
- Route: `/fjb` accessible via "Transaction" menu → "Faktur Jual Bengkel"