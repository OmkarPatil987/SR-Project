## ADDED Requirements

### Requirement: Fetch full gazette data for selected products
The system SHALL, upon advancing from the selection step, request full gazette details for the selected product IDs via the products-gazette-by-ids API and use the response to pre-fill the label form.

#### Scenario: Successful fetch pre-fills the form
- **WHEN** the user advances from selection with a set of selected product IDs
- **THEN** the system SHALL POST those IDs to the products-gazette-by-ids endpoint and, on success, render one editable section per returned product populated with that product's `composition`, `specifications`, `application_details`, and `note`

#### Scenario: Fetch failure is surfaced
- **WHEN** the products-gazette-by-ids request fails
- **THEN** the system SHALL display an error message and SHALL NOT advance to a partially-filled form

### Requirement: Editable manufacturer and marketing sections
The system SHALL present editable manufacturer details (name, address, contact person, mobile, email, website, license number, GST number) and, independently, marketing details of the same shape.

#### Scenario: Manufacturer and marketing differ
- **WHEN** the "manufacturer and marketing are the same" toggle is off
- **THEN** the manufacturer and marketing sections SHALL be independently editable and both SHALL be required before submission

#### Scenario: Manufacturer and marketing are the same company
- **WHEN** the user enables the "manufacturer and marketing are the same" toggle
- **THEN** the marketing section SHALL be disabled for direct editing and SHALL mirror the manufacturer section's current values, and the submitted payload SHALL set `is_manufacturer_marketing_same` to `true`

#### Scenario: Toggling back to independent editing
- **WHEN** the user disables the toggle after having enabled it
- **THEN** the marketing section SHALL become independently editable again, initialized with the last-mirrored values as a starting point

### Requirement: Editable per-product composition, specifications, application details, and note
For each selected product, the system SHALL allow the user to add, edit, and remove composition rows (ingredient/content) and specification rows (parameter/value), edit application details (one or more crop-name/dose entries), and edit a free-text note.

#### Scenario: Editing a pre-filled composition row
- **WHEN** the user changes the `content` value of a pre-filled composition row
- **THEN** the updated value SHALL be reflected in the form state for that product and SHALL be included in the submitted payload

#### Scenario: Adding and removing rows
- **WHEN** the user adds a new composition or specification row, or removes an existing one
- **THEN** the form SHALL reflect the addition/removal without affecting other products' data

#### Scenario: Multi-crop application details
- **WHEN** a product's `application_details.crop_name` contains multiple crop/dose entries
- **THEN** the system SHALL allow editing each entry independently and allow adding or removing crop entries

### Requirement: Form validation before submission
The system SHALL validate that all required manufacturer fields (and marketing fields, when not mirrored) are present and that every product retains at least one composition row and one specification row before allowing submission.

#### Scenario: Missing required field blocks submission
- **WHEN** a required manufacturer or marketing field is empty at submit time
- **THEN** the system SHALL prevent submission and SHALL indicate which field(s) are invalid

#### Scenario: All required data present
- **WHEN** all required fields are filled and every product has at least one composition and one specification row
- **THEN** the "Generate" action SHALL be enabled
