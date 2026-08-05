## Why

The free-text field on the QR generate/edit form is labelled "QR Description", which reads as metadata about the QR code itself rather than what it actually holds — information about the product that consumers see after scanning. The same value renders as "Product Description" on the public scan page, so the two surfaces disagree on what the field is called.

Separately, QR downloads currently produce a PDF wrapping the QR image. Printers, packaging vendors and design teams need the raw QR artwork as a plain image file they can place directly into label layouts; a PDF forces an extra extract step and is the wrong deliverable for that workflow.

## What Changes

- Rename the QR form field label from "QR Description" to "Product Information" in the QR generate/edit form.
- Rename the corresponding detail row on the public scan page from "Product Description" to "Product Information" so both surfaces agree.
- The underlying payload/API key stays `description` — this is a presentation-layer rename only, requiring no backend coordination.
- **BREAKING** (user-facing): replace the PDF download with a JPG image download everywhere a QR code is downloaded — the Static QR list, the Dynamic QR list, and the batch QR action menu on the Product Details screen. The download action now yields a `.jpg` of the QR artwork instead of a `.pdf`.
- Apply the same replacement in the QR Preview dialog on both lists — the "PDF" button becomes a "JPG" button.
- Remove the now-unused `jsPDF` usage from those three screens (the batch text that PDF generation embedded goes away with it).

## Capabilities

### New Capabilities
- `qr-management`: QR generate/edit form field presentation, public scan-page detail rendering, and QR artwork download behaviour (format, filename, failure handling) for static and dynamic QR codes.

### Modified Capabilities
<!-- None. No existing spec in openspec/specs/ covers QR behaviour. -->

## Impact

- `src/pages/admin/qr/QRGenerate.tsx` — field label text only; `FormValues.description` and the submit payload key are unchanged.
- `src/pages/guest/product/index.tsx` — the `createDetailItem('Product Description', ...)` label.
- `src/pages/admin/qr/StaticList.tsx` — `handleDownloadPDF` replaced by a JPG download; preview-dialog button label; `jsPDF` import dropped.
- `src/pages/admin/qr/DynamicQr.tsx` — `handleDownload` replaced by a JPG download; preview-dialog button label; `jsPDF` import dropped.
- `src/pages/admin/products/Components/ProductDetails.tsx` — `handleDownloadPDF` (batch QR action menu) replaced by a JPG download; `jsPDF` import dropped.
- The shared `loadImageAsBase64` helper (exported from `StaticList.tsx`, duplicated in `DynamicQr.tsx`) is reused for fetching the QR artwork; the conversion to JPG is added next to it.
- No backend, API contract, or database change.
- `jspdf` becomes unreferenced across `src/` once these three call sites are converted; removing it from `package.json` is deliberately left out of scope so the dependency stays available for the label-management flow.
