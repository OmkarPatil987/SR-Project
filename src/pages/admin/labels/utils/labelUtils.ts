import { GazetteDetail } from '../../../../utils/dto/response/label';

export interface EditableCropEntry {
    name: string;
    dose: string;
}

export interface EditableCompositionRow {
    ingredient: string;
    content: string;
}

export interface EditableSpecificationRow {
    parameter: string;
    value: string;
}

export interface EditableLabelProduct {
    id: number;
    product_name: string;
    composition: EditableCompositionRow[];
    specifications: EditableSpecificationRow[];
    crop_entries: EditableCropEntry[];
    note: string;
}

export const normalizeCropEntries = (applicationDetails: GazetteDetail['application_details'] | null | undefined): EditableCropEntry[] => {
    const cropName = applicationDetails?.crop_name;
    if (Array.isArray(cropName)) {
        return cropName.length > 0
            ? cropName.map((entry) => ({ name: entry.name ?? '', dose: entry.dose ?? '' }))
            : [{ name: '', dose: '' }];
    }
    return [{ name: cropName ?? '', dose: applicationDetails?.dose ?? '' }];
};

export const denormalizeCropEntries = (entries: EditableCropEntry[]): GazetteDetail['application_details'] => {
    if (entries.length === 1) {
        return { crop_name: entries[0].name, dose: entries[0].dose };
    }
    return { crop_name: entries.map((entry) => ({ name: entry.name, dose: entry.dose })), dose: null };
};

export const normalizeGazetteDetail = (detail: GazetteDetail): EditableLabelProduct => ({
    id: detail.id,
    product_name: detail.product?.name ?? '',
    composition: detail.composition?.length ? detail.composition.map((row) => ({ ...row })) : [{ ingredient: '', content: '' }],
    specifications: detail.specifications?.length ? detail.specifications.map((row) => ({ ...row })) : [{ parameter: '', value: '' }],
    crop_entries: normalizeCropEntries(detail.application_details),
    note: detail.note ?? '',
});

export const denormalizeLabelProduct = (product: EditableLabelProduct): GazetteDetail => ({
    id: product.id,
    product: { name: product.product_name },
    composition: product.composition,
    specifications: product.specifications,
    application_details: denormalizeCropEntries(product.crop_entries),
    note: product.note || null,
});
