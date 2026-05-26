# Component Update Tasks

Detailed task breakdown for updating components after service refactoring.

---

## Correct Pattern (Using fetchDataAsync)

Reference: `src/modules/auth/hooks/useLoginMutation.ts`

```typescript
import { useMutation } from "@tanstack/react-query";
import { fetchDataAsync } from "@/utils";
import { useErrorStore } from "@/store/useErrorStore";
import { loginApi } from "@/services/auth";

export function useLoginMutation() {
  const setError = useErrorStore((s) => s.setError);

  return useMutation({
    mutationFn: (credentials: LoginRequest) =>
      fetchDataAsync({
        asyncFn: () => loginApi(credentials),
        setError,
        menuName: "login",
      }),
    onSuccess: (response) => {
      const data = response?.data?.data;
      if (data) {
        // Use data here
      }
    },
  });
}
```

For useQuery hooks:
```typescript
export const useQueryX = () =>
  useQuery({
    queryKey: ["x"],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: () => fetchX(),
        setError,
        menuName: "x",
      }),
  });
```

---

## Pending Task: Update Remaining Hooks

Apply `fetchDataAsync` wrapper pattern to ALL hooks:

### Files That Need Update

| Module | File | Status |
|--------|------|--------|
| Dashboard | `useLoadDashboard.ts` | Needs rewrite |
| FJB | `useFjb.ts` | Needs rewrite |
| PDI | `usePdi.ts` | Needs rewrite |
| Master Cabinet | `useMasterCabang.ts` | Needs rewrite |
| Master COA | `useMasterCoa.ts` | Needs rewrite |
| Master Kas | `useMasterKas.ts` | Needs rewrite |
| Master Locator | (verify hooks) | Check |
| Master Service | (verify hooks) | Check |
| Ekspedisi | (verify hooks) | Check |
| Leads | (verify hooks) | Check |

---

## Correct Pattern Per Hook Type

### Pattern 1: useQuery with fetchDataAsync
```typescript
export const useQueryItems = () => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery({
    queryKey: ["items"],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: fetchItems,
        setError,
        menuName: "items",
      }),
  });
};
```

### Pattern 2: useMutation with fetchDataAsync
```typescript
export const useMutationCreate = () => {
  const setError = useErrorStore((s) => s.setError);
  return useMutation({
    mutationFn: (data) =>
      fetchDataAsync({
        asyncFn: () => createItem(data),
        setError,
        menuName: "create-item",
      }),
    onSuccess: (response) => {
      const newItem = response?.data?.data;
      // Handle success
    },
  });
};
```

---

## Build Progress

| Date | Errors | Notes |
|------|-------|-------|
| Start | 175 | - |
| Current | 148 | Need to re-apply pattern |

---

## Implementation

Rewriting hooks to use `fetchDataAsync` for consistency and error handling.

---
## Related Documents

- `COMPONENT_UPDATE_PLAN.md` - Overview
- `SERVICE_REFACTOR.md` - Service changes