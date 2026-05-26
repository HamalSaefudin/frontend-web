# Fundamentals

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
12. **Don't write mock/dummy data** in services — NEVER create `setTimeout(() => resolve(mockData))` patterns. Always use real `apiClient` calls.

When in doubt, mirror `src/modules/master-user/` or `src/modules/receiving-unit/`.

## Feature Structure

```
src/modules/[feature]/
├── [Feature]Screen.tsx           # entry point
├── components/                   # feature-specific UI + index.ts
├── hooks/use[Feature].ts         # 1-2 files max, not per-hook
└── schemas/validationSchemas.ts  # Zod + TS types

src/services/[feature].ts         # ALL API calls + interfaces
```

**Rules:**

1. API calls only in `/src/services/` — never in components
2. Hooks consolidated per feature (1-2 files), export `useQueryX`, `useMutationCreateX`, etc.
3. Use existing UI library — no custom Button/Input/Table
4. **NEVER write mock/dummy data** — always use real `apiClient` calls
5. **HTML mockups are reference only** — when an FSD ships an HTML mockup, treat it as a reference for layout and behavior. Do **not** copy the raw HTML/CSS into the codebase. Rebuild it using the components from `@/components/ui/*` and the patterns in this document.
6. **Dates always use Day.js** — for any date/time utility (parsing, formatting, comparing, math, timezones), use `dayjs` from `@/lib/dayjs`. **Never use `new Date()`**, `Date.now()`, `Date.parse()`, or native `Date` methods directly in feature code.
7. **Don't use cards or borders just to group fields** — group form sections with headings, subtle dividers, or vertical spacing (`space-y-*`, `gap-*`). Reserve `<Card>`, `border`, and shadow boxes for genuinely separate entities (a list of records, a dashboard widget). Wrapping a tab panel, form section, or field cluster in `border border-border rounded-lg p-4` is **not allowed**.
8. **Multi-tab forms split tabs into files** — when a form has **2+ tabs**, each tab panel goes in its own file under `modules/<feature>/components/tabs/<TabName>Tab.tsx`. The orchestrator (`<Feature>FormModal.tsx`) only handles modal wrapping, RHF setup, and tab routing. Tab files own their `<TabsContent>` wrapper, read shared form state via `useFormContext`, and keep tab-local state (sub-tabs, derived lists, item handlers) inside themselves.

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

## Navigation

After creating a feature route:

1. Register route in `src/App.tsx`
2. Add menu entry to `src/layouts/Constants.ts` (`NAV_GROUPS`)

## Before Submitting

1. `npm run build` — no TS errors
2. `npm run lint` — no errors
3. Manual test: CRUD, validation (empty/invalid/valid), filters, pagination, error states

## Reference Features

- `src/modules/master-user/` — forms, filtering, CRUD
- `src/modules/receiving-unit/` — complex forms with nested line items

When unsure, mirror existing feature patterns.