## 1. Label rename to "Product Information"

- [x] 1.1 In `src/pages/admin/qr/QRGenerate.tsx`, change the field heading above the multiline `description` input from "QR Description" to "Product Information". Leave the Formik key, Yup schema, and `handleSubmit` payload untouched.
- [x] 1.2 In `src/pages/guest/product/index.tsx`, change `createDetailItem('Product Description', product_detail.description)` to use the label "Product Information".
- [x] 1.3 Grep `src/` for any remaining "QR Description" / "Product Description" strings tied to this field and update or confirm they are unrelated.
      → Found a real coupling at `guest/product/index.tsx:304`: the link-rendering branch matched on the literal `item.label === 'Product Description'`. Updated to `'Product Information'`; without this the field would have silently lost clickable-link rendering.
- [x] 1.4 Confirm no DTO or service type is touched — `description` remains the key in `src/utils/dto/response/*.type.ts` and in the store/update QR payloads.
      → Confirmed. The QR/product types are local interfaces in `guest/product/index.tsx`; the only `description` in `src/utils/dto` is `flood-relief.type.ts`, unrelated.

## 2. Shared JPG download helper

- [x] 2.1 Create `src/utils/qrDownload.ts` and move `loadImageAsBase64` into it (from `src/pages/admin/qr/StaticList.tsx`), keeping its current fetch → `FileReader.readAsDataURL` behaviour.
- [x] 2.2 Add `downloadQrAsJpg(qrPath: string, fileName: string): Promise<void>` to the same module: fetch via `loadImageAsBase64`, load the resulting **data URL** into an `Image`, await decode, then draw to canvas.
- [x] 2.3 Size the canvas to the image's `naturalWidth`/`naturalHeight`, fill it with `#FFFFFF` **before** `drawImage`, and encode with `toDataURL('image/jpeg', 1.0)`.
- [x] 2.4 Save via a synthetic `<a download>` click, ensuring the filename ends in `.jpg`.
- [x] 2.5 Throw on missing `qrPath`, on empty base64 from the fetch, and on image decode failure — callers own their own snackbar messaging.
- [x] 2.6 Add a short comment at the data-URL step explaining that it exists to avoid cross-origin canvas tainting, so a later refactor does not "simplify" it into a `SecurityError`.

## 3. Wire up the QR list screens

- [x] 3.1 In `src/pages/admin/qr/StaticList.tsx`, replace `handleDownloadPDF` with a JPG handler calling `downloadQrAsJpg(row.qr_path, `${row.product_name}_QR`)`; keep the `downloadingId` guard, the success snackbar (worded for an image), and the error snackbar.
- [x] 3.2 Remove the `jsPDF` import and the local `loadImageAsBase64` definition from `StaticList.tsx`; import both helpers from `src/utils/qrDownload.ts`.
- [x] 3.3 In `src/pages/admin/qr/DynamicQr.tsx`, do the same: replace `handleDownload` with the JPG path, drop the `jsPDF` import and the duplicated `loadImageAsBase64`, and import from the shared module.
- [x] 3.4 Add the missing error handling in `DynamicQr.tsx` — its current handler has a bare `try/finally` with no `catch`, so a failure silently does nothing. Show an error snackbar.
- [x] 3.5 In both preview dialogs, relabel the download button from "PDF" to "JPG" and point it at the new handler.
      → Also added a `disabled={downloadingId === selectedQR.detail_uuid}` guard to both dialog buttons, which previously allowed re-entrant clicks during an in-flight download (spec: "In-flight download is indicated").
- [x] 3.6 Confirm the row-level tooltips read "Download JPG" rather than "Download PDF" in both lists.

## 4. Wire up Product Details

- [x] 4.1 In `src/pages/admin/products/Components/ProductDetails.tsx`, replace `handleDownloadPDF` with a JPG handler calling `downloadQrAsJpg(qrCodeData.qr_path, `${batch.batch_name}_QR`)`.
- [x] 4.2 Change the import of `loadImageAsBase64` from `StaticList.tsx` to the new shared module, and remove the `jsPDF` import.
- [x] 4.3 Keep the existing "QR path not found" guard, the `downloadingId` handling, and the `handleMenuClose()` in `finally`; update the snackbar copy to refer to an image.
- [x] 4.4 Update the menu item label if it names PDF.
      → Relabelled "Export PDF" → "Download JPG" and swapped the `PictureAsPdf` icon for `Image`. Also fixed a pre-existing bug on the same line: the handler was invoked as `handleDownloadPDF(Details)`, passing the imported MUI **icon component** instead of `selectedBatch`, so the menu action could never have worked. Now passes `selectedBatch`; the unused `Details` import was removed.

## 5. Verify

- [x] 5.1 Run the TypeScript build / `npm run build` and confirm no unused-import or type errors remain from the removed `jsPDF` usage.
      → `npx tsc --noEmit` clean; `npm run build` succeeded. No new warnings on any touched file (the remaining ones — unused `Divider`/`Person`/`S3_URL`, `refresh` dep — are pre-existing). Main bundle fell 129.77 kB gzip as jsPDF dropped out.
- [x] 5.2 Grep `src/` for `jspdf` and confirm the only remaining references are outside the QR flow (or none, per the design's note that removal from `package.json` is out of scope).
      → Zero `jspdf`/`jsPDF` references remain anywhere in `src/`. Left in `package.json` as designed.

### Manual browser verification — NOT YET DONE

These need the running app with real QR data behind admin auth, and 5.5 needs a physical device. No canvas-capable test tooling is installed (jsdom returns `null` from `getContext('2d')`), so they cannot be automated here.

- [ ] 5.3 Manually download a QR from the Static list, the Dynamic list, both preview dialogs, and the Product Details batch menu — confirm each saves a `.jpg`.
- [ ] 5.4 Open a downloaded `.jpg` and confirm the QR renders black-on-white, not inverted — this is the transparency/white-fill check.
- [ ] 5.5 Scan a downloaded `.jpg` with a phone camera and confirm it resolves to the expected `/p/:qr_uuid` URL.
- [ ] 5.6 Trigger a failure path (a row with an unreachable `qr_path`) and confirm an error snackbar appears and the spinner clears.
- [ ] 5.7 Open the QR generate form and the QR edit form and confirm the field reads "Product Information" and edit still pre-fills the saved value.
- [ ] 5.8 Submit the form and confirm via the network tab that the payload still sends `description`.
- [ ] 5.9 Open a public scan page for a non-Bio-Pesticide QR and confirm the row reads "Product Information"; confirm an empty value still renders no row.
