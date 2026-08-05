## Context

The QR form's "Section 2: Regulatory Details" (`src/pages/admin/qr/QRGenerate.tsx`) currently holds, in order: Gazette No. and Gazette Date (Biostimulants only), `biostimulant_title`, then `biostimulant_composition`, `crops`, `doses` and `application_method` (all hidden for Bio Pesticides). Every one of those is a plain `TextField` bound to a flat string on `FormValues`.

The regulator's dataset is reachable at `POST v1/products-gazette/list`, which takes `{offset, limit, product_name?}` and returns `body.data[]` where each entry carries `product_name`, `composition[{ingredient, content}]`, `specifications[{parameter, value}]`, `application_details{crop_name, dose}`, and nullable `gazette_no` / `gazette_date`. `filter_count` and `total_count` come back alongside. The app's request helper already prefixes `v1/`, so this slots in beside the existing `product.service.ts` exports with no client-axios work.

Three screens display this data: the form itself, the admin product/QR details view (`ProductDetails.tsx`), and the public scan page (`guest/product/index.tsx`). The public page reads `product_detail.biostimulant_composition` as a `string` on a locally-declared interface and renders it through `createDetailItem`, which drops falsy values.

The binding constraint, settled before design: **no backend change**. The structured arrays must round-trip through the existing `biostimulant_composition` string.

## Goals / Non-Goals

**Goals:**

- Make the official gazette record, not operator recall, the source of a biostimulant QR's title and composition.
- Keep the encode/decode contract in exactly one module, since three screens must agree on it byte-for-byte.
- Degrade safely on every QR created before this change — legacy prose must keep rendering.
- Absorb the polymorphic `dose` field without leaking `[object Object]` into printed labels.

**Non-Goals:**

- Adding API fields, or any backend/database change. Settled: JSON-in-existing-field.
- Applying the gazette lookup to any category other than Biostimulants. Bio Pesticides and everything else keep free-text titles.
- Migrating existing rows to the encoded format. Readers handle both shapes indefinitely.
- Caching or prefetching the gazette dataset — it is 285 records server-side and queried on demand.
- Editing composition/specification rows by hand. The tables are display-only, populated from the gazette.
- Making Application Method gazette-driven.

## Decisions

### Encode both arrays under a versioned envelope, sniff before parsing

`biostimulant_composition` must carry two arrays through a field typed as a string. The encoded form:

```json
{"__fmt":"gazette-v1","composition":[{"ingredient":"…","content":"21"}],"specifications":[{"parameter":"…","value":"6.00"}]}
```

The `__fmt` tag is what makes the fallback safe. Decoding is not "try `JSON.parse`, assume success means structured" — legacy prose could in principle parse as valid JSON (a bare number, or text that happens to be `null`), and a future format needs somewhere to branch. The decoder returns structured data only when the parse succeeds *and* `__fmt` matches *and* the arrays are actually arrays; anything else returns `{kind: 'text', value: raw}` and the caller renders prose.

Cheap pre-check before parsing: if the trimmed string does not start with `{`, it is text. This keeps the common legacy path off `JSON.parse` entirely.

*Alternative considered:* two separate fields by stuffing specifications into `application_method`. Rejected — it corrupts a field the admin still edits by hand.

*Alternative considered:* a bare `{composition, specifications}` object with no tag. Rejected — no way to distinguish "not our format" from "our format, empty", and no version handle for later.

### One module owns encode, decode, and dose flattening

`src/utils/gazette.ts` exports the encoder, the decoder, the dose normaliser, and the gazette entry types. All three screens import from it.

This is the whole reason the change is safe: a decoder that disagrees between the form and the public page produces a QR that looks right to the admin who made it and wrong to the farmer who scans it — the worst possible failure distribution, since the person who could notice never sees it.

### Normalise `dose` at the boundary, not at each render site

`application_details.dose` arrives as either a string or an object keyed by crop. Both real shapes appear in the sample response. The normaliser converts to a single display string at the point of gazette selection:

- string → used as-is
- object → `"Chilli: Two foliar applications at 750 ml/ha\nCucumber: One foliar application at 1 litre/ha"`
- null/undefined/empty object → `""`

Flattening at the boundary means `doses` stays a plain string, so the existing field, the existing payload key, and the existing public-page rendering all keep working untouched. The alternative — carrying the object through to render time — would force the same polymorphism check into three components and would need a new persisted field for the per-crop map.

The object branch must be an explicit `typeof === 'object'` check. `String(dose)` on an object yields `[object Object]`, which would be printed onto a physical label before anyone noticed.

### Server-side search, debounced, with a race guard

The dataset is 285 records and the endpoint already filters by `product_name`, so search goes to the server rather than fetching everything and filtering in the browser.

- Open with `{offset: 0, limit: 5}` — the "default only 5" requirement.
- On input, debounce ~400ms, then send `{offset: 0, limit: 20, product_name: <input>}`.
- Track the latest request; discard responses that arrive after a newer request was issued. Without this, a slow response for "Bio" can land after a fast one for "Bioventa" and repopulate the list with the wrong options — the classic autocomplete race, and one that surfaces only on slow connections.

Debounce and the in-flight guard live in the component via a ref, not in the service.

### Restrict selection with a controlled Autocomplete, not `freeSolo`

For Biostimulants the field is a plain (non-`freeSolo`) `Autocomplete` whose `value` is the selected gazette entry object. MUI then structurally prevents committing unlisted text — typed input that matches nothing simply leaves `value` null, and the existing Yup `required` on the title produces the error. No extra validation branch is needed.

The form keeps `biostimulant_title` as a string. The selected gazette object is held in separate component state; only its `product_name` is written to the Formik field. This keeps `FormValues` and the submit payload exactly as they are.

*Alternative considered:* `freeSolo` with a post-hoc "must match a gazette entry" validator. Rejected — it lets the invalid state exist and then complains, rather than making it unreachable.

### Category branch stays derived, not stored

The form already computes `isBiostimulantCategory` from the selected product on every render. The title field branches on that same value: Autocomplete when true, the existing `TextField` when false. Nothing new is stored, and switching product category swaps the control naturally on re-render.

One consequence to handle deliberately: switching *away* from a Biostimulants product leaves previously auto-filled composition/specifications in state. Clear the gazette selection and the structured arrays when the selected product's category stops being Biostimulants, otherwise a Bio Pesticides QR would silently submit an encoded composition it never displayed.

### Read-only tables, rendered from a shared shape

The tables are display-only — no add/remove/edit rows. On the form the composition `TextField` is replaced by a table when structured data is present, and falls back to the existing multiline field when it is not (legacy edit, or a category with no gazette backing).

Use MUI `Table` inside a `Box` with `overflowX: 'auto'` so a long ingredient name scrolls within the table rather than pushing the page sideways — the public page is predominantly read on phones.

## Risks / Trade-offs

- **Encoded JSON is visible if any surface renders the raw field** → Every consumer of `biostimulant_composition` must go through the decoder. The audit is bounded: three screens, greppable by field name. Task 5.2 checks it explicitly.
- **`dose` object flattened to text loses per-crop structure in storage** → Accepted. Preserving it would need a persisted field that does not exist. The flattened string names every crop and dose, so nothing is lost to the reader.
- **The strict Autocomplete blocks titles absent from the gazette dataset** → This is the requested behaviour and the point of the change, but it means a biostimulant not yet in the dataset cannot get a QR. Flagging explicitly: if that case is real, it needs a decision, and the fallback would be re-enabling `freeSolo` for Biostimulants.
- **285-record dataset queried per keystroke-pause** → Debounce plus `limit: 20` keeps this modest. No caching layer; if it proves chatty, memoising by query string is a contained follow-up.
- **Legacy prose that happens to start with `{`** → Handled by the `__fmt` check rather than the cheap prefix sniff; the sniff is only an optimisation, never the sole decision.
- **A future backend that adds real fields makes the encoding vestigial** → The `__fmt` tag and the single-module boundary make that migration a decoder change plus a writer change, not a search across three screens.

## Migration Plan

Frontend-only deploy; rollback is a revert. No data migration — existing rows stay plain text and render through the fallback path indefinitely. QRs created after the deploy carry the encoded field; if the change is reverted, those rows render their raw JSON on the public page, so a revert after any encoded QR exists should be paired with either re-deploying the decoder or manually clearing those rows.

## Open Questions

- What should happen when a biostimulant genuinely is not in the gazette dataset? Current design blocks QR creation for it. Raised as a risk above; no fallback path is built.
- Should the composition table be editable after auto-fill? Treated as display-only here, on the reading that the value of this change is fidelity to the official record.
