## ADDED Requirements

### Requirement: Photo upload functionality
The system SHALL allow users to upload photos for supporting PDI documentation. Users SHALL be able to select and upload image files.

#### Scenario: User uploads a photo
- **WHEN** user clicks upload button and selects an image file
- **THEN** system SHALL upload the image and display it in the photo list

#### Scenario: User views uploaded photos
- **WHEN** user navigates to the "Foto" tab
- **THEN** system SHALL display all uploaded photos for the current unit as thumbnails

### Requirement: Photo preview
The system SHALL display uploaded photos as thumbnails with the ability to view full-size.

#### Scenario: User previews photo
- **WHEN** user clicks on a photo thumbnail
- **THEN** system SHALL display the full-size photo in a preview modal

### Requirement: Photo deletion
The system SHALL allow users to delete uploaded photos.

#### Scenario: User deletes a photo
- **WHEN** user clicks delete button on a photo
- **THEN** system SHALL remove the photo from the list and delete from storage

### Requirement: Multiple photo uploads
The system SHALL support uploading multiple photos in sequence.

#### Scenario: User uploads multiple photos
- **WHEN** user uploads multiple photos one after another
- **THEN** system SHALL display all uploaded photos in the list

### Requirement: Photo type categorization
The system SHALL allow users to categorize photos by type (e.g., Exterior, Interior, Damage, etc.).

#### Scenario: User categorizes a photo
- **WHEN** user assigns a category to a photo
- **THEN** system SHALL save the category with the photo
