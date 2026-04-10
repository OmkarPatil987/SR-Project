import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Card, CircularProgress, Divider, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import {
    Business,
    Email,
    Phone,
    Place,
    AccountBalance,
    ReceiptLong,
} from '@mui/icons-material';
import { RootState } from '../../../redux/store';
import { FetchCompanyDetailsService, UpdateCompanyService } from '../../../utils/services/product.service';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

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
}

const profileValidationSchema = Yup.object().shape({
    company_name: Yup.string().nullable(),
    email: Yup.string().email('Invalid email').nullable(),
    mobile: Yup.string().nullable(),
    state: Yup.string().nullable(),
    city: Yup.string().nullable(),
    pincode: Yup.string().nullable(),
    address: Yup.string().nullable(),
    license_no: Yup.string().nullable(),
    gst_no: Yup.string().nullable(),
    pan_no: Yup.string().nullable(),
    bank_account_no: Yup.string().nullable(),
    bank_ifsc_code: Yup.string().nullable(),
    referral_name: Yup.string().nullable(),
});

const defaultValues: FormValues = {
    company_name: '',
    email: '',
    mobile: '',
    state: '',
    city: '',
    pincode: '',
    address: '',
    license_no: '',
    gst_no: '',
    pan_no: '',
    bank_account_no: '',
    bank_ifsc_code: '',
    referral_name: '',
};

const CompanyProfile = () => {
    const dispatch = useDispatch();
    const authUser = useSelector((state: RootState) => state.authUser);
    const companyUuid = authUser?.userDetails?.company_uuid;

    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [initialValues, setInitialValues] = useState<FormValues>(defaultValues);

    useEffect(() => {
        const fetchCompany = async () => {
            if (!companyUuid) return;
            setLoading(true);
            const { data, code } = await FetchCompanyDetailsService({ company_uuid: companyUuid });
            if (code === 200 && data) {
                const companyData = data.company || data;
                setInitialValues({
                    ...defaultValues,
                    ...companyData,
                });
            } else {
                dispatch(showSnackbar({ type: 'error', message: 'Failed to fetch company details.' }));
            }
            setLoading(false);
        };
        fetchCompany();
    }, [companyUuid, dispatch]);

    const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
        if (!companyUuid) return;
        const response = await UpdateCompanyService({ ...values, company_uuid: companyUuid });
        if (response.code === 200) {
            dispatch(showSnackbar({ type: 'success', message: 'Company profile updated successfully.' }));
            setIsEditing(false);
            resetForm({ values });
        } else {
            dispatch(showSnackbar({ type: 'error', message: response?.message || 'Failed to update profile.' }));
        }
        setSubmitting(false);
    };

    if (!companyUuid) {
        return (
            <Box sx={{ maxWidth: '1000px', mx: 'auto', py: 6, px: 2 }}>
                <Card sx={{ p: 4, borderRadius: '12px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Company profile not available</Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                        Your login does not include a company profile. Please contact support.
                    </Typography>
                </Card>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: '1100px', mx: 'auto', py: { xs: 3, md: 5 }, px: { xs: 2, md: 3 } }}>
            <Formik
                initialValues={initialValues}
                validationSchema={profileValidationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, errors, touched, handleChange, isSubmitting, resetForm }) => (
                    <Form noValidate>
                        <Card
                            sx={{
                                borderRadius: '18px',
                                p: { xs: 2, md: 3 },
                                mb: 3,
                                border: '1px solid #e6efe9',
                                boxShadow: '0 6px 24px rgba(16, 24, 40, 0.06)',
                                transition: 'box-shadow 200ms ease',
                                '&:hover': { boxShadow: '0 10px 30px rgba(16, 24, 40, 0.10)' },
                            }}
                        >
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
                                <Stack spacing={0.5}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Business sx={{ color: '#19b34d' }} />
                                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0e1b12' }}>
                                            {values.company_name || 'Company Profile'}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        View and update your company details.
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                {isEditing ? (
                                    <>
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                resetForm();
                                                setIsEditing(false);
                                            }}
                                            sx={{ textTransform: 'none', borderRadius: '10px', px: 3 }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={isSubmitting}
                                            sx={{
                                                textTransform: 'none',
                                                bgcolor: '#19b34d',
                                                borderRadius: '10px',
                                                px: 3,
                                                '&:hover': { bgcolor: '#159a41' },
                                            }}
                                        >
                                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={() => setIsEditing(true)}
                                        sx={{
                                            textTransform: 'none',
                                            bgcolor: '#19b34d',
                                            borderRadius: '10px',
                                            px: 3,
                                            '&:hover': { bgcolor: '#159a41' },
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                                </Stack>
                            </Stack>
                        </Card>

                        <Card
                            sx={{
                                borderRadius: '18px',
                                border: '1px solid #e6efe9',
                                boxShadow: '0 6px 24px rgba(16, 24, 40, 0.06)',
                                overflow: 'hidden',
                                transition: 'box-shadow 200ms ease',
                                '&:hover': { boxShadow: '0 10px 30px rgba(16, 24, 40, 0.10)' },
                            }}
                        >
                            <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                                    <Email sx={{ color: '#19b34d' }} />
                                    <Typography sx={{ fontSize: '18px', fontWeight: 800 }}>Basic Information</Typography>
                                </Stack>
                                <Grid container spacing={{ xs: 2, md: 3 }}>
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <Business sx={{ fontSize: 16, color: '#5b8b6b' }} />
                                            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#5b8b6b' }}>COMPANY NAME</Typography>
                                        </Stack>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="company_name"
                                                value={values.company_name}
                                                onChange={handleChange}
                                                disabled
                                            />
                                        ) : (
                                            <Card sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f7faf8', border: '1px solid #e6efe9' }}>
                                                <Typography sx={{ fontWeight: 700 }}>{values.company_name || '-'}</Typography>
                                            </Card>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <Email sx={{ fontSize: 16, color: '#5b8b6b' }} />
                                            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#5b8b6b' }}>EMAIL ADDRESS</Typography>
                                        </Stack>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                disabled
                                                error={touched.email && !!errors.email}
                                                helperText={touched.email && errors.email}
                                            />
                                        ) : (
                                            <Card sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f7faf8', border: '1px solid #e6efe9' }}>
                                                <Typography sx={{ fontWeight: 700 }}>{values.email || '-'}</Typography>
                                            </Card>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <Phone sx={{ fontSize: 16, color: '#5b8b6b' }} />
                                            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#5b8b6b' }}>MOBILE NUMBER</Typography>
                                        </Stack>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="mobile"
                                                value={values.mobile}
                                                onChange={handleChange}
                                                disabled
                                            />
                                        ) : (
                                            <Card sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f7faf8', border: '1px solid #e6efe9' }}>
                                                <Typography sx={{ fontWeight: 700 }}>{values.mobile || '-'}</Typography>
                                            </Card>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>

                            <Divider />

                            <Box sx={{ p: { xs: 2.5, md: 4 }, bgcolor: '#f8fbf9' }}>
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                                    <Place sx={{ color: '#19b34d' }} />
                                    <Typography sx={{ fontSize: '18px', fontWeight: 800 }}>Address & Location</Typography>
                                </Stack>
                                <Grid container spacing={{ xs: 2, md: 3 }}>
                                    <Grid item xs={12} md={6}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#5b8b6b', mb: 1 }}>STATE</Typography>
                                        {isEditing ? (
                                            <TextField
                                                select
                                                fullWidth
                                                size="small"
                                                name="state"
                                                value={values.state}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            >
                                                <MenuItem value="">Select State</MenuItem>
                                                <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                                                <MenuItem value="Gujarat">Gujarat</MenuItem>
                                            </TextField>
                                        ) : (
                                            <Card sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#ffffff', border: '1px solid #e6efe9' }}>
                                                <Typography sx={{ fontWeight: 700 }}>{values.state || '-'}</Typography>
                                            </Card>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#5b8b6b', mb: 1 }}>CITY</Typography>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="city"
                                                placeholder="Enter City"
                                                value={values.city}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        ) : (
                                            <Card sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#ffffff', border: '1px solid #e6efe9' }}>
                                                <Typography sx={{ fontWeight: 700 }}>{values.city || '-'}</Typography>
                                            </Card>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#5b8b6b', mb: 1 }}>PINCODE</Typography>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="pincode"
                                                placeholder="400001"
                                                value={values.pincode}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        ) : (
                                            <Card sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#ffffff', border: '1px solid #e6efe9' }}>
                                                <Typography sx={{ fontWeight: 700 }}>{values.pincode || '-'}</Typography>
                                            </Card>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#5b8b6b', mb: 1 }}>FULL ADDRESS</Typography>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                name="address"
                                                placeholder="Street, Building..."
                                                value={values.address}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        ) : (
                                            <Card sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#ffffff', border: '1px solid #e6efe9' }}>
                                                <Typography sx={{ fontWeight: 700, whiteSpace: 'pre-line' }}>{values.address || '-'}</Typography>
                                            </Card>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>

                            <Divider />

                            <Box sx={{ p: { xs: 2.5, md: 4 } }}>
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                                    <AccountBalance sx={{ color: '#19b34d' }} />
                                    <Typography sx={{ fontSize: '18px', fontWeight: 800 }}>Legal & Banking</Typography>
                                </Stack>
                                <Grid container spacing={{ xs: 2, md: 3 }}>
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <ReceiptLong sx={{ fontSize: 16, color: '#5b8b6b' }} />
                                            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#5b8b6b' }}>LICENSE NUMBER</Typography>
                                        </Stack>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="license_no"
                                                placeholder="Enter license number"
                                                value={values.license_no}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        ) : (
                                            <Card sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f7faf8', border: '1px solid #e6efe9' }}>
                                                <Typography sx={{ fontWeight: 700 }}>{values.license_no || '-'}</Typography>
                                            </Card>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <ReceiptLong sx={{ fontSize: 16, color: '#5b8b6b' }} />
                                            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#5b8b6b' }}>GST NUMBER</Typography>
                                        </Stack>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="gst_no"
                                                placeholder="27AAAAA0000A1Z5"
                                                value={values.gst_no}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        ) : (
                                            <Card sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f7faf8', border: '1px solid #e6efe9' }}>
                                                <Typography sx={{ fontWeight: 700 }}>{values.gst_no || '-'}</Typography>
                                            </Card>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <ReceiptLong sx={{ fontSize: 16, color: '#5b8b6b' }} />
                                            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#5b8b6b' }}>PAN NUMBER</Typography>
                                        </Stack>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="pan_no"
                                                placeholder="ABCDE1234F"
                                                value={values.pan_no}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        ) : (
                                            <Card sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f7faf8', border: '1px solid #e6efe9' }}>
                                                <Typography sx={{ fontWeight: 700 }}>{values.pan_no || '-'}</Typography>
                                            </Card>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <AccountBalance sx={{ fontSize: 16, color: '#5b8b6b' }} />
                                            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#5b8b6b' }}>BANK ACCOUNT NO</Typography>
                                        </Stack>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="bank_account_no"
                                                placeholder="0000 0000 0000"
                                                value={values.bank_account_no}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        ) : (
                                            <Card sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f7faf8', border: '1px solid #e6efe9' }}>
                                                <Typography sx={{ fontWeight: 700 }}>{values.bank_account_no || '-'}</Typography>
                                            </Card>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <AccountBalance sx={{ fontSize: 16, color: '#5b8b6b' }} />
                                            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#5b8b6b' }}>IFSC CODE</Typography>
                                        </Stack>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="bank_ifsc_code"
                                                placeholder="SBIN0001234"
                                                value={values.bank_ifsc_code}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        ) : (
                                            <Card sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f7faf8', border: '1px solid #e6efe9' }}>
                                                <Typography sx={{ fontWeight: 700 }}>{values.bank_ifsc_code || '-'}</Typography>
                                            </Card>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <Phone sx={{ fontSize: 16, color: '#5b8b6b' }} />
                                            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#5b8b6b' }}>REFERRAL NAME</Typography>
                                        </Stack>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                name="referral_name"
                                                placeholder="Referral name"
                                                value={values.referral_name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                            />
                                        ) : (
                                            <Card sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f7faf8', border: '1px solid #e6efe9' }}>
                                                <Typography sx={{ fontWeight: 700 }}>{values.referral_name || '-'}</Typography>
                                            </Card>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default CompanyProfile;
