## Context

`CompanyRegister.tsx` (guest, public) and `CreateCompnay.tsx` (admin, authenticated) both build a plain-object payload with Formik and POST it as JSON to `v1/company/register` / `v1/company/create` via `RegisterCompanyService` / `StoreCompanyService` in `src/utils/services/product.service.ts` (company endpoints currently live in the *product* service file — there is no dedicated `company.service.ts`). Neither form collects `logo` (file) or `enabled_modules` (nested boolean flags), even though the backend already accepts both — confirmed by the reference `curl` payloads for both endpoints.

`enabled_modules` already has a formal shape on the **response** side: `EnabledModules` / `LabelSystemModules` in `src/utils/dto/response/auth.ts`, consumed today only by `hasLabelModule()` in `src/utils/permission/index.ts` to gate the Label sidebar menu. There is currently no UI anywhere that lets a human set this value — it's read-only, presumably seeded directly in the DB/backend. This change adds the first UI surface that can *set* it.

`UpdateCompanyService` (`v1/company/update`) is shared by two unrelated call sites: `CreateCompnay.tsx`'s edit path and `CompanyProfile.tsx`'s company_admin self-service editor. Both currently send plain JSON. This change does not touch that endpoint at all (see Non-Goals) to avoid a multipart/JSON mismatch breaking `CompanyProfile.tsx`.

The codebase already has a proven multipart pattern to copy: `ngo.registration.service.ts` (`{ 'Content-Type': 'multipart/form-data' }` passed as the 4th arg to `handlePostRequest`) and `AddGlobalMediaStore.tsx` (manual `new FormData()` + `.append()`, Formik + Yup `Yup.mixed<File>()` file validation, `react-dropzone` for selection).

## Goals / Non-Goals

**Goals:**
- Let a guest registering a company, and an admin creating a company, attach a logo image and choose which modules (`qr_system`, `label_system.label_with_qr`, `label_system.label_without_qr`) are enabled.
- Submit both new fields alongside existing fields in a single multipart request, matching the reference `curl` payloads exactly (field names, JSON-stringified `enabled_modules`).
- Introduce a typed request DTO for this payload so the shape is enforced at compile time instead of `payload: any`.
- Keep the change additive/localized: no other form, service, or consumer of `StoreCompanyService`/`RegisterCompanyService` exists today, so converting these two functions to multipart has no other blast radius.

**Non-Goals:**
- Editing logo/`enabled_modules` on an existing company (`CreateCompnay.tsx` edit mode or `CompanyProfile.tsx`) — out of scope, left for a follow-up change once a multipart-safe update path is designed.
- Changing `hasLabelModule()` or any permission-gating logic — this change only adds a way to *set* `enabled_modules` at creation time; the read/gate side is unchanged.
- Backend changes — both endpoints already accept these fields per the provided `curl` examples.
- Letting a guest self-registrant bypass admin approval by enabling modules — the existing `ApproveCompanyService` approval workflow (`src/pages/admin/companies/index.tsx`) is unchanged; a self-selected `enabled_modules` on a pending registration is still subject to admin approval before the company is active, same as every other field on that form today.

## Decisions

**1. Shared FormData-building helper, not a shared component, for the two forms.**
`CompanyRegister.tsx` and `CreateCompnay.tsx` have different validation rules (captcha/honeypot vs `is_active`) and are unlikely to ever merge into one component. Rather than force a shared `<CompanyForm>` component (large refactor, high risk for this change's scope), add a small pure helper — `buildCompanyFormData(values: CompanyRequestPayload): FormData` — colocated with the new DTO, used by both pages. Keeps the diff additive and localized.
- *Alternative considered*: unify both pages into one shared form component. Rejected — bigger blast radius than requested, and the two forms already diverge (anti-bot fields, `is_active`), so unifying would be a separate refactor proposal.

**2. New DTO file `src/utils/dto/request/company.ts`.**
`src/utils/dto` currently only has a `response/` subfolder; there's no `request/` convention yet. Introduce `src/utils/dto/request/company.ts` exporting:
```ts
import { EnabledModules } from "../response/auth";

export interface CompanyRequestPayload {
    company_name: string;
    email: string;
    mobile: string;
    state: string;
    city: string;
    pincode: string;
    address: string;
    license_no?: string;
    gst_no?: string;
    pan_no?: string;
    bank_account_no?: string;
    bank_ifsc_code?: string;
    referral_name?: string;
    logo?: File | null;
    enabled_modules: EnabledModules;
}

export interface CompanyRegisterPayload extends CompanyRequestPayload {
    session_id: string;
    captcha_answer: number;
    form_load_time: number;
    honeypot: string;
}
```
Reusing `EnabledModules` from the response DTO (rather than redefining it) keeps the set/read shapes guaranteed identical.
- *Alternative considered*: inline the type in each page component (status quo). Rejected — the whole point of this change is to stop the `payload: any` drift; a shared, importable type is required for both forms to serialize `enabled_modules` identically.

**3. `enabled_modules` UI defaults to `qr_system: true` unchecked-by-default for label toggles.**
Per the reference `curl`s, `qr_system` is `true` and label toggles are the differentiator. Default state: `qr_system` checked (matches existing baseline behavior before this change, where presumably all companies had at least QR), `label_with_qr`/`label_without_qr` unchecked, and the two label sub-toggles are mutually exclusive (radio-like behavior within the Label System group) since a label is either printed with or without a QR code, not both — checking one unchecks the other. This mirrors how `hasLabelModule()` treats either flag as "Label enabled," so the UI should make the two variants an explicit choice rather than lettings both be true simultaneously by accident.
- *Alternative considered*: independent checkboxes allowing both label flags true at once. Rejected — no described use case needs "both," and `hasLabelModule()`'s OR-based check means an accidental double-select silently does the same thing as either alone, hiding a UI bug. A mutually-exclusive control is cheap here and avoids that failure mode.

**4. Logo field is optional on both forms, image-only, size-capped, with `react-dropzone` + inline `<img>` preview.**
No image = omit the `logo` key entirely from `FormData` (`ngo.registration.service.ts`'s callers already do this — don't append undefined/null values). Validation follows `AddGlobalMediaStore.tsx`'s Yup pattern: `Yup.mixed<File>().nullable().test('fileSize', ...).test('fileType', ...)`, restricted to `image/png`, `image/jpeg`, `image/webp`, capped at 2 MB (consistent with typical logo-upload limits; no backend limit was specified, so this is a conservative client-side guard — backend still enforces its own limit).
- *Alternative considered*: require logo on both forms. Rejected — neither reference `curl` marks it required, and forcing a guest to have a logo ready at signup time is an unnecessary conversion-funnel blocker; making it optional matches current server behavior (endpoint already works without it in practice, since no company has ever supplied one).

**5. `StoreCompanyService`/`RegisterCompanyService` unconditionally send multipart; `UpdateCompanyService` is untouched.**
These two functions have exactly one caller each (`CreateCompnay.tsx` create path, `CompanyRegister.tsx`), so switching their `Content-Type` unconditionally is safe. `UpdateCompanyService` has two callers with incompatible payload shapes today (see Context) — left alone entirely, matching the proposal's Non-Goal on editing.
- *Alternative considered*: make headers a parameter on all three service functions so callers opt in per-call. Rejected as unnecessary — only `Store`/`Register` need to change, and adding a headers passthrough to `Update` too would invite a future caller to accidentally break `CompanyProfile.tsx` again. Keep the fix minimal and scoped to what actually changes.

## Risks / Trade-offs

- **[Risk] Backend field-name/casing mismatch for `logo`/`enabled_modules` on the two endpoints diverges from the `curl` reference at implementation time** → Mitigation: implementation must be verified against a real backend call (not just typechecking) before considering the tasks done; use the exact reference `curl`s as the acceptance check.
- **[Risk] Guest self-registrants could enable modules (e.g. Label system) they haven't been sold/approved for, since `enabled_modules` becomes self-selectable on the public form** → Mitigation: this is unchanged from today's approval-gated flow — `ApproveCompanyService` still gates activation, and enabling this is explicitly what the reference `curl` for the public endpoint demonstrates the backend supports; if product wants to restrict this, that's a backend/business-rule decision outside this change's scope (flagged as an Open Question below).
- **[Risk] FormData field ordering/`Content-Type` boundary issues with axios + JSON-stringified nested field (`enabled_modules`) causing a parsing mismatch server-side** → Mitigation: follow the exact `ngo.registration.service.ts` header pattern and `AddGlobalMediaStore.tsx` FormData-building pattern already proven to work against this backend; do not hand-roll a new multipart approach.
- **[Trade-off] Two near-duplicate Yup schemas (guest vs admin) still won't be unified by this change** → accepted per Decision 1; unifying is a separate, larger refactor.

## Migration Plan

1. Add `CompanyRequestPayload`/`CompanyRegisterPayload` DTOs and `buildCompanyFormData` helper (no behavior change yet, additive files only).
2. Update `StoreCompanyService`/`RegisterCompanyService` to send multipart (safe — single caller each, currently unused fields simply weren't being sent before).
3. Add the logo + enabled-modules UI to `CreateCompnay.tsx` (create path only) and wire submission through the new DTO/helper.
4. Add the same UI to `CompanyRegister.tsx` and wire submission.
5. Manual verification against a running backend using the reference `curl`s as the contract to match (per `verify` skill — exercise both forms end-to-end, not just typecheck/build).

**Rollback**: each step is an independent, additive commit to already-isolated files (two page components + one new DTO file + two service functions with single callers); reverting any subset does not affect unrelated flows (`UpdateCompanyService`/`CompanyProfile.tsx` are never touched).

## Open Questions

- Should guest self-registration be allowed to choose `enabled_modules` at all, or should the public form omit that section and always send a fixed default (e.g. `qr_system: true` only), leaving module upsell to a human sales/approval process? The reference `curl` for the public endpoint includes it, so this design assumes it's intentional — confirm with product/business owner before implementation if this seems surprising.
- Is there a backend-enforced max file size / dimensions for `logo`? This design picks a conservative 2 MB client-side cap in the absence of a specified limit — adjust if the backend documents a different value.
