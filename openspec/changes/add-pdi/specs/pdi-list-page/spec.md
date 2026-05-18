## ADDED Requirements

### Requirement: PDI List Page displays unit list with tabs
The system SHALL display a Pre Delivery Inspection list page with two tabs: "Belum PDI" (Not Inspected) and "Sudah PDI" (Inspected). The list SHALL show units based on the selected tab.

#### Scenario: User views Belum PDI tab
- **WHEN** user opens the PDI page and clicks "Belum PDI" tab
- **THEN** system SHALL display units that have not been processed for PDI

#### Scenario: User views Sudah PDI tab
- **WHEN** user clicks "Sudah PDI" tab
- **THEN** system SHALL display units that have completed PDI processing

### Requirement: Branch dropdown filter at top of page
The system SHALL display a branch dropdown at the top-left of the PDI list page. The dropdown SHALL filter units by selected branch.

#### Scenario: User selects a branch
- **WHEN** user selects a branch from the dropdown
- **THEN** system SHALL refresh the unit list to show only units from that branch

### Requirement: Unit table with pagination
The system SHALL display units in a table format with pagination. The table SHALL include columns: No, No. FJ, Tanggal FJ, Kode Varian, Nama Varian, Kode Warna, Nama Warna, Nomor Mesin, Nomor Rangka, Status, Aksi.

#### Scenario: User navigates through pages
- **WHEN** user clicks next/previous page or page number
- **THEN** system SHALL display the corresponding page of units

### Requirement: Toolbar with filter and search
The system SHALL display a toolbar with filter dropdown and search input. Available filters: Nomor Mesin, Kode Varian.

#### Scenario: User searches by engine number
- **WHEN** user selects "Nomor Mesin" filter and enters a search term, then clicks "Cari"
- **THEN** system SHALL filter units matching the engine number

#### Scenario: User searches by variant code
- **WHEN** user selects "Kode Varian" filter and enters a search term, then clicks "Cari"
- **THEN** system SHALL filter units matching the variant code

### Requirement: Proses PDI action button
The system SHALL display a "Proses PDI" button in the Actions column for each unit. Clicking this button SHALL open the PDI process modal.

#### Scenario: User clicks Proses PDI button
- **WHEN** user clicks "Proses PDI" button for a unit
- **THEN** system SHALL open the Pre Delivery Inspection modal for that unit
