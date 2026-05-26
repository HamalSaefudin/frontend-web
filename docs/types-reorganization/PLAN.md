# Plan: Reorganize Types to `src/types/` by Module

## Overview

Move all types from `src/services/` files to `src/types/` directory, organized by module. Generic types (ApiResponse, MutationResponse, etc.) will stay in `src/types/index.ts`.

---

## Current State

### Files with Types in `src/services/`

| File | Types Present |
|------|--------------|
| `ekspedisi-inventory.ts` | 6 interfaces + 1 type alias |
| `fjb-types.ts` | 6 interfaces + 2 type alias |
| `master-cabang.ts` | Branch interface |
| `master-coa.ts` | 5 interfaces + error constants |
| `master-locator.ts` | 2 interfaces |
| `master-service.ts` | Service interface |

### Duplicate Types (to consolidate)

| Type | Defined In |
|------|-----------|
| `MutationResponse` | master-cabang, master-kas, master-locator, master-service |
| `ApiResponse` | master-coa, master-locator |
| `Branch` | master-cabang, master-service |

---

## Proposed Structure

```
src/types/
├── index.ts                    # Generic types only
├── types-auth.ts              # Auth types
├── types-fjb.ts               # FJB types
├── types-ekspedisi.ts          # Ekspedisi types
├── types-master-cabang.ts      # Branch interface
├── types-master-coa.ts         # COA types
├── types-master-locator.ts     # Lokasi/Warehouse types
├── types-master-service.ts    # Service interface
├── types-pdi.ts               # PDI types
└── types-master-kas.ts         # MasterKas types
```

---

## Step-by-Step Implementation

### Step 1: Update `src/types/index.ts`

Keep only generic types:

```typescript
// Generic API types
export interface IApiResponse<T = unknown> {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
  errors: { field: string; message: string }[];
}

export interface IMutationResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: string;
  };
}

export interface IPaginatedDataResponse<T> {
  items: T[];
  pagination: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface IApiError {
  status: number;
  message: string;
  code?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
```

**Keep in index.ts (generic):**
- IApiResponse, IMutationResponse, IPaginatedDataResponse, IApiError, SelectOption

**Remove from index.ts (move to types-*.ts):**
- User
- AuthResponse, LoginRequest, RegisterRequest, TokenData, AuthApiResponse
- Lead, Stats, Report, Settings
- All PDI types (PdiUnit, PdiData, PdiPhysicalChecklistItem, etc.)
- All MasterKas types (MasterKas, MasterKasFilters, MasterKasResponse)
- ApiResponse (replace with IApiResponse)

---

### Step 2: Create `src/types/types-auth.ts`

Move from `index.ts`:
- `AuthApiResponse`
- `LoginRequest`
- `RegisterRequest`
- `TokenData`
- `AuthResponse`

Also from `auth.ts` service (if used):
- `AuthApiResponse` (from imports)

---

### Step 3: Create `src/types/types-fjb.ts`

Move from `src/services/fjb-types.ts`:
- `FjbStatus`
- `FjbListItem`
- `FjbJob`
- `FjbPart`
- `FjbDetail`
- `FjbFilters`
- `MasterJasaItem`
- `MasterPartItem`

Note: `SelectOption` is in index.ts (generic/reusable)

---

### Step 4: Create `src/types/types-ekspedisi.ts`

Move from `src/services/ekspedisi-inventory.ts`:
- `EkspedisiInventoryStatus`
- `EkspedisiInventoryKsuItem`
- `EkspedisiInventoryListItem`
- `EkspedisiInventoryDetail`
- `EkspedisiInventoryFilters`
- `EkspedisiInventoryProcessItemPayload`
- `EkspedisiInventoryProcessPayload`

---

### Step 5: Create `src/types/types-master-cabang.ts`

Move from `src/services/master-cabang.ts`:
- `Branch`

---

### Step 6: Create `src/types/types-master-coa.ts`

Move from `src/services/master-coa.ts`:
- `MasterCoa`
- `CoaTransaction`
- `MasterCoaDetail`
- `CreateMasterCoaRequest`
- `UpdateMasterCoaRequest`
- `CopyMasterCoaRequest`
- `COA_ERRORS`

Note: Remove `PaginatedData<T>` - use `IPaginatedDataResponse` from index.ts instead

---

### Step 7: Create `src/types/types-master-locator.ts`

Move from `src/services/master-locator.ts`:
- `LokasiWarehouse`
- `LokasiFilterParams`

Note: Remove local `ApiResponse` and `MutationResponse` definitions (use from index.ts)

---

### Step 8: Create `src/types/types-master-service.ts`

Move from `src/services/master-service.ts`:
- `Service`

Note: Import `Branch` from `@/types/types-master-cabang` (not duplicated here)

---

### Step 9: Create `src/types/types-pdi.ts`

Move from `src/types/index.ts`:
- `PdiStatus`
- `PdiUnit`
- `PdiPhysicalChecklistItem`
- `PdiKsuItem`
- `PdiHadiahItem`
- `PdiBarangLainItem`
- `PdiPartItem`
- `PdiPhoto`
- `PdiData`
- `PdiFilters`

---

### Step 10: Create `src/types/types-master-kas.ts`

Move from `src/types/index.ts`:
- `MasterKas`
- `MasterKasFilters`
- `MasterKasResponse`

---

### Step 11: Update Service Files

Remove inline type definitions, import from `@/types`:

| File | Action |
|------|--------|
| `ekspedisi-inventory.ts` | Remove types, import from `@/types/types-ekspedisi` |
| `fjb.ts` | Import from `@/types/types-fjb` |
| `master-cabang.ts` | Import Branch from `@/types/types-master-cabang` |
| `master-coa.ts` | Remove types, import from `@/types/types-master-coa` |
| `master-locator.ts` | Remove types, import from `@/types/types-master-locator` |
| `master-service.ts` | Remove types, import from `@/types/types-master-service` |

---

### Step 12: Update Consumer Files

Find and update all imports across the codebase:

```bash
# Find files importing from @/types
grep -r "from '@/types'" src/
```

---

## Decisions Confirmed

1. **Branch type**: Only in master-cabang, import in master-service
2. **SelectOption**: Move to types/index.ts (generic, reusable dropdown)
3. **PaginatedData**: Replace with IPaginatedDataResponse in master-coa

---

## Verification

After implementation, run:
```bash
npm run build
```

Should have no type errors from the reorganization.

---

## Files to Modify

### Create (new files):
- `src/types/types-auth.ts`
- `src/types/types-fjb.ts`
- `src/types/types-ekspedisi.ts`
- `src/types/types-master-cabang.ts`
- `src/types/types-master-coa.ts`
- `src/types/types-master-locator.ts`
- `src/types/types-master-service.ts`
- `src/types/types-pdi.ts`
- `src/types/types-master-kas.ts`

### Modify:
- `src/types/index.ts` (remove module-specific types)
- `src/services/ekspedisi-inventory.ts`
- `src/services/fjb.ts`
- `src/services/fjb-types.ts` (can be deleted after moving types)
- `src/services/master-cabang.ts`
- `src/services/master-coa.ts`
- `src/services/master-locator.ts`
- `src/services/master-service.ts`
- Multiple consumer files (update imports)

### Delete:
- `src/services/fjb-types.ts` (types moved to src/types/)
- `src/services/masterdata.ts` (empty file)