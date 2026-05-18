## ADDED Requirements

### Tech Stack
Node.js 22.14.0 (use `nvm use`). React 19, TypeScript 6, Vite 8, Tailwind v4, TanStack Query v5, TanStack Table v8, Zustand v5, Axios, Radix UI.

### Import Patterns
**Always use `@/` alias** (maps to `src/`). Never `../../`. Example: `import { Button } from '@/components/ui/button'`

---

## Requirement: Architecture Layers

### Requirement: API functions must live in /src/services
All API calls, fetch functions, and data mutations SHALL live in `/src/services/` directory.

#### Scenario: Adding a new API
- **WHEN** implementing a new feature with API calls
- **THEN** create `serviceFileName.ts` in `/src/services/` with `fetch*()`, `create*()`, `update*()`, `delete*()` functions
- **AND** include `// TODO: Replace with actual API call to <METHOD> <ENDPOINT>` comments

#### Implementation Pattern
```ts
// /src/services/my-feature.ts
export const fetchData = async () => { /* API call */ }
export const createData = async (data) => { /* API call */ }
export const updateData = async (id, data) => { /* API call */ }
export const deleteData = async (id) => { /* API call */ }
```

### Requirement: React hooks wrap services with React Query
Hooks SHALL be in `/src/modules/<feature>/hooks/` and import from services, wrapping with React Query.

#### Scenario: Creating hooks
- **WHEN** a feature needs data fetching/mutations
- **THEN** create hooks in `/src/modules/<feature>/hooks/useMyFeature.ts`
- **AND** consolidate into 1-2 files per feature (not individual files per hook)

#### Implementation Pattern (Consolidated)
```ts
// /src/modules/my-feature/hooks/useMyFeature.ts
export const useQueryData = () => useQuery({ queryKey: ['data'], queryFn: fetchData })
export const useMutationCreate = () => useMutation({ mutationFn: createData })
export const useMutationUpdate = () => useMutation({ mutationFn: ({ id, data }) => updateData(id, data) })
export const useMutationDelete = () => useMutation({ mutationFn: (id) => deleteData(id) })
```

### Requirement: UI components from /src/components library only
Features SHALL only use composed UI components from `/src/components/`. No manual construction of input + label. No custom styled components.

#### Scenario: Building a form
- **WHEN** implementing a form
- **THEN** use `InputField` for text inputs, `SelectField` for dropdowns — **NEVER manually construct `<input>` + `<label>`**
- **AND** pass error messages from React Hook Form validation directly to component `error` prop

#### Key Components Available
- `Button` (variants: default, secondary, outline, ghost, destructive) — from `/src/components/ui/button`
- `InputField` (text, number, alpha, currency) — from `/src/components/ui/input-field` — **USE THIS FOR ALL TEXT INPUTS**
- `SelectField` (single, multi, simple modes) — from `/src/components/ui/select/select-field` — **USE THIS FOR ALL DROPDOWNS**
- `DatePicker` with validation support — from `/src/components/ui/date-picker`
- `DataTable` (TanStack Table with sorting, pagination, empty states) — from `/src/components/ui/table`
- `Modal`, `AlertDialog` for dialogs — from `/src/components/ui/alert-dialog`

#### Form Field Pattern (React Hook Form + Zod + InputField)
```tsx
import { InputField } from '@/components/ui/input-field'
import { SelectField } from '@/components/ui/select/select-field'

export function MyForm() {
  const { register, formState: { errors }, watch } = useForm<FormInput>({
    resolver: zodResolver(schema),
  })

  return (
    <form className="space-y-4">
      {/* Text input with validation */}
      <InputField
        {...register('fieldName')}
        label="Field Label"
        placeholder="Enter value..."
        error={errors.fieldName?.message}
      />

      {/* Select with validation */}
      <SelectField
        label="Select Label"
        placeholder="Choose option..."
        options={[{ value: 'a', label: 'Option A' }]}
        value={watch('selectField')}
        onChange={(val) => setValue('selectField', val)}
        error={errors.selectField?.message}
      />
    </form>
  )
}
```

**Critical rule:** If you use `<input>` or `<label>` directly, refactor to use `InputField`. If you build a custom styled field, use a composed component instead.

### Requirement: HTML mockups in an FSD are reference only
When an FSD (functional spec / requirement document) includes an HTML mockup, that mockup SHALL be treated as a visual and behavioral reference only. Implementation MUST follow the standard development workflow using the components in `/src/components/ui/`.

#### Scenario: Implementing a feature whose FSD ships with an HTML mockup
- **WHEN** the requirement document provides an HTML/CSS mockup of the screen
- **THEN** read the mockup to understand layout, fields, states, and interactions
- **AND** rebuild the screen in React using `InputField`, `SelectField`, `DatePicker`, `DataTable`, `Button`, `AppModal`, etc. from `/src/components/ui/`
- **AND** apply the existing design tokens (colors, spacing, shadows) — do not copy inline styles or one-off CSS from the mockup
- **AND NOT** paste the raw HTML/CSS into the codebase or render it via `dangerouslySetInnerHTML`

#### Why
The mockup communicates *what* the screen should look like and do. The codebase decides *how* it is built — using shared components keeps theming, accessibility, validation, and behavior consistent across features.

### Requirement: Date and time utilities must use Day.js
All date and time handling (parsing, formatting, comparing, arithmetic, timezone conversion) SHALL use `dayjs`. Native `Date` constructors and methods SHALL NOT be used directly in feature code.

#### Scenario: Working with dates in a feature
- **WHEN** a feature needs to parse, format, compare, add/subtract, or otherwise manipulate a date or time value
- **THEN** import `dayjs` (from `@/lib/dayjs` or the project's central Day.js setup)
- **AND** use Day.js APIs: `dayjs(value)`, `.format()`, `.add()`, `.subtract()`, `.diff()`, `.isBefore()`, `.isAfter()`, `.isSame()`, `.toDate()` only when an external API requires a native `Date`
- **AND NOT** call `new Date()`, `Date.now()`, `Date.parse()`, or chain native `Date` methods (`.getTime()`, `.toISOString()`, etc.) directly

#### Implementation Pattern
```ts
import dayjs from '@/lib/dayjs'

// Current time
const now = dayjs()

// Parse + format
const formatted = dayjs(record.createdAt).format('DD MMM YYYY')

// Math
const dueDate = dayjs().add(7, 'day')

// Compare
const isExpired = dayjs(record.expiresAt).isBefore(dayjs())

// Convert to native Date only when an external API requires it (e.g. DatePicker)
<DatePicker value={dayjs(field.value).toDate()} />
```

#### Why
A single date library guarantees consistent parsing (locale, timezone, ISO handling), consistent formatting across the UI, and avoids the well-known pitfalls of native `Date` (mutability, timezone surprises, inconsistent parser behavior across browsers).

### Requirement: Do not use cards or borders to group fields
Form sections, tab panels, and clusters of related fields SHALL NOT be wrapped in a `<Card>`, `border`, or shadow box purely to indicate grouping. Grouping SHALL be expressed with headings, vertical spacing, and subtle dividers.

#### Scenario: Grouping fields inside a form
- **WHEN** organizing related fields (e.g. "Buyer Info", "Vehicle Info") inside a form, modal, or tab panel
- **THEN** group them using a section heading (`<h3>` / `<Section title="…">`) plus vertical spacing (`space-y-4`, `space-y-6`) or grid gaps (`gap-4`)
- **AND NOT** wrap each group in `border border-border rounded-lg p-4`, `<Card>`, or any shadowed container
- **AND** if a visual separation is required, use a thin divider (`<hr className="border-border" />` or `border-t`) between groups instead of a full box

#### Allowed uses of cards / borders
- A list of distinct records (e.g. a row of summary cards on a dashboard).
- A widget or module that represents a separate entity in the UI (e.g. a profile card, a notification card).
- An interactive element where the box itself is the affordance (e.g. a selectable option card).

#### Disallowed uses (examples)
```tsx
// ❌ Wrapping a tab panel in a card
<TabsContent value="pembeli" className="rounded-lg border border-border p-4">…</TabsContent>

// ❌ Wrapping a form section in a card
<Card><h3>Buyer Info</h3><InputField … /></Card>

// ✅ Use a heading + spacing instead
<section className="space-y-4">
  <h3 className="text-base font-semibold">Buyer Info</h3>
  <InputField … />
</section>
```

#### Why
Stacked cards inside a single screen create visual noise and competing borders that hurt scanability. Spacing and typography are sufficient — and consistent with the project's clean, flat design system.

### Requirement: Multi-tab forms split tabs into individual files
When a form renders 2 or more `<TabsContent>` panels, each panel SHALL live in its own file under `modules/<feature>/components/tabs/<TabName>Tab.tsx`. The form orchestrator (`<Feature>FormModal.tsx` or `<Feature>Screen.tsx`) SHALL only contain modal wrapping, React Hook Form setup, tab list / routing, and submit handling.

#### Scenario: Refactoring a tabbed form
- **WHEN** a form is using `<Tabs>` with 2 or more `<TabsContent>` panels
- **THEN** create `modules/<feature>/components/tabs/<TabName>Tab.tsx` for each panel
- **AND** the tab file SHALL render its own `<TabsContent value="…">` wrapper
- **AND** the tab component SHALL access shared form state via `useFormContext<FormValues>()`
- **AND** props SHALL be limited to feature-specific data not in the form (dropdown options, mode flags such as `disabled`)
- **AND** state local to a single tab (sub-tab navigation, derived lists, item-level handlers) SHALL live inside that tab file, not in the orchestrator

#### Implementation Pattern
```tsx
// modules/faktur-jual/components/tabs/BuyerTab.tsx
import { Controller, useFormContext } from 'react-hook-form'
import { TabsContent } from '@/components/ui/tabs'
import { InputField } from '@/components/ui/input-field'
import type { FakturJualFormValues } from '../../schemas/validationSchemas'

export function BuyerTab({ disabled }: { disabled: boolean }) {
  const { control, formState: { errors } } = useFormContext<FakturJualFormValues>()
  return (
    <TabsContent value="pembeli" forceMount>
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          name="buyer.nama"
          control={control}
          render={({ field }) => (
            <InputField {...field} label="Nama Pembeli" required error={errors.buyer?.nama?.message} disabled={disabled} />
          )}
        />
        {/* … */}
      </div>
    </TabsContent>
  )
}

// modules/faktur-jual/components/FakturJualFormModal.tsx (orchestrator)
<FormProvider {...methods}>
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="overflow-x-auto">
        {FAKTUR_JUAL_TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
        ))}
      </TabsList>
      <BuyerTab disabled={isViewMode} />
      <OwnerTab disabled={isViewMode} />
      <PackageTab disabled={isViewMode} packageOptions={packageOptions} itemOptions={itemOptions} />
      {/* … */}
    </Tabs>
  </form>
</FormProvider>
```

#### When NOT to split
- Forms with a **single tab** or no tabs at all — keep flat.
- Tabs with fewer than ~5 fields each in a small modal — splitting can create more files than insight.

#### Why
Multi-tab forms quickly grow past 300 lines. Splitting per tab makes each file mentally cheap (one tab = one concern), unlocks parallel edits without merge conflicts, and lets each tab own its local state instead of leaking into the orchestrator.

---

## Requirement: Module Structure

### Feature-Based Organization
Each feature SHALL have its own module in `/src/modules/<feature>/` with this structure:

```
/src/modules/my-feature/
├── MyFeatureScreen.tsx       (main page component)
├── components/               (feature-specific UI)
│   ├── FormModal.tsx
│   ├── FilterPopup.tsx
│   └── index.ts
├── hooks/
│   └── useMyFeature.ts       (consolidated 1-2 files, not per-hook)
├── schemas/                  (optional: Zod validation schemas)
│   └── validationSchemas.ts  (form validation with Zod)
├── utils/                    (optional: feature-specific utilities)
│   └── filterLogic.ts
└── my-feature.css            (feature styling)

/src/services/
├── my-feature.ts             (API functions, mock data initially)
```

### Zod Validation Schemas
All form validation schemas SHALL use Zod and live in `/src/modules/<feature>/schemas/validationSchemas.ts`.

#### Implementation Pattern
```ts
// /src/modules/my-feature/schemas/validationSchemas.ts
import { z } from 'zod'

export const myFormSchema = z.object({
  fieldName: z.string().min(1, 'Field is required').trim(),
  email: z.string().email('Invalid email').optional(),
})

export const filterSchema = z.object({
  search: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
})

export type MyFormInput = z.infer<typeof myFormSchema>
export type FilterInput = z.infer<typeof filterSchema>
```

#### Form Component Integration (React Hook Form + Zod)
```tsx
// /src/modules/my-feature/components/MyForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { myFormSchema, type MyFormInput } from '../schemas/validationSchemas'

export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<MyFormInput>({
    resolver: zodResolver(myFormSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('fieldName')} />
      {errors.fieldName && <p>{errors.fieldName.message}</p>}
    </form>
  )
}
```
### Routing Pattern
```ts
// App.tsx - Protected routes inside ProtectedLayout
<Route element={<ProtectedLayout />}>
  <Route path="/my-feature" element={<MyFeatureScreen />} />
</Route>

// AppLayout.tsx - Add NavLink
{ to: "/my-feature", label: "My Feature", icon: IconName }
```

### Requirement: Activity mode must use shared constants
Feature modules SHALL use `ACTIVITY_TYPE` from `@/constants` to determine activity mode behavior (create, read, update, delete), instead of hardcoded string literals.

#### Scenario: Implementing form mode behavior
- **WHEN** a form needs to branch behavior for create/edit/view/delete actions
- **THEN** import `ACTIVITY_TYPE` from `@/constants`
- **AND** compare mode values using `ACTIVITY_TYPE.CREATE`, `ACTIVITY_TYPE.READ`, `ACTIVITY_TYPE.UPDATE`, and `ACTIVITY_TYPE.DELETE`
- **AND** avoid direct string checks like `"create"` or `"edit"` in feature components

---

## Requirement: Error Handling & Auth

### Error Flow
`fetchDataAsync` catches errors → `useErrorStore.setError()` → `GlobalErrorDialog` displays error (mounted once in `main.tsx`).

### Auth Pattern
- **Storage**: `localStorage.token` + `localStorage.user`
- **API**: `api-client.ts` auto-attaches Bearer token header
- **401 Response**: Clears storage, redirects to `/login`
- **Protection**: `ProtectedLayout` in `src/layouts/ProtectedLayout.tsx` wraps protected routes

---

## Requirement: Shared Utilities

Reusable functions that don't fit services/hooks SHALL go in `/src/utils/` or `/src/lib/`.

#### Scenario: Adding shared logic
- **WHEN** implementing utility used across multiple features
- **THEN** place in `/src/utils/` with clear exports and JSDoc comments

---

## Requirement: Design System

### Colors & Tokens
- Page background: `#f1f5f9`
- Surfaces/cards: `#ffffff` (white)
- Depth via: `border border-border` + `shadow-sm/md/lg`
- Radius: `--radius: 0.75rem` (12px)
- Font: Plus Jakarta Sans

### Button Variants
- `default` = solid indigo
- `secondary` = light gray + border
- `outline` = border only
- `ghost` = transparent
- `destructive` = solid red

### No Dark Mode
❌ Do NOT use `dark:` classes. App is light-mode only.

---

## Requirement: Testing

### Unit Tests Pattern
- Location: `/test/services/`, `/test/modules/<feature>/`
- Framework: Vitest with React Testing Library
- Scope: Service functions, validation logic, filtering logic, error scenarios

### Test Structure
```ts
describe('Feature Name', () => {
  describe('specific behavior', () => {
    it('should do X when Y', () => {
      // arrange, act, assert
    })
  })
})
```
