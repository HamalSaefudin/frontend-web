# Component Update Plan

## Overview

After refactoring services to return `IBaseResponse<T>`, components need to be updated to access `.data` from the Axios response.

**Previous service pattern:**
```typescript
return apiClient.get<T>('/endpoint')
// Returns: AxiosResponse<IBaseResponse<T>>
```

**New service pattern:**
```typescript
return await apiClient.get<IBaseResponse<T>>('/endpoint')
// Returns: AxiosResponse<IBaseResponse<T>>
```

---

## Why This Change

Backend returns data wrapped in IBaseResponse:
```json
{
  "success": true,
  "data": [...],
  "message": "Success"
}
```

Components must unwrap this nesting.

---

## Pattern Changes

### TanStack Query Usage

**Before (old - direct return):**
```typescript
const { data } = useQuery({
  queryKey: ['items'],
  queryFn: fetchItems,
})
// data = Item[]

// Use directly
return data
```

**After (new - double unwrap):**
```typescript
const { data: response } = useQuery({
  queryKey: ['items'],
  queryFn: fetchItems,
})
// response = AxiosResponse<IBaseResponse<Item[]>>

// Must unwrap twice
const items = response?.data?.data

// Use unwrapped data
return items
```

### Hook Return Values

**Before:**
```typescript
return { data, isLoading, error }
```

**After:**
```typescript
return { 
  data: response?.data?.data, 
  isLoading, 
  error: response?.data?.error 
}
```

### Form Default Values

**Before:**
```typescript
const { data } = useQuery({ queryFn: getDetail })
defaultValues: data
```

**After:**
```typescript
const { data: response } = useQuery({ queryFn: getDetail })
defaultValues: response?.data?.data
```

---

## Modules to Update

| # | Module | Priority | Status |
|---|-------|----------|--------|
| 1 | auth | HIGH | PENDING |
| 2 | dashboard | HIGH | PENDING |
| 3 | fjb | HIGH | PENDING |
| 4 | pdi | HIGH | PENDING |
| 5 | master-cabang | HIGH | PENDING |
| 6 | master-coa | HIGH | PENDING |
| 7 | master-kas | HIGH | PENDING |
| 8 | master-locator | HIGH | PENDING |
| 9 | master-service | MEDIUM | PENDING |
| 10 | ekspedisi-inventory | HIGH | PENDING |
| 11 | leads | MEDIUM | PENDING |
| 12 | master-bank | LOW | PENDING |

---

## Common Errors to Fix

1. **Property 'data' doesn't exist**
   - Fix: Access `response?.data?.data`

2. **Type mismatch**
   - Fix: Update return type expectations

3. **Loading state issues**
   - Fix: Use `response?.data` not response directly

4. **Form default values**
   - Fix: Use `response?.data?.data` as defaults

---

## Verification Steps

After updating each module:

```bash
npm run build 2>&1 | grep "error TS" | wc -l
```

Expected result: Should decrease or stay same (not increase)

---

## Reference

Related documents:
- `SERVICE_REFACTOR.md` - Service layer changes
- `COMPONENT_UPDATE_TASKS.md` - Detailed task breakdown