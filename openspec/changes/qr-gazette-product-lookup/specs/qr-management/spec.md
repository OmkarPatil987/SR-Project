## ADDED Requirements

### Requirement: Title leads the Regulatory Details section

In "Section 2: Regulatory Details" of the QR generate/edit form, the title field SHALL be the first field in the section. Gazette No., Gazette Date, composition, crops, doses and application method SHALL follow beneath it.

#### Scenario: Title renders first for Biostimulants

- **WHEN** an admin views Section 2 with a Biostimulants product selected
- **THEN** the title field appears above Gazette No. and Gazette Date

#### Scenario: Title renders first for other categories

- **WHEN** an admin views Section 2 with a non-Biostimulants product selected
- **THEN** the title field is still the first field in the section

#### Scenario: Conditional fields keep their category rules

- **WHEN** the section is reordered
- **THEN** Gazette No. and Gazette Date remain visible only for Biostimulants
- **AND** composition, crops, doses and application method remain hidden for Bio Pesticides

### Requirement: Composition and specifications render as tables

Wherever composition or specifications are displayed — the QR create/edit form, the admin QR details view, and the public scan page — structured values SHALL render as a table with a header row, not as free text. Composition SHALL show ingredient and content columns; specifications SHALL show parameter and value columns.

#### Scenario: Composition table on the QR form

- **WHEN** a gazette entry with a composition array is selected on the QR form
- **THEN** the composition renders as a table with "Ingredient" and "Content" column headers and one row per entry

#### Scenario: Specifications table on the QR form

- **WHEN** the selected entry carries a specifications array
- **THEN** the specifications render as a table with "Parameter" and "Value" column headers and one row per entry

#### Scenario: Tables on the public scan page

- **WHEN** a consumer opens the public scan page for a QR with structured composition and specifications
- **THEN** both render as tables with the same columns as the form

#### Scenario: Tables in the admin QR details view

- **WHEN** an admin opens the QR details view for such a QR
- **THEN** both render as tables

#### Scenario: Tables are readable on small screens

- **WHEN** either table is viewed on a narrow viewport
- **THEN** the table remains legible without the page scrolling horizontally

#### Scenario: Absent structured data renders nothing

- **WHEN** a QR carries no composition or specifications
- **THEN** no empty table and no table heading are rendered

#### Scenario: Legacy free-text composition is not tabulated

- **WHEN** a QR's composition is legacy prose rather than structured data
- **THEN** it renders as text in its existing position, with no table headers
