## ADDED Requirements

### Requirement: Gift (Hadiah) list display and CRUD operations
The system SHALL display a list of gift items and allow Create, Read, Update, and Delete operations. Gift items include: nama hadiah, jumlah (quantity), keterangan (notes).

#### Scenario: User views Hadiah list
- **WHEN** user navigates to the "Hadiah" tab
- **THEN** system SHALL display the list of gift items for the current unit

#### Scenario: User adds new gift item
- **WHEN** user clicks "Tambah" button and fills in gift details
- **THEN** system SHALL create a new gift item and add it to the list

#### Scenario: User edits gift item
- **WHEN** user clicks edit button on an item and modifies details
- **THEN** system SHALL update the gift item with new values

#### Scenario: User deletes gift item
- **WHEN** user clicks delete button on an item
- **THEN** system SHALL remove the gift item from the list

### Requirement: Gift item quantity input
The system SHALL allow users to input quantity for each gift item.

#### Scenario: User sets quantity
- **WHEN** user enters a quantity value
- **THEN** system SHALL store the quantity for that gift item

### Requirement: Gift item notes
The system SHALL allow users to add notes for each gift item.

#### Scenario: User adds notes
- **WHEN** user enters notes text
- **THEN** system SHALL save the notes for that gift item
