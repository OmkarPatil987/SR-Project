### Requirement: Module selection on company create/register forms
The system SHALL present an "Enabled Modules" section on the guest company registration form and the admin create-company form (create mode only) with a toggle for "QR System" and a toggle for "Label System", the latter revealing two mutually exclusive sub-options ("Label with QR" and "Label without QR") when enabled.

#### Scenario: Enabling QR System only
- **WHEN** the user enables only the "QR System" toggle and leaves "Label System" disabled
- **THEN** the submitted `enabled_modules` SHALL be `{"qr_system": true, "label_system": {"label_with_qr": false, "label_without_qr": false}}`

#### Scenario: Enabling Label System reveals sub-options
- **WHEN** the user enables the "Label System" toggle
- **THEN** the system SHALL reveal the "Label with QR" and "Label without QR" sub-options for selection

### Requirement: Label sub-options are mutually exclusive
The system SHALL allow at most one of "Label with QR" or "Label without QR" to be selected at a time; selecting one SHALL deselect the other.

#### Scenario: Selecting the other sub-option deselects the first
- **WHEN** "Label with QR" is currently selected and the user selects "Label without QR"
- **THEN** the system SHALL deselect "Label with QR" so that only "Label without QR" is selected

### Requirement: enabled_modules serialized as JSON-stringified form field
The system SHALL serialize the selected module configuration to a JSON string matching the `EnabledModules` shape (`qr_system: boolean`, `label_system: { label_with_qr: boolean, label_without_qr: boolean }`) and submit it under the `enabled_modules` field of the multipart request.

#### Scenario: Default submission shape
- **WHEN** the user submits the form without changing any module toggle from its default state
- **THEN** the system SHALL submit `enabled_modules` as a JSON string with `qr_system: true` and both label sub-options `false`

#### Scenario: Label system enabled with a variant selected
- **WHEN** the user enables "Label System" and selects "Label with QR"
- **THEN** the system SHALL submit `enabled_modules` as a JSON string equal to `{"qr_system": <current QR toggle value>, "label_system": {"label_with_qr": true, "label_without_qr": false}}`
