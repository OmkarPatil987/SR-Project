import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import dayjs, { Dayjs } from "dayjs";

// MUI Imports
import {
    Box, Button, Card, CardContent, Grid, TextField,
    IconButton, Autocomplete, CircularProgress,
    InputAdornment, Typography, Breadcrumbs, Link,
    Divider, Stack
} from "@mui/material";
import {
    ArrowBack, QrCode, InfoOutlined, GavelOutlined,
    ChevronRight, CalendarToday, EventBusy, Visibility,
    LightbulbOutlined, Sync, QrCode2, Layers, Business
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Redux & Services
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import PageHead from "../../../components/common/page/PageHead";
import { FetchProductListService, FetchQRDetailsService, StoreQRService, UpdateQRService } from "../../../utils/services/product.service";

interface FormValues {
    product_master_uuid: string;
    type: "static" | "dynamic" | "bulk";
    gazette_notification_number: string;
    gazette_notification_date: Dayjs | null;
    biostimulant_title: string;
    biostimulant_composition: string;
    crops: string;
    doses: string;
    application_method: string;
    manufacturer_details: string;
    company_name: string;
    batch_name: string;
    manufacturing_date: Dayjs | null;
    expiry_date: Dayjs | null;
}

const qrValidationSchema = Yup.object().shape({
    product_master_uuid: Yup.string().required("Product selection is required"),
    batch_name: Yup.string().required("Batch name/number is required"),
    company_name: Yup.string().required("Company name is required"),
    manufacturing_date: Yup.date().nullable().required("Mfg Date is required"),
    expiry_date: Yup.date().nullable().min(Yup.ref('manufacturing_date'), "Expiry must be after Mfg Date").required("Expiry Date is required"),
    gazette_notification_number: Yup.string().required("Gazette No. is required"),
    gazette_notification_date: Yup.date().nullable().required("Gazette Date is required"),
    type: Yup.string().required("QR Type is required"),
});

const QRForm: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    const uuid = searchParams.get("uuid");
    const urlType = searchParams.get("type");
    const isEdit = Boolean(uuid);
    const initialType = (urlType === "dynamic" || urlType === "static" || urlType === "bulk") ? urlType : "static";

    const [initialValues, setInitialValues] = useState<FormValues>({
        product_master_uuid: "",
        type: initialType as any,
        gazette_notification_number: "",
        gazette_notification_date: null,
        biostimulant_title: "",
        biostimulant_composition: "",
        crops: "",
        doses: "",
        application_method: "",
        manufacturer_details: "",
        company_name: "",
        batch_name: "",
        manufacturing_date: null,
        expiry_date: null,
    });

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);

    const inputStyles = {
        '& .MuiOutlinedInput-root': { bgcolor: '#f6f8f7', border: 'none' },
        '& fieldset': { border: 'none' }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { code, data } = await FetchProductListService({ offset: 0, limit: 1000 });
                if (code === 200 && data?.data) setProducts(data.data);

                if (isEdit && uuid) {
                    setLoading(true);
                    const res = await FetchQRDetailsService({ qr_uuid: uuid });
                    if (res.code === 200 && res.data) {
                        const d = res.data;
                        setInitialValues({
                            product_master_uuid: d.product_master_uuid || "",
                            type: d.type,
                            gazette_notification_number: d.gazette_notification_number || "",
                            gazette_notification_date: d.gazette_notification_date ? dayjs(d.gazette_notification_date) : null,
                            biostimulant_title: d.biostimulant_title || "",
                            biostimulant_composition: d.biostimulant_composition || "",
                            crops: d.crops || "",
                            doses: d.doses || "",
                            application_method: d.application_method || "",
                            manufacturer_details: d.manufacturer_details || "",
                            company_name: d.company_name || "",
                            batch_name: d.batch_name || "",
                            manufacturing_date: d.manufacturing_date ? dayjs(d.manufacturing_date) : null,
                            expiry_date: d.expiry_date ? dayjs(d.expiry_date) : null,
                        });
                    }
                }
            } finally { setLoading(false); }
        };
        fetchInitialData();
    }, [isEdit, uuid]);

    const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        const payload = {
            ...values,
            gazette_notification_date: values.gazette_notification_date?.format('YYYY-MM-DD'),
            manufacturing_date: values.manufacturing_date?.format('YYYY-MM-DD'),
            expiry_date: values.expiry_date?.format('YYYY-MM-DD'),
        };
        const response = isEdit ? await UpdateQRService({ ...payload, qr_uuid: uuid }) : await StoreQRService(payload);

        if (response.code === 200) {
            dispatch(showSnackbar({ type: "success", message: "QR Processed Successfully" }));
            navigate(values.type === "dynamic" ? "/admin/dynamic-qr" : "/admin/static-qr");
        }
        setSubmitting(false);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: '#06f957' }} /></Box>;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ maxWidth: '1024px', mx: 'auto', p: { xs: 2, md: 4 }, fontFamily: 'Manrope' }}>
                <Breadcrumbs separator={<ChevronRight fontSize="small" />} sx={{ mb: 3 }}>
                    <Link underline="hover" sx={{ color: '#06f957', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate("/admin/qr")}>QR Management</Link>
                    <Typography color="text.secondary" sx={{ fontWeight: 500 }}>Generate QR Code</Typography>
                </Breadcrumbs>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f2316', mb: 1 }}>Generate QR Code</Typography>
                    <Typography variant="body1" color="text.secondary">Provide batch and regulatory details for compliance.</Typography>
                </Box>

                <Formik initialValues={initialValues} validationSchema={qrValidationSchema} onSubmit={handleSubmit} enableReinitialize>
                    {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
                        <Form>
                            {/* QR Type Toggle */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#888', textTransform: 'uppercase', mb: 1.5, display: 'block', letterSpacing: 1 }}>
                                    QR Code Type
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    {[
                                        { id: 'dynamic', label: 'Dynamic', icon: <Sync /> },
                                        { id: 'static', label: 'Static', icon: <QrCode2 /> },
                                        { id: 'bulk', label: 'Bulk', icon: <Layers /> }
                                    ].map((item) => (
                                        <Box
                                            key={item.id}
                                            onClick={() => setFieldValue('type', item.id)}
                                            sx={{
                                                flex: 1, cursor: 'pointer', height: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '20px',
                                                border: values.type === item.id ? '2px solid #06f957' : '1px solid #e0e0e0',
                                                bgcolor: values.type === item.id ? 'rgba(6, 249, 87, 0.05)' : '#fff',
                                                transition: 'all 0.2s ease', '&:hover': { borderColor: '#06f957' }
                                            }}
                                        >
                                            <Box sx={{ color: values.type === item.id ? '#0f2316' : '#999', mb: 0.5 }}>
                                                {React.cloneElement(item.icon as React.ReactElement, { sx: { fontSize: 24 } })}
                                            </Box>
                                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: values.type === item.id ? '#0f2316' : '#999' }}>{item.label}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>

                            <Card sx={{ borderRadius: 4, border: '1px solid #e0e0e0', boxShadow: 'none', overflow: 'hidden' }}>
                                {/* Section 1 */}
                                <Box sx={{ p: 4 }}>
                                    <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                                        <Box sx={{ bgcolor: 'rgba(6, 249, 87, 0.1)', p: 1, borderRadius: 2, display: 'flex' }}><InfoOutlined sx={{ color: '#06f957' }} /></Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Section 1: Core Information</Typography>
                                    </Stack>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Select Product</Typography>
                                            <Autocomplete
                                                options={products} getOptionLabel={(option) => option.name || ""}
                                                value={products.find(p => p.uuid === values.product_master_uuid) || null}
                                                onChange={(_, val) => setFieldValue("product_master_uuid", val ? val.uuid : "")}
                                                renderInput={(params) => (
                                                    <TextField {...params}
                                                        placeholder="Choose product..."
                                                        error={touched.product_master_uuid && !!errors.product_master_uuid}
                                                        helperText={touched.product_master_uuid && errors.product_master_uuid}
                                                        sx={inputStyles}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Company Name</Typography>
                                            <TextField
                                                fullWidth name="company_name"
                                                placeholder="Choose enterprise..."
                                                value={values.company_name} onChange={handleChange}
                                                error={touched.company_name && !!errors.company_name}
                                                helperText={touched.company_name && errors.company_name}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Batch Name / Number</Typography>
                                            <TextField
                                                fullWidth name="batch_name"
                                                placeholder="e.g. BT-2024-XP-001"
                                                value={values.batch_name} onChange={handleChange}
                                                error={touched.batch_name && !!errors.batch_name}
                                                helperText={touched.batch_name && errors.batch_name}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Manufacturing Date</Typography>
                                            <DatePicker
                                                value={values.manufacturing_date}
                                                onChange={(val) => setFieldValue("manufacturing_date", val)}
                                                slotProps={{ textField: { fullWidth: true, placeholder: "Select date", sx: inputStyles, error: touched.manufacturing_date && !!errors.manufacturing_date, helperText: touched.manufacturing_date && errors.manufacturing_date as string } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Expiry Date</Typography>
                                            <DatePicker
                                                value={values.expiry_date}
                                                onChange={(val) => setFieldValue("expiry_date", val)}
                                                slotProps={{ textField: { fullWidth: true, placeholder: "Select date", sx: inputStyles, error: touched.expiry_date && !!errors.expiry_date, helperText: touched.expiry_date && errors.expiry_date as string } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Manufacturer Details</Typography>
                                            <TextField
                                                fullWidth multiline rows={2}
                                                name="manufacturer_details"
                                                placeholder="Enter full manufacturing address..."
                                                value={values.manufacturer_details} onChange={handleChange}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider sx={{ borderColor: '#f0f0f0' }} />

                                {/* Section 2 */}
                                <Box sx={{ p: 4, bgcolor: '#fafafa' }}>
                                    <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                                        <Box sx={{ bgcolor: 'rgba(6, 249, 87, 0.1)', p: 1, borderRadius: 2, display: 'flex' }}><GavelOutlined sx={{ color: '#06f957' }} /></Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Section 2: Regulatory Details</Typography>
                                    </Stack>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Gazette No.</Typography>
                                            <TextField
                                                fullWidth name="gazette_notification_number"
                                                placeholder="e.g. REG-2024-001"
                                                value={values.gazette_notification_number} onChange={handleChange}
                                                error={touched.gazette_notification_number && !!errors.gazette_notification_number}
                                                helperText={touched.gazette_notification_number && errors.gazette_notification_number}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Gazette Date</Typography>
                                            <DatePicker
                                                value={values.gazette_notification_date}
                                                onChange={(val) => setFieldValue("gazette_notification_date", val)}
                                                slotProps={{ textField: { fullWidth: true, placeholder: "Select date", sx: inputStyles, error: touched.gazette_notification_date && !!errors.gazette_notification_date, helperText: touched.gazette_notification_date && errors.gazette_notification_date as string } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Biostimulant Title</Typography>
                                            <TextField
                                                fullWidth name="biostimulant_title"
                                                placeholder="Enter official title..."
                                                value={values.biostimulant_title} onChange={handleChange}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Chemical Composition (%)</Typography>
                                            <TextField
                                                fullWidth multiline rows={3}
                                                name="biostimulant_composition"
                                                placeholder="List active ingredients and concentrations..."
                                                value={values.biostimulant_composition} onChange={handleChange}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Target Crops</Typography>
                                            <TextField
                                                fullWidth name="crops"
                                                placeholder="e.g. Wheat, Rice"
                                                value={values.crops} onChange={handleChange}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Doses</Typography>
                                            <TextField
                                                fullWidth name="doses"
                                                placeholder="e.g. 2ml/L"
                                                value={values.doses} onChange={handleChange}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Application Method</Typography>
                                            <TextField
                                                fullWidth name="application_method"
                                                placeholder="e.g. Foliar Spray"
                                                value={values.application_method} onChange={handleChange}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box sx={{ p: 4, display: 'flex', justifyContent: 'flex-end', gap: 2, bgcolor: '#fff' }}>
                                    <Button variant="outlined" onClick={() => navigate("/admin/qr")} sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}>Cancel</Button>
                                    <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ bgcolor: '#06f957', color: '#000', borderRadius: 2, px: 5, fontWeight: 800, boxShadow: '0 8px 16px rgba(6, 249, 87, 0.2)', '&:hover': { bgcolor: '#05e64f' } }}>
                                        {isSubmitting ? "Processing..." : "Generate QR"}
                                    </Button>
                                </Box>
                            </Card>
                        </Form>
                    )}
                </Formik>
            </Box>
        </LocalizationProvider>
    );
};

export default QRForm;