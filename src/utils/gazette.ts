/**
 * Types and read/write helpers for the regulator's products-gazette dataset.
 *
 * The QR API now carries structured composition and specifications as real
 * arrays — `biostimulant_composition_new` and `biostimulant_specification`.
 * Records written before those fields existed kept both JSON-encoded inside
 * the `biostimulant_composition` string, and older ones still hold plain
 * prose there. `resolveProductComposition` is the single place that decides
 * between the three shapes.
 *
 * Every screen must resolve through this module — a reader that disagrees
 * between the admin form and the public scan page produces a QR that looks
 * right to the person who made it and wrong to the person who scans it.
 */

import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export interface CompositionRow {
    ingredient: string;
    content: string;
}

export interface SpecificationRow {
    parameter: string;
    value: string;
}

export interface GazetteCropDose {
    name: string;
    dose: string;
}

export interface GazetteApplicationDetails {
    /**
     * Either a comma-separated string or an array of {name, dose} entries.
     * Both shapes occur live — see `labelUtils.normalizeCropEntries`, which
     * handles the same dataset for the label module.
     */
    crop_name?: string | GazetteCropDose[] | null;
    /** Either a plain string or an object keyed by crop name. Both occur live. */
    dose?: string | Record<string, string> | null;
}

export interface GazetteEntry {
    id: number;
    product_name: string;
    gazette_no?: string | null;
    gazette_date?: string | null;
    gazette_sr_no?: string | null;
    /**
     * Link to the Government Resolution PDF the entry was notified under, so an
     * operator can cross-verify what the form auto-filled. Optional: the
     * dataset does not carry it for every record, and the form falls back to a
     * manually entered link.
     */
    gr_pdf_link?: string | null;
    composition?: CompositionRow[] | null;
    specifications?: SpecificationRow[] | null;
    application_details?: GazetteApplicationDetails | null;
    note?: string | null;
}

export interface StructuredComposition {
    composition: CompositionRow[];
    specifications: SpecificationRow[];
}

export type DecodedComposition =
    | ({ kind: "structured" } & StructuredComposition)
    | { kind: "text"; value: string };

const FORMAT_TAG = "gazette-v1";

/**
 * Formats the gazette dataset uses for `gazette_date`, tried strictly in order.
 * The live API returns human-readable dates like "25th March, 2026".
 */
const GAZETTE_DATE_FORMATS = [
    "D MMMM, YYYY",
    "D MMMM YYYY",
    "D MMM, YYYY",
    "D MMM YYYY",
    "YYYY-MM-DD",
    "DD/MM/YYYY",
    "DD-MM-YYYY",
];

/**
 * Parses a gazette_date into a Dayjs, or null when it cannot be read.
 *
 * Returning null rather than an invalid Dayjs is the point: `dayjs("25th
 * March, 2026")` yields an Invalid Date object that is truthy and passes an
 * `if (value)` check, so it reaches the DatePicker as a blank field and
 * `.format('YYYY-MM-DD')` turns it into the literal string "Invalid Date" —
 * which would then be submitted to the API.
 */
export const parseGazetteDate = (raw: unknown): Dayjs | null => {
    if (typeof raw !== "string") return null;

    const trimmed = raw.trim();
    if (!trimmed) return null;

    // "25th March, 2026" -> "25 March, 2026"; dayjs cannot parse the ordinal.
    const normalized = trimmed.replace(/(\d+)(st|nd|rd|th)\b/gi, "$1");

    for (const format of GAZETTE_DATE_FORMATS) {
        const parsed = dayjs(normalized, format, true);
        if (parsed.isValid()) return parsed;
    }

    // Last resort for ISO datetimes and anything else the runtime can read.
    const loose = dayjs(normalized);
    return loose.isValid() ? loose : null;
};

/**
 * Normalises the polymorphic `application_details.dose` to a display string.
 * The object branch is checked explicitly because `String(dose)` on an object
 * yields "[object Object]" — which would be printed onto a physical label.
 */
export const flattenDose = (dose: unknown): string => {
    if (!dose) return "";

    if (typeof dose === "string") return dose.trim();

    if (typeof dose === "object" && !Array.isArray(dose)) {
        return Object.entries(dose as Record<string, unknown>)
            // Only primitive values are safe to stringify. A nested object would
            // become "[object Object]" and get printed onto a physical label.
            .filter(([crop, value]) =>
                crop && (typeof value === "string" || typeof value === "number"))
            .map(([crop, value]) => `${crop}: ${value}`)
            .join("\n");
    }

    return "";
};

/**
 * The crops string for a gazette entry, or "" when absent.
 *
 * `crop_name` arrives as either a string or an array of {name, dose} — calling
 * .trim() on the array shape throws, so both branches are explicit.
 */
export const extractCrops = (entry?: GazetteEntry | null): string => {
    const cropName = entry?.application_details?.crop_name;
    if (!cropName) return "";

    if (Array.isArray(cropName)) {
        return cropName
            .map((crop) => crop?.name)
            .filter((name): name is string => typeof name === "string" && name.trim() !== "")
            .join(", ");
    }

    return typeof cropName === "string" ? cropName.trim() : "";
};

/**
 * The doses string for a gazette entry.
 *
 * When `crop_name` is the array shape, the per-crop dose lives inside those
 * entries and the top-level `dose` is null — reading only `dose` would silently
 * drop the dosage for those records.
 */
export const extractDoses = (entry?: GazetteEntry | null): string => {
    const details = entry?.application_details;
    const cropName = details?.crop_name;

    if (Array.isArray(cropName)) {
        const perCrop = cropName
            .filter((crop) => crop?.name && crop?.dose)
            .map((crop) => `${crop.name}: ${crop.dose}`)
            .join("\n");
        if (perCrop) return perCrop;
    }

    return flattenDose(details?.dose);
};

/**
 * JSON-encodes composition + specifications into the single string field.
 *
 * @deprecated The API now has `biostimulant_composition_new` and
 * `biostimulant_specification`, so nothing writes this format any more. Kept
 * because `decodeComposition` must keep reading records that were written
 * with it, and the round-trip test is what pins that format down.
 */
export const encodeComposition = (data: Partial<StructuredComposition>): string => {
    const composition = data.composition ?? [];
    const specifications = data.specifications ?? [];

    if (composition.length === 0 && specifications.length === 0) return "";

    return JSON.stringify({ __fmt: FORMAT_TAG, composition, specifications });
};

/**
 * Decodes `biostimulant_composition`. Never throws.
 *
 * The `__fmt` check is load-bearing and is NOT redundant with a successful
 * JSON.parse: legacy prose can itself be valid JSON (a bare number, or the
 * literal text `null`), so "it parsed" is not evidence that a string is our
 * structured payload. Anything that is not a tagged envelope with array
 * members is returned as text for plain rendering.
 */
export const decodeComposition = (raw: unknown): DecodedComposition => {
    if (typeof raw !== "string" || raw.trim() === "") {
        return { kind: "text", value: "" };
    }

    const trimmed = raw.trim();

    // Cheap pre-check only — legacy prose rarely starts with "{", so this keeps
    // the common path off JSON.parse. The __fmt check below is the real gate.
    if (!trimmed.startsWith("{")) return { kind: "text", value: raw };

    try {
        const parsed = JSON.parse(trimmed);

        if (
            parsed &&
            typeof parsed === "object" &&
            parsed.__fmt === FORMAT_TAG &&
            Array.isArray(parsed.composition) &&
            Array.isArray(parsed.specifications)
        ) {
            return {
                kind: "structured",
                composition: parsed.composition as CompositionRow[],
                specifications: parsed.specifications as SpecificationRow[],
            };
        }
    } catch {
        // Not JSON at all — fall through to text.
    }

    return { kind: "text", value: raw };
};

/** True when the decoded value carries at least one row worth tabulating. */
export const hasStructuredRows = (decoded: DecodedComposition): boolean =>
    decoded.kind === "structured" &&
    (decoded.composition.length > 0 || decoded.specifications.length > 0);

/**
 * A cell value as text. Numbers are stringified because the API types these
 * rows as `Dict[str, Any]` — "3.0" and 3.0 both arrive in practice, and a
 * number would render as blank if it were required to be a string.
 */
const asCellText = (value: unknown): string => {
    if (typeof value === "string") return value.trim();
    if (typeof value === "number") return String(value);
    return "";
};

/**
 * Reads `biostimulant_composition_new` into typed rows.
 *
 * The field is declared `Optional[List[Dict[str, Any]]]`, so its shape is a
 * convention rather than a contract. Alternate key spellings are accepted and
 * anything that yields two empty cells is dropped, so a malformed row can
 * never render as a blank line on the public page.
 */
export const normalizeCompositionRows = (raw: unknown): CompositionRow[] => {
    if (!Array.isArray(raw)) return [];

    return raw.reduce<CompositionRow[]>((rows, item) => {
        if (!item || typeof item !== "object") return rows;

        const row = item as Record<string, unknown>;
        const ingredient = asCellText(row.ingredient ?? row.name ?? row.parameter);
        const content = asCellText(row.content ?? row.value);

        if (ingredient || content) rows.push({ ingredient, content });
        return rows;
    }, []);
};

/** Reads `biostimulant_specification` into typed rows. See above. */
export const normalizeSpecificationRows = (raw: unknown): SpecificationRow[] => {
    if (!Array.isArray(raw)) return [];

    return raw.reduce<SpecificationRow[]>((rows, item) => {
        if (!item || typeof item !== "object") return rows;

        const row = item as Record<string, unknown>;
        const parameter = asCellText(row.parameter ?? row.name ?? row.ingredient);
        const value = asCellText(row.value ?? row.content);

        if (parameter || value) rows.push({ parameter, value });
        return rows;
    }, []);
};

/** The composition-carrying subset of a QR's `product_detail`. */
export interface ProductCompositionSource {
    biostimulant_composition_new?: unknown;
    biostimulant_specification?: unknown;
    biostimulant_composition?: unknown;
}

export interface ResolvedComposition extends StructuredComposition {
    /**
     * Free prose from the legacy string field, and only that. Empty whenever
     * structured rows were found, so a caller can render the tables and the
     * prose row from the same result without showing both.
     */
    legacyText: string;
}

/**
 * Decides which of the three stored shapes a QR actually uses.
 *
 * Precedence: the real array fields, then the legacy JSON envelope inside
 * `biostimulant_composition`, then that same field as plain prose. New records
 * take the first branch; every record written before the API fields existed
 * keeps rendering through the other two, unchanged.
 */
export const resolveProductComposition = (
    detail?: ProductCompositionSource | null
): ResolvedComposition => {
    const composition = normalizeCompositionRows(detail?.biostimulant_composition_new);
    const specifications = normalizeSpecificationRows(detail?.biostimulant_specification);

    if (composition.length > 0 || specifications.length > 0) {
        return { composition, specifications, legacyText: "" };
    }

    const decoded = decodeComposition(detail?.biostimulant_composition);

    return decoded.kind === "structured"
        ? { composition: decoded.composition, specifications: decoded.specifications, legacyText: "" }
        : { composition: [], specifications: [], legacyText: decoded.value };
};
