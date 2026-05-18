# frontend-web

Enterprise CRM frontend — React 19, TypeScript, Vite, Tailwind v4, TanStack Query.

---

## Tech Stack

| Concern | Library |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Table | TanStack Table v8 |
| Global state | Zustand v5 |
| HTTP client | Axios |
| UI primitives | Radix UI |
| Design system | Neomorphic "Silk" (custom, shadcn-compatible) |

---

## Getting Started

```bash
npm install
npm run dev       # start dev server → http://localhost:5173
npm run build     # production build
npm run lint      # lint check
```

**Demo credentials:** `user@example.com / password123`

---

## Project Structure

```
src/
├── main.tsx              # App entry — QueryClient + GlobalErrorDialog
├── App.tsx               # Router + ProtectedRoute
├── types/index.ts        # All shared TypeScript interfaces
├── constants/index.ts    # App-wide constants
├── styles/tokens.css     # Design tokens (colors, shadows) — edit here for theming
├── lib/utils.ts          # cn() className utility
├── store/
│   └── useErrorStore.ts  # Zustand store for global error state
├── utils/
│   └── index.ts          # fetchDataAsync, formatIDR
├── services/
│   ├── api-client.ts     # Axios instance with auth interceptors
│   ├── auth.ts           # Login / logout API calls
│   └── api.ts            # All data API calls (mock + real)
├── components/
│   ├── GlobalErrorDialog.tsx   # Auto-shows error modal from store
│   ├── LoadingOverlay.tsx      # Full-screen loading state
│   ├── ErrorFallback.tsx       # Inline error display
│   ├── AppModal.tsx            # Generic modal wrapper
│   ├── ui/                     # Base UI components (Button, Input, Table, etc.)
│   └── layouts/                # Page, Header, Container, Section, Card
└── modules/
    ├── auth/             # Login screen + auth hooks
    ├── dashboard/        # Dashboard screen + data hooks
    └── leads/            # Leads screen + data hooks
```

---

## Architecture Decisions

### Modules

Each feature lives in `src/modules/[name]/` with its own screen and hooks:

```
modules/leads/
├── LeadsScreen.tsx
├── leads.css
└── hooks/
    ├── index.ts
    └── useLeadsQuery.ts
```

Services stay centralized in `src/services/` — not per module.

### Data Fetching

All async calls go through `fetchDataAsync`. Never write raw try/catch in hooks:

```ts
// src/modules/leads/hooks/useLeadsQuery.ts
export function useLeadsQuery() {
  const setError = useErrorStore((s) => s.setError)

  return useQuery({
    queryKey: ['leads'],
    queryFn: () => fetchDataAsync({
      asyncFn: fetchLeads,
      setError,
      menuName: 'leads',
    }),
  })
}
```

### Error Handling

Errors are handled globally — no per-screen error UI needed:

```
API throws → fetchDataAsync → useErrorStore → GlobalErrorDialog (modal)
```

To clear an error before retrying: `clearError('menuName')`.

### Authentication

- Token and user stored in `localStorage`
- `api-client.ts` automatically attaches `Authorization: Bearer <token>`
- 401 responses auto-redirect to `/login`
- `ProtectedRoute` in `App.tsx` guards authenticated pages

### Imports

Always use `@/` alias — never relative `../../` paths:

```ts
import { Button } from '@/components/ui/button'
import type { Lead } from '@/types'
```

---

## How to Add a New Screen

### 1. Create the module folder

```
src/modules/[name]/
├── [Name]Screen.tsx
├── [name].css          (if needed)
└── hooks/
    ├── index.ts
    └── use[Name]Query.ts
```

### 2. Create the data hook

```ts
// src/modules/[name]/hooks/use[Name]Query.ts
import { useQuery } from '@tanstack/react-query'
import { useErrorStore } from '@/store/useErrorStore'
import { fetchDataAsync } from '@/utils'
import { fetchSomething } from '@/services/api'

export function useNameQuery() {
  const setError = useErrorStore((s) => s.setError)

  return useQuery({
    queryKey: ['name'],
    queryFn: () => fetchDataAsync({
      asyncFn: fetchSomething,
      setError,
      menuName: 'name',
    }),
  })
}
```

### 3. Create the service function

```ts
// src/services/api.ts — add your function
export const fetchSomething = async (): Promise<Something[]> => {
  // Uncomment when backend is ready:
  // const res = await apiClient.get('/something')
  // return res.data

  // Mock data for now:
  await new Promise(r => setTimeout(r, 600))
  return [{ id: 1, name: 'Demo' }]
}
```

### 4. Add the type

```ts
// src/types/index.ts
export interface Something {
  id: number
  name: string
}
```

### 5. Build the screen

```tsx
// src/modules/[name]/[Name]Screen.tsx
import { Page, Header, Container, Section } from '@/components/layouts'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { DataTable } from '@/components/ui/table'
import type { ColumnDef } from '@tanstack/react-table'
import type { Something } from '@/types'
import { useNameQuery } from './hooks'

const columns: ColumnDef<Something>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
]

export function NameScreen() {
  const { data, isPending } = useNameQuery()

  if (isPending) return <LoadingOverlay message="Loading..." />

  return (
    <Page>
      <Header title="Name" subtitle={`${data?.length ?? 0} items`} />
      <Container maxWidth="xl">
        <Section>
          <DataTable columns={columns} data={data ?? []} />
        </Section>
      </Container>
    </Page>
  )
}
```

### 6. Register the route

```tsx
// src/App.tsx
import { NameScreen } from '@/modules/[name]/NameScreen'

// inside <Routes>:
<Route path="/name" element={<ProtectedRoute><NameScreen /></ProtectedRoute>} />
```

---

## How to Connect Real APIs

All mock implementations are in `src/services/api.ts` and `src/services/auth.ts`.
Every function has the real Axios call commented out above the mock.

Steps:
1. Set `VITE_API_URL` in `.env`:
   ```
   VITE_API_URL=https://your-api.com/api
   ```
2. In the service file, uncomment the real implementation and delete the mock block.
3. Ensure the backend returns the same shape as the TypeScript interface in `src/types/index.ts`. Adjust the interface if needed.

---

## Design System

Theme: **Clean modern flat** — white surfaces on a light slate background. Depth via borders and subtle shadows.

### Tokens

Edit `src/styles/tokens.css` to change colors or shadows globally.

| Token | Value | Usage |
|---|---|---|
| `--color-bg-page` | `#f1f5f9` | Page background |
| `--color-surface` | `#ffffff` | Cards, modals, inputs |
| `--color-border` | `#e2e8f0` | All borders |
| `--color-brand` | `#6366f1` (indigo) | Primary buttons, active states |
| `--color-brand-alt` | `#7c3aed` (violet) | Secondary accent |
| `--color-error-text` | `#ef4444` | Error messages |
| `--shadow-sm` | 0 1px 3px ... | Cards, sections |
| `--shadow-md` | 0 4px 6px ... | Elevated cards |
| `--shadow-lg` | 0 10px 15px ... | Modals, dialogs |

### Button Variants

| Variant | Style |
|---|---|
| `default` | Solid indigo, white text |
| `secondary` | Light gray + border |
| `outline` | Border only, transparent bg |
| `ghost` | Transparent, hover fills gray |
| `destructive` | Solid red, white text |

### Layout Components

```tsx
<Page>
  <Header
    title="Page Title"
    subtitle="Optional subtitle"
    action={<Button>Action</Button>}
  />
  <Container maxWidth="xl">    {/* xl | lg | md | sm */}
    <Section title="Section">
      <Card>...</Card>
    </Section>
  </Container>
</Page>
```

---

## Team Rules

1. **Import alias** — always `@/`, never `../../`
2. **Error handling** — always use `fetchDataAsync`, never manual try/catch in hooks
3. **Types** — define all interfaces in `src/types/index.ts`, use `import type`
4. **Constants** — module-specific → `modules/[name]/constants.ts`, shared → `constants/index.ts`
5. **No dark mode** — single light theme only, no `dark:` Tailwind classes
6. **Fast Refresh rule** — a file must export only components OR only non-components, never both (that's why `button-variants.ts` is separate from `button.tsx`)
7. **Mock first** — implement mock in service first, keep real code commented out until backend is ready
8. **Naming** — screens = `[Name]Screen.tsx`, hooks = `use[Name]Query.ts` or `use[Name]Mutation.ts`
