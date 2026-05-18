## 1. Project Setup & Architecture

- [x] 1.1 Create Master Cabang module directory structure (`/src/modules/master-cabang/`)
- [x] 1.2 Set up route for Master Cabang Management page
- [x] 1.3 Create API service file (`/src/services/master-cabang.ts`) with mock data and TODO comments

## 2. Data Fetching & State Management

- [x] 2.1 Create `useMasterCabang` hook file with exports:
  - `useQueryCabang()` for fetching all branches
  - `useMutationCreateCabang()` for create mutation
  - `useMutationUpdateCabang()` for update mutation
  - `useMutationDeleteCabang()` for delete mutation
- [x] 2.2 Implement branch filtering logic (based on selected filters)

## 3. Data Table Component

- [x] 3.1 Create main MasterCabangScreen component with page layout
- [x] 3.2 Set up DataTable with columns: branch code, branch name, leader name
- [x] 3.3 Implement table action buttons (edit pencil icon, delete trash icon)
- [x] 3.4 Configure pagination (default 5 rows, options: 5, 10, 30)
- [x] 3.5 Integrate DataTable with empty state messaging
- [x] 3.6 Implement loading skeleton while fetching data
- [x] 3.7 Add responsive design for mobile/tablet/desktop views

## 4. Filter Functionality

- [x] 4.1 Create FilterPopup component with filter form
- [x] 4.2 Add filter input fields: branch code, branch name, leader name
- [x] 4.3 Implement filter apply logic with AND condition matching
- [x] 4.4 Implement clear/reset filters functionality
- [x] 4.5 Add case-insensitive and partial string matching
- [x] 4.6 Implement filter state persistence during session
- [x] 4.7 Add empty state messaging when filters return no results

## 5. Create Branch Functionality

- [x] 5.1 Create BranchForm component for create/edit operations
- [x] 5.2 Create modal dialog wrapper for new branch creation
- [x] 5.3 Add form inputs for: branch code, branch name, leader name
- [x] 5.4 Implement client-side form validation (all fields mandatory)
- [x] 5.5 Add validation error display below fields (only after submit attempt)
- [x] 5.6 Implement form submission to create branch
- [x] 5.7 Auto-close modal and refresh table on successful create
- [x] 5.8 Add success/error feedback messages

## 6. Edit Branch Functionality

- [x] 6.1 Implement edit button click handler from table row
- [x] 6.2 Create API service method to fetch single branch details
- [x] 6.3 Pre-fill BranchForm with existing branch data in edit mode
- [x] 6.4 Implement form submission for branch updates
- [x] 6.5 Add form validation (same rules as create)
- [x] 6.6 Auto-close modal and refresh table on successful update
- [x] 6.7 Add success/error feedback messages

## 7. Delete Branch Functionality

- [x] 7.1 Implement delete button click handler from table row
- [x] 7.2 Create confirmation dialog showing branch name
- [x] 7.3 Implement confirm/cancel logic
- [x] 7.4 Call API to delete branch on confirmation
- [x] 7.5 Remove deleted branch from table on success
- [x] 7.6 Add success/error feedback messages
- [x] 7.7 Handle permission/authorization errors gracefully

## 8. Global Upload Document Modal Component

- [x] 8.1 Create UploadDocumentModal component in `/src/components/ui/upload-document-modal/`
- [x] 8.2 Implement drag-and-drop file upload area
- [x] 8.3 Add file picker (click to select) functionality
- [x] 8.4 Implement file type validation (Excel only: .xlsx, .xls)
- [x] 8.5 Implement file size validation (max 10MB)
- [x] 8.6 Display file preview with name and size
- [x] 8.7 Implement file upload to backend API
- [x] 8.8 Add progress indicator during upload
- [x] 8.9 Display import results and error messages
- [x] 8.10 Make component reusable with configurable props
- [x] 8.11 Integrate into Master Cabang for branch import

## 9. Styling & Polish

- [x] 9.1 Apply consistent styling using project design system (Tailwind CSS)
- [x] 9.2 Ensure responsive design works on mobile/tablet/desktop
- [x] 9.3 Add proper icons for edit (pencil) and delete (trash) buttons
- [x] 9.4 Style form inputs, buttons, and modal dialogs
- [x] 9.5 Add visual feedback for button hover/active states
- [x] 9.6 Ensure empty states display with proper icons and messaging

## 10. Error Handling

- [x] 10.1 Implement network error handling for all API calls
- [x] 10.2 Add timeout handling for API requests
- [x] 10.3 Handle 403/401 authorization errors
- [x] 10.4 Display user-friendly error messages for all failure scenarios
- [x] 10.5 Implement retry mechanisms for failed operations
- [x] 10.6 Handle concurrent edit conflicts (if relevant to backend)

## 11. Testing

- [x] 11.1 Write unit tests for branch API service functions
- [x] 11.2 Write unit tests for form validation logic
- [x] 11.3 Write unit tests for filter/search logic
- [x] 11.4 Write unit tests for UploadDocumentModal component
- [x] 11.5 Write integration tests for create flow
- [x] 11.6 Write integration tests for edit flow
- [x] 11.7 Write integration tests for delete flow
- [x] 11.8 Write tests for error scenarios and edge cases

## 12. Integration & Refinement

- [x] 12.1 Review code against architecture rules (services, hooks, components organization)
- [x] 12.2 Ensure all TODOs are addressed or documented
- [x] 12.3 Verify TypeScript compilation without errors
- [x] 12.4 Run linter and fix any ESLint issues
- [x] 12.5 Verify no console errors or warnings
- [x] 12.6 Test keyboard navigation and accessibility
- [x] 12.7 Manual testing of all CRUD operations end-to-end
- [x] 12.8 Test filtering with various combinations
- [x] 12.9 Test pagination with different page sizes
- [x] 12.10 Cross-browser testing

## 13. Backend Integration

- [x] 13.1 Once backend APIs are ready, update master-cabang service with real endpoints
- [x] 13.2 Remove dummy data and mock implementations
- [x] 13.3 Test integration with real backend
- [x] 13.4 Verify response format matches API contract
- [x] 13.5 Handle any API differences discovered during integration