## Context

The application manages branch-specific data including services (jasa). Currently, there's no dedicated interface for managing service master data. Service configuration needs to be centralized and accessible to branch administrators.

**Architectural Constraints (from codebase):**
- UI components must use components from `/src/components/` directory (existing component library)
- API/fetch functions must be in `/src/services/` directory (not in hooks or components)
- Services directory already contains: api-client.ts, masterdata.ts, api.ts, auth.ts

## Goals / Non-Goals

**Goals:**
- Create a dedicated Master Service Management page with CRUD functionality
- Display service data in a sortable, filterable table with branch context
- Provide intuitive filtering through a popup interface
- Enable create, edit, and delete operations for services
- Ensure all operations respect the currently selected branch

**Non-Goals:**
- Implementing service pricing or advanced analytics
- Building service hierarchies or dependencies
- Implementing approval workflows for service changes
- Exporting service data to external formats
- Service bulk operations (bulk edit/delete)

## Decisions

### Decision 0: Follow Codebase Architecture Rules
**Choice**: All implementation follows `/openspec/specs/codebase-architecture/spec.md` rules.

**Applied Rules**:
- API functions: `/src/services/master-service.ts`
- React hooks: `/src/modules/master-service/hooks/`
- UI components: from `/src/components/` library only
- See spec for full requirements

**Rationale**: Single source of truth across all features. New changes inherit these rules automatically without redefining them.

### Decision 1: Page Architecture
**Choice**: Create a dedicated page component (`MasterServicePage`) with container for data fetching and state management, separate presentational components for table and filter popup.

**Rationale**: Separation of concerns makes testing and maintenance easier. Container pattern keeps data logic separate from UI rendering.

**Alternatives Considered**:
- Single monolithic component: simpler initially but harder to test and maintain
- Using existing admin page as container: would require significant refactoring

### Decision 2: Table Implementation
**Choice**: Use a pre-built data table component (Material-UI DataGrid, react-table, or custom) that supports pagination, sorting, and dynamic columns.

**Rationale**: Reduces development time and ensures accessibility standards. Production-ready tables handle edge cases better than custom implementations.

**Alternatives Considered**:
- Custom table with HTML/CSS: full control but high maintenance burden
- Third-party table library: proven reliability vs. potential dependency updates

### Decision 3: Filter Popup
**Choice**: Modal/dialog component with form inputs for filter criteria. Filter state stored in page-level state (React useState or state management system).

**Rationale**: Modal provides clear UX distinction between filtering and main content. Form inputs can be customized per criteria.

**Alternatives Considered**:
- Inline sidebar filters: less prominent, harder to discover
- Dropdown filters on columns: complex column header management

### Decision 4: API Integration Points
**Choice**: Assume backend API endpoints:
- `GET /api/services?branchId=X` - fetch services for branch
- `POST /api/services` - create new service
- `PUT /api/services/:id` - update service
- `DELETE /api/services/:id` - delete service
- `GET /api/services/:id` - fetch single service for edit

**Rationale**: RESTful conventions align with typical backend patterns. Branch ID comes from active branch context.

**Alternatives Considered**:
- GraphQL endpoint: more flexible but requires different client setup
- Custom endpoints: would need backend specification first

### Decision 5: State Management
**Choice**: Use local component state (React hooks) for table data, filter state, and edit form state. Integrate with existing branch selection store/context.

**Rationale**: Simpler than global state management for isolated page feature. Branch context already managed by application.

**Alternatives Considered**:
- Redux/global state: overkill for single-page feature unless app already uses it
- URL query params: good for bookmarkable filters, adds complexity

### Decision 6: CRUD Forms
**Choice**: Reusable modal form component for both create and edit operations. Form validation using client-side validation library (Zod, Yup, or native HTML5).

**Rationale**: Reduces code duplication. Client-side validation improves UX with immediate feedback.

**Alternatives Considered**:
- Server-side validation only: slower user experience
- Custom validation logic: harder to maintain and test

### Decision 7: Delete Confirmation
**Choice**: Modal confirmation dialog before deletion. Message includes service name/code for clarity.

**Rationale**: Prevents accidental deletes. Clear information helps user make decision.

**Alternatives Considered**:
- Direct delete with undo: more modern but requires undo infrastructure
- No confirmation: risky for destructive operation

## Risks / Trade-offs

### Risk 1: Performance with large datasets
**Mitigation**: Implement pagination (page size ~50 rows) and lazy loading. Consider server-side filtering and sorting to reduce data transfer.

### Risk 2: Branch context coupling
**Mitigation**: Document assumptions about branch selection mechanism. If branch selection changes, update service queries accordingly.

### Risk 3: Concurrent edits
**Mitigation**: Add last-modified timestamp validation. Warn user if data changed since edit form loaded. Server should handle conflict resolution (last-write-wins or optimistic locking).

### Risk 4: Filter criteria unclear
**Mitigation**: Document which fields are filterable and filter logic during design. Current spec leaves criteria undefined — needs clarification before implementation.

### Risk 5: Form validation complexity
**Mitigation**: Define all required fields and validation rules upfront. Keep validation consistent between create and edit forms.

### Risk 6: API endpoint assumptions
**Mitigation**: Confirm actual endpoint names and response formats with backend team before implementation starts.

## Open Questions

1. **Filter Criteria**: Which specific fields should be filterable? (Service Code, Service Name, Service Category, Variant Name, etc.) - needs product/requirements clarification
2. **Required Fields**: Which fields are required when creating/editing a service?
3. **Field Constraints**: Are there field length limits, character restrictions, or specific formats (e.g., codes)?
4. **Pagination**: What's the preferred page size and pagination style (numbered pages, load-more, infinite scroll)?
5. **Sorting**: Should users be able to sort by any column or specific columns only?
6. **API Response Format**: What is the exact response format from backend service endpoints?
7. **Error Handling**: How should API errors (network failures, validation failures, permissions) be displayed?
8. **Empty State**: What message to show when no services exist for selected branch?
9. **Permissions**: Are all users allowed to create/edit/delete, or are there role-based restrictions?
10. **Branch Integration**: How is branch selection implemented in the app? (Component path, context, Redux, etc.)
