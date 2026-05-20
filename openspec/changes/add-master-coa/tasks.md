# Tasks — add-master-coa

Rencana form (cabang multi-select + status switch saat submit): [docs/master-coa/plan-master-coa-form-ux.md](../../../docs/master-coa/plan-master-coa-form-ux.md)

## 1. Setup

- [x] 1.1 Create module directory structure (src/modules/master-coa/)
- [x] 1.2 Add Master COA route to App.tsx
- [x] 1.3 Create navigation menu entry for Master COA

## 2. Types & Interfaces

- [x] 2.1 Define MasterCoa entity type (id, coaId, coaName, branches, status, createdAt, updatedAt)
- [x] 2.2 Define CoaTransaction type (transactionId, transactionName, category, subgroup, group, status)
- [x] 2.3 Define API response types (Create, Update, List, Detail responses)
- [x] 2.4 Define error types (COA_NOT_FOUND, BRANCH_ALREADY_USED, INVALID_STATE, COA_ALREADY_USED, INVALID_COA_NAME)

## 3. API Service

- [x] 3.1 Create masterCoa service (POST /api/v1/master-coas - create)
- [x] 3.2 Add updateMasterCoa (PUT /api/v1/master-coas/{coaId})
- [x] 3.3 Add activateMasterCoa (PATCH /api/v1/master-coas/{coaId}/activate)
- [x] 3.4 Add deactivateMasterCoa (PATCH /api/v1/master-coas/{coaId}/deactivate)
- [x] 3.5 Add copyMasterCoa (POST /api/v1/master-coas/{coaId}/copy)
- [x] 3.6 Add deleteMasterCoa (DELETE /api/v1/master-coas/{coaId})
- [x] 3.7 Add getMasterCoaDetail (GET /api/v1/master-coas/{coaId})
- [x] 3.8 Add getMasterCoaList (GET /api/v1/master-coas with keyword, status, page, size)

## 4. Hooks

- [x] 4.1 Create useMasterCoaList hook (fetch, filter, pagination)
- [x] 4.2 Create useMasterCoaDetail hook (fetch single COA)
- [x] 4.3 Create useMasterCoaCreate hook (create new COA)
- [x] 4.4 Create useMasterCoaUpdate hook (update COA)
- [x] 4.5 Create useMasterCoaActivate hook (activate COA)
- [x] 4.6 Create useMasterCoaDeactivate hook (deactivate COA)
- [x] 4.7 Create useMasterCoaCopy hook (copy COA)
- [x] 4.8 Create useMasterCoaDelete hook (delete COA)
- [x] 4.9 Add useQueryCabang for branch options (shared queryKey with master-kas)

## 5. Components - List View

- [x] 5.1 Create MasterCoaScreen (list + toolbar)
- [x] 5.2 Implement DataTable with columns (coaId, coaName, branches, actions)
- [x] 5.3 Add status filter (ACTIVE/INACTIVE)
- [x] 5.4 Add pagination controls
- [x] 5.5 Add action buttons (View, Edit, Activate/Deactivate, Copy, Delete)

## 6. Components - Detail View

- [x] 6.1 MasterCoaDetailDialog (modal detail)
- [x] 6.2 Display COA information (coaId, coaName, status, branches)
- [x] 6.3 Display transaction list with category, subgroup, group
- [x] 6.4 Add action buttons (Edit, Activate/Deactivate, Delete)

## 7. Components - Create/Update Form

- [x] 7.1 Create MasterCoaForm component using React Hook Form + Zod
- [x] 7.2 Add coaName field (required, max 255)
- [x] 7.3 Add branches via SelectField multi (min 1), options from master cabang
- [x] 7.4 Add status Switch (statusActive); applied on submit via activate/deactivate APIs
- [x] 7.5 Add transactions section (create only): transactionName, category, subgroup, group
- [x] 7.6 Add form validation with Zod schema
- [x] 7.7 Handle BRANCH_ALREADY_USED error display
- [x] 7.8 Handle INVALID_COA_NAME error display

## 15. DataTable for Transactions (NEW)

- [x] 15.1 Update validationSchemas.ts - add `isSaved` field to transaction schema
- [x] 15.2 Add imports: useFormContext, ColumnDef, DataTable, CheckIcon, EditIcon
- [x] 15.3 Create TransactionRow type with isSaved property
- [x] 15.4 Build buildTransactionColumns function (inline editing)
- [x] 15.5 Replace manual fields.map() with DataTable component
- [x] 15.6 Add emptyStateMessage to DataTable
- [x] 15.7 Test inline edit/save flow

## 8. Components - Dialogs/Modals

- [x] 8.1 Create confirmation dialog for Activate action
- [x] 8.2 Create confirmation dialog for Deactivate action
- [x] 8.3 Create confirmation dialog for Delete action
- [x] 8.4 Create Copy COA dialog with branch multi-select

## 9. State Management

- [x] 9.1 Set up React Query for data fetching and caching
- [x] 9.2 Implement optimistic updates for activate/deactivate
- [x] 9.3 Handle invalidation after create/update/delete

## 10. Error Handling

- [x] 10.1 Implement COA_NOT_FOUND error display (via API messages / feedback)
- [x] 10.2 Implement BRANCH_ALREADY_USED error display
- [x] 10.3 Implement INVALID_STATE error display
- [x] 10.4 Implement COA_ALREADY_USED error display
- [ ] 10.5 Add global error boundary for unexpected errors

## 11. Loading States

- [x] 11.1 LoadingOverlay for list view
- [x] 11.2 LoadingOverlay for detail modal
- [x] 11.3 Loading state for form submission (button disabled)
- [ ] 11.4 Add loading state for action buttons (row actions)

## 12. Empty States

- [x] 12.1 Add empty state for list view (no COA found)
- [x] 12.2 Add empty state for transaction list (detail dialog)

## 13. Testing

- [ ] 13.1 Write unit tests for masterCoa service
- [ ] 13.2 Write unit tests for hooks
- [ ] 13.3 Write component tests for form validation
- [ ] 13.4 Write integration tests for CRUD flows

## 14. Integration & Polish

- [ ] 14.1 Verify all API endpoints are connected (replace mocks when backend ready)
- [ ] 14.2 Test responsive layout
- [x] 14.3 Verify error messages match API contract (mock aligned)
- [x] 14.4 Verify success messages match API contract
