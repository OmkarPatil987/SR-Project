## Why

The `v1/company/register` (guest) and `v1/company/create` (admin) APIs already accept a `logo` file and an `enabled_modules` object (`qr_system`, `label_system.label_with_qr`, `label_system.label_without_qr`), but neither the guest registration form nor the admin "Create Company" form collects or submits them. Every company is therefore onboarded with no logo and no module configuration, forcing manual backend/DB edits before a company can use the Label system or have its branding shown anywhere in the admin UI.

## What Changes

- Add a logo image upload field (with preview) to the guest registration form (`src/pages/guest/company/CompanyRegister.tsx`) and the admin **Create** Company form (`src/pages/admin/companies/CreateCompnay.tsx`, `isEdit === false` path only).
- Add an "Enabled Modules" section (QR System toggle; Label System toggle with `Label with QR` / `Label without QR` sub-toggles) to both create-time forms, serialized to the `enabled_modules` JSON shape already defined by `EnabledModules`/`LabelSystemModules` in `src/utils/dto/response/auth.ts`.
- **BREAKING (internal only)**: convert company register/create submissions from JSON-body POSTs to multipart `FormData` POSTs, since a binary `logo` file must ride alongside the other fields. `enabled_modules` is appended as a JSON-stringified field, matching the reference `curl` payloads.
- Add a typed request DTO for the company create/register payload (reusing `EnabledModules`) instead of the current `payload: any` services.
- Update `StoreCompanyService` and `RegisterCompanyService` (`src/utils/services/product.service.ts`) to send `Content-Type: multipart/form-data`, following the existing pattern in `ngo.registration.service.ts`. `UpdateCompanyService` is left untouched (see Out of scope) — it stays a plain JSON POST.
- Extend the Yup validation schemas on both forms with an optional `logo` file field (size/mime-type checks) and default `enabled_modules` toggle state.

## Capabilities

### New Capabilities
- `company-logo-upload`: Image logo selection, client-side validation, preview, and multipart submission on the guest register and admin create/edit company forms.
- `company-module-configuration`: UI to select which modules (`qr_system`, `label_system.label_with_qr`, `label_system.label_without_qr`) are enabled for a company at register/create/edit time, and serialization of that selection into the `enabled_modules` request field.

### Modified Capabilities
- None — no existing `openspec/specs/` capability covers company registration/creation today (the prior `label-management` change explicitly left these forms untouched), so both capabilities above are new rather than deltas.

## Impact

- **Affected components**: `src/pages/guest/company/CompanyRegister.tsx`, `src/pages/admin/companies/CreateCompnay.tsx`.
- **Affected services**: `src/utils/services/product.service.ts` (`StoreCompanyService`, `UpdateCompanyService`, `RegisterCompanyService` — company endpoints currently live in this file, not a dedicated `company.service.ts`).
- **New/affected DTOs**: new company request DTO (reusing `EnabledModules`/`LabelSystemModules` from `src/utils/dto/response/auth.ts`); no changes to the existing response DTOs.
- **Out of scope**: editing an existing company's logo/modules is not covered by this change. `src/pages/admin/companies/CreateCompnay.tsx`'s `isEdit === true` path and `src/pages/admin/profile/CompanyProfile.tsx` (company_admin self-service profile editor) both submit through the shared `UpdateCompanyService`, which stays a plain JSON POST — switching it to multipart would break `CompanyProfile.tsx`'s unrelated JSON payload. A follow-up change should introduce a dedicated multipart update path if editing logo/modules is needed later. Backend API behavior is unchanged — both fields are already accepted server-side per the provided `curl` references.
