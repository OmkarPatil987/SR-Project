export interface ProductCategoryOption {
    value: string;
    label: string;
    singularLabel: string;
    aliases?: string[];
}

export const PRODUCT_CATEGORY_OPTIONS: ProductCategoryOption[] = [
    {
        value: 'Biostimulants',
        label: 'Biostimulants',
        singularLabel: 'Biostimulant',
        aliases: ['biostimulant'],
    },
    {
        value: 'Fertilizers',
        label: 'Fertilizers',
        singularLabel: 'Fertilizer',
        aliases: ['fertilizer'],
    },
    {
        value: 'Water Soluble Fertilizers',
        label: 'Water Soluble Fertilizers',
        singularLabel: 'Water Soluble Fertilizer',
        aliases: ['water soluble fertilizer', 'watersolublefertilizer', 'water soluble fertilizers'],
    },
    {
        value: 'Pesticides',
        label: 'Pesticides',
        singularLabel: 'Pesticide',
        aliases: ['pesticide'],
    },
    {
        value: 'Bio Pesticides',
        label: 'Bio Pesticides',
        singularLabel: 'Bio Pesticide',
        aliases: ['biopesticide', 'biopesticides', 'bio pesticide'],
    },
    {
        value: 'Biofertilizers',
        label: 'Biofertilizers',
        singularLabel: 'Biofertilizer',
        aliases: ['biofertilizer'],
    },
    {
        value: 'Organic Fertilizers',
        label: 'Organic Fertilizers',
        singularLabel: 'Organic Fertilizer',
        aliases: ['organic fertilizer'],
    },
    {
        value: 'Micronutrients',
        label: 'Micronutrients',
        singularLabel: 'Micronutrient',
        aliases: ['micronutrient'],
    },
    {
        value: 'PGR',
        label: 'PGR',
        singularLabel: 'PGR',
        aliases: ['pgr'],
    },
    {
        value: 'Adjuvants',
        label: 'Adjuvants',
        singularLabel: 'Adjuvant',
        aliases: ['adjuvant'],
    },
    {
        value: 'Soil Conditioners',
        label: 'Soil Conditioners',
        singularLabel: 'Soil Conditioner',
        aliases: ['soil conditioner'],
    },
];

const normalizeCategoryKey = (value?: string | null) =>
    (value || '')
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, ' ');

export const getProductCategoryOption = (category?: string | null): ProductCategoryOption | undefined => {
    const normalizedCategory = normalizeCategoryKey(category);

    return PRODUCT_CATEGORY_OPTIONS.find((option) => {
        const candidateValues = [option.value, option.label, option.singularLabel, ...(option.aliases || [])];
        return candidateValues.some((candidate) => normalizeCategoryKey(candidate) === normalizedCategory);
    });
};

export const getProductCategoryLabel = (category?: string | null) =>
    getProductCategoryOption(category)?.label || category || '-';

export const getProductCategorySingularLabel = (category?: string | null) =>
    getProductCategoryOption(category)?.singularLabel || category || 'Product';
