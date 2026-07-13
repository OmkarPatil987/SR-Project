## ADDED Requirements

### Requirement: Paginated history of generated label PDFs
The system SHALL provide a history screen, reachable from the Label menu area, that lists previously generated label PDFs for the logged-in company using the label-pdf-list API, paginated by `limit`/`offset`.

#### Scenario: Viewing the first page of history
- **WHEN** the user opens the label history screen
- **THEN** the system SHALL request the first page of the label-pdf-list endpoint and display each entry's associated product names and creation date

#### Scenario: Paging through history
- **WHEN** the user navigates to a subsequent page
- **THEN** the system SHALL request that page using the updated `offset` and display its entries

#### Scenario: No history yet
- **WHEN** the label-pdf-list endpoint returns zero entries
- **THEN** the system SHALL display an empty-state message instead of an empty table

### Requirement: View or download a past generated label PDF
The system SHALL allow the user to view or download the PDF for any entry shown in the history list via its `file_url`.

#### Scenario: Opening a past label PDF
- **WHEN** the user activates the view/download action on a history entry
- **THEN** the system SHALL open or download that entry's PDF using its `file_url`
