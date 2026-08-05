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

/**
 * Downloads the QR artwork at `qrPath` as a JPG file named `fileName`.
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

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Failed to prepare image canvas");

    // JPG has no alpha channel — without this fill, a transparent PNG
    // background flattens to black and inverts the QR beyond scanning.
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);

    // Quality 1.0: QR codes are high-contrast line art, the content JPEG
    // artifacts hurt most. File size is negligible at these dimensions.
    const jpgDataUrl = canvas.toDataURL("image/jpeg", 1.0);

    const link = document.createElement("a");
    link.href = jpgDataUrl;
    link.download = fileName.toLowerCase().endsWith(".jpg") ? fileName : `${fileName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
