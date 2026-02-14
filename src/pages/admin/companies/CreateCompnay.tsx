import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Card,
    Grid,
    TextField,
    FormControlLabel,
    Switch,
    CircularProgress,
    Typography,
    Breadcrumbs,
    Link,
    MenuItem
} from '@mui/material';
import {
    LocationOn,
    AccountBalance,
    Info,
    NavigateNext,
    Save,
    VerifiedUser
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { FetchCompanyDetailsService, StoreCompanyService, UpdateCompanyService } from '../../../utils/services/product.service';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';

// --- Types ---
interface FormValues {
    company_name: string;
    email: string;
    mobile: string;
    state: string;
    city: string;
    pincode: string;
    address: string;
    gst_no: string;
    pan_no: string;
    bank_account_no: string;
    bank_ifsc_code: string;
    referral_name: string;
    is_active: boolean;
}

// --- Validation Schema: Indian formats + required fields ---
const companyValidationSchema = Yup.object().shape({
    company_name: Yup.string().required('Company name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobile: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
        .required('Mobile number is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    pincode: Yup.string()
        .matches(/^\d{6}$/, 'Enter a valid 6-digit pincode')
        .required('Pincode is required'),
    address: Yup.string().required('Address is required'),
    gst_no: Yup.string()
        .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Enter a valid GST number')
        .nullable()
        .notRequired(),
    pan_no: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN number')
        .nullable()
        .notRequired(),
    bank_account_no: Yup.string()
        .matches(/^\d{9,18}$/, 'Enter a valid bank account number')
        .nullable()
        .notRequired(),
    bank_ifsc_code: Yup.string()
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC code')
        .nullable()
        .notRequired(),
    referral_name: Yup.string().nullable().notRequired(),
});

const CompanyForm: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const uuid = searchParams.get('uuid');
    const isEdit = Boolean(uuid);
    const [loading, setLoading] = useState(false);

    const [initialValues, setInitialValues] = useState<FormValues>({
        company_name: '', email: '', mobile: '', state: '', city: '',
        pincode: '', address: '', gst_no: '', pan_no: '',
        bank_account_no: '', bank_ifsc_code: '', referral_name: '', is_active: true,
    });

    useEffect(() => {
        const fetchCompanyData = async () => {
            if (isEdit && uuid) {
                setLoading(true);
                const { data, code } = await FetchCompanyDetailsService({ company_uuid: uuid });
                if (code === 200 && data) {
                    const companyData = data.company || data;
                    setInitialValues({
                        ...initialValues, // Fallback to defaults
                        ...companyData,
                        is_active: companyData.is_active ?? true
                    });
                }
                setLoading(false);
            }
        };
        fetchCompanyData();
    }, [isEdit, uuid]);

    const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        let response: any;
        if (isEdit) {
            response = await UpdateCompanyService({ ...values, company_uuid: uuid });
        } else {
            response = await StoreCompanyService(values);
        }

        if (response.code === 200) {
            dispatch(showSnackbar({ type: 'success', message: `Company ${isEdit ? 'updated' : 'created'} successfully` }));
            navigate('/admin/companies');
        } else {
            dispatch(showSnackbar({ type: 'error', message: response?.message || 'Failed to save company' }));
        }
        setSubmitting(false);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ maxWidth: '1200px', mx: 'auto', py: 4, px: 2 }}>
            <Formik initialValues={initialValues} validationSchema={companyValidationSchema} onSubmit={handleSubmit} enableReinitialize>
                {({ values, errors, touched, handleChange, isSubmitting, setFieldValue }) => (
                    <Form noValidate>
                        {/* Header & Status Section */}
                        <Box sx={{ mb: 3 }}>
                            <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 1 }}>
                                <Link underline="hover" color="inherit" onClick={() => navigate('/admin/companies')} sx={{ cursor: 'pointer', fontSize: '14px' }}>Company Master</Link>
                                <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{isEdit ? 'Edit Company' : 'Add New Company'}</Typography>
                            </Breadcrumbs>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0e1b12' }}>{isEdit ? 'Edit Company' : 'Create Company'}</Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'white', px: 2, py: 1, borderRadius: '12px', border: '1px solid #d1e6d8' }}>
                                    <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>Company Status</Typography>
                                    <FormControlLabel
                                        control={<Switch checked={values.is_active} onChange={(e) => setFieldValue('is_active', e.target.checked)} color="primary" />}
                                        label={values.is_active ? 'ACTIVE' : 'INACTIVE'}
                                        sx={{ '& .MuiTypography-root': { fontSize: '12px', fontWeight: 'bold', color: '#19b34d' } }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Card sx={{ borderRadius: '12px', border: '1px solid #d1e6d8', boxShadow: 'none', overflow: 'hidden' }}>
                            {/* Section 1: Basic Information (Name & Email Required) */}
                            <Box sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, borderBottom: '1px solid #e8f3eb', pb: 2 }}>
                                    <Info sx={{ color: '#19b34d' }} />
                                    <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>Basic Information</Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#509567', mb: 1 }}>
                                            COMPANY NAME <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                                        </Typography>
                                        <TextField fullWidth size="small" name="company_name" placeholder="Enter company legal name" value={values.company_name} onChange={handleChange} error={touched.company_name && !!errors.company_name} helperText={touched.company_name && errors.company_name} />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#509567', mb: 1 }}>
                                            EMAIL ADDRESS <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                                        </Typography>
                                        <TextField fullWidth size="small" name="email" placeholder="contact@company.com" value={values.email} onChange={handleChange} error={touched.email && !!errors.email} helperText={touched.email && errors.email} />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#509567', mb: 1 }}>
                                            MOBILE NUMBER <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="mobile"
                                            placeholder="0000000000"
                                            value={values.mobile}
                                            onChange={(e) => {
                                                const filtered = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setFieldValue('mobile', filtered);
                                            }}
                                            inputProps={{ inputMode: 'numeric' }}
                                            error={touched.mobile && !!errors.mobile}
                                            helperText={touched.mobile && errors.mobile}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Section 2: Address (Optional) */}
                            <Box sx={{ p: 4, bgcolor: '#f8fbf9', borderTop: '1px solid #e8f3eb', borderBottom: '1px solid #e8f3eb' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, borderBottom: '1px solid #e8f3eb', pb: 2 }}>
                                    <LocationOn sx={{ color: '#19b34d' }} />
                                    <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>Address & Location</Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#509567', mb: 1 }}>
                                            STATE <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                                        </Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            name="state"
                                            value={values.state}
                                            onChange={handleChange}
                                            error={touched.state && !!errors.state}
                                            helperText={touched.state && errors.state}
                                        >
                                            <MenuItem value="">Select State</MenuItem>
                                            <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                                            <MenuItem value="Gujarat">Gujarat</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#509567', mb: 1 }}>
                                            CITY <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="city"
                                            placeholder="Enter City"
                                            value={values.city}
                                            onChange={handleChange}
                                            error={touched.city && !!errors.city}
                                            helperText={touched.city && errors.city}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#509567', mb: 1 }}>
                                            PINCODE <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="pincode"
                                            placeholder="400001"
                                            value={values.pincode}
                                            onChange={(e) => {
                                                const filtered = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                setFieldValue('pincode', filtered);
                                            }}
                                            inputProps={{ inputMode: 'numeric' }}
                                            error={touched.pincode && !!errors.pincode}
                                            helperText={touched.pincode && errors.pincode}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#509567', mb: 1 }}>
                                            FULL ADDRESS <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            name="address"
                                            placeholder="Street, Building..."
                                            value={values.address}
                                            onChange={handleChange}
                                            error={touched.address && !!errors.address}
                                            helperText={touched.address && errors.address}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Section 3: Legal & Banking (Optional) */}
                            <Box sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, borderBottom: '1px solid #e8f3eb', pb: 2 }}>
                                    <AccountBalance sx={{ color: '#19b34d' }} />
                                    <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>Legal & Banking</Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#509567', mb: 1 }}>
                                            GST NUMBER
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="gst_no"
                                            placeholder="27AAAAA0000A1Z5"
                                            value={values.gst_no}
                                            onChange={(e) => setFieldValue('gst_no', e.target.value.toUpperCase())}
                                            error={touched.gst_no && !!errors.gst_no}
                                            helperText={touched.gst_no && errors.gst_no}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#509567', mb: 1 }}>
                                            PAN NUMBER
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="pan_no"
                                            placeholder="ABCDE1234F"
                                            value={values.pan_no}
                                            onChange={(e) => setFieldValue('pan_no', e.target.value.toUpperCase())}
                                            error={touched.pan_no && !!errors.pan_no}
                                            helperText={touched.pan_no && errors.pan_no}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#509567', mb: 1 }}>
                                            BANK ACCOUNT NO
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="bank_account_no"
                                            placeholder="000000000000"
                                            value={values.bank_account_no}
                                            onChange={(e) => {
                                                const filtered = e.target.value.replace(/\D/g, '').slice(0, 18);
                                                setFieldValue('bank_account_no', filtered);
                                            }}
                                            inputProps={{ inputMode: 'numeric' }}
                                            error={touched.bank_account_no && !!errors.bank_account_no}
                                            helperText={touched.bank_account_no && errors.bank_account_no}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#509567', mb: 1 }}>
                                            IFSC CODE
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="bank_ifsc_code"
                                            placeholder="SBIN0001234"
                                            value={values.bank_ifsc_code}
                                            onChange={(e) => setFieldValue('bank_ifsc_code', e.target.value.toUpperCase())}
                                            error={touched.bank_ifsc_code && !!errors.bank_ifsc_code}
                                            helperText={touched.bank_ifsc_code && errors.bank_ifsc_code}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#509567', mb: 1 }}>
                                            REFERRAL NAME
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="referral_name"
                                            placeholder="Referral name"
                                            value={values.referral_name}
                                            onChange={handleChange}
                                            error={touched.referral_name && !!errors.referral_name}
                                            helperText={touched.referral_name && errors.referral_name}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Action Footer */}
                            <Box sx={{ p: 3, bgcolor: '#f8fbf9', display: 'flex', justifyContent: 'flex-end', gap: 2, borderTop: '1px solid #e8f3eb' }}>
                                <Button onClick={() => navigate('/admin/companies')} sx={{ color: '#509567', fontWeight: 'bold', textTransform: 'none' }}>Cancel</Button>
                                <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                    sx={{ bgcolor: '#19b34d', '&:hover': { bgcolor: '#159a41' }, borderRadius: '8px', px: 4, textTransform: 'none', fontWeight: 'bold' }}>
                                    {isSubmitting ? 'Saving...' : 'Save Company'}
                                </Button>
                            </Box>
                        </Card>

                        {/* Bottom Disclaimer */}
                        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(25, 179, 77, 0.05)', borderRadius: '12px', border: '1px solid rgba(25, 179, 77, 0.1)', display: 'flex', gap: 2, alignItems: 'center' }}>
                            <VerifiedUser sx={{ color: '#19b34d' }} />
                            <Typography sx={{ fontSize: '12px', color: '#509567', fontWeight: 500 }}>
                                Ensure all legal and banking details are cross-verified with official documents before saving.
                            </Typography>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default CompanyForm;
