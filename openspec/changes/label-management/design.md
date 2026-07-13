## Context

The app is React 18 + TypeScript (CRA), Redux Toolkit for state, MUI v5 for UI, Formik + Yup for forms, and a flat axios service-function layer (`src/utils/services/*.service.ts`) built on `handleGetRequest`/`handlePostRequest` wrappers with a shared auth-token interceptor (`src/utils/client-axios.ts`). Menu items are not hardcoded JSX; they are produced by `handleNav(dispatch)` (`src/utils/permission/index.ts`) from a static, role-keyed permission table (`responseDataPermissionUsingRole` in `src/utils/permission/Permission.ts`). Today that table is **role-based only** — there is no reading of `enabled_modules` (the company's `qr_system` / `label_system.label_with_qr` / `label_system.label_without_qr` flags) anywhere on the frontend.

A reusable stepper component (`src/components/common/stepper/Stepper.tsx`) and a PDF-preview drawer (`src/components/common/FilePreview.tsx`, iframe-based) already exist but are currently unused/underused — both are good fits for this feature. There is no existing pattern for a checkbox-driven, multi-select paginated table; the closest precedent is the plain `Table` + `CustomPagination` (`src/components/common/table/TablePagination.tsx`) used in `ProductList`/`CompanyList`.

## Goals / Non-Goals

**Goals:**
- Ship a self-contained `src/pages/admin/labels/` module (list precedent: `src/pages/admin/products/`) covering: menu entry → product selection → editable form → PDF result/edit → history.
- Gate the new "Label" menu entry on the company's `enabled_modules.label_system` flag (either sub-flag true), without disrupting the existing role-based permission table for every other menu item.
- Reuse existing primitives wherever they fit: `CustomStepper` for the 3-step flow, `FilePreviewDrawer` for viewing the generated PDF, `CustomPagination` for both the selection list and history list, Formik + Yup for the editable form.
- Support "edit after generate" without re-fetching `products-gazette-by-ids` — the last-used form payload is kept in memory for the session.

**Non-Goals:**
- No backend changes. All 4 endpoints and their contracts are already final (see proposal's reference curl examples).
- No changes to the QR module, company create/register forms, or any existing product/gazette admin screens beyond what's needed to read `enabled_modules` for gating.
- No offline/local PDF rendering — `jsPDF` (present in package.json but unused for this) is not used; the PDF is generated server-side and served as a URL (`file_url`).
- No cross-session draft persistence (e.g. localStorage) in v1 — if the user navigates away mid-flow before generating, in-progress edits are lost. This can be revisited later if it proves painful.

## Decisions

1. **Module-flag gating is new plumbing, added narrowly.** Since `enabled_modules` isn't read anywhere on the frontend today, add it to the company/auth profile shape already loaded at login (wherever `authUser`/company profile is stored in Redux) and expose a small selector/helper (e.g. `hasLabelModule(state)`) that `handleNav` (or the component consuming its output) calls to conditionally include the "Label" entry from `responseDataPermissionUsingRole`. Alternative considered: gate purely at the route level (still render the menu item, redirect if flag missing) — rejected because it would show a dead-end menu entry to companies who haven't purchased the add-on, which is confusing and leaks the feature's existence.

2. **3-step flow as one stepper-driven page, not 3 routed pages.** Selection → Form → Result are steps of a single `CustomStepper`-wrapped container component (state lifted to a parent, e.g. `GenerateLabel.tsx`), rather than 3 separate routes with URL-driven state. Alternative considered: route-per-step (`/labels/select`, `/labels/form`, `/labels/result`) — rejected because it requires either URL-encoding selected IDs/form drafts or a global store for what's inherently transient, single-flow state; a stepper component already exists precisely for this in-page pattern and keeping state local to the flow container is simpler and matches the "no cross-session persistence" non-goal. History remains its own separate route/page (`/admin/labels/history` or similar) since it's an independent, revisitable list, not part of the generation flow.

3. **Selection list gets a new checkbox-table component; no existing component is reused as-is.** Build a `LabelProductSelectionTable` combining MUI `Table` + `Checkbox` + the existing `CustomPagination`, since no multi-select list precedent exists. Selection state (a `Set`/array of selected IDs across pages) is held in the flow container so checked state survives pagination within the same session. Enforce the max-10 rule at selection time (disable further checkboxes once 10 are selected, with an inline message) rather than only at submit time, to avoid a frustrating late rejection.

4. **Form step is Formik + Yup, one form per selected product plus a shared manufacturer/marketing section.** The `products-gazette-by-ids` response seeds `initialValues`; composition/specifications are Formik `FieldArray`s (add/remove rows) since content varies per product and must stay editable; `application_details.crop_name` may be a single object or an array (per the sample payloads) — normalize to an array internally for editing and un-normalize (collapse to a single object) on submit only if exactly one crop entry remains, to match the two shapes the backend accepts. The `is_manufacturer_marketing_same` toggle, when on, disables and mirrors the marketing fields from manufacturer values client-side; when off, marketing fields become independently editable — mirroring stops but last-mirrored values remain as a starting point.

5. **"Edit" after generation re-enters the same form step with the same Formik state**, not a re-fetch. The flow container keeps the last submitted payload (manufacturer/marketing/products_gazette) in memory; clicking "Edit" on the result step moves the stepper back to the form step pre-filled with that payload, and "Generate"/"Regenerate" re-POSTs to `label-pdf`. Only a fresh "Start new label" action clears state and returns to selection.

6. **New `label.service.ts` following the existing flat-function service convention** (as in `product.service.ts`), one exported function per endpoint: `FetchProductGazetteListService`, `FetchProductGazetteByIdsService`, `GenerateLabelPdfService`, `FetchLabelPdfHistoryService`.

## Risks / Trade-offs

- **[Risk]** No existing frontend precedent for module-flag-based menu gating → could be implemented inconsistently with the role-based table it extends. **Mitigation**: keep the flag check as a thin wrapper around the existing `handleNav`/permission output (filter, don't restructure), reviewed against the existing `Permission.ts` shape before merging.
- **[Risk]** `application_details.crop_name` shape ambiguity (object vs array in sample payloads) could cause data loss on submit if not normalized carefully. **Mitigation**: explicit normalize-on-load / denormalize-on-submit step covered by a unit test for both shapes.
- **[Risk]** Losing in-progress edits on navigation/refresh (no draft persistence) could frustrate users filling a long form. **Mitigation**: accepted for v1 per Non-Goals; add a simple "unsaved changes" browser confirm-on-navigate as a cheap partial mitigation.
- **[Trade-off]** Building a bespoke checkbox-table instead of pulling in a table library (e.g. MUI DataGrid) keeps the bundle/pattern consistent with the rest of the app, at the cost of some boilerplate for selection-state-across-pages that a grid library would provide for free.

## Migration Plan

Additive only — no existing data, routes, or components are removed or changed. Rollout is a single frontend deploy once implementation + review are done; no feature flag needed beyond the existing `enabled_modules.label_system` check, which naturally limits exposure to companies with the module purchased. Rollback is a plain revert (no backend/data migration involved).

## Open Questions

- Exact new route path(s) and path-constant names to add in `src/constant/index.tsx` / `AdminRoute.tsx` (e.g. `/admin/labels`, `/admin/labels/history`) — to be finalized during task breakdown against current naming conventions.
- Whether `company_admin` and `admin` (superadmin) roles both get the Label menu entry, or only `company_admin` (labels are a company-scoped, paid add-on) — assumed `company_admin`-only unless told otherwise.
- Where the logged-in company's `enabled_modules` will actually be available on the frontend (login response shape vs. a separate profile-fetch call) — needs a quick check of the current login/auth slice before implementation.
