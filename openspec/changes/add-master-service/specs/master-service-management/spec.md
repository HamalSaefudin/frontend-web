## ADDED Requirements

### Requirement: Main service management page loads
The system SHALL display the Master Service Management page with a data table, filter button, and create button.

#### Scenario: Page displays correctly
- **WHEN** user navigates to Master Service Management
- **THEN** system displays a data table with service data, a filter button, and a create new service button

### Requirement: Page respects branch context
The system SHALL load and display service data based on the currently selected branch code or branch name.

#### Scenario: Services filtered by active branch
- **WHEN** user has selected a branch and navigates to the page
- **THEN** system displays only services for that selected branch

#### Scenario: Branch selection change updates data
- **WHEN** user changes the selected branch
- **THEN** system immediately reloads and displays services for the newly selected branch
