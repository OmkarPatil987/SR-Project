## ADDED Requirements

### Requirement: Generate label PDF from the edited form
The system SHALL submit the completed manufacturer, marketing, `is_manufacturer_marketing_same` flag, and per-product `products_gazette` data to the label-pdf API and, on success, display the returned PDF via its `file_url`.

#### Scenario: Successful generation
- **WHEN** the user activates "Generate" on a valid, fully-filled form
- **THEN** the system SHALL POST the assembled payload to the label-pdf endpoint and, on success, show a result screen with the PDF viewable/downloadable from `file_url`

#### Scenario: Generation failure is surfaced
- **WHEN** the label-pdf request fails
- **THEN** the system SHALL display an error message and SHALL keep the user on the form step with their entered data intact

### Requirement: Edit and regenerate after a PDF has been generated
The system SHALL allow the user to return from the result screen to the form step with the same data that produced the current PDF, edit it, and regenerate without re-selecting products or re-fetching gazette data.

#### Scenario: Editing after generation
- **WHEN** the user activates "Edit" on the result screen
- **THEN** the system SHALL return to the form step pre-filled with the exact data last submitted, without calling products-gazette-by-ids again

#### Scenario: Regenerating after edits
- **WHEN** the user modifies the pre-filled data and activates "Generate" again
- **THEN** the system SHALL POST the updated payload to the label-pdf endpoint and replace the previously shown PDF with the newly returned one

### Requirement: Starting a new label clears prior selection and form state
The system SHALL provide an explicit action to start a new label generation that discards the current selection, form data, and result, returning the user to the selection step.

#### Scenario: Starting fresh after generating a label
- **WHEN** the user activates "Start new label" from the result screen
- **THEN** the system SHALL clear the previously selected product IDs and form data and SHALL return the user to an empty selection step
