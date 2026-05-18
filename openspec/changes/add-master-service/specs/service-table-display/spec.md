## ADDED Requirements

### Requirement: Display service table with required columns
The system SHALL display a data table with the following columns in order: No., Service Code (kode jasa), Service Name (nama jasa), Service Category (servis category), Daily Code (kode harian), Variant Name (nama varian), and Variant Code (kode varian).

#### Scenario: Table renders with all columns
- **WHEN** service data is loaded
- **THEN** table displays all seven columns with proper headers and data

#### Scenario: Table rows display service records
- **WHEN** services exist for the selected branch
- **THEN** each row displays one service with values for each column

### Requirement: Action buttons on each row
The system SHALL display two action buttons on each row: Edit (pencil icon) and Delete (trash/delete icon).

#### Scenario: Edit and delete buttons visible
- **WHEN** table row is rendered
- **THEN** row displays edit (pencil) and delete buttons at the end

### Requirement: Row numbering
The system SHALL automatically number rows starting from 1 in the No. column.

#### Scenario: Rows are numbered sequentially
- **WHEN** table displays services
- **THEN** first row shows 1, second shows 2, etc. (sequential numbering)

### Requirement: Table pagination or scrolling
The system SHALL handle large datasets through pagination or scrolling.

#### Scenario: Multiple pages handled
- **WHEN** more than a reasonable number of services exist
- **THEN** table paginates or scrolls appropriately without freezing
