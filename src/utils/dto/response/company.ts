import { EnabledModules } from "./auth";

export interface CompanyDetailsResponse {
    uuid: string;
    company_name: string;
    email: string;
    mobile: string;
    state: string;
    city: string;
    pincode: string;
    address: string;
    gst_no: string | null;
    pan_no: string | null;
    bank_account_no: string | null;
    bank_ifsc_code: string | null;
    referral_name: string | null;
    is_active: boolean;
    is_approved: boolean;
    remark: string | null;
    approved_by: number | null;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
    license_no: string;
    enabled_modules: EnabledModules;
    logo: string | null;
}
