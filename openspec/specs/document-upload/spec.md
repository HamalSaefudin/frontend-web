## ADDED Requirements

### Requirement: Global document upload component
The system SHALL provide a reusable UploadDocumentModal component in `/src/components/ui/upload-document-modal/UploadDocumentModal.tsx` for uploading Excel files.

#### Scenario: Open upload modal
- **WHEN** user clicks the "Import" button on a feature page that supports bulk import
- **THEN** system displays a modal with upload area

#### Scenario: Display upload interface
- **WHEN** upload modal is opened
- **THEN** system shows drag-and-drop area and "Choose file" button

### Requirement: File validation
The system SHALL validate uploaded files for type and size before processing.

#### Scenario: Accept Excel files
- **WHEN** user selects or drags an Excel file (.xlsx, .xls)
- **THEN** system accepts the file for upload

#### Scenario: Reject invalid file type
- **WHEN** user selects a non-Excel file
- **THEN** system displays "Only Excel files (.xlsx, .xls) are allowed"

#### Scenario: Validate file size
- **WHEN** user selects a file larger than 10MB
- **THEN** system displays "File size must not exceed 10MB"

### Requirement: File upload and preview
The system SHALL display file preview with name and size before upload.

#### Scenario: Display file preview
- **WHEN** user selects a valid file
- **THEN** system displays file name and size in the preview area

#### Scenario: Show upload progress
- **WHEN** user clicks "Upload" on a selected file
- **THEN** system displays a progress indicator during upload

### Requirement: Upload results handling
The system SHALL display import results with success/failure statistics and error details.

#### Scenario: Display success results
- **WHEN** file upload completes successfully
- **THEN** system displays: total imported count, failed count, and list of errors (if any)

#### Scenario: Display error details
- **WHEN** upload contains errors
- **THEN** system shows row number and error message for each failed record

### Requirement: Component reusability
The system SHALL make the upload component configurable for different use cases.

#### Scenario: Configurable upload component
- **WHEN** component is used in different features
- **THEN** component accepts props: title, description, onUpload callback, acceptedFormats, maxFileSize
