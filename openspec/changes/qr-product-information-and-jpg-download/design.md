## Context

The QR feature spans four React screens, all client-side, all talking to the same `product.service` endpoints:

- `src/pages/admin/qr/QRGenerate.tsx` — the generate/edit form. The multiline free-text field renders under the heading `QR Description` and binds to Formik key `description`. Category logic already hides it for Bio Pesticides (GTIN + Web Link show instead) and blanks `description` in the submit payload for that category.
- `src/pages/guest/product/index.tsx` — the public scan page. Renders `product_detail.description` through `createDetailItem('Product Description', …)`, which returns `null` for empty values so blank rows are already suppressed.
- `src/pages/admin/qr/StaticList.tsx` and `src/pages/admin/qr/DynamicQr.tsx` — the QR inventories. Each has a near-identical `loadImageAsBase64` helper (`StaticList.tsx` exports its copy; `DynamicQr.tsx` keeps a private duplicate) and a download handler that builds an 80×100mm `jsPDF`, places the QR at 50×50mm, and calls `doc.save(…)`.
- `src/pages/admin/products/Components/ProductDetails.tsx` — the batch QR action menu, running the same jsPDF recipe against `batch.qr_codes[0].qr_path` and importing `loadImageAsBase64` from `StaticList.tsx`.

The two changes are independent: one is a label-text edit across two files, the other replaces the download pipeline in three files. Neither touches the API.

Constraints worth naming up front: `qr_path` is a remote URL on a different origin than the app, and the QR artwork is served as PNG — which may carry an alpha channel. Both facts drive the decisions below.

## Goals / Non-Goals

**Goals:**

- Present the free-text QR field as "Product Information" on both the admin form and the public scan page, with no change to the wire format.
- Make every QR download produce a `.jpg` image of the artwork, with the same loading/success/error affordances users have today.
- Keep the JPG conversion in one place rather than pasting a canvas dance into three components.
- Preserve scannability of the downloaded image — a QR that will not scan is a silent, expensive failure.

**Non-Goals:**

- Renaming the `description` field in the API, database, or DTO types. The rename is presentation-only; `src/utils/dto/response/*.type.ts` keeps `description`.
- Offering a format choice. The decision is to replace PDF, not add a second option — no menu, no toggle.
- Removing `jspdf` from `package.json`, or touching the PDF generation in the label-management flow.
- Consolidating the duplicated `loadImageAsBase64` between `StaticList.tsx` and `DynamicQr.tsx` beyond what the new shared helper naturally absorbs.
- Server-side image generation or any change to how `qr_path` is produced.

## Decisions

### Convert client-side via canvas, not by renaming the fetched file

The QR source is a PNG. A JPG download therefore requires a real re-encode, not just a changed extension — writing PNG bytes to a `.jpg` file produces a file many print/design tools reject.

The pipeline: reuse the existing `loadImageAsBase64(qr_path)` to fetch the artwork as a data URL, load that data URL into an `Image`, draw it onto a `<canvas>`, and read back `canvas.toDataURL('image/jpeg', quality)`. Trigger the save with a synthetic `<a download>` click.

*Alternative considered:* fetch the blob and re-encode with a library (e.g. `browser-image-compression`). Rejected — a new dependency for something the canvas API does in ten lines.

*Alternative considered:* ask the backend to serve a JPG variant. Rejected as out of proportion for this change and it would need backend coordination the proposal explicitly avoids.

### Route the image through a data URL to sidestep canvas tainting

`qr_path` is cross-origin. Setting `img.src = qr_path` directly and then calling `toDataURL()` throws a `SecurityError` on a tainted canvas unless the remote host sends permissive CORS headers — which we do not control and must not assume.

Going through `loadImageAsBase64` first means the `Image` is fed a `data:` URL, which is same-origin by definition, so the canvas is never tainted. This is the single most important implementation detail in the change: it is why the existing helper is reused rather than bypassed, and it is easy to "simplify" into a bug later.

The `fetch` inside `loadImageAsBase64` still needs the remote host to permit the request. That is already true of today's PDF path, so this introduces no new network requirement.

### Fill the canvas white before drawing

JPG has no alpha channel. Compositing a transparent PNG onto an unfilled canvas flattens transparent pixels to **black** — for a QR code whose quiet zone and background are typically transparent, that inverts the image and can render it unscannable.

The helper fills the canvas with `#FFFFFF` before `drawImage`. This is covered by the "Downloaded image preserves scan integrity" scenario in the spec and should not be dropped as a cosmetic detail.

### Encode at quality 1.0 at native resolution

QR codes are high-contrast line art — exactly the content JPEG's chroma subsampling degrades worst, and artifacts around module edges cost scan reliability. Encode at quality `1.0` and size the canvas to the source image's `naturalWidth`/`naturalHeight` so no downscaling occurs. File size is irrelevant at QR dimensions.

*Alternative considered:* upscale to a fixed print size (e.g. 1000×1000). Rejected — interpolation cannot add real detail, and the source resolution is what the backend deemed sufficient.

### Put the helper next to `loadImageAsBase64`, exported from a shared module

Three call sites need identical behaviour. Rather than import from `StaticList.tsx` (which `ProductDetails.tsx` already does — a page component importing from another page component), move `loadImageAsBase64` and the new `downloadQrAsJpg` into a small shared utility module under `src/utils/`, and have all three screens import from there. `StaticList.tsx` re-exports nothing; its local duplicate and `DynamicQr.tsx`'s private copy both go away.

The helper owns fetch → decode → canvas → encode → save and reports failure by throwing, leaving each screen to own its own snackbar copy and `downloadingId` state — matching how those screens already handle it.

*Alternative considered:* leave the helper in `StaticList.tsx` and import it from there. Rejected — it entrenches an existing structural wart across one more file.

### Rename labels only where they are rendered

`QRGenerate.tsx` carries the string in a `Typography` heading above the field; `guest/product/index.tsx` carries it as the first argument to `createDetailItem`. Both are plain string literals with no i18n layer, so both are one-line edits. The Formik key, the Yup schema, the payload construction in `handleSubmit`, and the response DTOs all keep `description`.

## Risks / Trade-offs

- **Canvas tainting reintroduced by a later refactor** → The data-URL indirection looks redundant to anyone reading the helper cold. Comment the reason at the point of use, and keep the fetch-then-decode order intact.
- **Transparent PNG flattens to black if the white fill is dropped** → Same class of risk; the fill is load-bearing, not decorative. Verify by downloading a real QR and scanning the saved file, not by eyeballing a thumbnail.
- **JPEG artifacts reduce scan reliability** → Mitigated by quality 1.0 at native resolution. Acceptance testing must include an actual phone scan of a downloaded `.jpg`, since a visually fine image can still fail at the edges of a scanner's tolerance.
- **Users who relied on the PDF lose it** → This is the requested behaviour and is flagged BREAKING in the proposal. The PDFs carried only the QR image plus a batch line, so nothing beyond the artwork itself is lost. Worth a heads-up to whoever consumes these downloads before release.
- **`jspdf` becomes unreferenced in `src/`** → Left installed on purpose. A later cleanup can remove it; doing so here would widen the blast radius of a UI change.
- **Older browsers lacking `canvas.toDataURL('image/jpeg')`** → Universally supported in every browser this admin app targets; no fallback planned.

## Migration Plan

No data migration, no API version bump, no feature flag. The change ships as a normal frontend deploy; rollback is a revert of the commit. The only user-visible discontinuity is the download format, which takes effect immediately on deploy for all users.

## Open Questions

- Should the downloaded filename include the batch number or date to disambiguate multiple QRs for the same product? The spec requires only that the identifying name be present; current behaviour (`{product_name}_QR`) is carried forward unless someone asks for more.
