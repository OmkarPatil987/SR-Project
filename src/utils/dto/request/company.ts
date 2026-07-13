import { EnabledModules } from "../response/auth";

export interface CompanyRequestPayload {
    company_name: string;
    email: string;
    mobile: string;
    state: string;
    city: string;
    pincode: string;
    address: string;
    license_no?: string;
    gst_no?: string;
    pan_no?: string;
    bank_account_no?: string;
    bank_ifsc_code?: string;
    referral_name?: string;
    is_active?: boolean;
    logo?: File | null;
    enabled_modules: EnabledModules;
}

export interface CompanyRegisterPayload extends CompanyRequestPayload {
    session_id: string;
    captcha_answer: number;
    form_load_time: number;
    honeypot: string;
}

export const buildCompanyFormData = (payload: CompanyRequestPayload | CompanyRegisterPayload): FormData => {
    const { logo, enabled_modules, ...rest } = payload;
    const formData = new FormData();

    Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    formData.append("enabled_modules", JSON.stringify(enabled_modules));

    if (logo) {
        formData.append("logo", logo);
    }

    return formData;
};
