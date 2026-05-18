## ADDED Requirements

### Requirement: Create new service
The system SHALL allow users to create a new service record by clicking a "Create" button that opens a form.

#### Scenario: Create button opens form
- **WHEN** user clicks the create button
- **THEN** system displays a form for entering new service details

#### Scenario: New service is saved
- **WHEN** user fills in all required fields and clicks save
- **THEN** system creates the service and adds it to the table

### Requirement: Edit existing service
The system SHALL allow users to edit an existing service by clicking the edit (pencil) button on a table row.

#### Scenario: Edit button opens form
- **WHEN** user clicks the edit button on a row
- **THEN** system displays a form with the current service details pre-filled

#### Scenario: Service is updated
- **WHEN** user modifies fields and clicks save
- **THEN** system updates the service record and reflects changes in the table

### Requirement: Delete service
The system SHALL allow users to delete a service by clicking the delete button on a table row.

#### Scenario: Delete button triggers confirmation
- **WHEN** user clicks the delete button
- **THEN** system displays a confirmation dialog

#### Scenario: Service is deleted
- **WHEN** user confirms deletion
- **THEN** system removes the service record and updates the table

### Requirement: Form validation
The system SHALL validate all required fields in create and edit forms before allowing submission.

#### Scenario: Empty required fields are rejected
- **WHEN** user attempts to save with empty required fields
- **THEN** system displays validation errors and prevents submission

#### Scenario: Valid data is accepted
- **WHEN** all required fields are filled correctly
- **THEN** system accepts the submission and saves the data
