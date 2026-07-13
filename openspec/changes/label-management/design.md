## Context

The app is React 18 + TypeScript (CRA), Redux Toolkit for state, MUI v5 for UI, Formik + Yup for forms, and a flat axios service-function layer (`src/utils/services/*.service.ts`) built on `handleGetRequest`/`handlePostRequest` wrappers with a shared auth-token interceptor (`src/utils/client-axios.ts`). Menu items are not hardcoded JSX; they are produced by `handleNav(dispatch)` (`src/utils/permission/index.ts`) from a static, role-keyed permission table (`responseDataPermissionUsingRole` in `src/utils/permission/Permission.ts`). Confirmed against a real login response: `enabled_modules` (the `qr_system` / `label_system.label_with_qr` / `label_system.label_without_qr` flags) is returned directly on the login response's `User` object, alongside `company_id` and `company_uuid`, and is stored as-is into `authUser.userDetails` (and persisted to `localStorage` via the existing encrypted session, so it survives reloads with no extra fetch).

A reusable stepper component (`src/components/common/stepper/Stepper.tsx`) and a PDF-preview drawer (`src/components/common/FilePreview.tsx`, iframe-based) already exist but are currently unused/underused — both are good fits for this feature. There is no existing pattern for a checkbox-driven, multi-select paginated table; the closest precedent is the plain `Table` + `CustomPagination` (`src/components/common/table/TablePagination.tsx`) used in `ProductList`/`CompanyList`.

## Goals / Non-Goals

**Goals:**
- Ship a self-contained `src/pages/admin/labels/` module (list precedent: `src/pages/admin/products/`) covering: menu entry → product selection → editable form → PDF result/edit → history.
- Gate the "Label" menu entry on `enabled_modules.label_system` (either sub-flag true) for both `admin` and `company_admin` roles, without disrupting the existing role-based permission table for every other menu item.
- Reuse existing primitives wherever they fit: `CustomStepper` for the 3-step flow, `FilePreviewDrawer` for viewing the generated PDF, `CustomPagination` for both the selection list and history list, Formik + Yup for the editable form.
- Support "edit after generate" without re-fetching `products-gazette-by-ids` — the last-used form payload is kept in memory for the session.

**Non-Goals:**
- No backend changes. All 4 endpoints and their contracts are already final (see proposal's reference curl examples).
- No changes to the QR module, company create/register forms, or any existing product/gazette admin screens.
- No offline/local PDF rendering — `jsPDF` (present in package.json but unused for this) is not used; the PDF is generated server-side and served as a URL (`file_url`).
- No cross-session draft persistence (e.g. localStorage) in v1 — if the user navigates away mid-flow before generating, in-progress edits are lost. This can be revisited later if it proves painful.

## Decisions

1. **Module-flag gating reads `enabled_modules` synchronously off `authUser.userDetails`, not via a separate company-details fetch.** An earlier attempt introduced a `companyModules` Redux slice populated by an async `FetchCompanyDetailsService` call keyed on `company_uuid`, gated to fire after mount — this left the "Label" entry invisible for both roles, root-caused to relying on a value (`company_uuid` and/or `enabled_modules` from that specific endpoint) that wasn't confirmed present. Inspecting an actual login response resolved this: `enabled_modules` (along with `company_id`/`company_uuid`) is already part of the login response's `User` object and lands directly on `authUser.userDetails`, which is hydrated synchronously from the encrypted `localStorage` session at store creation — no fetch, no loading state, no race condition. `hasLabelModule()` (`src/utils/permission/index.ts`) now reads `store.getState().authUser?.userDetails?.enabled_modules` directly, and `handleMakingNestedData` filters the `label-001` entry out of `user_role_permission` when it's false. The async slice, fetch effect, and `clearPermission` dance from the earlier attempt were removed as unnecessary. Alternative considered: gate purely at the route level (still render the menu item, redirect if flag missing) — rejected because it would show a dead-end menu entry to companies who haven't purchased the add-on, which is confusing and leaks the feature's existence.

2. **3-step flow as one stepper-driven page, not 3 routed pages.** Selection → Form → Result are steps of a single `CustomStepper`-wrapped container component (state lifted to a parent, e.g. `GenerateLabel.tsx`), rather than 3 separate routes with URL-driven state. Alternative considered: route-per-step (`/labels/select`, `/labels/form`, `/labels/result`) — rejected because it requires either URL-encoding selected IDs/form drafts or a global store for what's inherently transient, single-flow state; a stepper component already exists precisely for this in-page pattern and keeping state local to the flow container is simpler and matches the "no cross-session persistence" non-goal. History remains its own separate route/page (`/admin/labels/history` or similar) since it's an independent, revisitable list, not part of the generation flow.

3. **Selection list gets a new checkbox-table component; no existing component is reused as-is.** Build a `LabelProductSelectionTable` combining MUI `Table` + `Checkbox` + the existing `CustomPagination`, since no multi-select list precedent exists. Selection state (a `Set`/array of selected IDs across pages) is held in the flow container so checked state survives pagination within the same session. Enforce the max-10 rule at selection time (disable further checkboxes once 10 are selected, with an inline message) rather than only at submit time, to avoid a frustrating late rejection.

4. **Form step is Formik + Yup, one form per selected product plus a shared manufacturer/marketing section.** The `products-gazette-by-ids` response seeds `initialValues`; composition/specifications are Formik `FieldArray`s (add/remove rows) since content varies per product and must stay editable; `application_details.crop_name` may be a single object or an array (per the sample payloads) — normalize to an array internally for editing and un-normalize (collapse to a single object) on submit only if exactly one crop entry remains, to match the two shapes the backend accepts. The `is_manufacturer_marketing_same` toggle, when on, disables and mirrors the marketing fields from manufacturer values client-side; when off, marketing fields become independently editable — mirroring stops but last-mirrored values remain as a starting point.

5. **"Edit" after generation re-enters the same form step with the same Formik state**, not a re-fetch. The flow container keeps the last submitted payload (manufacturer/marketing/products_gazette) in memory; clicking "Edit" on the result step moves the stepper back to the form step pre-filled with that payload, and "Generate"/"Regenerate" re-POSTs to `label-pdf`. Only a fresh "Start new label" action clears state and returns to selection.

6. **New `label.service.ts` following the existing flat-function service convention** (as in `product.service.ts`), one exported function per endpoint: `FetchProductGazetteListService`, `FetchProductGazetteByIdsService`, `GenerateLabelPdfService`, `FetchLabelPdfHistoryService`.

## Risks / Trade-offs

- **[Risk]** `enabled_modules` is read from the user object stored at login time; if a company's modules are changed after the user last logged in, the menu won't reflect that until the next fresh login (the encrypted `localStorage` session isn't re-fetched mid-session). **Mitigation**: acceptable for v1 — matches how the rest of `userDetails` already behaves (no live refresh of any login-time field); revisit if this proves confusing in practice (e.g. force re-login on plan changes, or add an explicit "refresh permissions" action).
- **[Risk]** `application_details.crop_name` shape ambiguity (object vs array in sample payloads) could cause data loss on submit if not normalized carefully. **Mitigation**: explicit normalize-on-load / denormalize-on-submit step covered by a unit test for both shapes.
- **[Risk]** Losing in-progress edits on navigation/refresh (no draft persistence) could frustrate users filling a long form. **Mitigation**: accepted for v1 per Non-Goals; add a simple "unsaved changes" browser confirm-on-navigate as a cheap partial mitigation.
- **[Trade-off]** Building a bespoke checkbox-table instead of pulling in a table library (e.g. MUI DataGrid) keeps the bundle/pattern consistent with the rest of the app, at the cost of some boilerplate for selection-state-across-pages that a grid library would provide for free.

## Migration Plan

Additive only — no existing data, routes, or components are removed or changed. Rollout is a single frontend deploy once implementation + review are done; no feature flag needed beyond the existing `enabled_modules.label_system` check, which naturally limits exposure to companies with the module purchased. Rollback is a plain revert (no backend/data migration involved).

## Open Questions

None outstanding — resolved via the actual login response: `enabled_modules`, `company_id`, and `company_uuid` are confirmed present on `User` for at least the `superadmin` role; both `admin` and `company_admin` menu tables carry the `label-001` entry and are filtered by the same `hasLabelModule()` check.
