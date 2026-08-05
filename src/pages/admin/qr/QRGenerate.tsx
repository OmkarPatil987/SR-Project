import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import dayjs, { Dayjs } from "dayjs";

// MUI Imports
import {
    Box, Button, Card, Grid, TextField,
    IconButton, Autocomplete, CircularProgress,
    Typography, Breadcrumbs, Link,
    Divider, Stack
} from "@mui/material";
import {
    ArrowBack, InfoOutlined, GavelOutlined,
    ChevronRight, Sync, QrCode2
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Redux & Services
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import PageHead from "../../../components/common/page/PageHead";
import { FetchProductListService, FetchQRDetailsService, StoreQRService, UpdateQRService, FetchProductsGazetteListService } from "../../../utils/services/product.service";
import { getProductCategoryLabel, getProductCategorySingularLabel } from "../../../utils/productCategory";
import DetailTable from "../../../components/common/DetailTable";
import {
    GazetteEntry, CompositionRow, SpecificationRow,
    extractCrops, extractDoses, encodeComposition, decodeComposition, parseGazetteDate
} from "../../../utils/gazette";

interface FormValues {
    product_master_uuid: string;
    type: "static" | "dynamic" | "bulk";
    description: string;
    gtin: string;
    web_link: string;
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
    company_name: Yup.string().required("Company name is required"),
    gazette_notification_number: Yup.string().nullable(),
    gazette_notification_date: Yup.date().nullable(),
    type: Yup.string().required("QR Type is required"),
    batch_name: Yup.string().when('type', {
        is: 'static',
        then: (schema) => schema.required("Batch name/number is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    manufacturing_date: Yup.date().nullable().when('type', {
        is: 'static',
        then: (schema) => schema.required("Mfg Date is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    expiry_date: Yup.date().nullable().when('type', {
        is: 'static',
        then: (schema) => schema.min(Yup.ref('manufacturing_date'), "Expiry must be after Mfg Date").required("Expiry Date is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

const QRForm: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    const uuid = searchParams.get("uuid");
    const qrUuidParam = searchParams.get("qr_uuid") || searchParams.get("detail_uuid");
    const urlType = searchParams.get("type");
    const isEdit = Boolean(qrUuidParam || uuid);
    const initialType = (urlType === "dynamic" || urlType === "static" || urlType === "bulk") ? urlType : "static";

    const [initialValues, setInitialValues] = useState<FormValues>({
        product_master_uuid: "",
        type: initialType as any,
        description: "",
        gtin: "",
        web_link: "",
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

    // Gazette lookup state (Biostimulants only)
    const [gazetteOptions, setGazetteOptions] = useState<GazetteEntry[]>([]);
    const [selectedGazette, setSelectedGazette] = useState<GazetteEntry | null>(null);
    const [gazetteLoading, setGazetteLoading] = useState(false);
    const [composition, setComposition] = useState<CompositionRow[]>([]);
    const [specifications, setSpecifications] = useState<SpecificationRow[]>([]);

    const hasStructuredComposition = composition.length > 0 || specifications.length > 0;

    // Guards the autocomplete race: a slow response for "Bio" must not land
    // after a fast one for "Bioventa" and repopulate the list with stale options.
    const gazetteRequestRef = useRef(0);
    const gazetteDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchGazette = useCallback(async (productName?: string) => {
        const requestId = ++gazetteRequestRef.current;
        setGazetteLoading(true);
        try {
            const payload: any = productName?.trim()
                ? { offset: 0, limit: 20, product_name: productName.trim() }
                : { offset: 0, limit: 5 };
            const { code, data } = await FetchProductsGazetteListService(payload);
            if (requestId !== gazetteRequestRef.current) return; // superseded
            setGazetteOptions(code === 200 && Array.isArray(data?.data) ? data.data : []);
        } catch {
            if (requestId === gazetteRequestRef.current) setGazetteOptions([]);
        } finally {
            if (requestId === gazetteRequestRef.current) setGazetteLoading(false);
        }
    }, []);

    const handleGazetteInputChange = useCallback((value: string, reason: string) => {
        if (reason !== "input") return;
        if (gazetteDebounceRef.current) clearTimeout(gazetteDebounceRef.current);
        gazetteDebounceRef.current = setTimeout(() => fetchGazette(value), 400);
    }, [fetchGazette]);

    useEffect(() => () => {
        if (gazetteDebounceRef.current) clearTimeout(gazetteDebounceRef.current);
    }, []);

    const inputStyles = {
        '& .MuiOutlinedInput-root': { bgcolor: '#f6f8f7', border: 'none' },
        '& fieldset': { border: 'none' }
    };

    // Helper to determine back navigation path based on type
    const getBackPath = (type: string) => {
        if (type === "dynamic") return "/admin/dynamic-qr";
        return "/admin/static-qr";
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { code, data } = await FetchProductListService({ offset: 0, limit: 1000 });
                if (code === 200 && data?.data) setProducts(data.data);

                if (isEdit && (qrUuidParam || uuid)) {
                    setLoading(true);
                    const res = await FetchQRDetailsService({ qr_uuid: qrUuidParam || uuid });
                    if (res.code === 200 && res.data) {
                        // MAPPING BASED ON YOUR PROVIDED JSON STRUCTURE
                        const detail = res.data.product_detail;
                        const master = res.data.product_master;

                        // Structured composition round-trips through the same
                        // string field; legacy prose falls back to the textarea.
                        const decoded = decodeComposition(detail?.biostimulant_composition);
                        if (decoded.kind === "structured") {
                            setComposition(decoded.composition);
                            setSpecifications(decoded.specifications);
                        }

                        // Pre-seed the autocomplete so the saved title shows on edit.
                        if (detail?.biostimulant_title) {
                            setSelectedGazette({ id: -1, product_name: detail.biostimulant_title } as GazetteEntry);
                        }

                        setInitialValues({
                            product_master_uuid: master?.uuid || "",
                            type: detail?.type || "static",
                            description: detail?.description || "",
                            gtin: detail?.gtin || "",
                            web_link: detail?.web_link || "",
                            gazette_notification_number: detail?.gazette_notification_number || "",
                            // Tolerates both the stored ISO form and any
                            // human-readable value saved before the parser existed.
                            gazette_notification_date: parseGazetteDate(detail?.gazette_notification_date),
                            biostimulant_title: detail?.biostimulant_title || "",
                            // Holds only the free-text form; structured rows live in component state.
                            biostimulant_composition: decoded.kind === "text" ? decoded.value : "",
                            crops: detail?.crops || "",
                            doses: detail?.doses || "",
                            application_method: detail?.application_method || "",
                            manufacturer_details: detail?.manufacturer_details || "",
                            company_name: detail?.company_name || "",
                            batch_name: detail?.batch_name || "",
                            manufacturing_date: detail?.manufacturing_date ? dayjs(detail.manufacturing_date) : null,
                            expiry_date: detail?.expiry_date ? dayjs(detail.expiry_date) : null,
                        });
                    }
                }
            } finally { setLoading(false); }
        };
        fetchInitialData();
    }, [isEdit, qrUuidParam, uuid]);

    /**
     * Applies a chosen gazette record to the form. Crops and Doses are filled
     * but stay editable; Application Method is never auto-filled; Gazette
     * No./Date are only written when the record actually carries them, so a
     * null in the dataset does not wipe what the admin already typed.
     */
    const handleGazetteSelect = (
        entry: GazetteEntry | null,
        setFieldValue: (field: string, value: any) => void
    ) => {
        setSelectedGazette(entry);

        if (!entry) {
            setFieldValue("biostimulant_title", "");
            setComposition([]);
            setSpecifications([]);
            return;
        }

        setFieldValue("biostimulant_title", entry.product_name || "");
        setComposition(Array.isArray(entry.composition) ? entry.composition : []);
        setSpecifications(Array.isArray(entry.specifications) ? entry.specifications : []);

        const crops = extractCrops(entry);
        if (crops) setFieldValue("crops", crops);

        const dose = extractDoses(entry);
        if (dose) setFieldValue("doses", dose);

        if (entry.gazette_no) setFieldValue("gazette_notification_number", entry.gazette_no);

        // The API returns human-readable dates ("25th March, 2026"), which
        // plain dayjs() cannot parse — it yields an Invalid Date, not null.
        const gazetteDate = parseGazetteDate(entry.gazette_date);
        if (gazetteDate) setFieldValue("gazette_notification_date", gazetteDate);
    };

    const validateForm = async (values: FormValues) => {
        const errors: Record<string, string> = {};

        try {
            await qrValidationSchema.validate(values, { abortEarly: false });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                error.inner.forEach((item) => {
                    if (item.path && !errors[item.path]) {
                        errors[item.path] = item.message;
                    }
                });
            }
        }

        const selectedProduct = products.find((product) => product.uuid === values.product_master_uuid);
        const isBiostimulantCategory = getProductCategoryLabel(selectedProduct?.category) === "Biostimulants";

        if (isBiostimulantCategory) {
            if (!values.gazette_notification_number?.trim()) {
                errors.gazette_notification_number = "Gazette No. is required";
            }

            if (!values.gazette_notification_date) {
                errors.gazette_notification_date = "Gazette Date is required";
            }

            // The Autocomplete is not freeSolo, so typed-but-unselected text
            // never reaches the field — this is what surfaces that to the user.
            if (!values.biostimulant_title?.trim()) {
                errors.biostimulant_title = "Select a gazette product";
            }
        }

        return errors;
    };

    const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        const selectedProduct = products.find((product) => product.uuid === values.product_master_uuid);
        const isBiostimulantCategory = getProductCategoryLabel(selectedProduct?.category) === "Biostimulants";
        const isBiopesticideCategory = getProductCategoryLabel(selectedProduct?.category) === "Bio Pesticides";

        // Structured gazette rows are JSON-encoded into the existing string
        // field; when there are none we keep whatever free text was entered.
        const encodedComposition = (composition.length > 0 || specifications.length > 0)
            ? encodeComposition({ composition, specifications })
            : values.biostimulant_composition;

        // Formatting an invalid Dayjs yields the literal string "Invalid Date",
        // which must never be sent to the API.
        const asApiDate = (value: Dayjs | null) =>
            value?.isValid() ? value.format('YYYY-MM-DD') : null;

        const payload = {
            ...values,
            gazette_notification_number: isBiostimulantCategory ? values.gazette_notification_number : "",
            gazette_notification_date: isBiostimulantCategory ? asApiDate(values.gazette_notification_date) : null,
            manufacturing_date: values.type === 'static' ? asApiDate(values.manufacturing_date) : null,
            expiry_date: values.type === 'static' ? asApiDate(values.expiry_date) : null,
            batch_name: values.type === 'static' ? values.batch_name : "",
            gtin: isBiopesticideCategory ? values.gtin : "",
            web_link: isBiopesticideCategory ? values.web_link : "",
            description: isBiopesticideCategory ? "" : values.description,
            biostimulant_composition: isBiopesticideCategory ? "" : encodedComposition,
            crops: isBiopesticideCategory ? "" : values.crops,
            doses: isBiopesticideCategory ? "" : values.doses,
            application_method: isBiopesticideCategory ? "" : values.application_method,
            manufacturer_details: isBiopesticideCategory ? "" : values.manufacturer_details,
        };
        const response = isEdit ? await UpdateQRService({ ...payload, qr_uuid: qrUuidParam || uuid }) : await StoreQRService(payload);

        if (response.code === 200) {
            dispatch(showSnackbar({ type: "success", message: "QR Processed Successfully" }));
            navigate(getBackPath(values.type));
        }
        setSubmitting(false);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: '#06f957' }} /></Box>;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ maxWidth: '1024px', mx: 'auto', p: { xs: 2, md: 4 }, fontFamily: 'Manrope' }}>

                {/* BREADCRUMBS: Product navigates based on type */}
                <Breadcrumbs separator={<ChevronRight fontSize="small" />} sx={{ mb: 3 }}>
                    <Link
                        underline="hover"
                        sx={{ color: '#4c9a74', fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => navigate(getBackPath(initialValues.type))}
                    >
                        {initialValues.type === "dynamic" ? "Dynamic QR Management" : "Static QR Management"}
                    </Link>
                    <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                        {isEdit ? 'Edit QR Code' : 'Generate QR Code'}
                    </Typography>
                </Breadcrumbs>

                <Box sx={{ mb: 4 }}>
                    <PageHead
                        primary={isEdit ? "Edit QR Code" : "Generate QR Code"}
                        secondary="Provide batch and regulatory details for compliance."
                        back={
                            <IconButton onClick={() => navigate(getBackPath(initialValues.type))} size="small" sx={{ mr: 1 }}>
                                <ArrowBack />
                            </IconButton>
                        }
                    />
                </Box>

                <Formik initialValues={initialValues} validationSchema={qrValidationSchema} validate={validateForm} onSubmit={handleSubmit} enableReinitialize>
                    {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => {
                        const selectedProduct = products.find((product) => product.uuid === values.product_master_uuid);
                        const categoryLabel = getProductCategorySingularLabel(selectedProduct?.category);
                        const isBiostimulantCategory = getProductCategoryLabel(selectedProduct?.category) === "Biostimulants";
                        const isBiopesticideCategory = getProductCategoryLabel(selectedProduct?.category) === "Bio Pesticides";

                        return (
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
                                        // { id: 'bulk', label: 'Bulk', icon: <Layers /> }
                                    ].map((item) => (
                                        <Box
                                            key={item.id}
                                            onClick={() => !isEdit && setFieldValue('type', item.id)}
                                            sx={{
                                                flex: 1, cursor: isEdit ? 'not-allowed' : 'pointer', height: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '20px',
                                                border: values.type === item.id ? '2px solid #06f957' : '1px solid #e0e0e0',
                                                bgcolor: values.type === item.id ? 'rgba(6, 249, 87, 0.05)' : '#fff',
                                                transition: 'all 0.2s ease',
                                                opacity: isEdit ? 0.7 : 1,
                                                '&:hover': { borderColor: isEdit ? '#e0e0e0' : '#06f957' }
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
                                                onChange={(_, val) => {
                                                    setFieldValue("product_master_uuid", val ? val.uuid : "");
                                                    // Auto-fill company name if product is selected
                                                    if (val?.company_name) setFieldValue("company_name", val.company_name);

                                                    // Drop gazette-sourced data when the new product is not a
                                                    // Biostimulant, so a non-biostimulant QR can never submit an
                                                    // encoded composition it never displayed.
                                                    if (getProductCategoryLabel(val?.category) !== "Biostimulants") {
                                                        setSelectedGazette(null);
                                                        setComposition([]);
                                                        setSpecifications([]);
                                                        setGazetteOptions([]);
                                                    }
                                                }}
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
                                                placeholder="Choice Agro..."
                                                value={values.company_name} onChange={handleChange}
                                                error={touched.company_name && !!errors.company_name}
                                                helperText={touched.company_name && errors.company_name}
                                                sx={inputStyles}
                                            />
                                        </Grid>
                                        {values.type === "static" && (
                                            <>
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
                                                        slotProps={{ textField: { fullWidth: true, placeholder: "Select date", sx: inputStyles, error: touched.manufacturing_date && !!errors.manufacturing_date, helperText: touched.manufacturing_date && (errors.manufacturing_date as string) } }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Expiry Date</Typography>
                                                    <DatePicker
                                                        value={values.expiry_date}
                                                        onChange={(val) => setFieldValue("expiry_date", val)}
                                                        slotProps={{ textField: { fullWidth: true, placeholder: "Select date", sx: inputStyles, error: touched.expiry_date && !!errors.expiry_date, helperText: touched.expiry_date && (errors.expiry_date as string) } }}
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                        {isBiopesticideCategory ? (
                                            <>
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>GTIN (Unique Identifier)</Typography>
                                                    <TextField
                                                        fullWidth
                                                        name="gtin"
                                                        placeholder="Enter GTIN / Unique Identifier..."
                                                        value={values.gtin}
                                                        onChange={handleChange}
                                                        sx={inputStyles}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Web Link</Typography>
                                                    <TextField
                                                        fullWidth
                                                        name="web_link"
                                                        placeholder="https://example.com"
                                                        value={values.web_link}
                                                        onChange={handleChange}
                                                        sx={inputStyles}
                                                    />
                                                </Grid>
                                            </>
                                        ) : (
                                            <>
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Product Information</Typography>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={4}
                                                        name="description"
                                                        placeholder="Add product information or any reference link..."
                                                        value={values.description}
                                                        onChange={handleChange}
                                                        sx={inputStyles}
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
                                            </>
                                        )}
                                    </Grid>
                                </Box>

                                <Divider sx={{ borderColor: '#f0f0f0' }} />

                                <Box sx={{ p: 4, bgcolor: '#fafafa' }}>
                                    <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                                        <Box sx={{ bgcolor: 'rgba(6, 249, 87, 0.1)', p: 1, borderRadius: 2, display: 'flex' }}><GavelOutlined sx={{ color: '#06f957' }} /></Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800 }}>Section 2: Regulatory Details</Typography>
                                    </Stack>

                                    <Grid container spacing={3}>
                                        {/* Title leads the section. For Biostimulants it is a strict
                                            gazette lookup; every other category keeps free text. */}
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>{categoryLabel} Title</Typography>
                                            {isBiostimulantCategory ? (
                                                <Autocomplete
                                                    options={gazetteOptions}
                                                    loading={gazetteLoading}
                                                    value={selectedGazette}
                                                    getOptionLabel={(option) => option?.product_name || ""}
                                                    isOptionEqualToValue={(option, val) => option.id === val.id}
                                                    filterOptions={(options) => options}
                                                    noOptionsText="No matching gazette products"
                                                    onOpen={() => { if (gazetteOptions.length === 0) fetchGazette(); }}
                                                    onInputChange={(_, val, reason) => handleGazetteInputChange(val, reason)}
                                                    onChange={(_, entry) => handleGazetteSelect(entry, setFieldValue)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Search gazette products..."
                                                            error={touched.biostimulant_title && !!errors.biostimulant_title}
                                                            helperText={(touched.biostimulant_title && errors.biostimulant_title) || "Select an official gazette product"}
                                                            sx={inputStyles}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                endAdornment: (
                                                                    <>
                                                                        {gazetteLoading ? <CircularProgress color="inherit" size={18} /> : null}
                                                                        {params.InputProps.endAdornment}
                                                                    </>
                                                                ),
                                                            }}
                                                        />
                                                    )}
                                                />
                                            ) : (
                                                <TextField
                                                    fullWidth name="biostimulant_title"
                                                    placeholder="Enter official title..."
                                                    value={values.biostimulant_title} onChange={handleChange}
                                                    sx={inputStyles}
                                                />
                                            )}
                                        </Grid>
                                        {isBiostimulantCategory && (
                                            <>
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
                                                        slotProps={{ textField: { fullWidth: true, placeholder: "Select date", sx: inputStyles, error: touched.gazette_notification_date && !!errors.gazette_notification_date, helperText: touched.gazette_notification_date && (errors.gazette_notification_date as string) } }}
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                        {!isBiopesticideCategory && (
                                            <>
                                                {hasStructuredComposition ? (
                                                    <>
                                                        <Grid item xs={12}>
                                                            <DetailTable
                                                                title={`Composition of ${categoryLabel}`}
                                                                keyHeader="Ingredient"
                                                                valueHeader="Content"
                                                                rows={composition.map((row) => ({ key: row.ingredient, value: row.content }))}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <DetailTable
                                                                title="Specifications"
                                                                keyHeader="Parameter"
                                                                valueHeader="Value"
                                                                rows={specifications.map((row) => ({ key: row.parameter, value: row.value }))}
                                                            />
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Composition of {categoryLabel}</Typography>
                                                        <TextField
                                                            fullWidth multiline rows={3}
                                                            name="biostimulant_composition"
                                                            placeholder="List active ingredients..."
                                                            value={values.biostimulant_composition} onChange={handleChange}
                                                            sx={inputStyles}
                                                        />
                                                    </Grid>
                                                )}
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
                                            </>
                                        )}
                                    </Grid>
                                </Box>

                                <Box sx={{ p: 4, display: 'flex', justifyContent: 'flex-end', gap: 2, bgcolor: '#fff' }}>
                                    <Button variant="outlined" onClick={() => navigate(getBackPath(values.type))} sx={{ borderRadius: 2, px: 4, fontWeight: 700 }}>Cancel</Button>
                                    <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ bgcolor: '#06f957', color: '#000', borderRadius: 2, px: 5, fontWeight: 800, boxShadow: '0 8px 16px rgba(6, 249, 87, 0.2)', '&:hover': { bgcolor: '#05e64f' } }}>
                                        {isSubmitting ? "Processing..." : (isEdit ? "Update QR" : "Generate QR")}
                                    </Button>
                                </Box>
                            </Card>
                            </Form>
                        );
                    }}
                </Formik>
            </Box>
        </LocalizationProvider>
    );
};

export default QRForm;
