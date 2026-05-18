## ADDED Requirements

### Requirement: Display branches in paginated table

The system SHALL display all branches in a data table with columns for branch code, branch name, and leader name. The table SHALL support pagination with a default page size of 5 rows per page, configurable to 10 or 30 rows.

#### Scenario: User opens branch management page
- **WHEN** user navigates to the Master Cabang page
- **THEN** system displays a data table with all branches and pagination controls
- **AND** table shows columns: branch code, branch name, leader name
- **AND** default page size is 5 rows

#### Scenario: User changes page size
- **WHEN** user selects a different page size from the rows-per-page selector
- **THEN** system updates the table to show the selected number of rows
- **AND** table resets to page 1

#### Scenario: User navigates between pages
- **WHEN** user clicks next/previous pagination buttons
- **THEN** system displays the corresponding page of results
- **AND** pagination controls disable appropriately at boundaries

### Requirement: Display action buttons on each row

The system SHALL display edit and delete action buttons on each table row for branch management operations.

#### Scenario: User sees action buttons
- **WHEN** table displays branch data
- **THEN** each row contains an edit button (pencil icon) and delete button (trash icon)
- **AND** buttons are properly aligned and easily clickable

#### Scenario: User hovers over action buttons
- **WHEN** user hovers over action buttons
- **THEN** buttons show visual feedback (color change/highlighting)

### Requirement: Display empty state messaging

The system SHALL display user-friendly messaging when no branches are available or when filter results are empty.

#### Scenario: No branches exist
- **WHEN** table data is empty (no branches created yet)
- **THEN** system displays empty state with icon and "No branches available" message
- **AND** displays "Create First Branch" action button

#### Scenario: Filter results are empty
- **WHEN** user applies filters that match no branches
- **THEN** system displays empty state with "No branches found" message
- **AND** suggests adjusting filter criteria

### Requirement: Show loading skeleton while fetching

The system SHALL display animated skeleton loaders while branch data is being fetched.

#### Scenario: Data is loading
- **WHEN** user opens the page or changes filters
- **THEN** system displays skeleton placeholder rows
- **AND** skeleton rows animate to indicate loading state
- **AND** skeleton is replaced with actual data when fetch completes
