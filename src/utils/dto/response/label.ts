export interface GazetteListItem {
    id: number;
    name: string;
}

export interface GazettePagination {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
}

export interface GazetteCompositionRow {
    ingredient: string;
    content: string;
}

export interface GazetteSpecificationRow {
    parameter: string;
    value: string;
}

export interface GazetteCropDose {
    name: string;
    dose: string;
}

export interface GazetteApplicationDetails {
    crop_name: string | GazetteCropDose[] | null;
    dose?: string | null;
}

export interface GazetteDetail {
    id: number;
    product: { name: string };
    composition: GazetteCompositionRow[];
    specifications: GazetteSpecificationRow[];
    application_details: GazetteApplicationDetails;
    note?: string | null;
}

export interface CompanyContact {
    name: string;
    address: string;
    contact_person: string;
    mobile: string;
    email: string;
    website: string;
    license_no: string;
    gst_no: string;
}

export interface LabelPdfRequestPayload {
    is_manufacturer_marketing_same: boolean;
    manufacturer: CompanyContact;
    marketing: CompanyContact;
    products_gazette: GazetteDetail[];
}

export interface LabelPdfResponse {
    id: number;
    uuid: string;
    created_by: number;
    file_name: string;
    file_url: string;
}

export interface LabelPdfHistoryProduct {
    id: number;
    product_name: string;
}

export interface LabelPdfHistoryItem {
    id: number;
    uuid: string;
    company_id: number;
    created_by: number;
    company_name: string;
    file_name: string;
    file_url: string;
    products: LabelPdfHistoryProduct[];
    created_at: string;
}

export interface PublicLabelCompany {
    name: string;
    logo: string | null;
}

export interface PublicLabelProduct {
    id: number;
    note: string | null;
    qr_path: string | null;
    short_code: string;
    product_name: string;
    composition: GazetteCompositionRow[];
    specifications: GazetteSpecificationRow[];
    application_details: GazetteApplicationDetails;
}

export interface PublicLabelResponse {
    company: PublicLabelCompany;
    manufacturer: CompanyContact;
    marketing: CompanyContact;
    product: PublicLabelProduct;
}
