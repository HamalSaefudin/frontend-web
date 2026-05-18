## ADDED Requirements

### Requirement: Display global upload document modal

The system SHALL provide a global reusable UploadDocumentModal component for uploading Excel documents. The component can be used across the application for bulk import operations.

#### Scenario: Modal is opened
- **WHEN** modal is triggered from any page
- **THEN** system displays a dialog with document upload area
- **AND** modal shows clear instructions for file upload
- **AND** upload area has drag-and-drop support

#### Scenario: User provides file via drag-and-drop
- **WHEN** user drags an Excel file into the upload area
- **THEN** system highlights the drop zone
- **AND** file is selected when user releases the file
- **AND** file name is displayed in the upload area

#### Scenario: User selects file via file picker
- **WHEN** user clicks the upload area to open file picker
- **THEN** system opens native file picker dialog
- **AND** file picker filters to show Excel files (.xlsx, .xls)
- **AND** selected file name displays in upload area

### Requirement: Validate file before upload

The system SHALL validate file type and size before allowing upload.

#### Scenario: User selects valid Excel file
- **WHEN** user selects a .xlsx or .xls file
- **THEN** system accepts the file
- **AND** displays file preview with name and size

#### Scenario: User selects invalid file type
- **WHEN** user selects a non-Excel file
- **THEN** system displays error message
- **AND** message indicates "Only Excel files (.xlsx, .xls) are supported"
- **AND** file is not accepted

#### Scenario: File exceeds size limit
- **WHEN** user selects a file larger than 10MB
- **THEN** system displays error message
- **AND** message indicates file is too large
- **AND** file is not accepted

### Requirement: Upload document to backend

The system SHALL send the selected file to the backend for processing.

#### Scenario: User submits file for upload
- **WHEN** user clicks the Upload button
- **THEN** system sends file to backend API endpoint
- **AND** displays progress indicator while uploading
- **AND** prevents closing modal during upload

#### Scenario: Upload succeeds
- **WHEN** backend successfully processes the file
- **THEN** system displays success message
- **AND** shows count of imported records
- **AND** modal closes automatically after brief delay
- **AND** parent component (e.g., branch list) refreshes to show new data

#### Scenario: Upload fails
- **WHEN** backend returns an error
- **THEN** system displays error message with details
- **AND** error message includes specific issue (e.g., "Invalid file format", "Duplicate branch codes")
- **AND** modal remains open to allow retry

### Requirement: Display import results and errors

The system SHALL provide feedback on import success and errors.

#### Scenario: Import completes with some errors
- **WHEN** backend processes file with partial success
- **THEN** system displays summary: X records imported, Y records failed
- **AND** shows list of specific errors for failed rows
- **AND** allows user to download error report

#### Scenario: User reviews error details
- **WHEN** import results show errors
- **THEN** system displays row-level error messages
- **AND** indicates which fields caused validation errors
- **AND** provides guidance on fixing issues

### Requirement: Reusable component with customization

The UploadDocumentModal component SHALL be reusable across the application with customizable behavior.

#### Scenario: Component accepts configuration props
- **WHEN** component is instantiated
- **THEN** accepts props for: title, description, accepted file types, size limit
- **AND** accepts callback for custom upload endpoint
- **AND** accepts callback for custom success/error handling

#### Scenario: Component used in different contexts
- **WHEN** component is used in branch import flow
- **THEN** uploads to branch import endpoint
- **WHEN** component is used in another feature
- **THEN** uploads to that feature's endpoint with appropriate configuration
