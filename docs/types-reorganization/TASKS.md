# Types Reorganization - Task Checklist

## Overview

Move all types from `src/services/` files to `src/types/` directory, organized by module.

---

## Task Checklist

### Phase 1: Create Type Files ✅

- [x] Create `src/types/types-auth.ts`
- [x] Create `src/types/types-fjb.ts`
- [x] Create `src/types/types-ekspedisi.ts`
- [x] Create `src/types/types-master-cabang.ts`
- [x] Create `src/types/types-master-coa.ts`
- [x] Create `src/types/types-master-locator.ts`
- [x] Create `src/types/types-master-service.ts`
- [x] Create `src/types/types-pdi.ts`
- [x] Create `src/types/types-master-kas.ts`

### Phase 2: Update Generic Types ✅

- [x] Update `src/types/index.ts` - keep only generic types:
  - `IApiResponse<T>`
  - `IMutationResponse<T>`
  - `IPaginatedDataResponse<T>`
  - `IApiError`
  - `SelectOption`

### Phase 3: Update Service Files ✅

- [x] Update `src/services/ekspedisi-inventory.ts` - import from `@/types/types-ekspedisi`
- [x] Update `src/services/fjb.ts` - import from `@/types/types-fjb`
- [x] Updated `src/services/fjb-types.ts` - re-exports for backward compat
- [x] Update `src/services/master-cabang.ts` - import Branch from `@/types/types-master-cabang`
- [x] Update `src/services/master-coa.ts` - import from `@/types/types-master-coa`
- [x] Update `src/services/master-locator.ts` - import from `@/types/types-master-locator`
- [x] Update `src/services/master-service.ts` - import from `@/types/types-master-service`, import Branch from `@/types/types-master-cabang`
- [x] Update `src/services/pdi.ts` - import from `@/types/types-pdi`
- [x] Update `src/services/auth.ts` - import from `@/types/types-auth`
- [x] Update `src/services/api.ts` - move Lead/Stats/Report/Settings locally
- [x] Update `src/services/master-kas.ts` - import from `@/types/types-master-kas`

### Phase 4: Delete Unused Files ✅

- [~] Deleted `src/services/fjb-types.ts` (restored for backward compat)
- [x] Deleted `src/services/masterdata.ts`

### Phase 5: Build Status

**Remaining errors (pre-existing, unrelated to type reorganiztion):**
- `filterBranches.ts(35,8)` - `branch.namaLead` possibly undefined (existing bug)
- `MasterCoaForm.tsx` - unused variables (existing warnings)
- `MasterCoaScreen.tsx` - unused variables (existing warnings)

---

## Decisions Applied

| Item | Decision |
|------|----------|
| Branch type | Only in master-cabang, import in master-service |
| SelectOption | In index.ts (generic/reusable) |
| PaginatedData | Replaced with IPaginatedDataResponse |