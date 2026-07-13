import { CompanyContact } from '../../../../utils/dto/response/label';

export const MAX_LABEL_SELECTIONS = 10;

export const emptyCompanyContact: CompanyContact = {
    name: '',
    address: '',
    contact_person: '',
    mobile: '',
    email: '',
    website: '',
    license_no: '',
    gst_no: '',
};

export const LABEL_STEPS = ['Select Products', 'Label Details', 'Result'];
