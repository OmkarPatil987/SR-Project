import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, FieldArray, FormikErrors } from 'formik';
import * as Yup from 'yup';
import {
    Box, Paper, Grid, TextField, Typography, Button, Switch, FormControlLabel,
    IconButton, Divider, CircularProgress, Alert, Stack, Accordion, AccordionSummary, AccordionDetails, Chip,
} from '@mui/material';
import { Add, Delete, ExpandMore, Factory, Storefront, Inventory2, ErrorOutline } from '@mui/icons-material';
import { FetchProductGazetteByIdsService } from '../../../../utils/services/label.service';
import { showSnackbar } from '../../../../redux/reducer/snackbarSlice';
import { CompanyContact, GazetteDetail, LabelPdfRequestPayload } from '../../../../utils/dto/response/label';
import { emptyCompanyContact } from '../constants/labelConstants';
import { EditableLabelProduct, denormalizeLabelProduct, normalizeGazetteDetail } from '../utils/labelUtils';

export interface LabelFormValues {
    is_manufacturer_marketing_same: boolean;
    manufacturer: CompanyContact;
    marketing: CompanyContact;
    products: EditableLabelProduct[];
}

interface LabelFormStepProps {
    selectedIds: number[];
    initialFormValues: LabelFormValues | null;
    onGenerate: (payload: LabelPdfRequestPayload, formValues: LabelFormValues) => void;
    onBack: () => void;
    submitting: boolean;
}

const contactSchema = (required: boolean) => Yup.object().shape({
    name: required ? Yup.string().required('Required') : Yup.string(),
    address: required ? Yup.string().required('Required') : Yup.string(),
    contact_person: required ? Yup.string().required('Required') : Yup.string(),
    mobile: required ? Yup.string().required('Required') : Yup.string(),
    email: required ? Yup.string().email('Invalid email').required('Required') : Yup.string().email('Invalid email'),
    website: Yup.string(),
    license_no: required ? Yup.string().required('Required') : Yup.string(),
    gst_no: required ? Yup.string().required('Required') : Yup.string(),
});

const validationSchema = Yup.object().shape({
    is_manufacturer_marketing_same: Yup.boolean(),
    manufacturer: contactSchema(true),
    marketing: Yup.mixed().when('is_manufacturer_marketing_same', {
        is: false,
        then: () => contactSchema(true),
        otherwise: () => contactSchema(false),
    }),
    products: Yup.array().of(
        Yup.object().shape({
            composition: Yup.array().min(1, 'At least one composition row is required'),
            specifications: Yup.array().min(1, 'At least one specification row is required'),
        })
    ),
});

const RequiredMark: React.FC = () => (
    <Box component="span" sx={{ color: 'error.main', fontWeight: 700 }}>&nbsp;*</Box>
);

const fieldLabel = (label: string, required: boolean): React.ReactNode => (
    <>{label}{required && <RequiredMark />}</>
);

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string; action?: React.ReactNode }> = ({ icon, title, subtitle, action }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 3, pb: 2, borderBottom: '1px solid #e8f3ee' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Box sx={{ color: '#19b369', display: 'flex', mt: 0.25 }}>{icon}</Box>
            <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '18px', color: '#0e1b15' }}>{title}</Typography>
                {subtitle && <Typography variant="body2" sx={{ color: '#509574' }}>{subtitle}</Typography>}
            </Box>
        </Box>
        {action}
    </Box>
);

const CompanyContactFields: React.FC<{
    prefix: 'manufacturer' | 'marketing';
    values: CompanyContact;
    errors: any;
    touched: any;
    handleChange: any;
    disabled?: boolean;
    required?: boolean;
}> = ({ prefix, values, errors, touched, handleChange, disabled, required = true }) => {
    const fields: { key: keyof CompanyContact; label: string; required: boolean }[] = [
        { key: 'name', label: 'Name', required },
        { key: 'contact_person', label: 'Contact Person', required },
        { key: 'mobile', label: 'Mobile', required },
        { key: 'email', label: 'Email', required },
        { key: 'website', label: 'Website', required: false },
        { key: 'license_no', label: 'License No', required },
        { key: 'gst_no', label: 'GST No', required },
    ];
    return (
        <Grid container spacing={2}>
            {fields.map(({ key, label, required: fieldRequired }) => (
                <Grid item xs={12} md={4} key={key}>
                    <TextField
                        fullWidth
                        size="small"
                        label={fieldLabel(label, fieldRequired)}
                        name={`${prefix}.${key}`}
                        value={values?.[key] ?? ''}
                        onChange={handleChange}
                        disabled={disabled}
                        error={Boolean(touched?.[key] && errors?.[key])}
                        helperText={touched?.[key] && errors?.[key]}
                    />
                </Grid>
            ))}
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    label={fieldLabel('Address', required)}
                    name={`${prefix}.address`}
                    value={values?.address ?? ''}
                    onChange={handleChange}
                    disabled={disabled}
                    error={Boolean(touched?.address && errors?.address)}
                    helperText={touched?.address && errors?.address}
                />
            </Grid>
        </Grid>
    );
};

interface LabelFormFieldsProps {
    values: LabelFormValues;
    errors: FormikErrors<LabelFormValues>;
    touched: any;
    handleChange: any;
    setFieldValue: (field: string, value: any) => void;
    onBack: () => void;
    submitting: boolean;
}

const LabelFormFields: React.FC<LabelFormFieldsProps> = ({ values, errors, touched, handleChange, setFieldValue, onBack, submitting }) => {
    useEffect(() => {
        if (values.is_manufacturer_marketing_same && JSON.stringify(values.marketing) !== JSON.stringify(values.manufacturer)) {
            setFieldValue('marketing', values.manufacturer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.is_manufacturer_marketing_same, values.manufacturer]);

    const productErrors = errors.products as FormikErrors<EditableLabelProduct>[] | undefined;

    return (
        <Form noValidate>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#6b7c74' }}>
                    Fields marked with
                </Typography>
                <RequiredMark />
                <Typography variant="body2" sx={{ color: '#6b7c74' }}>
                    are required.
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ border: '1px solid #d1e6dc', borderRadius: '1rem', p: 3, mb: 3 }}>
                <SectionHeader
                    icon={<Factory />}
                    title="Manufacturer Details"
                    subtitle="Details of the entity manufacturing this product"
                />
                <CompanyContactFields prefix="manufacturer" values={values.manufacturer} errors={errors.manufacturer} touched={touched.manufacturer} handleChange={handleChange} required />
            </Paper>

            <Paper elevation={0} sx={{ border: '1px solid #d1e6dc', borderRadius: '1rem', p: 3, mb: 3 }}>
                <SectionHeader
                    icon={<Storefront />}
                    title="Marketing Details"
                    subtitle="Details of the entity marketing this product"
                    action={
                        <FormControlLabel
                            control={<Switch checked={values.is_manufacturer_marketing_same} onChange={(e) => setFieldValue('is_manufacturer_marketing_same', e.target.checked)} />}
                            label="Same as Manufacturer"
                            sx={{ whiteSpace: 'nowrap' }}
                        />
                    }
                />
                <CompanyContactFields
                    prefix="marketing"
                    values={values.marketing}
                    errors={errors.marketing}
                    touched={touched.marketing}
                    handleChange={handleChange}
                    disabled={values.is_manufacturer_marketing_same}
                    required={!values.is_manufacturer_marketing_same}
                />
            </Paper>

            {values.products.map((product, pIdx) => {
                const prodErr = productErrors?.[pIdx] as any;
                const hasProductError = typeof prodErr?.composition === 'string' || typeof prodErr?.specifications === 'string';

                return (
                <Accordion
                    key={product.id}
                    defaultExpanded
                    elevation={0}
                    disableGutters
                    sx={{
                        border: '1px solid #d1e6dc',
                        borderRadius: '1rem !important',
                        mb: 3,
                        overflow: 'hidden',
                        '&:before': { display: 'none' },
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                            px: 3,
                            py: 1,
                            bgcolor: '#f8fbf9',
                            '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1.5, my: 1.5 },
                        }}
                    >
                        <Inventory2 sx={{ color: '#19b369' }} fontSize="small" />
                        <Typography sx={{ fontWeight: 800, flex: 1, color: '#0e1b15' }}>{product.product_name}</Typography>
                        <Chip
                            size="small"
                            label={`${product.composition.length} composition · ${product.specifications.length} specs`}
                            sx={{ bgcolor: '#e8f3ee', color: '#509574', fontWeight: 600 }}
                        />
                        {hasProductError && (
                            <Chip size="small" icon={<ErrorOutline sx={{ fontSize: 16 }} />} label="Needs attention" color="error" variant="outlined" />
                        )}
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 3, pb: 3, pt: 2 }}>

                    <Typography sx={{ fontWeight: 700, mb: 1 }}>
                        Composition<RequiredMark />
                    </Typography>
                    <FieldArray name={`products.${pIdx}.composition`}>
                        {({ push, remove }) => (
                            <Stack spacing={1} sx={{ mb: 2 }}>
                                {product.composition.map((row, rIdx) => (
                                    <Stack direction="row" spacing={1} key={rIdx} alignItems="center">
                                        <TextField
                                            fullWidth size="small" label="Ingredient"
                                            name={`products.${pIdx}.composition.${rIdx}.ingredient`}
                                            value={row.ingredient}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            size="small" label="Content" sx={{ width: 160 }}
                                            name={`products.${pIdx}.composition.${rIdx}.content`}
                                            value={row.content}
                                            onChange={handleChange}
                                        />
                                        <IconButton onClick={() => remove(rIdx)} disabled={product.composition.length <= 1} aria-label="Remove composition row">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                ))}
                                {productErrors?.[pIdx] && typeof (productErrors[pIdx] as any)?.composition === 'string' && (
                                    <Typography variant="caption" color="error">{(productErrors[pIdx] as any).composition}</Typography>
                                )}
                                <Button size="small" startIcon={<Add />} onClick={() => push({ ingredient: '', content: '' })} sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                                    Add Row
                                </Button>
                            </Stack>
                        )}
                    </FieldArray>

                    <Divider sx={{ my: 2 }} />

                    <Typography sx={{ fontWeight: 700, mb: 1 }}>
                        Specifications<RequiredMark />
                    </Typography>
                    <FieldArray name={`products.${pIdx}.specifications`}>
                        {({ push, remove }) => (
                            <Stack spacing={1} sx={{ mb: 2 }}>
                                {product.specifications.map((row, rIdx) => (
                                    <Stack direction="row" spacing={1} key={rIdx} alignItems="center">
                                        <TextField
                                            fullWidth size="small" label="Parameter"
                                            name={`products.${pIdx}.specifications.${rIdx}.parameter`}
                                            value={row.parameter}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            size="small" label="Value" sx={{ width: 160 }}
                                            name={`products.${pIdx}.specifications.${rIdx}.value`}
                                            value={row.value}
                                            onChange={handleChange}
                                        />
                                        <IconButton onClick={() => remove(rIdx)} disabled={product.specifications.length <= 1} aria-label="Remove specification row">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                ))}
                                {productErrors?.[pIdx] && typeof (productErrors[pIdx] as any)?.specifications === 'string' && (
                                    <Typography variant="caption" color="error">{(productErrors[pIdx] as any).specifications}</Typography>
                                )}
                                <Button size="small" startIcon={<Add />} onClick={() => push({ parameter: '', value: '' })} sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                                    Add Row
                                </Button>
                            </Stack>
                        )}
                    </FieldArray>

                    <Divider sx={{ my: 2 }} />

                    <Typography sx={{ fontWeight: 700, mb: 1 }}>Application Details</Typography>
                    <FieldArray name={`products.${pIdx}.crop_entries`}>
                        {({ push, remove }) => (
                            <Stack spacing={1} sx={{ mb: 2 }}>
                                {product.crop_entries.map((entry, cIdx) => (
                                    <Stack direction="row" spacing={1} key={cIdx} alignItems="center">
                                        <TextField
                                            fullWidth size="small" label="Crop"
                                            name={`products.${pIdx}.crop_entries.${cIdx}.name`}
                                            value={entry.name}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            fullWidth size="small" label="Dose"
                                            name={`products.${pIdx}.crop_entries.${cIdx}.dose`}
                                            value={entry.dose}
                                            onChange={handleChange}
                                        />
                                        <IconButton onClick={() => remove(cIdx)} disabled={product.crop_entries.length <= 1} aria-label="Remove crop entry">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                ))}
                                <Button size="small" startIcon={<Add />} onClick={() => push({ name: '', dose: '' })} sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                                    Add Crop
                                </Button>
                            </Stack>
                        )}
                    </FieldArray>

                    <TextField
                        fullWidth multiline rows={2} size="small" label="Note"
                        name={`products.${pIdx}.note`}
                        value={product.note}
                        onChange={handleChange}
                    />
                    </AccordionDetails>
                </Accordion>
                );
            })}

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    bottom: 0,
                    bgcolor: '#fff',
                    py: 2,
                    mt: 1,
                    borderTop: '1px solid #e8f3ee',
                }}
            >
                <Button onClick={onBack} sx={{ textTransform: 'none' }}>Back</Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
                    sx={{ bgcolor: '#19b369', '&:hover': { bgcolor: '#159658' }, textTransform: 'none', fontWeight: 700, borderRadius: '0.75rem', px: 4 }}
                >
                    {submitting ? 'Generating...' : 'Generate'}
                </Button>
            </Box>
        </Form>
    );
};

const LabelFormStep: React.FC<LabelFormStepProps> = ({ selectedIds, initialFormValues, onGenerate, onBack, submitting }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(!initialFormValues);
    const [error, setError] = useState(false);
    const [formValues, setFormValues] = useState<LabelFormValues | null>(initialFormValues);

    const fetchGazetteData = useCallback(async () => {
        setLoading(true);
        setError(false);
        const { code, data } = await FetchProductGazetteByIdsService({ ids: selectedIds });
        if (code === 200 && data?.products_gazette) {
            const products = (data.products_gazette as GazetteDetail[]).map(normalizeGazetteDetail);
            setFormValues({
                is_manufacturer_marketing_same: false,
                manufacturer: { ...emptyCompanyContact },
                marketing: { ...emptyCompanyContact },
                products,
            });
        } else {
            setError(true);
            dispatch(showSnackbar({ type: 'error', message: 'Failed to fetch product gazette details.' }));
        }
        setLoading(false);
    }, [selectedIds, dispatch]);

    useEffect(() => {
        if (!initialFormValues) fetchGazetteData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
    }

    if (error || !formValues) {
        return (
            <Box sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>Could not load product details for the selected labels.</Alert>
                <Button variant="outlined" onClick={fetchGazetteData}>Retry</Button>
            </Box>
        );
    }

    return (
        <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values) => {
                const payload: LabelPdfRequestPayload = {
                    is_manufacturer_marketing_same: values.is_manufacturer_marketing_same,
                    manufacturer: values.manufacturer,
                    marketing: values.is_manufacturer_marketing_same ? values.manufacturer : values.marketing,
                    products_gazette: values.products.map(denormalizeLabelProduct),
                };
                onGenerate(payload, values);
            }}
        >
            {({ values, errors, touched, handleChange, setFieldValue }) => (
                <LabelFormFields
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    onBack={onBack}
                    submitting={submitting}
                />
            )}
        </Formik>
    );
};

export default LabelFormStep;
