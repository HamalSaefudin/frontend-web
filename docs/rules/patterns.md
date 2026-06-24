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

Activity types in `packages/shared/src/constants/activity-type.ts` (`ACTIVITY_TYPE.CREATE|READ|UPDATE|DELETE`).

## Multi-Tab Forms

When a form has **2+ tabs**, split each tab into its own file under `components/tabs/<Name>Tab.tsx`.

### Orchestrator (`<Feature>FormModal.tsx`)

Owns only: modal wrapping, `useForm`/`FormProvider`, tab routing, and footer buttons.

```tsx
export function FjbFormModal({ mode, open, onOpenChange, initialData }: FormProps) {
  const [tab, setTab] = useState("data-unit");
  const methods = useForm<FormData>({ resolver: zodResolver(schema), defaultValues });

  return (
    <AppModal isOpen={open} onClose={() => onOpenChange(false)} title={getTitle(mode)}>
      <FormProvider {...methods}>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="data-unit">Data Unit</TabsTrigger>
            <TabsTrigger value="data-transaksi">Data Transaksi</TabsTrigger>
          </TabsList>
          <DataUnitTab />
          <DataTransaksiTab />
        </Tabs>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {/* footer with Cancel/Submit buttons */}
        </form>
      </FormProvider>
    </AppModal>
  );
}
```

### Tab file (`tabs/DataUnitTab.tsx`)

Owns its `<TabsContent>` wrapper, reads shared state via `useFormContext`, keeps tab-local state inside itself.

```tsx
import { useFormContext, Controller } from "react-hook-form";

export function DataUnitTab() {
  const { control, formState: { errors } } = useFormContext<FormData>();

  return (
    <TabsContent value="data-unit" className="space-y-4">
      <Controller
        name="field"
        control={control}
        render={({ field }) => (
          <InputField {...field} label="..." error={errors.field?.message} />
        )}
      />
    </TabsContent>
  );
}
```

Tab files with array fields use `useFieldArray` via `useFormContext`:

```tsx
const { control } = useFormContext<FormData>();
const { fields, append, remove } = useFieldArray({ control, name: "items" });
```

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

**Layout:** Use grid for multi-column form sections:

```tsx
// 2 or 3 columns for form layouts
<div className="grid grid-cols-2 gap-4">
  <Controller name="field1" control={control} render={({ field }) => (
    <InputField {...field} label="Field 1" />
  )} />
  <Controller name="field2" control={control} render={({ field }) => (
    <InputField {...field} label="Field 2" />
  )} />
</div>

// Detail sections — muted background, 3 columns
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

## Data Fetching & Error Handling (TanStack Query)

Hooks wrap API calls with `fetchDataAsync` for centralized error handling (via `useErrorStore` + `GlobalErrorDialog`). Services never handle errors.

```tsx
import { fetchDataAsync } from "@frontend/shared";
import { useErrorStore } from "@frontend/shared/store/useErrorStore.ts";

export const useQueryData = (filters?: Params) => {
  const setError = useErrorStore((s) => s.setError);
  return useQuery({
    queryKey: ["data", filters],
    queryFn: () =>
      fetchDataAsync({ asyncFn: () => getData(filters), setError, menuName: "data" }),
  });
};

export const useMutationCreate = () => {
  const qc = useQueryClient();
  const setError = useErrorStore((s) => s.setError);
  return useMutation({
    mutationFn: (data) =>
      fetchDataAsync({ asyncFn: () => createData(data), setError, menuName: "data" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["data"] }),
  });
};
```

## Service Layer

### API Services — NEVER Mock

**CRITICAL: Do NOT create mock/dummy data in services.**

```tsx
import { apiClient } from '@frontend/shared'

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

### Error Handling Rules

1. Services return raw AxiosResponse — no mock/dummy data, no error handling
2. Hooks wrap with `fetchDataAsync` for error handling (see [Data Fetching section](#data-fetching--error-handling-tanstack-query))
3. Mutations don't check `.success`/`.message` — errors handled by `fetchDataAsync`
4. Use `apiClient.get/post/put/patch/delete()` directly — no custom helpers
