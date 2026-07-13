## Why

The backend now exposes a full set of "Label Management" APIs (product gazette listing, gazette lookup by IDs, label PDF generation, and label PDF history) and the company record already carries `enabled_modules.label_system` flags (`label_with_qr` / `label_without_qr`) to gate access to this as a paid add-on service. Today the frontend has no UI for any of this — companies with the module enabled cannot select gazette products, fill in manufacturer/marketing details, generate a compliant product label PDF, or look back at previously generated labels. This change adds that UI so Label Management becomes a usable additional service rather than backend-only capability.

## What Changes

- Add a **Label** entry to the main menu/sidebar, visible to both `admin` and `company_admin` roles, gated on `enabled_modules.label_system` (either `label_with_qr` or `label_without_qr`) read directly off the logged-in user's own record (see design.md Decision 1 for how this is sourced).
- Add a **product selection screen**: paginated, checkboxed list of gazette products (`GET /products-gazette-list`), with a running selection count, a hard cap of 10 selected items, and a "Next" action that proceeds only when at least 1 item is selected.
- Add a **label details form screen**: on "Next", selected IDs are POSTed to `POST /products-gazette-by-ids` to fetch full gazette data (composition, specifications, application details, note) per product. The response pre-fills an editable form containing:
  - Manufacturer details (name, address, contact person, mobile, email, website, license no, GST no)
  - A toggle "manufacturer and marketing company are the same" (`is_manufacturer_marketing_same`) that, when on, hides/mirrors the marketing section
  - Marketing details (same fields as manufacturer), editable when the toggle is off
  - Per-product editable composition table, specifications table, application details (crop/dose, single or multi-crop), and a free-text note
- Add **PDF generation & edit flow**: submitting the form calls `POST /products-gazette/label-pdf` and returns a `file_url`. Show the generated PDF (view/download) with an explicit "Edit" action that returns to the same pre-filled form (state retained in-session) so the user can adjust values and regenerate (re-POST) without re-selecting products from scratch.
- Add a **label history screen**: paginated list backed by `GET /products-gazette/label-pdf-list`, showing each past generation's product names, created date, and a link to view/download that PDF.
- Wire the 3-step flow (select → fill/edit → result) as a single guided flow (stepper), with the history screen reachable as its own menu tab.

## Capabilities

### New Capabilities
- `label-product-selection`: Paginated, multi-select (max 10) browsing of product gazette entries as the entry point into label generation.
- `label-form-editing`: Fetching full gazette detail by IDs and presenting an editable manufacturer/marketing/composition/specification/application-details/note form, including the manufacturer-equals-marketing toggle.
- `label-pdf-generation`: Submitting the edited form to generate a label PDF, viewing the result, and re-editing/regenerating from the same data.
- `label-history`: Paginated list of previously generated label PDFs with their associated products, creation date, and download/view links.

### Modified Capabilities
- None. `enabled_modules.label_system` already exists on the login response's `User` object; this change only reads the existing flag on the frontend to gate menu visibility and does not change its shape or the company create/register APIs.

## Impact

- **New frontend routes/pages**: a Label module with 3-4 screens (selection, form/edit, result, history) reachable from a new sidebar "Label" menu item, gated by `enabled_modules.label_system` for both `admin` and `company_admin`.
- **API integration**: 4 existing backend endpoints consumed for the first time on the frontend — `GET /products-gazette-list`, `POST /products-gazette-by-ids`, `POST /products-gazette/label-pdf`, `GET /products-gazette/label-pdf-list`. No backend changes required; contracts are already finalized (see reference curl examples supplied with this change).
- **State/session handling**: selected product IDs and fetched gazette data must be held across the selection → form step, and the last-submitted form payload must be retained to support "Edit" after PDF generation without a redundant `products-gazette-by-ids` call.
- **Auth**: all four endpoints (except the public QR scan endpoint, out of scope here) require the existing company-scoped Bearer token already used elsewhere in the app.
- **No changes** to QR system screens, company create/register forms, or the product gazette listing/detail admin screens (if any) beyond reuse of existing API/auth plumbing.
