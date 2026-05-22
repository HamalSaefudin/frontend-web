# Tasks — add-master-bank

## 1. Setup & Infrastructure

- [ ] 1.1 Create module structure at `src/modules/master-bank/` following master-user pattern
- [ ] 1.2 Create service layer at `src/services/master-bank.ts` with API endpoints
- [ ] 1.3 Create types at `src/types/master-bank.ts` based on FSD entity (id, code, name, status, createdAt, updatedAt)
- [ ] 1.4 Set up mock data for development (if needed)

## 2. List Banks (US-006)

- [ ] 2.1 Create BankListPage component with DataTable
- [ ] 2.2 Implement GET /api/v1/master-banks API call with pagination, keyword, and status filters
- [ ] 2.3 Add search/filter UI (keyword input, status dropdown)
- [ ] 2.4 Handle empty state (no data)

## 3. Create Bank (US-001)

- [ ] 3.1 Create BankFormModal using AppModal + React Hook Form + Zod
- [ ] 3.2 Implement POST /api/v1/master-banks API call
- [ ] 3.3 Add validation: code required, code unique, name required
- [ ] 3.4 Handle BANK_CODE_EXISTS and INVALID_BANK_CODE errors
- [ ] 3.5 Add "Create Bank" button on list page

## 4. Get Bank Detail (US-005)

- [ ] 4.1 Implement GET /api/v1/master-banks/{bankId} API call
- [ ] 4.2 Create BankDetailModal or integrate with edit form
- [ ] 4.3 Handle BANK_NOT_FOUND error

## 5. Update Bank (US-002)

- [ ] 5.1 Add edit functionality to BankFormModal (reusable for create/update)
- [ ] 5.2 Implement PUT /api/v1/master-banks/{bankId} API call
- [ ] 5.3 Handle BANK_NOT_FOUND and BANK_CODE_EXISTS errors
- [ ] 5.4 Add "Edit" action on list page

## 6. Activate Bank (US-003)

- [ ] 6.1 Implement PATCH /api/v1/master-banks/{bankId}/activate API call
- [ ] 6.2 Add "Activate" action on list page (for INACTIVE banks)
- [ ] 6.3 Handle INVALID_STATE and BANK_NOT_FOUND errors

## 7. Deactivate Bank (US-004)

- [ ] 7.1 Implement PATCH /api/v1/master-banks/{bankId}/deactivate API call
- [ ] 7.2 Add "Deactivate" action on list page (for ACTIVE banks)
- [ ] 7.3 Handle INVALID_STATE and BANK_NOT_FOUND errors

## 8. State Management & Integration

- [ ] 8.1 Create consolidated hooks in `src/modules/master-bank/hooks.ts`
- [ ] 8.2 Integrate React Query for data fetching and caching
- [ ] 8.3 Add route for master-bank in App.tsx
- [ ] 8.4 Add navigation menu item

## 9. UI/UX Polish

- [ ] 9.1 Add loading states for all actions
- [ ] 9.2 Add toast notifications for success/error feedback
- [ ] 9.3 Add confirmation dialogs for activate/deactivate actions
- [ ] 9.4 Style according to project design system

## 10. Testing

- [ ] 10.1 Add unit tests for service layer
- [ ] 10.2 Add unit tests for hooks
- [ ] 10.3 Add component tests for forms and modals
- [ ] 10.4 Test edge cases per FSD (existing code, invalid state, etc.)