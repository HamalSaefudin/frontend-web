## ADDED Requirements

### Requirement: Physical inspection checklist form
The system SHALL display a form with checklist items for physical inspection of the vehicle unit. The checklist SHALL include items that can be marked as OK or Not OK.

#### Scenario: User views physical checklist tab
- **WHEN** user navigates to the "Cek Fisik Unit" tab
- **THEN** system SHALL display the physical inspection checklist form

### Requirement: Checklist item selection
The system SHALL allow users to mark each checklist item as OK or Not OK.

#### Scenario: User marks item as OK
- **WHEN** user marks a checklist item as OK
- **THEN** system SHALL update the item status to "OK"

#### Scenario: User marks item as Not OK
- **WHEN** user marks a checklist item as Not OK
- **THEN** system SHALL update the item status to "Not OK" and enable notes field

### Requirement: Notes field for Not OK items
The system SHALL display a notes field when a checklist item is marked as Not OK. Users SHALL be able to enter description of the issue.

#### Scenario: User adds notes to Not OK item
- **WHEN** user marks an item as Not OK
- **THEN** system SHALL display a notes field for user to enter description

### Requirement: Save checklist data
The system SHALL persist checklist data when user clicks Simpan.

#### Scenario: User saves checklist
- **WHEN** user completes checklist and clicks "Simpan"
- **THEN** system SHALL save all checklist item statuses and notes
