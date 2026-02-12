import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Card,
    Divider,
    Grid,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
import { GenerateCompanyCaptchaTokenService, RegisterCompanyService } from '../../../utils/services/product.service';

interface CaptchaToken {
    session_id: string;
    question: string;
    form_load_time: number;
}

interface CompanyRegisterValues {
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
    captcha_answer: string;
    honeypot: string;
}

const validationSchema = Yup.object().shape({
    company_name: Yup.string().required('Company name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    mobile: Yup.string().nullable().notRequired(),
    state: Yup.string().nullable().notRequired(),
    city: Yup.string().nullable().notRequired(),
    pincode: Yup.string().nullable().notRequired(),
    address: Yup.string().nullable().notRequired(),
    gst_no: Yup.string().nullable().notRequired(),
    pan_no: Yup.string().nullable().notRequired(),
    bank_account_no: Yup.string().nullable().notRequired(),
    bank_ifsc_code: Yup.string().nullable().notRequired(),
    referral_name: Yup.string().nullable().notRequired(),
    captcha_answer: Yup.string().required('Captcha answer is required'),
});

const initialValues: CompanyRegisterValues = {
    company_name: '',
    email: '',
    mobile: '',
    state: '',
    city: '',
    pincode: '',
    address: '',
    gst_no: '',
    pan_no: '',
    bank_account_no: '',
    bank_ifsc_code: '',
    referral_name: '',
    captcha_answer: '',
    honeypot: '',
};

const CompanyRegister = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [captchaToken, setCaptchaToken] = useState<CaptchaToken | null>(null);
    const [loadingCaptcha, setLoadingCaptcha] = useState(false);

    const fetchCaptchaToken = async () => {
        setLoadingCaptcha(true);
        const { code, data } = await GenerateCompanyCaptchaTokenService({});
        if (code === 200 && data?.session_id) {
            setCaptchaToken({
                session_id: data.session_id,
                question: data.question,
                form_load_time: data.form_load_time,
            });
        } else {
            setCaptchaToken(null);
            dispatch(showSnackbar({ type: 'error', message: 'Failed to load captcha. Please try again.' }));
        }
        setLoadingCaptcha(false);
    };

    useEffect(() => {
        fetchCaptchaToken();
    }, []);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (!captchaToken?.session_id) {
                dispatch(showSnackbar({ type: 'error', message: 'Captcha session missing. Please refresh captcha.' }));
                return;
            }

            const payload = {
                company_name: values.company_name,
                email: values.email,
                mobile: values.mobile,
                state: values.state,
                city: values.city,
                pincode: values.pincode,
                address: values.address,
                gst_no: values.gst_no,
                pan_no: values.pan_no,
                bank_account_no: values.bank_account_no,
                bank_ifsc_code: values.bank_ifsc_code,
                referral_name: values.referral_name,
                session_id: captchaToken.session_id,
                captcha_answer: Number(values.captcha_answer),
                form_load_time: captchaToken.form_load_time,
                honeypot: values.honeypot,
            };

            const { code, message } = await RegisterCompanyService(payload);
            if (code === 200) {
                dispatch(showSnackbar({ type: 'success', message: 'Company registration submitted successfully.' }));
                resetForm();
                navigate('/home');
            } else {
                dispatch(showSnackbar({ type: 'error', message: message || 'Failed to register company.' }));
                fetchCaptchaToken();
            }
        },
    });

    return (
        <Box sx={{ maxWidth: '1200px', mx: 'auto', py: 4, px: 2 }}>
            <Card sx={{ borderRadius: '16px', border: '1px solid #e8f3eb', boxShadow: '0 10px 30px rgba(13,27,21,0.06)', overflow: 'hidden' }}>
                <Box sx={{ p: 4, borderBottom: '1px solid #e8f3eb', bgcolor: '#f6fbf8' }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#0e1b12' }}>Company Registration</Typography>
                    <Typography sx={{ color: '#4c9a74', mt: 1 }}>
                        Submit your company details for verification and approval.
                    </Typography>
                </Box>

                <form onSubmit={formik.handleSubmit}>
                    <Box sx={{ p: 4 }}>
                        <Typography sx={{ fontSize: '13px', letterSpacing: '0.08em', fontWeight: 800, color: '#2f6d4f', mb: 2 }}>
                            BASIC INFORMATION
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Company Name *"
                                    name="company_name"
                                    value={formik.values.company_name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.company_name && !!formik.errors.company_name}
                                    helperText={formik.touched.company_name && formik.errors.company_name}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Email Address *"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && !!formik.errors.email}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Mobile Number"
                                    name="mobile"
                                    value={formik.values.mobile}
                                    onChange={(e) => {
                                        const filtered = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        formik.setFieldValue('mobile', filtered);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider />

                    <Box sx={{ p: 4, bgcolor: '#f8fbf9' }}>
                        <Typography sx={{ fontSize: '13px', letterSpacing: '0.08em', fontWeight: 800, color: '#2f6d4f', mb: 2 }}>
                            ADDRESS
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth size="small" label="State" name="state" value={formik.values.state} onChange={formik.handleChange} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField fullWidth size="small" label="City" name="city" value={formik.values.city} onChange={formik.handleChange} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Pincode"
                                    name="pincode"
                                    value={formik.values.pincode}
                                    onChange={(e) => {
                                        const filtered = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        formik.setFieldValue('pincode', filtered);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth size="small" multiline rows={3} label="Full Address" name="address" value={formik.values.address} onChange={formik.handleChange} />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider />

                    <Box sx={{ p: 4 }}>
                        <Typography sx={{ fontSize: '13px', letterSpacing: '0.08em', fontWeight: 800, color: '#2f6d4f', mb: 2 }}>
                            LEGAL & BANKING
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth size="small" label="GST Number" name="gst_no" value={formik.values.gst_no} onChange={formik.handleChange} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth size="small" label="PAN Number" name="pan_no" value={formik.values.pan_no} onChange={formik.handleChange} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth size="small" label="Bank Account No" name="bank_account_no" value={formik.values.bank_account_no} onChange={formik.handleChange} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth size="small" label="IFSC Code" name="bank_ifsc_code" value={formik.values.bank_ifsc_code} onChange={formik.handleChange} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField fullWidth size="small" label="Referral Name" name="referral_name" value={formik.values.referral_name} onChange={formik.handleChange} />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider />

                    <Box sx={{ p: 4, bgcolor: '#f8fbf9' }}>
                        <Typography sx={{ fontSize: '13px', letterSpacing: '0.08em', fontWeight: 800, color: '#2f6d4f', mb: 2 }}>
                            CAPTCHA VERIFICATION
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ px: 2, py: 1.5, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: 1, minHeight: 42 }}>
                                        <Typography sx={{ fontWeight: 700 }}>
                                            {captchaToken?.question || (loadingCaptcha ? 'Loading captcha...' : 'No captcha loaded')}
                                        </Typography>
                                    </Box>
                                    <IconButton onClick={fetchCaptchaToken} disabled={loadingCaptcha} aria-label="Refresh Captcha" size="small" sx={{ border: '1px solid #ccc' }}>
                                        <Refresh fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Captcha Answer *"
                                    name="captcha_answer"
                                    value={formik.values.captcha_answer}
                                    onChange={(e) => {
                                        const filtered = e.target.value.replace(/\D/g, '').slice(0, 4);
                                        formik.setFieldValue('captcha_answer', filtered);
                                    }}
                                    error={formik.touched.captcha_answer && !!formik.errors.captcha_answer}
                                    helperText={formik.touched.captcha_answer && formik.errors.captcha_answer}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <TextField
                        name="honeypot"
                        value={formik.values.honeypot}
                        onChange={formik.handleChange}
                        sx={{ display: 'none' }}
                    />

                    <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="contained" sx={{ bgcolor: '#19b34d', '&:hover': { bgcolor: '#159a41' }, borderRadius: '8px', px: 4, textTransform: 'none', fontWeight: 'bold' }}>
                            Submit Registration
                        </Button>
                    </Box>
                </form>
            </Card>
        </Box>
    );
};

export default CompanyRegister;
