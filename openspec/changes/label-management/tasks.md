## 1. Module flag plumbing & routing setup

- [x] 1.1 Confirm where the logged-in company's `enabled_modules` (incl. `label_system.label_with_qr` / `label_without_qr`) is available on the frontend (login response vs. profile fetch); if missing from the currently stored auth/company state, add it to that slice.
- [x] 1.2 Add a `hasLabelModule` selector/helper that returns true when either `label_with_qr` or `label_without_qr` is enabled for the current company.
- [x] 1.3 Extend `responseDataPermissionUsingRole` (`src/utils/permission/Permission.ts`) with a "Label" entry (uuid, name, slug, module_url, icon, module_order) for the `company_admin` role, and filter it out of `handleNav`'s output (`src/utils/permission/index.ts`) when `hasLabelModule` is false.
- [x] 1.4 Add new path constants (e.g. `NAVIGATE_ADMIN.LABELS`, `NAVIGATE_ADMIN.LABELS_HISTORY`) in `src/constant/index.tsx` and register the corresponding routes in `src/routes/AdminRoute.tsx`.
- [x] 1.5 Scaffold the `src/pages/admin/labels/` module folder (mirroring `src/pages/admin/products/` layout: top-level list/flow components, `constants/`, `utils/`).

## 2. API service layer

- [x] 2.1 Create `src/utils/services/label.service.ts` following the flat-function convention in `product.service.ts`.
- [x] 2.2 Add `FetchProductGazetteListService(limit, offset)` → `GET /products-gazette-list`.
- [x] 2.3 Add `FetchProductGazetteByIdsService(ids: number[])` → `POST /products-gazette-by-ids`.
- [x] 2.4 Add `GenerateLabelPdfService(payload)` → `POST /products-gazette/label-pdf`.
- [x] 2.5 Add `FetchLabelPdfHistoryService(limit, offset)` → `GET /products-gazette/label-pdf-list`.
- [x] 2.6 Define shared TypeScript types/interfaces for the gazette list item, full gazette detail (composition/specifications/application_details/note), label-pdf request/response, and history entry shapes.

## 3. Product selection step

- [x] 3.1 Build `LabelProductSelectionTable` (MUI `Table` + `Checkbox` + existing `CustomPagination`) rendering `id`/`name` per gazette item.
- [x] 3.2 Wire pagination to `FetchProductGazetteListService`, keeping selected-ID state (e.g. a `Set<number>`) in the parent flow container so it survives page changes.
- [x] 3.3 Implement the 10-item selection cap: disable unchecked checkboxes once 10 are selected, show an inline "maximum 10 labels" message, and re-enable on deselect.
- [x] 3.4 Implement the "Next" action: disabled when zero items selected; on click, passes selected IDs to the flow container and advances the stepper.

## 4. Editable label form step

- [x] 4.1 On advancing to this step, call `FetchProductGazetteByIdsService` with the selected IDs; show a loading state and an error state (with retry) that does not advance on failure.
- [x] 4.2 Build the manufacturer details Formik section (name, address, contact person, mobile, email, website, license_no, gst_no) with Yup validation for required fields.
- [x] 4.3 Build the `is_manufacturer_marketing_same` toggle: when on, disable + mirror marketing fields from manufacturer values; when off, restore independent editable marketing fields (initialized from last-mirrored values) with its own Yup validation.
- [x] 4.4 Build a per-product editable section: composition table as a Formik `FieldArray` (ingredient/content, add/remove rows), specifications table as a Formik `FieldArray` (parameter/value, add/remove rows), free-text `note` field.
- [x] 4.5 Build editable `application_details`: support both the single crop/dose object and the multi-entry `crop_name` array shapes — normalize to an array in form state on load, add/remove crop entries in the UI.
- [x] 4.6 On submit, denormalize `application_details` back to a single object when exactly one crop entry remains, else keep the array shape, matching the two payload shapes accepted by the backend.
- [x] 4.7 Validate before enabling "Generate": all required manufacturer/marketing fields present, and every product retains at least one composition row and one specification row.

## 5. PDF generation & edit/regenerate flow

- [x] 5.1 Wire "Generate" to assemble the payload (`is_manufacturer_marketing_same`, `manufacturer`, `marketing`, `products_gazette[]`) and call `GenerateLabelPdfService`; show a loading state and surface errors without losing form data.
- [x] 5.2 On success, advance to a result step showing the PDF via the existing `FilePreviewDrawer` (`src/components/common/FilePreview.tsx`) using the returned `file_url`, plus a direct download link.
- [x] 5.3 Keep the last-submitted payload in the flow container's state; wire "Edit" on the result step to return to the form step pre-filled with that payload (no re-fetch of gazette-by-ids).
- [x] 5.4 Wire "Generate" on a returned-to form step to re-POST and replace the currently shown PDF/result with the new response.
- [x] 5.5 Wire "Start new label" to clear selected IDs, fetched gazette data, form state, and result, returning the user to an empty selection step.
- [x] 5.6 Assemble the 3 steps (`Select`, `Form`, `Result`) under the existing `CustomStepper` (`src/components/common/stepper/Stepper.tsx`) in a parent `GenerateLabel` (or similarly named) container component, lifting shared state to that container.

## 6. Label history screen

- [x] 6.1 Build a paginated history table (reusing `CustomPagination`) backed by `FetchLabelPdfHistoryService`, showing product names, created date, and company name per entry.
- [x] 6.2 Add an empty-state message for zero history entries.
- [x] 6.3 Add a view/download action per row that opens/downloads the entry's `file_url` (reuse `FilePreviewDrawer` for viewing where consistent with the result step).
- [x] 6.4 Add navigation between the generation flow and the history screen (e.g. a tab or secondary link under the "Label" menu area).

## 7. Verification

- [ ] 7.1 Manually verify menu gating: confirm the "Label" entry appears only for a company with `label_system` enabled and is absent otherwise.
- [ ] 7.2 Manually walk the full flow end-to-end against the real backend: select up to 10 products → edit form (including toggling manufacturer=marketing, multi-crop editing) → generate → edit → regenerate → start new label.
- [ ] 7.3 Manually verify the history screen lists newly generated PDFs (including ones just created during 7.2) and that pagination and view/download links work.
- [x] 7.4 Run existing lint/type-check/test scripts and fix any issues introduced by the new module. (`tsc --noEmit` clean; ESLint clean on all new/modified files; CRA dev server compiles and serves with no new warnings — the only warning present, a pre-existing `jsx-a11y/iframe-has-title` on `FilePreview.tsx`, predates this change.)
