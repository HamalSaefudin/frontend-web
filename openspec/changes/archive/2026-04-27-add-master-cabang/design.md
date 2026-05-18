## Context

The application currently has a working Master Service Management feature that provides CRUD operations with filtering and pagination. The Master Cabang (Branch Management) feature follows the same architectural patterns already established in the codebase, allowing us to reuse existing component libraries and patterns.

**Current State:**
- DataTable component with pagination and filtering support
- React Query for API data fetching
- Custom hooks for data management
- Form validation patterns already in place
- Modal dialogs for CRUD operations

**Constraints:**
- Must follow established code architecture (services in `/src/services/`, hooks in `/src/modules/<feature>/hooks/`, components in `/src/components/ui/` or feature-specific)
- Backend API endpoints not yet implemented (dummy/mock data will be used initially)
- UploadDocumentModal is a new global component that needs to be created

## Goals / Non-Goals

**Goals:**
- Implement full CRUD operations for branch management
- Reuse existing DataTable and form components to reduce development time
- Create a global, reusable UploadDocumentModal component for future use
- Provide filtering/search functionality across branch attributes
- Display meaningful empty states and loading indicators
- Support pagination with configurable page sizes

**Non-Goals:**
- Actual Excel file parsing and import validation (backend will handle this)
- Complex permission/authorization rules (all users can perform all operations in this phase)
- Branch hierarchy or parent-child relationships
- Bulk operations beyond import (export, batch delete, etc.)

## Decisions

### Decision 1: Reuse DataTable Component from Master Service

**Choice:** Use the existing generic `DataTable` component with customization for branch-specific columns

**Rationale:** 
- DataTable already provides pagination, sorting, empty states, and loading skeletons
- Avoids code duplication and maintains consistency across features
- Faster implementation

**Alternatives Considered:**
- Build a custom BranchTable component → Would increase development time and maintenance burden
- Use TanStack Table directly → Less abstraction and losing empty state handling benefits

### Decision 2: Create Global UploadDocumentModal Component

**Choice:** Build a reusable, configurable modal component in `/src/components/ui/` that any feature can use

**Rationale:**
- Requirement explicitly calls for a global, reusable component
- Future features (bulk import for other entities) will benefit from this abstraction
- Encapsulates file upload logic, validation, and feedback
- Single source of truth for upload UX consistency

**Alternatives Considered:**
- Create feature-specific upload component → Harder to reuse, potential duplication
- Use third-party upload library → May introduce unwanted dependencies, less control over behavior

### Decision 3: Mock Backend with Dummy Data During Frontend Development

**Choice:** Create dummy data and mock API endpoints in `/src/services/master-cabang.ts` with TODO comments for real API integration

**Rationale:**
- Follows pattern established in master-service.ts
- Allows frontend development to proceed without blocking on backend
- Placeholder functions with clear integration points for backend
- Easy to swap with real API calls when backend is ready

**Alternatives Considered:**
- Wait for backend API → Blocks frontend work, delays feature completion
- Use local storage → Less realistic testing of async data flows

### Decision 4: Implement Filter as Modal Dialog

**Choice:** Filter popup (modal dialog) similar to Master Service feature, with form inputs for each criterion

**Rationale:**
- Consistent with existing UI patterns
- Doesn't clutter the toolbar area
- Familiar to users who've used Master Service feature
- Clear separation between applied filters and filter UI

**Alternatives Considered:**
- Inline filter bar → Takes up space, less clean UI
- Collapsible filter panel → More complex state management

### Decision 5: File Structure and Organization

**Choice:** 
- Service: `/src/services/master-cabang.ts`
- Module: `/src/modules/master-cabang/`
- Hooks: `/src/modules/master-cabang/hooks/`
- Components: `/src/modules/master-cabang/components/`
- Upload Modal: `/src/components/ui/upload-document-modal/`

**Rationale:**
- Mirrors existing master-service architecture
- Clear separation of concerns
- Global UI components in `/src/components/ui/`, feature-specific in feature module
- Easy to locate files and maintain consistency

## Risks / Trade-offs

### Risk 1: Backend API Timing
**Risk:** Real backend APIs may not be ready when frontend development completes

**Impact:** Frontend may need adjustment when integrating with real API

**Mitigation:** 
- Clear TODO comments in service layer marking integration points
- Build API contracts as JSON interfaces upfront
- Establish API specifications before full implementation

### Risk 2: File Upload Complexity
**Risk:** Excel file parsing is delegated to backend; frontend doesn't validate actual file contents

**Impact:** Invalid data in Excel file won't be caught until upload completes

**Mitigation:**
- Clear error messages from backend with specific row/field details
- Allow user to download error report for fixes
- Consider client-side validation in future (add as optional feature)

### Risk 3: Filter Session Persistence
**Risk:** Filter state resets on page refresh (stored in React state, not localStorage)

**Impact:** User loses filter context if page reloads

**Mitigation:**
- This is acceptable for MVP; can be enhanced with URL params or localStorage later
- Mentioned as future enhancement in spec

### Trade-off: Page Reload on CRUD Operations
**Trade-off:** On create/update/delete success, we refresh the entire data table instead of optimistic updates

**Rationale:** Simpler implementation, ensures data consistency with server

**Cost:** Slight delay in UI responsiveness; acceptable for initial version

## Migration Plan

**Phase 1: Development**
- Implement using mock data
- Build all UI components and interaction flows
- Test with dummy data locally

**Phase 2: Backend API Integration**
- Once backend provides API endpoints, update `/src/services/master-cabang.ts` with real calls
- Remove dummy data
- Run integration tests with real backend

**Phase 3: Deployment**
- Deploy feature to staging for QA
- Perform manual testing of all CRUD operations
- Roll out to production

**Rollback Strategy:**
- Feature flag to disable Master Cabang module if critical issues arise
- OR remove route/module access temporarily until fix is deployed

## Open Questions

1. **Excel Import Format**: What columns and validation rules should the Excel import follow? Backend team needs to document the expected format.

2. **Permission Model**: Should different users have different access levels (e.g., read-only, create-only, full access)? Currently treating all users as administrators.

3. **Branch Lead Assignment**: Should "leader name" be a free text field or a dropdown of existing users/employees? Current spec treats it as text field.

4. **API Response Format**: Confirm API returns branch list in what format? Assuming `{ success: boolean, data: Branch[] }` based on master-service pattern.
