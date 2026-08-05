## Why

The Biostimulant Title on the QR form is free text today. Admins retype official gazette product names by hand, then separately retype the composition, crops and doses that belong to that gazette record — so the QR that a consumer scans can drift from the official notification it claims to represent. Typos, stale compositions, and missing specification data are all invisible once the QR is printed.

The regulator's gazette dataset is already available at `products-gazette/list`, keyed by product name and carrying the full composition, specifications and per-crop application details. Binding the title field to that dataset makes the official record the source of the QR's contents rather than the operator's memory.

Composition and specifications are also inherently tabular — ingredient/content and parameter/value pairs. Today they are squeezed into free-text areas and render on the public page as an undifferentiated blob, which is exactly the content a farmer or inspector needs to read at a glance.

## What Changes

- Add a `FetchProductsGazetteListService` binding to `POST v1/products-gazette/list`, paged and filtered by `product_name`.
- **Biostimulants only**: replace the free-text Biostimulant Title input with a searchable Autocomplete backed by that endpoint. It loads 5 entries by default and re-queries the server with `product_name` as the admin types. Selection is restricted to gazette entries — no free text.
- **All other categories** (including Bio Pesticides) keep the existing free-text title field unchanged.
- Selecting a gazette entry auto-fills the QR form from that record: composition, specifications, crops (from `crop_name`) and doses (from `dose`). Crops and Doses stay editable so an admin can override; Application Method remains manual.
- Auto-fill Gazette No. and Gazette Date from the selected record when the record carries them.
- Move the Biostimulant Title field to the **top** of "Section 2: Regulatory Details", above Gazette No./Gazette Date, with the remaining fields reordered below it.
- Render composition and specifications as **tables** rather than text areas, in all three places the data surfaces: the QR create/edit form, the admin product/QR details view, and the public scan page.
- Persist the structured arrays by JSON-encoding them into the existing `biostimulant_composition` string field. No backend or API contract change is required.
- Readers fall back to plain-text rendering when the field does not parse as JSON, so QRs created before this change keep displaying correctly.

## Capabilities

### New Capabilities
- `gazette-product-lookup`: sourcing biostimulant title, composition, specifications and application details from the regulator's gazette dataset — search behaviour, selection rules, auto-fill mapping, and the encode/decode contract for persisting structured data through existing string fields.

### Modified Capabilities
<!-- None in the delta sense. `qr-management` gains requirements (Section 2 field order,
     table rendering of composition/specifications), but none of its existing requirements
     — the "Product Information" label and the JPG download — change. Those requirements
     also still sit in the unarchived `qr-product-information-and-jpg-download` change,
     so there is no baseline in openspec/specs/ to write a MODIFIED delta against.
     The new requirements are therefore filed as ADDED under `qr-management`. -->
- `qr-management` (ADDED only): Regulatory Details field ordering and tabular rendering of composition/specifications.

## Impact

- `src/utils/services/product.service.ts` — new `FetchProductsGazetteListService` export.
- `src/pages/admin/qr/QRGenerate.tsx` — Section 2 reordered; title field becomes a category-conditional Autocomplete with debounced server-side search; auto-fill on selection; composition/specifications rendered as tables; `handleSubmit` encodes the structured payload into `biostimulant_composition`.
- `src/pages/guest/product/index.tsx` — decode `biostimulant_composition`; render composition and specifications as tables; `ProductDetail.biostimulant_composition` type widens to accommodate the encoded form.
- `src/pages/admin/products/Components/ProductDetails.tsx` — render the same tables in the admin QR details view.
- New shared module for the encode/decode helpers and the dose-flattening logic, consumed by all three screens.
- No backend, database, or API contract change. The endpoint being consumed already exists.
- **Data-shape risk**: `application_details.dose` is polymorphic in the live API — a plain string in some records, an object keyed by crop name in others. Both forms must be handled.
