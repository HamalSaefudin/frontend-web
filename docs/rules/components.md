# Components

## Modal Components

- **AppModal** (`@/components/AppModal`) — forms, filters, detail views, any user input/substantial content
- **AlertDialog** (`@/components/ui/alert-dialog`) — ONLY for confirmations (delete), brief notifications, yes/no dialogs

Never use AlertDialog for forms. Never use AppModal for simple yes/no.

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

## SelectField (`@/components/ui/select`)

Portal-based dropdown (escapes overflow containers). Modes: default (searchable single), `mode="multi"`, `mode="simple"` (Radix, non-searchable, value is `SelectOption` object).
Override positioning: `dropdownPosition="top" | "bottom" | "auto"` (default auto).

## DatePicker (`@/components/ui/date-picker`)

**Never use `<InputField type="date">`.** Expects `Date` object. With RHF, convert:

```tsx
value={field.value ? new Date(field.value) : undefined}
onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
```

## DataTable (`@/components/ui/table`)

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