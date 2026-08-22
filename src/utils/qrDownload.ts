/**
 * Shared helpers for fetching QR artwork and saving it as a JPG image.
 */

export const loadImageAsBase64 = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        if (!response.ok) return "";
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        return "";
    }
};

const loadImageElement = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Failed to decode QR image"));
        image.src = src;
    });

interface CropBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

/** Mean channel value below which a pixel counts as ink rather than paper. */
const INK_LEVEL = 128;

/**
 * Finds the box holding the QR code itself, so the caption the API bakes
 * under the artwork (the QR reference number) is left out of what gets
 * printed. The strip is separated from the code by a band of blank rows,
 * which is what this measures — it is not tied to a fixed image size, so a
 * caption-free QR measures to its own bounds and comes out untouched.
 *
 * Returns null when nothing can be measured; callers then keep the artwork
 * exactly as served.
 */
const measureQrBox = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number
): CropBox | null => {
    let pixels: Uint8ClampedArray;
    try {
        pixels = context.getImageData(0, 0, width, height).data;
    } catch {
        return null;
    }

    const hasInk = (x: number, y: number) => {
        const i = (y * width + x) * 4;
        return (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3 < INK_LEVEL;
    };

    const rowHasInk: boolean[] = new Array(height).fill(false);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (hasInk(x, y)) {
                rowHasInk[y] = true;
                break;
            }
        }
    }

    // Ink runs closer together than this stay one block: a QR can carry a
    // fully blank module row, which is only a few pixels tall, and splitting
    // on that would crop the code in half.
    const gapLimit = Math.max(12, Math.round(height * 0.03));

    let start = -1;
    let last = -1;
    let bandTop = -1;
    let bandBottom = -1;

    // The QR is the tallest block by a wide margin — a caption is one text line.
    const keepTallest = () => {
        if (start < 0) return;
        if (bandTop < 0 || last - start > bandBottom - bandTop) {
            bandTop = start;
            bandBottom = last;
        }
    };

    for (let y = 0; y < height; y++) {
        if (rowHasInk[y]) {
            if (start < 0) start = y;
            last = y;
        } else if (start >= 0 && y - last > gapLimit) {
            keepTallest();
            start = -1;
        }
    }
    keepTallest();

    if (bandTop < 0) return null;

    // Measured inside the band only, so caption glyphs cannot widen the box.
    let colFirst = -1;
    let colLast = -1;
    for (let x = 0; x < width; x++) {
        for (let y = bandTop; y <= bandBottom; y++) {
            if (hasInk(x, y)) {
                if (colFirst < 0) colFirst = x;
                colLast = x;
                break;
            }
        }
    }

    if (colFirst < 0) return null;

    // Keep as much quiet zone as the artwork already carries — a QR cropped
    // tight to its modules is measurably harder for a scanner to lock onto.
    const pad = Math.min(bandTop, colFirst, width - 1 - colLast);

    const x = Math.max(0, colFirst - pad);
    const y = Math.max(0, bandTop - pad);

    return {
        x,
        y,
        width: Math.min(width - x, colLast + pad + 1 - x),
        height: Math.min(height - y, bandBottom + pad + 1 - y),
    };
};

/**
 * Downloads the QR artwork at `qrPath` as a JPG file named `fileName`, with
 * the caption strip cropped off so only the code itself prints.
 * Throws if the artwork is missing, unreachable, or cannot be decoded —
 * callers own their own user-facing messaging.
 */
export const downloadQrAsJpg = async (qrPath: string, fileName: string): Promise<void> => {
    if (!qrPath) throw new Error("QR path not found");

    // Fetch to a data URL first, then feed THAT to the Image. qr_path is a
    // cross-origin URL, so pointing the Image straight at it would taint the
    // canvas and make toDataURL() throw a SecurityError. A data: URL is
    // same-origin by definition, so the canvas stays readable.
    const base64 = await loadImageAsBase64(qrPath);
    if (!base64) throw new Error("Failed to fetch QR image");

    const image = await loadImageElement(base64);

    const source = document.createElement("canvas");
    source.width = image.naturalWidth;
    source.height = image.naturalHeight;

    const sourceContext = source.getContext("2d");
    if (!sourceContext) throw new Error("Failed to prepare image canvas");

    // JPG has no alpha channel — without this fill, a transparent PNG
    // background flattens to black and inverts the QR beyond scanning.
    sourceContext.fillStyle = "#FFFFFF";
    sourceContext.fillRect(0, 0, source.width, source.height);
    sourceContext.drawImage(image, 0, 0);

    const box = measureQrBox(sourceContext, source.width, source.height)
        || { x: 0, y: 0, width: source.width, height: source.height };

    const output = document.createElement("canvas");
    output.width = box.width;
    output.height = box.height;

    const outputContext = output.getContext("2d");
    if (!outputContext) throw new Error("Failed to prepare image canvas");

    outputContext.fillStyle = "#FFFFFF";
    outputContext.fillRect(0, 0, output.width, output.height);
    outputContext.drawImage(source, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);

    // Quality 1.0: QR codes are high-contrast line art, the content JPEG
    // artifacts hurt most. File size is negligible at these dimensions.
    const jpgDataUrl = output.toDataURL("image/jpeg", 1.0);

    const link = document.createElement("a");
    link.href = jpgDataUrl;
    link.download = fileName.toLowerCase().endsWith(".jpg") ? fileName : `${fileName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Display styles for QR artwork shown on screen. `cover` anchored to the top
 * hides the same caption strip `downloadQrAsJpg` crops, so what is previewed
 * matches the file that prints — and it keeps the code square rather than
 * stretching it to fill a square box.
 */
export const qrArtworkSx = { objectFit: 'cover', objectPosition: 'top' } as const;
