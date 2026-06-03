# Monorepo Architecture Plan

## Goal

Restructure the current single SPA into a monorepo with domain packages.
Produce 3 independently deployable products from one codebase.

## Products

| App | Domain | Packages included |
|-----|--------|-------------------|
| `full` | `https://crm.perusahaan.com` | ui + shared + auth + dashboard + master-data + order + delivery |
| `order-only` | `https://order.perusahaan.com` | ui + shared + auth + dashboard + order + delivery |
| `master-only` | `https://master.perusahaan.com` | ui + shared + auth + dashboard + master-data |

---

## Final Structure

```
frontend-web/
├── package.json                       ← "workspaces": ["packages/*", "apps/*"]
├── tsconfig.json
├── eslint.config.js
│
├── packages/
│   ├── ui/                            ← @frontend/ui (primitives, shared components)
│   ├── shared/                        ← @frontend/shared (infra: types, api-client, store, utils)
│   ├── auth/                          ← @frontend/auth (login/register screens, layouts, hooks)
│   ├── dashboard/                     ← @frontend/dashboard (DashboardScreen, stats hooks)
│   ├── master-data/                   ← @frontend/master-data (all master-x screens + CRUD services)
│   ├── order/                         ← @frontend/order (fjb, ekspedisi, pdi screens + read-only lookups)
│   └── delivery/                      ← @frontend/delivery (leads + future screens)
│
└── apps/
    ├── full/                          ← all packages → complete product
    ├── order-only/                    ← ui + shared + auth + dashboard + order + delivery
    └── master-only/                   ← ui + shared + auth + dashboard + master-data
```

---

## Package Contents

### `packages/ui` (@frontend/ui)

Pure UI primitives, zero business logic.

**From `src/components/`:**
```
components/ui/*              → packages/ui/src/components/ui/          (21 shadcn primitives)
components/AppModal.tsx      → packages/ui/src/components/AppModal.tsx
components/LoadingOverlay.*  → packages/ui/src/components/
components/GlobalErrorDialog → packages/ui/src/components/
components/TopLoadingBar.*   → packages/ui/src/components/
components/ModalProvider.tsx → packages/ui/src/components/
components/ErrorFallback.tsx → packages/ui/src/components/
components/layouts/*         → packages/ui/src/components/layouts/      (Card, Container, Header, Page, Row, Section)
```

### `packages/shared` (@frontend/shared)

Shared infrastructure, zero React components.

**From `src/`:**
```
services/api-client.ts  → packages/shared/src/api-client.ts
store/useErrorStore.ts  → packages/shared/src/store/useErrorStore.ts
types/index.ts          → packages/shared/src/types/index.ts   (generic types only: IBaseResponse, SelectOption, etc.)
utils/index.ts          → packages/shared/src/utils/index.ts   (fetchDataAsync, formatIDR)
lib/utils.ts            → packages/shared/src/lib/utils.ts    (cn helper)
```

### `packages/auth` (@frontend/auth)

Auth screens, layouts, auth hooks, auth service.

**From `src/`:**
```
modules/auth/*               → packages/auth/src/             (LoginScreen, RegisterScreen, hooks, schemas)
layouts/ProtectedLayout.tsx  → packages/auth/src/layouts/     (refactor: render <Outlet />)
layouts/AppLayout.tsx        → packages/auth/src/layouts/     (refactor: navGroups prop)
layouts/AppLayout.css        → packages/auth/src/layouts/
services/auth.ts             → packages/auth/src/services/
types/types-auth.ts          → packages/auth/src/types/
```

### `packages/dashboard` (@frontend/dashboard)

Dashboard screen + service calls.

**From `src/`:**
```
modules/dashboard/*          → packages/dashboard/src/        (DashboardScreen, hooks, css)
services/api.ts              → packages/dashboard/src/services/  (fetchUsers, fetchStats, fetchReports, fetchSettings)
```

### `packages/master-data` (@frontend/master-data)

All master-x screens + CRUD services.

**From `src/`:**
```
modules/master-cabang/*      → packages/master-data/src/screens/master-cabang/
modules/master-coa/*         → packages/master-data/src/screens/master-coa/
modules/master-kas/*         → packages/master-data/src/screens/master-kas/
modules/master-locator/*     → packages/master-data/src/screens/master-locator/
modules/master-service/*     → packages/master-data/src/screens/master-service/
services/master-cabang.ts    → packages/master-data/src/services/
services/master-coa.ts       → packages/master-data/src/services/
services/master-kas.ts       → packages/master-data/src/services/
services/master-locator.ts   → packages/master-data/src/services/
services/master-service.ts   → packages/master-data/src/services/
```

### `packages/order` (@frontend/order)

Order screens + own read-only master data lookups.

**From `src/`:**
```
modules/fjb/*                   → packages/order/src/screens/fjb/
modules/ekspedisi-inventory/*   → packages/order/src/screens/ekspedisi/
modules/pdi/*                   → packages/order/src/screens/pdi/
services/fjb.ts                 → packages/order/src/services/
services/ekspedisi-inventory.ts → packages/order/src/services/
services/pdi.ts                 → packages/order/src/services/
```

**New file:**
```
packages/order/src/services/master-lookups.ts  ← decoupled fetchBranches from master-cabang
```

### `packages/delivery` (@frontend/delivery)

Delivery screens.

**From `src/`:**
```
modules/leads/*              → packages/delivery/src/        (LeadsScreen, hooks, css)
services/api.ts (fetchLeads) → packages/delivery/src/services/leads.ts
```

---

## App Structures

### `apps/full/`

```
package.json                 ← deps: ui, shared, auth, dashboard, master-data, order, delivery
vite.config.ts               ← port 5173
tsconfig.json
index.html
src/
├── main.tsx
├── App.tsx                   ← routes ALL screens from ALL packages
├── index.css                 ← tailwind import
├── navigation.ts             ← all 3 nav groups (Monitoring, Transaction, Master Data)
└── assets/
```

### `apps/order-only/`

```
package.json                 ← deps: ui, shared, auth, dashboard, order, delivery
vite.config.ts               ← port 5174
index.html
src/
├── main.tsx
├── App.tsx                   ← routes only order + delivery screens
├── index.css
└── navigation.ts             ← only Monitoring + Transaction groups
```

### `apps/master-only/`

```
package.json                 ← deps: ui, shared, auth, dashboard, master-data
vite.config.ts               ← port 5175
index.html
src/
├── main.tsx
├── App.tsx                   ← routes only master-data screens
├── index.css
└── navigation.ts             ← only Monitoring + Master Data groups
```

---

## Key Architectural Changes

### 1. ProtectedLayout renders `<Outlet />`

```tsx
// packages/auth/src/layouts/ProtectedLayout.tsx
export default function ProtectedLayout() {
  const isAuthenticated = !!localStorage.getItem('user')
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return <Outlet />   // was: return <AppLayout />
}
```

### 2. AppLayout accepts `navGroups` prop

```tsx
// packages/auth/src/layouts/AppLayout.tsx
export function AppLayout({ navGroups }: { navGroups: NavGroup[] }) {
  // uses navGroups prop instead of importing Constants
}
```

### 3. Cross-domain coupling eliminated

pdi currently imports `fetchBranches` from `services/master-cabang.ts`.
Fix: Create `packages/order/src/services/master-lookups.ts` with a local copy of `fetchBranches`.

### 4. Navigation defined per app, not per module

Each app has its own `navigation.ts`. No hardcoded Constants.

### 5. Routing nested layout pattern

```tsx
<Route element={<ProtectedLayout />}>       // auth check
  <Route element={<AppLayout navGroups={X} />}>  // sidebar + header
    <Route path="/dashboard" element={<DashboardScreen />} />
    ...
  </Route>
</Route>
```

---

## Domain Dependency Graph

```
apps/full → @frontend/{ui, shared, auth, dashboard, master-data, order, delivery}
apps/order-only → @frontend/{ui, shared, auth, dashboard, order, delivery}
apps/master-only → @frontend/{ui, shared, auth, dashboard, master-data}

@frontend/order → @frontend/{ui, shared}        ✓ (NOT master-data)
@frontend/master-data → @frontend/{ui, shared}  ✓
@frontend/delivery → @frontend/{ui, shared}     ✓
@frontend/dashboard → @frontend/{ui, shared}    ✓
@frontend/auth → @frontend/{ui, shared}         ✓
```

---

## Production Build

```bash
npm run build:order   # → dist/order-only/   → deploy to https://order.perusahaan.com
npm run build:master  # → dist/master-only/  → deploy to https://master.perusahaan.com
npm run build:full    # → dist/full/         → deploy to https://crm.perusahaan.com
```

Each app uses its own `.env.production`:
```
# apps/order-only/.env.production
VITE_API_URL=https://api.perusahaan.com
```
