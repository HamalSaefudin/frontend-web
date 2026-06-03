# TODO: Monorepo Architecture Migration

> Check off tasks as you complete them. Use this file to track progress across sessions.

---

## ✅ Phase 0: Decouple Cross-Domain Dependency

- [ ] Create `src/services/master-lookups.ts` with local `fetchBranches()` (duplicate from `master-cabang.ts`)
- [ ] Update `src/modules/pdi/hooks/usePdi.ts` to import from `@/services/master-lookups` instead of `@/services/master-cabang`

---

## ✅ Phase 1: Create Shared Foundation Packages

### 1.1 Root workspace setup
- [ ] Update root `package.json` — add `"workspaces": ["packages/*", "apps/*"]`
- [ ] Run `npm install` to bootstrap workspace

### 1.2 `packages/ui` (@frontend/ui)
- [ ] Create `packages/ui/package.json`
- [ ] Create `packages/ui/tsconfig.json`
- [ ] Create `packages/ui/src/index.ts` (barrel exports)
- [ ] Move `src/components/ui/*` → `packages/ui/src/components/ui/`
- [ ] Move `src/components/AppModal.tsx` → `packages/ui/src/components/`
- [ ] Move `src/components/LoadingOverlay.*` → `packages/ui/src/components/`
- [ ] Move `src/components/GlobalErrorDialog.tsx` → `packages/ui/src/components/`
- [ ] Move `src/components/TopLoadingBar.*` → `packages/ui/src/components/`
- [ ] Move `src/components/ModalProvider.tsx` → `packages/ui/src/components/`
- [ ] Move `src/components/ErrorFallback.tsx` → `packages/ui/src/components/`
- [ ] Move `src/components/layouts/*` → `packages/ui/src/components/layouts/`
- [ ] Update `package.json` dependencies (react, react-router-dom, lucide-react, class-variance-authority, etc.)

### 1.3 `packages/shared` (@frontend/shared)
- [ ] Create `packages/shared/package.json`
- [ ] Create `packages/shared/tsconfig.json`
- [ ] Create `packages/shared/src/index.ts` (barrel exports)
- [ ] Move `src/services/api-client.ts` → `packages/shared/src/`
- [ ] Move `src/store/useErrorStore.ts` → `packages/shared/src/store/`
- [ ] Move `src/types/index.ts` (keep ONLY generic types: IBaseResponse, SelectOption, IApiError, IPaginatedDataResponse) → `packages/shared/src/types/`
- [ ] Move `src/utils/index.ts` → `packages/shared/src/utils/`
- [ ] Move `src/lib/utils.ts` → `packages/shared/src/lib/`
- [ ] Update `package.json` dependencies (axios, zustand, tailwind-merge, clsx)

---

## ✅ Phase 2: Create Domain Packages

### 2.1 `packages/auth` (@frontend/auth)
- [ ] Create `packages/auth/package.json`
- [ ] Create `packages/auth/tsconfig.json`
- [ ] Create `packages/auth/src/index.ts` (barrel exports)
- [ ] Move `src/modules/auth/*` → `packages/auth/src/` (LoginScreen, RegisterScreen, hooks, schemas)
- [ ] Move `src/layouts/ProtectedLayout.tsx` → `packages/auth/src/layouts/`
- [ ] **REFACTOR** `ProtectedLayout.tsx` — change `return <AppLayout />` to `return <Outlet />`
- [ ] Move `src/layouts/AppLayout.tsx` + `AppLayout.css` → `packages/auth/src/layouts/`
- [ ] **REFACTOR** `AppLayout.tsx` — accept `navGroups` as prop, remove `import { NAV_GROUPS } from "./Constants"`
- [ ] Move `src/services/auth.ts` → `packages/auth/src/services/`
- [ ] Move `src/types/types-auth.ts` → `packages/auth/src/types/`
- [ ] Update `package.json` dependencies (react-hook-form, zod, @tanstack/react-query)

### 2.2 `packages/dashboard` (@frontend/dashboard)
- [ ] Create `packages/dashboard/package.json`
- [ ] Create `packages/dashboard/tsconfig.json`
- [ ] Create `packages/dashboard/src/index.ts` (barrel exports)
- [ ] Move `src/modules/dashboard/*` → `packages/dashboard/src/`
- [ ] Move `fetchUsers, fetchStats, fetchReports, fetchSettings` from `src/services/api.ts` → `packages/dashboard/src/services/api.ts`
- [ ] Update `package.json` dependencies (@tanstack/react-query)

### 2.3 `packages/master-data` (@frontend/master-data)
- [ ] Create `packages/master-data/package.json`
- [ ] Create `packages/master-data/tsconfig.json`
- [ ] Create `packages/master-data/src/index.ts` (barrel exports — re-export all screens)
- [ ] Move `src/modules/master-cabang/*` → `packages/master-data/src/screens/master-cabang/`
- [ ] Move `src/modules/master-coa/*` → `packages/master-data/src/screens/master-coa/`
- [ ] Move `src/modules/master-kas/*` → `packages/master-data/src/screens/master-kas/`
- [ ] Move `src/modules/master-locator/*` → `packages/master-data/src/screens/master-locator/`
- [ ] Move `src/modules/master-service/*` → `packages/master-data/src/screens/master-service/`
- [ ] Move `src/services/master-cabang.ts` → `packages/master-data/src/services/`
- [ ] Move `src/services/master-coa.ts` → `packages/master-data/src/services/`
- [ ] Move `src/services/master-kas.ts` → `packages/master-data/src/services/`
- [ ] Move `src/services/master-locator.ts` → `packages/master-data/src/services/`
- [ ] Move `src/services/master-service.ts` → `packages/master-data/src/services/`
- [ ] Update `package.json` dependencies

### 2.4 `packages/order` (@frontend/order)
- [ ] Create `packages/order/package.json`
- [ ] Create `packages/order/tsconfig.json`
- [ ] Create `packages/order/src/index.ts` (barrel exports)
- [ ] Move `src/modules/fjb/*` → `packages/order/src/screens/fjb/`
- [ ] Move `src/modules/ekspedisi-inventory/*` → `packages/order/src/screens/ekspedisi/`
- [ ] Move `src/modules/pdi/*` → `packages/order/src/screens/pdi/`
- [ ] Move `src/services/fjb.ts` → `packages/order/src/services/`
- [ ] Move `src/services/ekspedisi-inventory.ts` → `packages/order/src/services/`
- [ ] Move `src/services/pdi.ts` → `packages/order/src/services/`
- [ ] **CREATE** `packages/order/src/services/master-lookups.ts` — with `fetchBranches()` calling `/api/v1/cabang`
- [ ] Update `package.json` dependencies

### 2.5 `packages/delivery` (@frontend/delivery)
- [ ] Create `packages/delivery/package.json`
- [ ] Create `packages/delivery/tsconfig.json`
- [ ] Create `packages/delivery/src/index.ts` (barrel exports)
- [ ] Move `src/modules/leads/*` → `packages/delivery/src/`
- [ ] Move `fetchLeads` from `src/services/api.ts` → `packages/delivery/src/services/leads.ts`
- [ ] Update `package.json` dependencies

---

## ✅ Phase 3: Create Deployable Apps

### 3.1 `apps/full`
- [ ] Create `apps/full/package.json` (deps: all 7 packages)
- [ ] Create `apps/full/vite.config.ts` (port 5173, base `/`)
- [ ] Create `apps/full/tsconfig.json`
- [ ] Create `apps/full/index.html`
- [ ] Create `apps/full/src/main.tsx`
- [ ] Create `apps/full/src/App.tsx` (routes ALL screens)
- [ ] Create `apps/full/src/index.css` (tailwind import)
- [ ] Create `apps/full/src/navigation.ts` (all 3 nav groups)
- [ ] Create `apps/full/.env.production` (VITE_API_URL)

### 3.2 `apps/order-only`
- [ ] Create `apps/order-only/package.json` (deps: ui, shared, auth, dashboard, order, delivery)
- [ ] Create `apps/order-only/vite.config.ts` (port 5174)
- [ ] Create `apps/order-only/tsconfig.json`
- [ ] Create `apps/order-only/index.html`
- [ ] Create `apps/order-only/src/main.tsx`
- [ ] Create `apps/order-only/src/App.tsx` (routes only order + delivery screens)
- [ ] Create `apps/order-only/src/index.css`
- [ ] Create `apps/order-only/src/navigation.ts` (only Monitoring + Transaction)
- [ ] Create `apps/order-only/.env.production`

### 3.3 `apps/master-only`
- [ ] Create `apps/master-only/package.json` (deps: ui, shared, auth, dashboard, master-data)
- [ ] Create `apps/master-only/vite.config.ts` (port 5175)
- [ ] Create `apps/master-only/tsconfig.json`
- [ ] Create `apps/master-only/index.html`
- [ ] Create `apps/master-only/src/main.tsx`
- [ ] Create `apps/master-only/src/App.tsx` (routes only master-data screens)
- [ ] Create `apps/master-only/src/index.css`
- [ ] Create `apps/master-only/src/navigation.ts` (only Monitoring + Master Data)
- [ ] Create `apps/master-only/.env.production`

---

## ✅ Phase 4: Update All Imports

- [ ] `packages/shared/` — all internal imports (no changes, no `@/` deps)
- [ ] `packages/ui/` — all internal imports (no `@/` deps)
- [ ] `packages/auth/` — update `@/components/...` → `@frontend/ui/...`, `@/shar` → `@frontend/shared/...`
- [ ] `packages/dashboard/` — update imports
- [ ] `packages/master-data/` — update imports
- [ ] `packages/order/` — update imports, fix pdi import to use local `master-lookups`
- [ ] `packages/delivery/` — update imports
- [ ] `apps/*` — all imports reference `@frontend/...`

---

## ✅ Phase 5: Cleanup Old `src/`

- [ ] Delete `src/components/`
- [ ] Delete `src/modules/`
- [ ] Delete `src/layouts/`
- [ ] Delete `src/services/`
- [ ] Delete `src/store/`
- [ ] Delete `src/types/`
- [ ] Delete `src/utils/`
- [ ] Delete `src/lib/`
- [ ] Delete `src/App.tsx`, `src/main.tsx`, `src/index.css`
- [ ] Delete `src/App.css` (if unused)
- [ ] Keep `src/assets/` (moved to apps as needed)
- [ ] Keep `src/constants/` (check if anything is needed)
- [ ] Keep `src/hooks/` (check: `use-mobile.ts` may move to ui)
- [ ] Keep `src/styles/` (design tokens, check if still needed)

---

## ✅ Phase 6: Verify Builds

- [ ] Run `npm run build:order` — verify `dist/order-only/` exists and has no master-data code
- [ ] Run `npm run build:master` — verify `dist/master-only/` exists and has no order code
- [ ] Run `npm run build:full` — verify `dist/full/` exists with all features
- [ ] Run `npm run lint` — no errors
- [ ] Run `npm test` — no failures
- [ ] Dev test: `npm run dev:order` — login, navigate screens, verify no broken paths
- [ ] Dev test: `npm run dev:master` — login, navigate screens
- [ ] Dev test: `npm run dev:full` — login, navigate all screens
