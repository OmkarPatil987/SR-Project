## ADDED Requirements

### Requirement: Biostimulant title is selected from the gazette dataset

When the product selected on the QR form belongs to the Biostimulants category, the title field SHALL be a search-backed Autocomplete whose options come from `POST v1/products-gazette/list`. The admin SHALL NOT be able to submit a title that was not chosen from that list. For every other category the title field SHALL remain a free-text input with its current behaviour.

#### Scenario: Default options on open

- **WHEN** an admin selects a Biostimulants product and opens the title field without typing
- **THEN** the field requests the gazette list with `offset: 0` and `limit: 5`
- **AND** at most 5 options are shown

#### Scenario: Server-side search as the admin types

- **WHEN** an admin types "Bioventa" into the title field
- **THEN** a request is sent to `v1/products-gazette/list` carrying `product_name: "Bioventa"`
- **AND** the options are replaced by the response's `body.data` entries, labelled by `product_name`

#### Scenario: Typing is debounced

- **WHEN** an admin types several characters in quick succession
- **THEN** the search request is issued only after typing pauses, not once per keystroke

#### Scenario: Free text is rejected for Biostimulants

- **WHEN** an admin types a title that matches no gazette entry and does not select an option
- **THEN** no title value is committed to the form
- **AND** submitting shows the required-field validation for the title

#### Scenario: Other categories keep free text

- **WHEN** the selected product is in any category other than Biostimulants
- **THEN** the title renders as a plain text field accepting any value, with no gazette lookup

#### Scenario: No matching gazette entries

- **WHEN** a search returns an empty `body.data`
- **THEN** the Autocomplete shows an empty-results message and no options
- **AND** no error notification is raised

#### Scenario: Gazette search fails

- **WHEN** the gazette request errors or times out
- **THEN** the Autocomplete stops showing its loading state and presents no options
- **AND** the rest of the form remains usable

### Requirement: Selecting a gazette entry auto-fills the QR record

Choosing a gazette entry SHALL populate the QR form from that record: composition, specifications, crops, and doses. Crops and Doses SHALL remain editable after auto-fill. Application Method SHALL NOT be auto-filled. Gazette No. and Gazette Date SHALL be auto-filled only when the selected record carries non-null values for them.

#### Scenario: Composition and specifications are captured

- **WHEN** an admin selects a gazette entry carrying `composition` and `specifications` arrays
- **THEN** both arrays are held on the form and rendered as tables

#### Scenario: Crops are filled from crop_name

- **WHEN** the selected record has `application_details.crop_name` of "Cucumber, Chilli"
- **THEN** the Crops field is populated with "Cucumber, Chilli"
- **AND** the admin can still edit it

#### Scenario: Gazette number and date fill when present

- **WHEN** the selected record has a non-null `gazette_no` and `gazette_date`
- **THEN** the Gazette No. and Gazette Date fields are populated from them

#### Scenario: Null gazette number and date do not clear existing input

- **WHEN** the selected record has `gazette_no` and `gazette_date` of `null`
- **THEN** any value the admin already entered in those fields is left untouched

#### Scenario: Changing selection replaces prior auto-fill

- **WHEN** an admin selects a different gazette entry after a previous selection
- **THEN** composition, specifications, crops and doses are replaced by the new record's values

#### Scenario: Application Method is never auto-filled

- **WHEN** any gazette entry is selected
- **THEN** the Application Method field retains whatever the admin entered

### Requirement: Polymorphic dose values are normalised

The gazette API returns `application_details.dose` either as a plain string or as an object keyed by crop name. The system SHALL accept both shapes without error and render a per-crop breakdown when the object form is supplied.

#### Scenario: Dose supplied as a string

- **WHEN** the selected record has `dose` of "One foliar application at 2.5 litre/ha"
- **THEN** the Doses field is populated with that string

#### Scenario: Dose supplied as a per-crop object

- **WHEN** the selected record has `dose` of `{"Chilli": "Two foliar applications at 750 ml/ha", "Cucumber": "One foliar application at 1 litre/ha"}`
- **THEN** the Doses field is populated with a readable per-crop rendering naming both crops and both doses
- **AND** no `[object Object]` text appears anywhere in the form or on the public page

#### Scenario: Dose absent

- **WHEN** the selected record has no `application_details` or a null `dose`
- **THEN** the Doses field is left empty and no error is raised

### Requirement: Structured gazette data persists through the existing composition field

Composition and specifications SHALL be persisted by JSON-encoding them into the existing `biostimulant_composition` string field of the QR store/update payload. No new API field is introduced. Every reader SHALL decode this field defensively and fall back to plain-text rendering when it does not parse as the encoded structure.

#### Scenario: Encoded on submit

- **WHEN** an admin submits a QR whose composition and specifications came from a gazette entry
- **THEN** the request payload's `biostimulant_composition` is a JSON string carrying both the composition and specifications arrays
- **AND** no new keys are added to the payload

#### Scenario: Decoded on edit

- **WHEN** an admin opens a QR whose `biostimulant_composition` holds the encoded structure
- **THEN** the composition and specifications tables are repopulated from it

#### Scenario: Legacy plain text still renders

- **WHEN** a QR created before this change is opened, whose `biostimulant_composition` is ordinary prose
- **THEN** that text is rendered as-is
- **AND** no parse error surfaces to the user

#### Scenario: Malformed encoded value degrades safely

- **WHEN** `biostimulant_composition` contains a string that begins to parse as JSON but lacks the expected arrays
- **THEN** the raw string is rendered as text rather than an empty or broken table

#### Scenario: Public page decodes the same contract

- **WHEN** a consumer opens the public scan page for a QR carrying encoded composition data
- **THEN** the composition and specifications render as tables decoded from that single field
