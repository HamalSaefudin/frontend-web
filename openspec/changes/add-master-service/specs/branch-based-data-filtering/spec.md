## ADDED Requirements

### Requirement: Data filtered by branch code
The system SHALL display only services that belong to the currently selected branch code.

#### Scenario: Services match selected branch code
- **WHEN** user has a branch code selected
- **THEN** table displays only services with matching branch code

### Requirement: Data filtered by branch name
The system SHALL display only services that belong to the currently selected branch name.

#### Scenario: Services match selected branch name
- **WHEN** user has a branch name selected
- **THEN** table displays only services with matching branch name

### Requirement: Branch selection changes update data
The system SHALL immediately refresh the service table when the user changes the selected branch.

#### Scenario: Table updates on branch change
- **WHEN** user changes the branch selection from one branch to another
- **THEN** system immediately loads and displays services for the new branch

### Requirement: Create respects branch context
The system SHALL associate newly created services with the currently selected branch.

#### Scenario: New service created in correct branch
- **WHEN** user creates a new service while a branch is selected
- **THEN** system automatically associates the new service with that branch
