## ADDED Requirements

### Requirement: Full-width PDI modal with header information
The system SHALL display a full-width modal when user clicks "Proses PDI". The modal header SHALL display read-only unit information: Cabang, Warna Unit, No. FJ, No. PDI, No. Mesin, Keterangan, Tipe Unit, No. Rangka in a 3-column grid layout.

#### Scenario: Modal displays header information
- **WHEN** user opens the PDI modal
- **THEN** system SHALL display unit details in read-only format organized in a 3-column grid

### Requirement: Modal tabbed interface with 6 tabs
The system SHALL display six tabs below the header: Cek Fisik Unit, KSU, Hadiah, Barang Lain, Part, Foto.

#### Scenario: User switches between tabs
- **WHEN** user clicks on a tab
- **THEN** system SHALL display the corresponding tab content

### Requirement: Modal footer with action buttons
The system SHALL display footer buttons at the bottom-right of the modal: Refresh, Simpan, Tolak, Proses.

#### Scenario: User clicks footer button
- **WHEN** user clicks any footer button
- **THEN** system SHALL execute the corresponding action

### Requirement: Refresh button reloads PDI data
The system SHALL reload all PDI data when user clicks the Refresh button.

#### Scenario: User clicks Refresh
- **WHEN** user clicks "Refresh" button
- **THEN** system SHALL reload all PDI form data including checklist items, KSU, gifts, items, parts, and photos

### Requirement: Simpan button saves current state
The system SHALL save the current PDI state when user clicks the Simpan (Save) button.

#### Scenario: User clicks Simpan
- **WHEN** user clicks "Simpan" button
- **THEN** system SHALL save all current changes and display a success confirmation

### Requirement: Tolak button rejects the PDI
The system SHALL mark the unit as rejected when user clicks the Tolak (Reject) button.

#### Scenario: User clicks Tolak
- **WHEN** user clicks "Tolak" button
- **THEN** system SHALL mark the unit as rejected and close the modal

### Requirement: Proses button completes the PDI
The system SHALL mark the PDI as complete when user clicks the Proses (Process) button.

#### Scenario: User clicks Proses with valid data
- **WHEN** user clicks "Proses" button and all required data is present
- **THEN** system SHALL mark the unit as "Sudah PDI" and close the modal

#### Scenario: User clicks Proses with invalid data
- **WHEN** user clicks "Proses" button and required data is missing
- **THEN** system SHALL display validation errors and NOT close the modal
