## ADDED Requirements

### Requirement: Filter button opens popup
The system SHALL provide a filter button that opens a popup window for entering filter criteria.

#### Scenario: Filter popup opens
- **WHEN** user clicks the filter button
- **THEN** system displays a popup dialog with filter options

#### Scenario: Filter popup can be closed
- **WHEN** filter popup is open
- **THEN** user can close it by clicking close button or cancel

### Requirement: Filter by configurable criteria
The system SHALL allow users to filter services based on custom criteria (specific criteria to be determined during design phase).

#### Scenario: User applies filter
- **WHEN** user selects filter criteria and clicks apply
- **THEN** system closes popup and updates table to show only matching services

#### Scenario: Filter is cleared
- **WHEN** user clicks clear or reset filter
- **THEN** system removes all filters and displays all services for the branch

### Requirement: Filter state persists during session
The system SHALL remember applied filters while user remains on the page.

#### Scenario: Filtered data remains after operations
- **WHEN** user applies a filter and then performs other actions
- **THEN** filter remains applied until user clears it or applies new filter
