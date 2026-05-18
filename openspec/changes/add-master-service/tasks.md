## 1. Setup & Project Structure

- [x] 1.1 Create Master Service page component directory structure
- [x] 1.2 Set up page routing for Master Service Management
- [x] 1.3 Create page layout with header, toolbar, and content area
- [x] 1.4 Integrate with existing branch selection context/state

## 2. Data Table Component

- [x] 2.1 Create ServiceTable component with all 7 required columns (No., Code, Name, Category, Daily Code, Variant Name, Variant Code)
- [x] 2.2 Implement row numbering in No. column
- [x] 2.3 Add edit (pencil icon) and delete action buttons to each row
- [x] 2.4 Implement pagination support (page size ~50 rows)
- [x] 2.5 Add table loading state and empty state messaging
- [x] 2.6 Implement table responsive design for smaller screens

## 3. Data Fetching & State Management

- [x] 3.1 Create API client/hook for fetching services (GET /api/services?branchId=X)
- [x] 3.2 Implement branch-based filtering - fetch only services for selected branch
- [x] 3.3 Set up page-level state for table data, loading, and error states
- [x] 3.4 Handle API errors gracefully with user-friendly error messages
- [x] 3.5 Implement branch selection change listener to refresh table data
- [x] 3.6 Add loading indicators during data fetch

## 4. Filter Popup Component

- [x] 4.1 Create FilterPopup modal dialog component
- [x] 4.2 Design filter form with input fields (criteria TBD with product)
- [x] 4.3 Implement filter apply logic to update table data
- [x] 4.4 Implement clear/reset filters functionality
- [x] 4.5 Add filter state persistence during page session
- [x] 4.6 Style popup with proper modal behavior and accessibility

## 5. Create Service Functionality

- [x] 5.1 Create ServiceForm component for create/edit operations
- [x] 5.2 Create modal dialog for new service creation
- [x] 5.3 Implement form inputs for all service fields
- [x] 5.4 Add client-side form validation
- [x] 5.5 Implement API call to create new service (POST /api/services)
- [x] 5.6 Add success/error feedback after create operation
- [x] 5.7 Refresh table after successful creation

## 6. Edit Service Functionality

- [x] 6.1 Implement edit button click handler on table rows
- [x] 6.2 Create API call to fetch single service details (GET /api/services/:id)
- [x] 6.3 Pre-fill ServiceForm with existing service data
- [x] 6.4 Implement form submission for updates (PUT /api/services/:id)
- [x] 6.5 Add validation for all required fields
- [x] 6.6 Add success/error feedback after edit operation
- [x] 6.7 Refresh table after successful edit

## 7. Delete Service Functionality

- [x] 7.1 Implement delete button click handler on table rows
- [x] 7.2 Create confirmation dialog with service name/code
- [x] 7.3 Implement API call to delete service (DELETE /api/services/:id)
- [x] 7.4 Add success/error feedback after delete operation
- [x] 7.5 Remove deleted row from table
- [x] 7.6 Handle permissions/authorization errors

## 8. Styling & Polish

- [x] 8.1 Apply consistent styling matching application design system
- [x] 8.2 Implement responsive design for mobile/tablet/desktop
- [x] 8.3 Add icons for edit (pencil) and delete (trash) buttons
- [x] 8.4 Style form inputs, buttons, and dialogs
- [x] 8.5 Add visual feedback for button hover/active states
- [x] 8.6 Implement loading spinners and skeleton loaders
- [ ] 8.7 Test accessibility with keyboard navigation and screen readers

## 9. Error Handling & Edge Cases

- [x] 9.1 Handle network error scenarios gracefully
- [x] 9.2 Implement timeout handling for API calls
- [x] 9.3 Handle permission/authorization errors (403, 401)
- [x] 9.4 Handle concurrent edit conflicts (last-modified timestamp)
- [x] 9.5 Display user-friendly error messages for all failure scenarios
- [x] 9.6 Implement retry mechanism for failed API calls

## 10. Testing

- [x] 10.1 Write unit tests for ServiceTable component
- [x] 10.2 Write unit tests for FilterPopup component
- [x] 10.3 Write unit tests for ServiceForm component
- [x] 10.4 Write integration tests for create flow
- [x] 10.5 Write integration tests for edit flow
- [x] 10.6 Write integration tests for delete flow
- [x] 10.7 Test branch switching and data refresh
- [x] 10.8 Write tests for error scenarios

## 11. Documentation & Code Review

- [ ] 11.1 Add inline code comments for complex logic
- [ ] 11.2 Document component props and usage
- [ ] 11.3 Create user documentation for Master Service Management feature
- [ ] 11.4 Prepare code for peer review
- [ ] 11.5 Address code review feedback
- [ ] 11.6 Final verification against all spec requirements

## 12. QA & Deployment

- [ ] 12.1 Manual testing of all CRUD operations
- [ ] 12.2 Manual testing of filtering functionality
- [ ] 12.3 Manual testing of branch switching
- [ ] 12.4 Cross-browser testing
- [ ] 12.5 Performance testing with large datasets
- [ ] 12.6 Verify no console errors or warnings
- [ ] 12.7 Merge to main branch and deploy
