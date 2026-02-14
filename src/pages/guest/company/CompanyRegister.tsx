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
    InputAdornment,
    TextField,
    Typography
} from '@mui/material';
import {
    Refresh,
    Business,
    Email,
    Phone,
    LocationOn,
    LocationCity,
    MarkunreadMailbox,
    Home,
    CreditCard,
    AccountBalance,
    Badge,
    People
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
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
        <Box sx={{ maxWidth: '1200px', mx: 'auto', py: { xs: 3, md: 5 }, px: { xs: 2, md: 3 } }}>
            <Card
                sx={{
                    borderRadius: '22px',
                    border: '1px solid #e8f3eb',
                    boxShadow: '0 14px 36px rgba(13,27,21,0.08)',
                    overflow: 'hidden',
                    transition: 'box-shadow 200ms ease',
                    '&:hover': { boxShadow: '0 20px 44px rgba(13,27,21,0.12)' },
                }}
            >
                <Box sx={{ p: { xs: 3, md: 4 }, borderBottom: '1px solid #e8f3eb', bgcolor: '#f6fbf8' }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#0e1b12', lineHeight: 1.1 }}>
                        Company Registration
                    </Typography>
                    <Typography sx={{ color: '#4c9a74', mt: 1, maxWidth: 680 }}>
                        Submit your company details for verification and approval. Fields marked with * are required.
                    </Typography>
                </Box>

                <form onSubmit={formik.handleSubmit}>
                    <Box sx={{ p: { xs: 3, md: 4 } }}>
                        <Typography sx={{ fontSize: '12px', letterSpacing: '0.12em', fontWeight: 800, color: '#2f6d4f', mb: 2 }}>
                            BASIC INFORMATION
                        </Typography>
                        <Grid container spacing={{ xs: 2, md: 3 }}>
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Business fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Mobile Number *"
                                    name="mobile"
                                    value={formik.values.mobile}
                                    onChange={(e) => {
                                        const filtered = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        formik.setFieldValue('mobile', filtered);
                                    }}
                                    inputProps={{ inputMode: 'numeric' }}
                                    error={formik.touched.mobile && !!formik.errors.mobile}
                                    helperText={formik.touched.mobile && formik.errors.mobile}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider />

                    <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: '#f8fbf9' }}>
                        <Typography sx={{ fontSize: '12px', letterSpacing: '0.12em', fontWeight: 800, color: '#2f6d4f', mb: 2 }}>
                            ADDRESS
                        </Typography>
                        <Grid container spacing={{ xs: 2, md: 3 }}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="State *"
                                    name="state"
                                    value={formik.values.state}
                                    onChange={formik.handleChange}
                                    error={formik.touched.state && !!formik.errors.state}
                                    helperText={formik.touched.state && formik.errors.state}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationOn fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="City *"
                                    name="city"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    error={formik.touched.city && !!formik.errors.city}
                                    helperText={formik.touched.city && formik.errors.city}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationCity fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Pincode *"
                                    name="pincode"
                                    value={formik.values.pincode}
                                    onChange={(e) => {
                                        const filtered = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        formik.setFieldValue('pincode', filtered);
                                    }}
                                    inputProps={{ inputMode: 'numeric' }}
                                    error={formik.touched.pincode && !!formik.errors.pincode}
                                    helperText={formik.touched.pincode && formik.errors.pincode}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MarkunreadMailbox fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    multiline
                                    rows={3}
                                    label="Full Address *"
                                    name="address"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    error={formik.touched.address && !!formik.errors.address}
                                    helperText={formik.touched.address && formik.errors.address}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                <Home fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider />

                    <Box sx={{ p: { xs: 3, md: 4 } }}>
                        <Typography sx={{ fontSize: '12px', letterSpacing: '0.12em', fontWeight: 800, color: '#2f6d4f', mb: 2 }}>
                            LEGAL & BANKING
                        </Typography>
                        <Grid container spacing={{ xs: 2, md: 3 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="GST Number"
                                    name="gst_no"
                                    value={formik.values.gst_no}
                                    onChange={(e) => formik.setFieldValue('gst_no', e.target.value.toUpperCase())}
                                    error={formik.touched.gst_no && !!formik.errors.gst_no}
                                    helperText={formik.touched.gst_no && formik.errors.gst_no}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Badge fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="PAN Number"
                                    name="pan_no"
                                    value={formik.values.pan_no}
                                    onChange={(e) => formik.setFieldValue('pan_no', e.target.value.toUpperCase())}
                                    error={formik.touched.pan_no && !!formik.errors.pan_no}
                                    helperText={formik.touched.pan_no && formik.errors.pan_no}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CreditCard fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Bank Account No"
                                    name="bank_account_no"
                                    value={formik.values.bank_account_no}
                                    onChange={(e) => {
                                        const filtered = e.target.value.replace(/\D/g, '').slice(0, 18);
                                        formik.setFieldValue('bank_account_no', filtered);
                                    }}
                                    inputProps={{ inputMode: 'numeric' }}
                                    error={formik.touched.bank_account_no && !!formik.errors.bank_account_no}
                                    helperText={formik.touched.bank_account_no && formik.errors.bank_account_no}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountBalance fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="IFSC Code"
                                    name="bank_ifsc_code"
                                    value={formik.values.bank_ifsc_code}
                                    onChange={(e) => formik.setFieldValue('bank_ifsc_code', e.target.value.toUpperCase())}
                                    error={formik.touched.bank_ifsc_code && !!formik.errors.bank_ifsc_code}
                                    helperText={formik.touched.bank_ifsc_code && formik.errors.bank_ifsc_code}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountBalance fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Referral Name"
                                    name="referral_name"
                                    value={formik.values.referral_name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.referral_name && !!formik.errors.referral_name}
                                    helperText={formik.touched.referral_name && formik.errors.referral_name}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <People fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider />

                    <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: '#f8fbf9' }}>
                        <Typography sx={{ fontSize: '12px', letterSpacing: '0.12em', fontWeight: 800, color: '#2f6d4f', mb: 2 }}>
                            CAPTCHA VERIFICATION
                        </Typography>
                        <Box
                            sx={(theme) => ({
                                p: { xs: 2.5, md: 3 },
                                borderRadius: 3,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                bgcolor: alpha(theme.palette.primary.main, 0.06),
                            })}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    alignItems: { xs: 'flex-start', md: 'center' },
                                    justifyContent: 'space-between',
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Typography sx={{ fontWeight: 800, color: 'text.primary' }}>Human Verification</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Please solve this simple math problem.
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                    <Box
                                        sx={(theme) => ({
                                            px: 2.5,
                                            py: 1.2,
                                            bgcolor: '#fff',
                                            borderRadius: 2,
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                            color: 'primary.main',
                                            fontWeight: 800,
                                            minWidth: 120,
                                            textAlign: 'center',
                                        })}
                                    >
                                        {captchaToken?.question || (loadingCaptcha ? 'Loading...' : 'No captcha')}
                                    </Box>
                                    <TextField
                                        size="small"
                                        label="Answer"
                                        name="captcha_answer"
                                        value={formik.values.captcha_answer}
                                        onChange={(e) => {
                                            const filtered = e.target.value.replace(/\D/g, '').slice(0, 4);
                                            formik.setFieldValue('captcha_answer', filtered);
                                        }}
                                        error={formik.touched.captcha_answer && !!formik.errors.captcha_answer}
                                        helperText={formik.touched.captcha_answer && formik.errors.captcha_answer}
                                        sx={{ width: { xs: '100%', sm: 160 }, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
                                    />
                                    <IconButton
                                        onClick={fetchCaptchaToken}
                                        disabled={loadingCaptcha}
                                        aria-label="Refresh Captcha"
                                        size="small"
                                        sx={(theme) => ({ border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}` })}
                                    >
                                        <Refresh fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <TextField
                        name="honeypot"
                        value={formik.values.honeypot}
                        onChange={formik.handleChange}
                        sx={{ display: 'none' }}
                    />

                    <Box sx={{ p: { xs: 3, md: 4 }, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                bgcolor: '#19b34d',
                                '&:hover': { bgcolor: '#159a41' },
                                borderRadius: '10px',
                                px: 4,
                                py: 1.2,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                boxShadow: '0 8px 20px rgba(25,179,77,0.25)',
                            }}
                        >
                            Submit Registration
                        </Button>
                    </Box>
                </form>
            </Card>
        </Box>
    );
};

export default CompanyRegister;
