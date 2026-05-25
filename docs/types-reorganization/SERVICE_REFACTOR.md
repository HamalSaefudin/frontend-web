# Service Refactor: Return Full Axios Response

## Overview

Update all service functions to return the full Axios response instead of just `response.data`. This allows components to access error details via TanStack Query's error object.

---

## Problem

Currently services return `response.data`:
```typescript
// CURRENT
export const getMasterKasList = async () => {
  const response = await apiClient.get<MasterKasResponse>('/api/v1/master-kas')
  return response.data  // Loses error details!
}
```

When HTTP errors occur, `response.data` is lost, and components can't access the API's error response format.

---

## Solution

Return full Axios response, update `fetchDataAsync` to extract error messages:

```typescript
// AFTER
export const getMasterKasList = async () => {
  return await apiClient.get<IBaseResponse<MasterKasResponse>>('/api/v1/master-kas')
}
```

TanStack Query receives AxiosError, and `fetchDataAsync` extracts `{ message }` from `error.response?.data`.

---

## Tasks

### Phase 1: Update Utility

- [x] Update `src/utils/index.ts` - fix `fetchDataAsync` error extraction

### Phase 2: Update Services

- [x] `src/services/api.ts`
- [x] `src/services/auth.ts`
- [x] `src/services/ekspedisi-inventory.ts`
- [x] `src/services/fjb.ts`
- [x] `src/services/master-cabang.ts`
- [x] `src/services/master-coa.ts`
- [x] `src/services/master-kas.ts`
- [x] `src/services/master-locator.ts` (remove try/catch pattern)
- [x] `src/services/master-service.ts`
- [x] `src/services/pdi.ts`

### Phase 3: Verify

- [ ] Run `npm run build`
- [ ] Update component code to access .data

---

## Error Extraction Flow

```typescript
// In fetchDataAsync
catch (error: any) {
  const apiError = error?.response?.data
  const errorMessage = apiError?.message 
    || error?.message 
    || "An unexpected error occurred."
  
  setError({ menuName, errorMessage, title })
  throw error
}
```

Components access via:
```typescript
onError: (error: AxiosError<IBaseResponse>) => {
  const message = error.response?.data?.message
}
```

---

## Files Changed Pattern

### Before:
```typescript
export const getFjbList = async (filters: FjbFilters): Promise<FjbListItem[]> => {
  const response = await apiClient.get<FjbListItem[]>("/api/v1/fjb", { params })
  return response.data
}
```

### After:
```typescript
export const getFjbList = async (filters: FjbFilters) => {
  return await apiClient.get<IBaseResponse<FjbListItem[]>>("/api/v1/fjb", { params })
}
```

---

## Master Locator Exception

Currently `master-locator.ts` uses try/catch with manual error wrapping:
```typescript
try {
  const response = await apiClient.get(...)
  return response.data
} catch (error: any) {
  return { success: false, code: ..., message: ... }
}
```

This pattern will be REMOVED - let Axios throw naturally.

---

## Component Usage

After updating services, components need to access `.data`:

```typescript
// Before
const { data } = useQuery({
  queryKey: ['fjb'],
  queryFn: getFjbList,
})
// data is FjbListItem[]

// After
const { data: response } = useQuery({
  queryKey: ['fjb'],
  queryFn: getFjbList,
})
const data = response?.data  // FjbListItem[]
```

Or with fetchDataAsync:
```typescript
const result = await fetchDataAsync({
  asyncFn: getFjbList,
  setError,
  menuName: 'FJB',
})
const data = result.data  // FjbListItem[]