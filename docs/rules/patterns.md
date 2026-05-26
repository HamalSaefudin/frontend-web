# Patterns

## Form Modes (create / edit / view)

Single component, `mode` prop. View mode disables all fields, hides submit.

```tsx
interface FormProps {
  mode?: "create" | "edit" | "view";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: DataType;
  onSubmit?: (data: DataType) => Promise<void>;
}

export function MyForm({
  mode = "create",
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: FormProps) {
  const isViewMode = mode === "view";
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      Object.entries(initialData).forEach(([k, v]) =>
        setValue(k as keyof FormData, v),
      );
    } else {
      reset(defaultValues);
    }
  }, [initialData, open, setValue, reset]);

  const getTitle = () => {
    if (isViewMode) return `View Record - ${initialData?.id}`;
    if (initialData) return "Edit Record";
    return "Create Record";
  };

  return (
    <AppModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={getTitle()}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit!)} className="space-y-6">
          <Controller
            name="field"
            control={methods.control}
            render={({ field }) => (
              <InputField
                {...field}
                label="..."
                disabled={isViewMode}
                error={errors.field?.message}
              />
            )}
          />
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Simpan"}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </AppModal>
  );
}
```

Activity types in `src/constants/activity-type.ts` (`ACTIVITY_TYPE.CREATE|READ|UPDATE|DELETE`).

## Read-Only Detail Displays

For displaying unit/entity details in modals and forms, use **disabled input components** instead of labels + paragraphs.

```tsx
// ✅ Read-only text — disabled InputField
<InputField label="Cabang" value={unit.cabangName} disabled={true} />

// ✅ Read-only dropdown — disabled SelectField  
<SelectField label="Tipe Unit" options={[{ value: unit.tipeUnit, label: unit.tipeUnit }]} value={unit.tipeUnit} disabled={true} />

// ✅ Read-only date — disabled DatePicker
<DatePicker label="Tanggal PDI" value={unit.tanggalPdi ? new Date(unit.tanggalPdi) : undefined} disabled={true} />

// ❌ WRONG - Don't use labels + paragraphs
<label className="text-xs text-muted-foreground">Cabang</label>
<p className="font-medium">{unit.cabangName}</p>
```

**Layout:** Use grid for multi-column detail sections:
```tsx
<div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg mb-4">
  <InputField label="Cabang" value={unit.cabangName} disabled={true} />
  <InputField label="Warna" value={unit.namaWarna} disabled={true} />
  <InputField label="No. FJ" value={unit.noFj} disabled={true} />
</div>
```

## isSaved — Inline Row Editing

Each row has `isSaved: boolean` in form data. `true` = read-only, `false` = editable.

```tsx
// Schema — frontend-only flag, filter out before API
const itemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Required"),
  isSaved: z.boolean().optional(),
});

// Component
const { control, setValue, watch } = useFormContext<FormData>();
const { fields, append, remove } = useFieldArray({ control, name: "items" });
const watchedItems = watch("items");

// New item — starts read-only
const handleAdd = () => append({ id: `item-${Date.now()}`, name: "", isSaved: true });

// Submit — strip isSaved before sending to API
const handleFormSubmit = async (data: FormData) => {
  const items = data.items.map(({ isSaved, ...rest }) => rest);
  await onSubmit({ ...data, items });
};
```

## Nested Modal Z-Index

Wrap app with `<ModalProvider>`. AppModal auto-scales z-index by depth (`300 + depth * 100`). No manual work needed.

## Form Validation (Zod + RHF)

```tsx
const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(schema),
  mode: "onSubmit",
});

<Controller
  name="field"
  control={control}
  render={({ field }) => (
    <InputField {...field} label="..." error={errors.field?.message} />
  )}
/>;
```

## Data Fetching (TanStack Query)

```tsx
export const useQueryData = (filters?) =>
  useQuery({
    queryKey: ["data", filters],
    queryFn: () => fetchData(filters),
  });

export const useMutationCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createData,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["data"] }),
  });
};
```

## Service Layer

### API Services — NEVER Mock

**CRITICAL: Do NOT create mock/dummy data in services.**

```tsx
import apiClient from '@/services/api-client'

// ✅ CORRECT - Direct apiClient calls, no mock data
export const getBanks = () => 
  apiClient.get<IBaseResponse<Bank[]>>('/api/v1/banks')

export const createBank = (data: CreateBankRequest) =>
  apiClient.post<IBaseResponse<Bank>>('/api/v1/banks', data)

export const updateBank = (id: string, data: UpdateBankRequest) =>
  apiClient.put<IBaseResponse<Bank>>(`/api/v1/banks/${id}`, data)

export const deleteBank = (id: string) =>
  apiClient.delete<IBaseResponse<void>>(`/api/v1/banks/${id}`)
```

**❌ WRONG - Never do this:**
```tsx
// DO NOT write mock data
const mockBanks = [{ id: '1', name: 'Bank A' }]
export const getBanks = () => 
  new Promise(resolve => setTimeout(() => resolve(mockBanks), 500))
```

### Query Parameters

Pass query params via Axios `params` option — do NOT manually build URLSearchParams.

```tsx
// ✅ CORRECT - Use params option
export const listBanks = async (filters: BankListParams) => {
  return apiClient.get("/api/v1/master-banks", { params: filters });
};

// ❌ WRONG - Manual URLSearchParams
export const listBanks = async (filters: BankListParams) => {
  const searchParams = new URLSearchParams();
  if (filters.keyword) searchParams.set("keyword", filters.keyword);
  return apiClient.get(`/api/v1/master-banks?${searchParams}`);
};
```

### Error Handling in Hooks (NOT in Services)

Use `fetchDataAsync` wrapper ONLY in hooks, not services. Services return raw AxiosResponse.

```tsx
import { fetchDataAsync } from '@/utils'
import { useErrorStore } from '@/store/useErrorStore'

// ✅ CORRECT - fetchDataAsync in hooks only
export const useQueryBanks = () => {
  const setError = useErrorStore((s) => s.setError)
  return useQuery({
    queryKey: ['banks'],
    queryFn: () => fetchDataAsync({
      asyncFn: getBanks,
      setError,
      menuName: 'banks',
    }),
  })
}

// ❌ WRONG - No error handling in services
// ❌ WRONG - No .success/.message checks in screen handlers
```

**Rules:**
1. Services return raw AxiosResponse — no mock/dummy data, no error handling
2. Hooks wrap with `fetchDataAsync` for error handling
3. Mutations don't check `.success`/`.message` — errors handled by `fetchDataAsync`
4. Use `apiClient.get/post/put/patch/delete()` directly — no custom helpers
