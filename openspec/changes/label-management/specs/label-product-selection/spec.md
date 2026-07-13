## ADDED Requirements

### Requirement: Label menu visibility gated by module flag, for admin and company_admin
The system SHALL show a "Label" navigation entry to a logged-in user with the `admin` or `company_admin` role only when that user's `enabled_modules.label_system` has at least one of `label_with_qr` or `label_without_qr` set to `true`. Users without either sub-flag enabled SHALL NOT see the entry.

#### Scenario: Company admin with label module enabled sees the menu entry
- **WHEN** a `company_admin` user whose `enabled_modules.label_system.label_with_qr = true` logs in
- **THEN** the sidebar/menu SHALL include a "Label" entry that navigates to the label selection screen

#### Scenario: Admin with label module enabled sees the menu entry
- **WHEN** an `admin` (superadmin) user whose `enabled_modules.label_system.label_with_qr = true` logs in
- **THEN** the sidebar/menu SHALL include a "Label" entry that navigates to the label selection screen

#### Scenario: User without label module does not see the menu entry
- **WHEN** a user (`admin` or `company_admin`) whose `enabled_modules.label_system.label_with_qr = false` and `label_without_qr = false` (or the flag is absent) logs in
- **THEN** the sidebar/menu SHALL NOT include a "Label" entry

### Requirement: Paginated product gazette listing for selection
The system SHALL display product gazette entries as a paginated, checkbox-selectable list, fetched via the products-gazette-list API using the current page's `limit`/`offset`.

#### Scenario: Initial page load
- **WHEN** the user opens the label selection screen
- **THEN** the system SHALL request the first page of gazette products and render each item's `id` and `name` with an unchecked checkbox

#### Scenario: Paging through results
- **WHEN** the user navigates to a subsequent page of the list
- **THEN** the system SHALL request that page's items using the updated `offset` while preserving the checked/unchecked state of items already selected on other pages

### Requirement: Maximum 10 product selections
The system SHALL allow a user to select at most 10 product gazette items across all pages before proceeding to the next step.

#### Scenario: Selecting up to the limit
- **WHEN** the user checks product items one at a time
- **THEN** each checkbox SHALL remain selectable until exactly 10 items are selected

#### Scenario: Attempting to exceed the limit
- **WHEN** 10 items are already selected and the user attempts to check an 11th item
- **THEN** the system SHALL prevent the additional selection and SHALL display a message indicating the 10-item maximum has been reached

#### Scenario: Deselecting frees up a slot
- **WHEN** exactly 10 items are selected and the user unchecks one of them
- **THEN** the system SHALL allow one additional item to be selected

### Requirement: Proceeding to the next step requires at least one selection
The system SHALL only allow the user to advance from the selection step when at least one product is selected.

#### Scenario: No selections made
- **WHEN** zero products are selected
- **THEN** the "Next" action SHALL be disabled

#### Scenario: At least one selection made
- **WHEN** one or more products are selected
- **THEN** the "Next" action SHALL be enabled and, when activated, SHALL advance the user to the label form step carrying the selected product IDs
