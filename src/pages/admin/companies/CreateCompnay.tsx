import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDropzone, FileRejection } from 'react-dropzone';
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
    MenuItem,
    Stack,
    IconButton
} from '@mui/material';
import {
    LocationOn,
    AccountBalance,
    Info,
    NavigateNext,
    Save,
    VerifiedUser,
    Image as ImageIcon,
    Extension,
    CloudUpload,
    DeleteOutline
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { FetchCompanyDetailsService, StoreCompanyService, UpdateCompanyService } from '../../../utils/services/product.service';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
import { CompanyRequestPayload, buildCompanyFormData } from '../../../utils/dto/request/company';

// --- Types ---
interface FormValues {
    company_name: string;
    email: string;
    mobile: string;
    state: string;
    city: string;
    pincode: string;
    address: string;
    license_no: string;
    gst_no: string;
    pan_no: string;
    bank_account_no: string;
    bank_ifsc_code: string;
    referral_name: string;
    is_active: boolean;
    qr_system: boolean;
    label_with_qr: boolean;
    label_without_qr: boolean;
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
    license_no: Yup.string().nullable().notRequired(),
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
        pincode: '', address: '', license_no: '', gst_no: '', pan_no: '',
        bank_account_no: '', bank_ifsc_code: '', referral_name: '', is_active: true,
        qr_system: true, label_with_qr: false, label_without_qr: false,
    });

    const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
        };
    }, [logoPreview]);

    const onDropLogo = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        fileRejections.forEach((rejected) => {
            rejected.errors.forEach((error) => {
                const message = error.code === 'file-too-large'
                    ? `Logo "${rejected.file.name}" is too large. Maximum size allowed is 2MB.`
                    : error.code === 'file-invalid-type'
                        ? `Logo "${rejected.file.name}" has an unsupported type. Only PNG, JPEG, or WEBP images are allowed.`
                        : error.message;
                dispatch(showSnackbar({ type: 'error', message }));
            });
        });

        const file = acceptedFiles[0];
        if (file) {
            setSelectedLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    }, [dispatch]);

    const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps, isDragActive: isLogoDragActive } = useDropzone({
        onDrop: onDropLogo,
        multiple: false,
        maxSize: 2 * 1024 * 1024,
        accept: { 'image/png': [], 'image/jpeg': [], 'image/webp': [] },
    });

    const handleRemoveLogo = () => {
        setSelectedLogo(null);
        setLogoPreview(null);
    };

    useEffect(() => {
        const fetchCompanyData = async () => {
            if (isEdit && uuid) {
                setLoading(true);
                const { data, code } = await FetchCompanyDetailsService({ company_uuid: uuid });
                if (code === 200 && data) {
                    const enabledModules = data.enabled_modules || {};
                    setInitialValues({
                        ...initialValues, // Fallback to defaults
                        ...data,
                        gst_no: data.gst_no ?? '',
                        pan_no: data.pan_no ?? '',
                        bank_account_no: data.bank_account_no ?? '',
                        bank_ifsc_code: data.bank_ifsc_code ?? '',
                        referral_name: data.referral_name ?? '',
                        is_active: data.is_active ?? true,
                        qr_system: enabledModules.qr_system ?? true,
                        label_with_qr: enabledModules.label_system?.label_with_qr ?? false,
                        label_without_qr: enabledModules.label_system?.label_without_qr ?? false,
                    });
                    if (data.logo) {
                        setLogoPreview(data.logo);
                    }
                }
                setLoading(false);
            }
        };
        fetchCompanyData();
    }, [isEdit, uuid]);

    const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        const { qr_system, label_with_qr, label_without_qr, ...rest } = values;
        const payload: CompanyRequestPayload = {
            ...rest,
            ...(isEdit && uuid ? { company_uuid: uuid } : {}),
            logo: selectedLogo,
            enabled_modules: {
                qr_system,
                label_system: { label_with_qr, label_without_qr },
            },
        };
        const response = isEdit
            ? await UpdateCompanyService(buildCompanyFormData(payload))
            : await StoreCompanyService(buildCompanyFormData(payload));

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
                                            LICENSE NUMBER
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name="license_no"
                                            placeholder="Enter license number"
                                            value={values.license_no}
                                            onChange={handleChange}
                                        />
                                    </Grid>
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

                            <Box sx={{ p: 4, bgcolor: '#f8fbf9', borderTop: '1px solid #e8f3eb', borderBottom: '1px solid #e8f3eb' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, borderBottom: '1px solid #e8f3eb', pb: 2 }}>
                                    <ImageIcon sx={{ color: '#19b34d' }} />
                                    <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>Company Logo</Typography>
                                </Box>
                                <Box
                                    {...getLogoRootProps()}
                                    sx={{
                                        border: '2px dashed #aaa',
                                        borderRadius: 2,
                                        padding: 3,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        bgcolor: isLogoDragActive ? '#f0f0f0' : '#fafafa',
                                        '&:hover': { borderColor: 'primary.main' },
                                    }}
                                >
                                    <input {...getLogoInputProps()} />
                                    <CloudUpload sx={{ mb: 1, color: '#509567' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {isLogoDragActive ? 'Drop the logo here...' : 'Drag & drop a logo image here, or click to select'}
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled">
                                        PNG, JPEG, or WEBP — up to 2MB
                                    </Typography>
                                </Box>
                                {logoPreview && (
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                                        <Box component="img" src={logoPreview} alt="Logo preview" sx={{ width: 72, height: 72, objectFit: 'contain', border: '1px solid #d1e6d8', borderRadius: 1, bgcolor: '#fff' }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2">{selectedLogo?.name}</Typography>
                                        </Box>
                                        <IconButton onClick={handleRemoveLogo} size="small" color="error">
                                            <DeleteOutline />
                                        </IconButton>
                                    </Stack>
                                )}
                            </Box>

                            <Box sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, borderBottom: '1px solid #e8f3eb', pb: 2 }}>
                                    <Extension sx={{ color: '#19b34d' }} />
                                    <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>Enabled Modules</Typography>
                                </Box>
                                <Stack spacing={1}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={values.qr_system}
                                                onChange={(e) => setFieldValue('qr_system', e.target.checked)}
                                                color="primary"
                                            />
                                        }
                                        label="QR System"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={values.label_with_qr || values.label_without_qr}
                                                onChange={(e) => {
                                                    const enabled = e.target.checked;
                                                    setFieldValue('label_with_qr', enabled);
                                                    if (!enabled) setFieldValue('label_without_qr', false);
                                                }}
                                                color="primary"
                                            />
                                        }
                                        label="Label System"
                                    />
                                    {(values.label_with_qr || values.label_without_qr) && (
                                        <Box sx={{ pl: 4, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={values.label_with_qr}
                                                        onChange={() => {
                                                            setFieldValue('label_with_qr', true);
                                                            setFieldValue('label_without_qr', false);
                                                        }}
                                                    />
                                                }
                                                label="Label with QR"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={values.label_without_qr}
                                                        onChange={() => {
                                                            setFieldValue('label_without_qr', true);
                                                            setFieldValue('label_with_qr', false);
                                                        }}
                                                    />
                                                }
                                                label="Label without QR"
                                            />
                                        </Box>
                                    )}
                                </Stack>
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
