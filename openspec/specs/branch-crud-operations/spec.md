## ADDED Requirements

### Requirement: Create new branch

The system SHALL allow users to create new branches with required fields: branch code, branch name, and leader name. All fields are mandatory and form validation SHALL prevent submission with empty fields.

#### Scenario: User opens create branch dialog
- **WHEN** user clicks the "Create Branch" button
- **THEN** system displays a modal dialog with form fields
- **AND** fields include: branch code, branch name, leader name
- **AND** all fields are initially empty

#### Scenario: User submits valid form
- **WHEN** user fills all required fields and clicks Submit
- **THEN** system sends request to create the branch
- **AND** on success, modal closes automatically
- **AND** data table refreshes to show the new branch
- **AND** success message is displayed briefly

#### Scenario: User submits incomplete form
- **WHEN** user leaves fields empty and clicks Submit
- **THEN** system displays validation error messages below each empty field
- **AND** modal remains open for user to correct

#### Scenario: Form validation on input
- **WHEN** user begins filling the form
- **THEN** system does not show validation errors
- **AND** validation errors only appear after submit attempt
- **AND** errors clear when user fills the field

### Requirement: Read branch details

The system SHALL allow users to view branch information in a paginated table and fetch individual branch details when needed.

#### Scenario: User views branch list
- **WHEN** user opens the Master Cabang page
- **THEN** system fetches and displays all branches from the backend
- **AND** each branch shows code, name, and leader information

#### Scenario: Edit dialog loads branch data
- **WHEN** user clicks edit button on a branch row
- **THEN** system fetches the branch details
- **AND** displays form pre-populated with current branch data

### Requirement: Update existing branch

The system SHALL allow users to edit branch information with the same validation rules as creation.

#### Scenario: User opens edit dialog
- **WHEN** user clicks the edit (pencil) icon on a branch row
- **THEN** system displays modal with branch data pre-filled
- **AND** form fields show the current branch code, name, and leader

#### Scenario: User updates branch fields
- **WHEN** user modifies branch fields
- **THEN** system allows changes to all fields
- **AND** validation only triggers on submit attempt

#### Scenario: User submits updated form
- **WHEN** user clicks Submit with valid changes
- **THEN** system sends update request to backend
- **AND** modal closes on success
- **AND** data table refreshes to show updated information
- **AND** success message is displayed

### Requirement: Delete branch

The system SHALL allow users to delete branches with a confirmation dialog to prevent accidental deletion.

#### Scenario: User initiates delete
- **WHEN** user clicks the delete (trash) icon on a branch row
- **THEN** system displays a confirmation modal
- **AND** modal shows the branch name being deleted
- **AND** asks user to confirm the action

#### Scenario: User confirms deletion
- **WHEN** user clicks "Confirm" on the confirmation modal
- **THEN** system sends delete request to backend
- **AND** modal closes on success
- **AND** deleted branch is removed from the table
- **AND** success message is displayed

#### Scenario: User cancels deletion
- **WHEN** user clicks "Cancel" on the confirmation modal
- **THEN** system closes the modal without deleting
- **AND** branch remains in the table

### Requirement: Handle CRUD errors gracefully

The system SHALL provide user-friendly error messages for all CRUD operation failures.

#### Scenario: Create/update fails
- **WHEN** API request fails during create or update
- **THEN** system displays error message in the form or as a toast
- **AND** modal remains open so user can retry
- **AND** error message explains the issue clearly

#### Scenario: Delete fails
- **WHEN** API request fails during delete
- **THEN** system displays error message
- **AND** branch remains in the table
- **AND** user is informed about the failure reason
