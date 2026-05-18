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

### API Calls

Use `apiClient` directly from `@/services/api-client`. Do NOT create custom helper functions.

```tsx
import apiClient from "@/services/api-client";

// ✅ CORRECT - Use apiClient directly
export const getBanks = () => apiClient.get("/api/v1/banks");
export const createBank = (data) => apiClient.post("/api/v1/banks", data);
export const updateBank = (id, data) => apiClient.put(`/api/v1/banks/${id}`, data);
export const deleteBank = (id) => apiClient.delete(`/api/v1/banks/${id}`);

// ❌ WRONG - Custom helper functions
import { get, post, put, patch } from "@/services/api-client";
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

**Rules:**
1. Use `apiClient.get()`, `apiClient.post()`, `apiClient.put()`, `apiClient.patch()`, `apiClient.delete()` directly
2. Pass query parameters via the `params` option object — Axios serializes automatically
3. Include `params?: object` in function signature for optional query params

### Data Fetching with Error Handling

Use `fetchDataAsync` wrapper for all API calls in hooks to handle errors centrally.

```tsx
import { fetchDataAsync } from '@/utils'
import { useErrorStore } from '@/store/useErrorStore'

// ✅ CORRECT - Use fetchDataAsync wrapper
export const useLeadsQuery = () => {
  const setError = useErrorStore((s) => s.setError)
  return useQuery({
    queryKey: ['leads'],
    queryFn: () =>
      fetchDataAsync({
        asyncFn: fetchLeads,
        setError,
        menuName: 'leads',
      }),
  })
}

// ❌ WRONG - Direct API call without error handling
export const useLeadsQuery = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: () => fetchLeads(),
  })
}
```

**Rules:**
1. Wrap all API calls with `fetchDataAsync` in hooks
2. Pass `setError` from `useErrorStore` to handle errors globally
3. Use `menuName` to identify the feature in logs/error messages