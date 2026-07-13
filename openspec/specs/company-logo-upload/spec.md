### Requirement: Optional logo selection on company create/register forms
The system SHALL allow the user to optionally select a single image file as the company logo on the guest company registration form and on the admin company creation form (create mode only), and SHALL NOT require a logo to submit either form.

#### Scenario: Submitting without a logo
- **WHEN** the user submits the guest registration form or the admin create-company form without selecting a logo
- **THEN** the system SHALL submit the request without a `logo` field and SHALL NOT block submission on the missing logo

#### Scenario: Selecting a logo
- **WHEN** the user selects an image file for the logo field
- **THEN** the system SHALL show a live preview of the selected image and SHALL allow the user to remove/replace the selection before submitting

### Requirement: Logo file validation
The system SHALL validate a selected logo file's type and size on the client before allowing submission, accepting only `image/png`, `image/jpeg`, and `image/webp` and rejecting files larger than 2 MB.

#### Scenario: Invalid file type rejected
- **WHEN** the user selects a file whose MIME type is not `image/png`, `image/jpeg`, or `image/webp`
- **THEN** the system SHALL display a validation error and SHALL NOT allow that file to be submitted as the logo

#### Scenario: Oversized file rejected
- **WHEN** the user selects an image file larger than 2 MB
- **THEN** the system SHALL display a validation error and SHALL NOT allow that file to be submitted as the logo

### Requirement: Logo submitted as multipart form data
The system SHALL submit the company create/register request as `multipart/form-data` and, when a logo is selected, SHALL append it to the request under the `logo` field, matching the backend's expected field name.

#### Scenario: Logo included in submission
- **WHEN** the user has selected a valid logo and submits the form
- **THEN** the system SHALL send a multipart request containing the selected file under the `logo` field alongside the other form fields

#### Scenario: Non-logo text fields still submitted correctly
- **WHEN** the form is submitted as multipart form data
- **THEN** all existing text/select fields (e.g. `company_name`, `email`, `mobile`) SHALL continue to be included in the request with their existing values, unchanged in name or meaning
