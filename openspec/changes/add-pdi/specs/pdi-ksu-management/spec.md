## ADDED Requirements

### Requirement: KSU list display and CRUD operations
The system SHALL display a list of KSU (accessories) items and allow Create, Read, Update, and Delete operations. KSU items include: nama item, jumlah (quantity), kondisi (condition).

#### Scenario: User views KSU list
- **WHEN** user navigates to the "KSU" tab
- **THEN** system SHALL display the list of KSU items for the current unit

#### Scenario: User adds new KSU item
- **WHEN** user clicks "Tambah" button and fills in item details
- **THEN** system SHALL create a new KSU item and add it to the list

#### Scenario: User edits KSU item
- **WHEN** user clicks edit button on an item and modifies details
- **THEN** system SHALL update the KSU item with new values

#### Scenario: User deletes KSU item
- **WHEN** user clicks delete button on an item
- **THEN** system SHALL remove the KSU item from the list

### Requirement: KSU item quantity input
The system SHALL allow users to input quantity for each KSU item.

#### Scenario: User sets quantity
- **WHEN** user enters a quantity value
- **THEN** system SHALL store the quantity for that KSU item

### Requirement: KSU item condition selection
The system SHALL allow users to select the condition status for each KSU item (Baik/Damage/Rusak).

#### Scenario: User selects condition
- **WHEN** user selects a condition from dropdown
- **THEN** system SHALL save the condition for that KSU item
