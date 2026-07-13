## 1. DTOs and shared helper

- [x] 1.1 Create `src/utils/dto/request/company.ts` exporting `CompanyRequestPayload` and `CompanyRegisterPayload`, reusing `EnabledModules`/`LabelSystemModules` from `src/utils/dto/response/auth.ts`.
- [x] 1.2 Add `buildCompanyFormData(values: CompanyRequestPayload): FormData` in the same file (or a colocated helper file), appending all text fields, `logo` only when present, and `enabled_modules` as `JSON.stringify(...)`.

## 2. Services

- [x] 2.1 Update `StoreCompanyService` in `src/utils/services/product.service.ts` to send `Content-Type: multipart/form-data`, following the `ngo.registration.service.ts` pattern.
- [x] 2.2 Update `RegisterCompanyService` in `src/utils/services/product.service.ts` to send `Content-Type: multipart/form-data`.
- [x] 2.3 Confirm `UpdateCompanyService` is left unchanged (still plain JSON) — no edit required, verify no accidental diff.

## 3. Admin Create Company form (`src/pages/admin/companies/CreateCompnay.tsx`)

- [x] 3.1 Add logo field (dropzone-based selection + `<img>` preview + remove action) to the form, shown only when `isEdit === false`.
- [x] 3.2 Add "Enabled Modules" section (QR System toggle, Label System toggle revealing mutually-exclusive "Label with QR"/"Label without QR" sub-options), shown only when `isEdit === false`.
- [x] 3.3 Validate `logo` (type/size) — implemented via `react-dropzone`'s `accept`/`maxSize` options and a rejected-file snackbar, instead of a Formik/Yup `logo` field, so the file selection can live in local state outside Formik's `<Formik>` render-prop (avoids calling `useDropzone` inside a render-prop child). Behavior matches the spec (image-only, 2MB cap, optional).
- [x] 3.4 Wire submission for the create path to build `CompanyRequestPayload`, convert via `buildCompanyFormData`, and call `StoreCompanyService(formData)`; leave the edit path's `UpdateCompanyService(values)` call untouched (module toggle fields stripped out of the edit payload).

## 4. Guest Register form (`src/pages/guest/company/CompanyRegister.tsx`)

- [x] 4.1 Add logo field (dropzone-based selection + `<img>` preview + remove action).
- [x] 4.2 Add "Enabled Modules" section (QR System toggle, Label System toggle revealing mutually-exclusive "Label with QR"/"Label without QR" sub-options).
- [x] 4.3 Validate `logo` (same `react-dropzone` `accept`/`maxSize` approach as the admin form — see 3.3 note).
- [x] 4.4 Wire submission to build `CompanyRegisterPayload` (existing `session_id`/`captcha_answer`/`form_load_time`/`honeypot` fields plus the new `logo`/`enabled_modules`), convert via `buildCompanyFormData`, and call `RegisterCompanyService(formData)`.

## 5. Verification

- [x] 5.1 Run typecheck/build (`tsc --noEmit`, `react-scripts build`) to confirm no type errors from the new DTOs/services — both pass; the only ESLint warnings in the build output are pre-existing ones in unrelated files, plus two pre-existing `react-hooks/exhaustive-deps` warnings on effects this change didn't touch.
- [ ] 5.2 Manually exercise the admin create-company form end-to-end against a running backend: submit with and without a logo, with different module toggle combinations, and confirm the request matches the reference `curl` shape (field names, JSON-stringified `enabled_modules`). **Not run** — no backend was available in this environment; needs a live `v1/company/create` endpoint to verify.
- [ ] 5.3 Manually exercise the guest registration form end-to-end the same way, including the existing captcha/honeypot flow still working after the JSON→multipart change. **Not run** — same backend-availability constraint as 5.2.
- [ ] 5.4 Confirm the admin edit-company path (`isEdit === true`) and `CompanyProfile.tsx` are unaffected — no logo/module fields shown, `UpdateCompanyService` still sends JSON, both save successfully. **Not run** — same constraint; code review confirms the edit path strips the new fields and calls `UpdateCompanyService` unchanged (src/pages/admin/companies/CreateCompnay.tsx handleSubmit), and `CompanyProfile.tsx` was not touched by this change.
