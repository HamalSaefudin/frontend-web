## Why

Sales outlets and branches need to be managed centrally in the system. Currently, there is no way to create, view, update, or delete branch information. This feature enables branch administrators to manage all sales branches in one place, including branch codes, names, and assigned leaders, improving organizational control and data consistency.

## What Changes

- Add a new Master Cabang (Branch Management) module with full CRUD capabilities
- Display branches in a paginated data table with branch code, branch name, and leader name
- Implement filtering functionality to search and filter branches by criteria
- Add document upload capability for bulk branch import (via Excel)
- Create a global reusable UploadDocumentModal component for file uploads
- Implement form validation for required fields
- Add modal dialogs for create/edit operations

## Capabilities

### New Capabilities

- `branch-data-table`: Display branches in a paginated table (code, name, leader name) with action buttons (edit, delete)
- `branch-crud-operations`: Create, read, update, and delete branch records
- `branch-filtering`: Search and filter branches by code, name, or other criteria
- `document-upload-modal`: Global component for uploading and importing Excel documents

### Modified Capabilities

<!-- No existing capabilities have requirement changes -->

## Impact

- **Frontend**: New module in `/src/modules/master-cabang/` with screen component, hooks, and child components
- **UI Components**: New global `UploadDocumentModal` component in `/src/components/ui/`
- **API**: New backend endpoints for branch CRUD operations:
  - `GET /api/cabang` (list branches)
  - `GET /api/cabang/:id` (get single branch)
  - `POST /api/cabang` (create branch)
  - `PUT /api/cabang/:id` (update branch)
  - `DELETE /api/cabang/:id` (delete branch)
  - `POST /api/cabang/import` (bulk import from Excel)
- **Services**: New API service file for branch data operations
- **Testing**: Unit tests for branch service, validation, and filtering logic
