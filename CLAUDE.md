# Architecture & Development Guidelines

## ⚠️ DO NOT — Common AI-Generated Mistakes

These violations have caused real refactor work. **Verify your code does not do any of these before submitting:**

1. **Don't write manual `<table>` markup** — use `DataTable` from `@/components/ui/table`. DataTable already handles empty states, sorting, pagination.
2. **Don't write custom modal markup** (`fixed inset-0 bg-black/50`, custom backdrops, etc.) — use `AppModal` from `@/components/AppModal`.
3. **Don't use `useState` for form data inside tab components** — multi-tab forms must share ONE RHF instance via `useFormContext`. The orchestrator owns `useForm`/`FormProvider`; tabs read state via `useFormContext` and write via `useFieldArray`/`Controller`.
4. **Don't create separate add/edit modals for table rows** — use the `isSaved` inline editing pattern. Click "Tambah" appends a row with `isSaved: false`; click ✓ flips to `isSaved: true`.
5. **Don't use `<label>` + `<p>` for read-only details** — use disabled `InputField`/`SelectField`/`DatePicker` for consistent form semantics and selectable text.
6. **Don't use `<InputField type="date">`** — always use `DatePicker`.
7. **Don't use `new Date()`/`Date.parse()`/native `Date` methods directly** — use `dayjs` from `@/lib/dayjs`.
8. **Don't put API calls in components or hooks** — all API calls live in `/src/services/[feature].ts`.
9. **Don't create one hook file per hook** — consolidate into 1-2 files per feature.
10. **Don't wrap form sections in `border border-border rounded-lg p-4`** — group with headings, dividers, or `space-y-*`. Cards/borders are for genuinely separate entities.
11. **Don't use button toggles (OK/Not OK) for constrained values** — use `SelectField mode="simple"` with explicit options.

When in doubt, mirror `src/modules/master-user/` or `src/modules/receiving-unit/`.

## Modal Components

- **AppModal** (`@/components/AppModal`) — forms, filters, detail views, any user input/substantial content
- **AlertDialog** (`@/components/ui/alert-dialog`) — ONLY for confirmations (delete), brief notifications, yes/no dialogs

Never use AlertDialog for forms. Never use AppModal for simple yes/no.

## Feature Structure

```
src/modules/[feature]/
├── [Feature]Screen.tsx           # entry point
├── components/                   # feature-specific UI + index.ts
├── hooks/use[Feature].ts         # 1-2 files max, not per-hook
└── schemas/validationSchemas.ts  # Zod + TS types

src/services/[feature].ts         # ALL API calls + interfaces + mock data
```

**Rules:**

1. API calls only in `/src/services/` — never in components
2. Hooks consolidated per feature (1-2 files), export `useQueryX`, `useMutationCreateX`, etc.
3. Use existing UI library — no custom Button/Input/Table
4. Mark mock API calls with `// TODO: Replace with real API endpoint`
5. **HTML mockups are reference only** — when an FSD ships an HTML mockup, treat it as a reference for layout and behavior. Do **not** copy the raw HTML/CSS into the codebase. Rebuild it using the components from `@/components/ui/*` and the patterns in this document.
6. **Dates always use Day.js** — for any date/time utility (parsing, formatting, comparing, math, timezones), use `dayjs` from `@/lib/dayjs`. **Never use `new Date()`**, `Date.now()`, `Date.parse()`, or native `Date` methods directly in feature code.
7. **Don't use cards or borders just to group fields** — group form sections with headings, subtle dividers, or vertical spacing (`space-y-*`, `gap-*`). Reserve `<Card>`, `border`, and shadow boxes for genuinely separate entities (a list of records, a dashboard widget). Wrapping a tab panel, form section, or field cluster in `border border-border rounded-lg p-4` is **not allowed**.
8. **Multi-tab forms split tabs into files** — when a form has **2+ tabs**, each tab panel goes in its own file under `modules/<feature>/components/tabs/<TabName>Tab.tsx`. The orchestrator (`<Feature>FormModal.tsx`) only handles modal wrapping, RHF setup, and tab routing. Tab files own their `<TabsContent>` wrapper, read shared form state via `useFormContext`, and keep tab-local state (sub-tabs, derived lists, item handlers) inside themselves.

## Loading States

Use **LoadingOverlay** (`@/components/LoadingOverlay`) for all loading states instead of custom inline spinners.

```tsx
// ✅ CORRECT - Use LoadingOverlay
if (isLoading) {
  return <LoadingOverlay message="Memuat data..." />;
}

// ❌ WRONG - Don't use custom inline spinners
if (isLoading) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin">
        <RefreshCwIcon className="size-8" />
      </div>
    </div>
  );
}
```

**Rules:**
1. Wrap the entire component/overlay when data is being fetched, not just a spinner
2. Use descriptive loading messages (e.g., "Memuat data unit...", "Menyimpan perubahan...")
3. For modal loading, the LoadingOverlay replaces the entire modal content during fetch
4. For form submissions, use button disabled state + LoadingOverlay if the operation takes long

## Navigation

After creating a feature route:

1. Register route in `src/App.tsx`
2. Add menu entry to `src/layouts/Constants.ts` (`NAV_GROUPS`)

## UI Components — Required Usage

### SelectField (`@/components/ui/select`)

Portal-based dropdown (escapes overflow containers). Modes: default (searchable single), `mode="multi"`, `mode="simple"` (Radix, non-searchable, value is `SelectOption` object).
Override positioning: `dropdownPosition="top" | "bottom" | "auto"` (default auto).

### DatePicker (`@/components/ui/date-picker`)

**Never use `<InputField type="date">`.** Expects `Date` object. With RHF, convert:

```tsx
value={field.value ? new Date(field.value) : undefined}
onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
```

### DataTable (`@/components/ui/table`)

**Never write manual `<table>` markup.** Built on TanStack Table.

```tsx
<DataTable columns={columns} data={rows} serverSide={false} />
// Server: pass page, rowsPerPage, totalRows, onPageChange, onRowsPerPageChange
```

**Column widths** — use `meta.className` on `ColumnDef` with Tailwind utilities. Applied to both `<th>` and `<td>`. Use `meta.headerClassName` / `meta.cellClassName` for header- or cell-only styles. Do NOT wrap cell/header content in `<div className="w-...">` — set widths on the column.

**Use `min-w-*` for column sizing, not `w-*`.** The DataTable uses HTML's auto table layout (browser sizes columns by content + hints). With auto layout, `min-width` is enforced but `width` is only a hint and gets overridden when content is wider/narrower. `min-w-*` guarantees at least that width, lets columns grow with longer content, and when total min-widths exceed the container, the table extends and the parent (`overflow-auto`) provides horizontal scroll.

```tsx
const columns: ColumnDef<Row>[] = [
  { id: "no", header: "No", cell: ..., meta: { className: "min-w-12" } },
  { accessorKey: "noFj", header: "No. FJ", meta: { className: "min-w-32" } },
  { accessorKey: "namaVarian", header: "Nama Varian", meta: { className: "min-w-48" } },
  { id: "actions", header: "Aksi", cell: ..., meta: { className: "min-w-32 text-center" } },
];
```

## Patterns

### Form Modes (create / edit / view)

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

### Read-Only Detail Displays

For displaying unit/entity details in modals and forms, use **disabled input components** instead of labels + paragraphs. This ensures visual consistency, text selectability, and proper form semantics.

```tsx
// ✅ Read-only text — disabled InputField
<InputField 
  label="Cabang" 
  value={unit.cabangName} 
  disabled={true}
/>

// ✅ Read-only dropdown — disabled SelectField  
<SelectField 
  label="Tipe Unit"
  options={[{ value: unit.tipeUnit, label: unit.tipeUnit }]}
  value={unit.tipeUnit}
  disabled={true}
/>

// ✅ Read-only date — disabled DatePicker
<DatePicker 
  label="Tanggal PDI"
  value={unit.tanggalPdi ? new Date(unit.tanggalPdi) : undefined}
  disabled={true}
/>

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

**Benefits:** Consistent styling, text selectable, proper form semantics, less markup.

### isSaved — Inline Row Editing

Each row has `isSaved: boolean` in form data. `true` = read-only (Edit/Delete buttons), `false` = editable (Save/Cancel buttons). New rows + loaded data default to `isSaved: true`. Supports multiple simultaneous edits. Prefer over `editingIndex` state.

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

const columns: ColumnDef<Item & { index: number }>[] = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      const idx = row.original.index;
      const isSaved = watchedItems?.[idx]?.isSaved ?? true;
      if (!isSaved) {
        return (
          <Controller
            name={`items.${idx}.name`}
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                error={errors.items?.[idx]?.name?.message}
              />
            )}
          />
        );
      }
      return watchedItems?.[idx]?.name || "-";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const idx = row.original.index;
      const isSaved = watchedItems?.[idx]?.isSaved ?? true;
      if (!isSaved) {
        return (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setValue(`items.${idx}.isSaved`, true)}
            >
              <CheckIcon className="size-4" />
            </button>
            <button type="button" onClick={() => remove(idx)}>
              ✕
            </button>
          </div>
        );
      }
      return (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setValue(`items.${idx}.isSaved`, false)}
          >
            <EditIcon className="size-4" />
          </button>
          <button type="button" onClick={() => remove(idx)}>
            <TrashIcon className="size-4" />
          </button>
        </div>
      );
    },
  },
];

// New item — starts read-only
const handleAdd = () =>
  append({ id: `item-${Date.now()}`, name: "", isSaved: true });

// Loading initialData — always read-only first
useEffect(() => {
  if (initialData) {
    reset({ items: initialData.items.map((i) => ({ ...i, isSaved: true })) });
  }
}, [initialData, reset]);

// Submit — strip isSaved before sending to API
const handleFormSubmit = async (data: FormData) => {
  const items = data.items.map(({ isSaved, ...rest }) => rest);
  await onSubmit({ ...data, items });
};
```

### Nested Modal Z-Index

Wrap app with `<ModalProvider>`. AppModal auto-scales z-index by depth (`300 + depth * 100`). No manual work needed.

### Form Validation (Zod + RHF)

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

### Data Fetching (TanStack Query)

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

## Code Style

- **Imports:** `import type` for type-only (verbatimModuleSyntax is on). No `as any` — use proper types or eslint-disable with comment.
- **Comments:** Default none. Only explain non-obvious WHY. Never document WHAT.
- **Types:** Union literals over `string` for constrained values (`"active" | "inactive"`).
- **Naming:** Components `PascalCase`, hooks `useCamelCase`, services/schemas `kebab-case.ts` / `camelCase.ts`.

## Common Imports

```tsx
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { SelectField, type SelectOption } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { DataTable } from "@/components/ui/table";
import { AppModal } from "@/components/AppModal";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { PlusIcon, EditIcon, TrashIcon, FilterIcon } from "lucide-react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
```

## Before Submitting

1. `npm run build` — no TS errors
2. `npm run lint` — no errors
3. Manual test: CRUD, validation (empty/invalid/valid), filters, pagination, error states

## Reference Features

- `src/modules/master-user/` — forms, filtering, CRUD
- `src/modules/receiving-unit/` — complex forms with nested line items

When unsure, mirror existing feature patterns.