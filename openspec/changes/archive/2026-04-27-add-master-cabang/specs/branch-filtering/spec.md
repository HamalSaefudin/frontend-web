## ADDED Requirements

### Requirement: Filter branches by criteria

The system SHALL provide a filter dialog that allows users to search and filter branches by multiple criteria including branch code, branch name, and leader name. Filters use AND logic (all criteria must match).

#### Scenario: User opens filter dialog
- **WHEN** user clicks the Filter button
- **THEN** system displays a modal dialog with filter input fields
- **AND** fields include: branch code, branch name, leader name
- **AND** all filter fields are optional

#### Scenario: User applies single filter criterion
- **WHEN** user enters a value in one filter field and clicks Apply
- **THEN** system filters the table to show only matching branches
- **AND** table resets to page 1
- **AND** pagination updates to reflect filtered results
- **AND** filter dialog closes

#### Scenario: User applies multiple filter criteria
- **WHEN** user enters values in multiple filter fields and clicks Apply
- **THEN** system uses AND logic to match all criteria
- **AND** table shows only branches matching ALL criteria
- **AND** table resets to page 1
- **AND** result count reflects filtered data

#### Scenario: User filters with no matches
- **WHEN** user applies filters that match no branches
- **THEN** system displays empty state in the table
- **AND** empty message indicates "No branches found"
- **AND** suggests adjusting filter criteria

### Requirement: Support case-insensitive filtering

The system SHALL support case-insensitive search across all filter fields.

#### Scenario: User searches with different cases
- **WHEN** user enters search term in different letter cases
- **THEN** system matches branches regardless of case
- **AND** "jakarta" matches "Jakarta", "JAKARTA", "JaKaRtA"

### Requirement: Support partial string matching

The system SHALL allow partial string matches for better search flexibility.

#### Scenario: User searches with partial text
- **WHEN** user enters partial branch code or name
- **THEN** system matches branches containing the partial text
- **AND** "jakarta" matches "jakarta", "jakarta-pusat", "stasiun jakarta"

### Requirement: Clear and reset filters

The system SHALL provide functionality to clear all filters and show all branches again.

#### Scenario: User clears filters
- **WHEN** user clicks the Clear/Reset button in filter dialog
- **THEN** system clears all filter input fields
- **AND** displays all branches without filtering
- **AND** table resets to page 1
- **AND** pagination shows original data count

### Requirement: Persist filter state during session

The system SHALL maintain filter state while the user navigates the page, clearing only when user explicitly resets or closes the browser.

#### Scenario: User applies filter then interacts with table
- **WHEN** user applies filter and then changes page or page size
- **THEN** filter criteria remain active
- **AND** table continues showing filtered results
- **AND** pagination works within filtered dataset

#### Scenario: User closes filter dialog
- **WHEN** user closes filter dialog without clicking Apply
- **THEN** system discards unsaved filter changes
- **AND** existing applied filters remain active
