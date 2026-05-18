## Why

The application lacks a centralized interface to manage services (jasa) that can be configured and maintained by branch managers. Currently, there's no way to view, filter, create, edit, or delete service master data in an organized manner. This feature will enable administrators to manage service definitions per branch with proper filtering and CRUD operations.

## What Changes

- New **Master Service Management** page in the application with a data table displaying all services
- Services displayed with columns: No., Service Code, Service Name, Service Category, Daily Code, Variant Name, Variant Code
- **Filter popup** enabling filtering by custom criteria
- **Branch filtering** to show data relevant to selected branch code/name
- **CRUD actions**: Create button to add new services, Edit (pencil icon) and Delete buttons for each row
- Integration with existing branch/location selection mechanism

## Capabilities

### New Capabilities
- `master-service-management`: Main page displaying service master data with table, filtering, and CRUD operations
- `service-table-display`: Data table component showing services with all required columns and formatting
- `service-filter-popup`: Popup filter interface for filtering services by custom criteria
- `service-crud-operations`: Create, read, edit, and delete operations for service master data
- `branch-based-data-filtering`: Display service data based on selected branch code or branch name

### Modified Capabilities
- `codebase-architecture`: ENFORCED - All implementations must follow architecture rules (see `/openspec/specs/codebase-architecture/spec.md`)
  - API functions in `/src/services/master-service.ts`
  - Hooks in `/src/modules/master-service/hooks/`
  - UI from `/src/components/` library only

## Impact

- **Frontend Components**: New page, table component, filter popup, CRUD forms
- **Data Layer**: Integration with service API endpoints (list, create, update, delete)
- **State Management**: Branch selection state may need expansion to support service filtering
- **UI/UX**: New navigation item for Master Service Management, new data table layouts
