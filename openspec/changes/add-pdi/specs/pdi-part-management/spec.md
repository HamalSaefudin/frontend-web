## ADDED Requirements

### Requirement: Parts list display and CRUD operations
The system SHALL display a list of parts and allow Create, Read, Update, and Delete operations. Parts include: nama part, jumlah (quantity), kondisi (condition), keterangan (notes).

#### Scenario: User views Part list
- **WHEN** user navigates to the "Part" tab
- **THEN** system SHALL display the list of parts for the current unit

#### Scenario: User adds new part
- **WHEN** user clicks "Tambah" button and fills in part details
- **THEN** system SHALL create a new part item and add it to the list

#### Scenario: User edits part
- **WHEN** user clicks edit button on an item and modifies details
- **THEN** system SHALL update the part with new values

#### Scenario: User deletes part
- **WHEN** user clicks delete button on an item
- **THEN** system SHALL remove the part from the list

### Requirement: Part quantity input
The system SHALL allow users to input quantity for each part.

#### Scenario: User sets quantity
- **WHEN** user enters a quantity value
- **THEN** system SHALL store the quantity for that part

### Requirement: Part condition selection
The system SHALL allow users to select the condition status for each part (Baik/Damage/Rusak).

#### Scenario: User selects condition
- **WHEN** user selects a condition from dropdown
- **THEN** system SHALL save the condition for that part

### Requirement: Part notes
The system SHALL allow users to add notes for each part.

#### Scenario: User adds notes
- **WHEN** user enters notes text
- **THEN** system SHALL save the notes for that part
