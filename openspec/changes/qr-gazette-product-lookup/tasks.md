## 1. Service binding and shared module

- [ ] 1.1 Add `FetchProductsGazetteListService = (payload: any) => handlePostRequest<any>('v1/products-gazette/list', payload, CMRF_NGO_ADMIN_SERVER)` to `src/utils/services/product.service.ts`.
- [ ] 1.2 Create `src/utils/gazette.ts` with types for a gazette entry: `product_name`, `composition[{ingredient, content}]`, `specifications[{parameter, value}]`, `application_details{crop_name, dose}`, nullable `gazette_no` / `gazette_date`.
- [ ] 1.3 Add `flattenDose(dose: unknown): string` — string passes through; object becomes newline-joined `"<crop>: <dose>"` lines via an explicit `typeof === 'object'` check; null/undefined/empty object returns `""`. Must never emit `[object Object]`.
- [ ] 1.4 Add `encodeComposition({composition, specifications}): string` producing the `{"__fmt":"gazette-v1", …}` envelope. Return `""` when both arrays are empty, so an empty payload stays empty rather than storing a hollow envelope.
- [ ] 1.5 Add `decodeComposition(raw)` returning a discriminated result: structured only when the trimmed string starts with `{` **and** parses **and** `__fmt === 'gazette-v1'` **and** both members are arrays; otherwise `{kind: 'text', value: raw}`. Never throws.
- [ ] 1.6 Add a comment on the decoder explaining why the `__fmt` check exists and not just `JSON.parse` success — legacy prose can parse as valid JSON, and a silent wrong branch here corrupts the public page.

## 2. Gazette Autocomplete on the QR form

- [ ] 2.1 In `src/pages/admin/qr/QRGenerate.tsx`, add state for gazette options, the selected gazette entry, and a loading flag.
- [ ] 2.2 Fetch `{offset: 0, limit: 5}` when the Biostimulants title field first opens — the "default only 5" requirement.
- [ ] 2.3 Add a ~400ms debounced input handler sending `{offset: 0, limit: 20, product_name: <input>}`; map `body.data` to options labelled by `product_name`.
- [ ] 2.4 Add an in-flight request guard (ref holding the latest query) and discard responses that arrive after a newer request — prevents a slow "Bio" response overwriting a fast "Bioventa" one.
- [ ] 2.5 Render the title as a non-`freeSolo` controlled `Autocomplete` when `isBiostimulantCategory`, so unlisted text can never be committed; keep the existing `TextField` for every other category.
- [ ] 2.6 Handle empty results with an empty-results message and no error snackbar; on request failure clear the loading state and leave the rest of the form usable.

## 3. Auto-fill on selection

- [ ] 3.1 On selection, write the entry's `product_name` into the Formik `biostimulant_title` field and hold the full entry in component state.
- [ ] 3.2 Populate `crops` from `application_details.crop_name` and `doses` from `flattenDose(application_details.dose)`; both stay editable.
- [ ] 3.3 Populate `gazette_notification_number` / `gazette_notification_date` only when the record's values are non-null — do not clear what the admin already typed.
- [ ] 3.4 Leave `application_method` untouched by auto-fill.
- [ ] 3.5 Replace composition/specifications state wholesale when a different entry is selected.
- [ ] 3.6 Clear the gazette selection and both structured arrays when the selected product's category stops being Biostimulants, so a non-biostimulant QR cannot submit an encoded composition it never showed.
- [ ] 3.7 On edit load, run `decodeComposition` on the fetched `biostimulant_composition` and repopulate the tables when structured; leave the multiline text field in place when legacy.

## 4. Section 2 reorder and tables

- [ ] 4.1 Move the title field to the top of "Section 2: Regulatory Details", above Gazette No. / Gazette Date; reorder the rest below it.
- [ ] 4.2 Confirm the reorder preserves the category rules — Gazette No./Date still Biostimulants-only, composition/crops/doses/application method still hidden for Bio Pesticides.
- [ ] 4.3 Build a reusable read-only table component rendering `[{key, value}]` pairs with configurable column headers, wrapped in a `Box` with `overflowX: 'auto'`.
- [ ] 4.4 On the QR form, render composition as an Ingredient/Content table and specifications as a Parameter/Value table when structured data is present; fall back to the existing multiline `TextField` when it is not.
- [ ] 4.5 Render nothing — no heading, no empty table — when there is no structured data and no legacy text.
- [ ] 4.6 In `handleSubmit`, set `biostimulant_composition` to `encodeComposition(...)` when structured data is present, preserving the existing text value otherwise. Add no new payload keys.
- [ ] 4.7 Confirm the existing Bio Pesticides branch still blanks `biostimulant_composition`, `crops`, `doses` and `application_method` on submit.

## 5. Display surfaces

- [ ] 5.1 In `src/pages/guest/product/index.tsx`, decode `biostimulant_composition` and render the two tables; keep legacy prose rendering through the existing `createDetailItem` path.
- [ ] 5.2 Grep every read of `biostimulant_composition` across `src/` and confirm each goes through `decodeComposition` — a missed one prints raw JSON to a consumer.
- [ ] 5.3 Widen the local `ProductDetail.biostimulant_composition` typing in the public page as needed, without changing the wire contract.
- [ ] 5.4 Render the same two tables in the admin QR details view (`src/pages/admin/products/Components/ProductDetails.tsx`).
- [ ] 5.5 Verify both tables stay legible on a narrow viewport and scroll within themselves rather than pushing the page sideways.

## 6. Verify

- [ ] 6.1 `npx tsc --noEmit` and `npm run build` clean, with no new warnings on touched files.
- [ ] 6.2 Unit-check `flattenDose` against all four shapes — string, per-crop object, null, empty object — asserting no `[object Object]`.
- [ ] 6.3 Unit-check `decodeComposition` against: a valid envelope, legacy prose, prose that happens to start with `{`, valid JSON without `__fmt`, an envelope whose members are not arrays, and `""`.
- [ ] 6.4 Round-trip check: `decodeComposition(encodeComposition(x))` returns `x` for a populated record and for empty arrays.
- [ ] 6.5 Manual — select a Biostimulants product, open the title field, confirm exactly 5 default options.
- [ ] 6.6 Manual — type "Bioventa", confirm one request fires after the pause (not per keystroke) carrying `product_name`, and options update.
- [ ] 6.7 Manual — select the seaweed record from the sample response (per-crop dose object) and confirm Doses shows both crops readably.
- [ ] 6.8 Manual — type unlisted text without selecting, submit, and confirm the title required-error appears and nothing is committed.
- [ ] 6.9 Manual — switch the product to a non-Biostimulants category and confirm the title reverts to free text and no encoded composition is submitted.
- [ ] 6.10 Manual — save a gazette-backed QR, reopen it for edit, and confirm the tables repopulate.
- [ ] 6.11 Manual — open the public scan page for that QR and confirm both tables render with correct columns.
- [ ] 6.12 Manual — open the public scan page for a QR created **before** this change and confirm its prose composition still renders, with no JSON and no empty table.
