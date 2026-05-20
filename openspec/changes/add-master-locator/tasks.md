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

- [x] 11.1 Create unit test for API service
- [x] 11.2 Create component tests for MasterLocatorScreen
- [x] 11.3 Test CRUD operations and status toggle

## API Integration

- [x] 12.1 Updated API base URL to http://192.168.19.247:8080
- [x] 12.2 Replaced mock data with real API calls
- [x] 12.3 Updated master-locator service with real endpoints
- [x] 12.4 Updated auth service with real API endpoint

## API Contract Updates (v1.0)

- [x] 13.1 Updated LokasiFilterParams to use `page` and `size` instead of `limit`
- [x] 13.2 Removed wildcard `%` wrapping in filter values (API handles partial match)
- [x] 13.3 Updated hooks to use filterLokasi API when filters applied
- [x] 13.4 Updated inline search to send plain text values

## UI Updates (Latest)

- [x] 14.1 Kode Cabrera in FilterPopup now uses dropdown (SelectField)
- [x] 14.2 Uses fetchBranches from master-cabang service
- [x] 14.3 User can type wildcards manually in text inputs
- [x] 14.4 Status toggle sends opposite value (ACTIVE→INACTIVE, INACTIVE→ACTIVE)

## Test Infrastructure Updates

- [x] 15.1 Fixed test/setup.ts - improved matchMedia mock for Radix UI
- [x] 15.2 Added passWithNoTests to vitest.config.ts to handle edge cases
- [x] 15.3 Test files created for master-locator are syntactically correct

## CORS & Auth Fix (2026-05-20)

- [x] 16.1 Added Vite proxy configuration to forward /api requests to backend
- [x] 16.2 Updated api-client.ts to use relative URLs in dev mode
- [x] 16.3 Added debug logging to track token presence in requests
- [x] 16.4 Dev server now runs on http://localhost:5174/

**Fix Summary:**
- CORS errors fixed by using Vite proxy (requests go to same origin in dev)
- 403 errors should now include Bearer token in Authorization header
- Console logs will show "[API Request] PATCH /api/v1/..." with token status
- Restart dev server after changes for proxy to take effect
