## ADDED Requirements

### Requirement: QR free-text field is labelled "Product Information"

The QR generate/edit form SHALL label the multiline free-text field "Product Information". The public scan page SHALL label the same value "Product Information". The field's form key, request payload key, and API response key SHALL remain `description` — this requirement governs displayed label text only.

#### Scenario: Label on the QR generate form

- **WHEN** an admin opens the QR generate form for a product whose category is not Bio Pesticides
- **THEN** the multiline free-text field is labelled "Product Information"
- **AND** no field on the form is labelled "QR Description"

#### Scenario: Label on the QR edit form

- **WHEN** an admin opens an existing QR for editing
- **THEN** the field is labelled "Product Information" and is pre-filled from the saved `description` value

#### Scenario: Submitted payload key is unchanged

- **WHEN** an admin fills in Product Information and submits the QR form
- **THEN** the request payload carries the entered text under the key `description`

#### Scenario: Label on the public scan page

- **WHEN** a consumer opens the public product page for a QR whose `description` is non-empty
- **THEN** the detail row for that value is labelled "Product Information"
- **AND** no row is labelled "Product Description"

#### Scenario: Empty value stays hidden

- **WHEN** a consumer opens the public product page for a QR whose `description` is empty
- **THEN** no "Product Information" row is rendered

#### Scenario: Field remains hidden for Bio Pesticides

- **WHEN** an admin selects a product in the Bio Pesticides category on the QR form
- **THEN** the Product Information field is not rendered, and GTIN and Web Link are shown instead

### Requirement: QR codes download as JPG images

Every QR download action SHALL produce a JPG image of the QR artwork. The system SHALL NOT produce a PDF for a QR download. This applies to the Static QR list, the Dynamic QR list, the QR Preview dialog on both lists, and the batch QR action menu on the Product Details screen.

#### Scenario: Download from the Static QR list

- **WHEN** an admin clicks the download action on a row in the Static QR list
- **THEN** a JPG file of that row's QR artwork is saved to the browser's download location
- **AND** the saved file has a `.jpg` extension

#### Scenario: Download from the Dynamic QR list

- **WHEN** an admin clicks the download action on a row in the Dynamic QR list
- **THEN** a JPG file of that row's QR artwork is saved

#### Scenario: Download from the QR Preview dialog

- **WHEN** an admin opens the QR Preview dialog on either list
- **THEN** the download button is labelled "JPG"
- **AND** clicking it saves a JPG file of the previewed QR artwork

#### Scenario: Download from the Product Details batch menu

- **WHEN** an admin triggers the QR download action for a batch on the Product Details screen
- **THEN** a JPG file of that batch's QR artwork is saved

#### Scenario: Downloaded image preserves scan integrity

- **WHEN** any QR JPG download completes
- **THEN** the image contains the full QR artwork at no less than its source resolution
- **AND** the QR modules are rendered on an opaque white background so that source transparency does not flatten to black

#### Scenario: Filename identifies the QR

- **WHEN** a QR JPG download completes
- **THEN** the filename incorporates the identifying name shown for that QR (product name for QR lists, batch name for Product Details) and ends in `.jpg`

#### Scenario: In-flight download is indicated

- **WHEN** a QR download is in progress for a given row
- **THEN** that row's download control shows a progress indicator and is disabled until the download resolves or fails

#### Scenario: Missing QR artwork

- **WHEN** an admin triggers a download for a QR whose artwork path is absent
- **THEN** no file is downloaded
- **AND** an error notification is shown
- **AND** the download control returns to its idle state

#### Scenario: Artwork fetch fails

- **WHEN** the QR artwork cannot be fetched or decoded
- **THEN** no file is downloaded
- **AND** an error notification is shown
- **AND** the download control returns to its idle state

#### Scenario: Successful download is confirmed

- **WHEN** a QR JPG download completes successfully
- **THEN** a success notification confirming the image download is shown
