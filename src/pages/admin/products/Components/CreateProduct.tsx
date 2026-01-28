import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Formik, Form, FormikHelpers, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    TextField,
    MenuItem,
    FormControlLabel,
    Switch,
    IconButton,
    Autocomplete,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { ArrowBack, Inventory, Delete, Add, Science, Gavel, Agriculture } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../../redux/reducer/snackbarSlice';
import PageHead from '../../../../components/common/page/PageHead';
import { StoreProductService, FetchProductDetailsService, UpdateProductService } from '../../../../utils/services/product.service';

// --- Types ---
interface Ingredient {
    ingredient_name: string;
    unit: string;
    spec_type: string;
    value: string;
    sort_order: number;
}

interface Specification {
    parameter_name: string;
    unit: string;
    spec_type: string;
    value: string;
    sort_order: number;
}

interface Usage {
    crops: string[];
    dose: string;
}

interface FormValues {
    company_id: number;
    product_code: string;
    product_name: string;
    category: string;
    sub_category: string;
    grade: string;
    brand: string;
    description: string;
    mrp: number | string;
    selling_price: number | string;
    unit: string;
    stock_qty: number | string;
    is_active: boolean;
    ingredients: Ingredient[];
    specifications: Specification[];
    usage: Usage;
}

// --- Constants ---
const UNITS = ['Ltr', 'Kg', 'Gm', 'Ml', 'Ton'];
const SPEC_TYPES = ['minimum', 'maximum', 'exact'];
const COMMON_CROPS = ['Onion', 'Paddy', 'Potato', 'Chilli', 'Cotton', 'Wheat', 'Tomato', 'Soybean'];

// --- Validation Schema ---
const productValidationSchema = Yup.object().shape({
    product_name: Yup.string().required('Product name is required'),
    product_code: Yup.string().required('Product code is required'),
    category: Yup.string().required('Category is required'),
    mrp: Yup.number().min(0, 'Cannot be negative').required('MRP is required'),
    selling_price: Yup.number()
        .min(0, 'Cannot be negative')
        .max(Yup.ref('mrp'), 'Selling price cannot exceed MRP')
        .required('Selling price is required'),
    stock_qty: Yup.number().min(0, 'Cannot be negative').required('Stock is required'),
    unit: Yup.string().required('Unit is required'),
    usage: Yup.object().shape({
        dose: Yup.string().required('Dose instruction is required'),
        crops: Yup.array().min(1, 'Select at least one crop'),
    }),
    ingredients: Yup.array().of(
        Yup.object().shape({
            ingredient_name: Yup.string().required('Name required'),
            value: Yup.string().nullable(),
        })
    ),
    specifications: Yup.array().of(
        Yup.object().shape({
            parameter_name: Yup.string().required('Parameter required'),
        })
    ),
});

const ProductForm: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const uuid = searchParams.get('uuid'); // Get UUID from query params
    const isEdit = Boolean(uuid);

    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState<FormValues>({
        company_id: 1,
        product_code: '',
        product_name: '',
        category: '',
        sub_category: '',
        grade: '',
        brand: '',
        description: '',
        mrp: 0,
        selling_price: 0,
        unit: 'Ltr',
        stock_qty: 0,
        is_active: true,
        ingredients: [
            { ingredient_name: '', unit: '%', spec_type: 'exact', value: '', sort_order: 1 }
        ],
        specifications: [
            { parameter_name: '', unit: '%', spec_type: 'minimum', value: '', sort_order: 1 }
        ],
        usage: {
            crops: [],
            dose: ''
        }
    });

    useEffect(() => {
        const fetchProductData = async () => {
            if (isEdit && uuid) {
                setLoading(true);
                try {
                    const { data, code } = await FetchProductDetailsService({ product_uuid: uuid });
                    if (code === 200 && data) {
                        // Map API response to FormValues structure
                        setInitialValues({
                            company_id: data.product.company_id,
                            product_code: data.product.product_code,
                            product_name: data.product.product_name,
                            category: data.product.category,
                            sub_category: data.product.sub_category,
                            grade: data.product.grade,
                            brand: data.product.brand,
                            description: data.product.description,
                            mrp: data.product.mrp,
                            selling_price: data.product.selling_price,
                            unit: data.product.unit,
                            stock_qty: data.product.stock_qty,
                            is_active: data.product.is_active,
                            ingredients: data.ingredients.length > 0 ? data.ingredients : [{ ingredient_name: '', unit: '%', spec_type: 'exact', value: '', sort_order: 1 }],
                            specifications: data.specifications.length > 0 ? data.specifications : [{ parameter_name: '', unit: '%', spec_type: 'minimum', value: '', sort_order: 1 }],
                            usage: {
                                crops: data.usage?.crops || [],
                                dose: data.usage?.dose || ''
                            }
                        });
                    } else {
                        dispatch(showSnackbar({ type: 'error', message: 'Failed to fetch product details' }));
                        navigate('/admin/products'); // Redirect back on failure
                    }
                } catch (error) {
                    console.error("Error fetching product:", error);
                    dispatch(showSnackbar({ type: 'error', message: 'An error occurred while fetching details' }));
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProductData();
    }, [isEdit, uuid, dispatch, navigate]);

    const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        const payload: any = {
            ...values,
            mrp: Number(values.mrp),
            selling_price: Number(values.selling_price),
            stock_qty: Number(values.stock_qty),
            ingredients: values.ingredients.map((item, index) => ({
                ...item,
                sort_order: index + 1,
            })),
            specifications: values.specifications.map((item, index) => ({
                ...item,
                sort_order: index + 1,
            })),
        };

        let response: any;

        if (isEdit) {
            // update flow
            response = await UpdateProductService({
                ...payload,
                product_uuid:uuid,
            });
        } else {
            // create flow
            response = await StoreProductService(payload);
        }

        const { code, data } = response;

        if (code === 200 ) {
            dispatch(
                showSnackbar({
                    type: 'success',
                    message: isEdit
                        ? 'Product updated successfully'
                        : 'Product created successfully',
                })
            );
            navigate('/admin/products');
        } else {
            dispatch(
                showSnackbar({
                    type: 'error',
                    message: 'Failed to save product. Please try again.',
                })
            );
        }

    };

    const handleBackNavigation = () => {
        navigate('/admin/products');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ pb: 4 }}>
            <PageHead
                primary={isEdit ? 'Edit Product' : 'Add New Product'}
                back={
                    <IconButton onClick={handleBackNavigation} size="small">
                        <ArrowBack />
                    </IconButton>
                }
            />

            <Formik
                initialValues={initialValues}
                validationSchema={productValidationSchema}
                onSubmit={handleSubmit}
                enableReinitialize // Important to re-render form when initialValues are updated from API
            >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
                    <Form noValidate>
                        <Grid container spacing={3} sx={{ p: 1 }}>

                            {/* --- LEFT COLUMN (General Info) --- */}
                            <Grid item xs={12} lg={8}>
                                {/* Basic Info Card */}
                                <Card elevation={0} sx={{ mb: 2 }}>
                                    <CardHeader avatar={<Inventory />} title="General Information" />
                                    <CardContent sx={{ pt: 0 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth label="Product Name" name="product_name"
                                                    value={values.product_name} onChange={handleChange} onBlur={handleBlur}
                                                    error={touched.product_name && Boolean(errors.product_name)}
                                                    helperText={touched.product_name && errors.product_name}
                                                    size="small" required
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth label="Product Code" name="product_code"
                                                    value={values.product_code} onChange={handleChange} onBlur={handleBlur}
                                                    error={touched.product_code && Boolean(errors.product_code)}
                                                    helperText={touched.product_code && errors.product_code}
                                                    size="small" required
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth label="Brand" name="brand"
                                                    value={values.brand} onChange={handleChange} onBlur={handleBlur}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth label="Category" name="category"
                                                    value={values.category} onChange={handleChange} onBlur={handleBlur}
                                                    error={touched.category && Boolean(errors.category)}
                                                    helperText={touched.category && errors.category}
                                                    size="small" required
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth label="Sub Category" name="sub_category"
                                                    value={values.sub_category} onChange={handleChange} onBlur={handleBlur}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth label="Grade" name="grade"
                                                    value={values.grade} onChange={handleChange} onBlur={handleBlur}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth label="Description" name="description"
                                                    value={values.description} onChange={handleChange} onBlur={handleBlur}
                                                    multiline rows={3} size="small"
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                {/* Ingredients Section */}
                                <Card elevation={0} sx={{ mb: 2 }}>
                                    <CardHeader avatar={<Science />} title="Ingredients"
                                        action={
                                            <Button startIcon={<Add />} onClick={() => {
                                                const newIngredient: Ingredient = { ingredient_name: '', unit: '%', spec_type: 'exact', value: '', sort_order: values.ingredients.length + 1 };
                                                setFieldValue('ingredients', [...values.ingredients, newIngredient]);
                                            }}>Add</Button>
                                        }
                                    />
                                    <CardContent sx={{ pt: 0 }}>
                                        <FieldArray name="ingredients">
                                            {({ remove }) => (
                                                <Box>
                                                    {values.ingredients.map((_, index) => (
                                                        <Grid container spacing={1} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                                                            <Grid item xs={4}>
                                                                <TextField fullWidth label="Ingredient Name" size="small"
                                                                    name={`ingredients.${index}.ingredient_name`}
                                                                    value={values.ingredients[index].ingredient_name} onChange={handleChange}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <TextField fullWidth select label="Type" size="small"
                                                                    name={`ingredients.${index}.spec_type`}
                                                                    value={values.ingredients[index].spec_type} onChange={handleChange}
                                                                >
                                                                    {SPEC_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                                                </TextField>
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <TextField fullWidth label="Value" size="small"
                                                                    name={`ingredients.${index}.value`}
                                                                    value={values.ingredients[index].value} onChange={handleChange}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <TextField fullWidth label="Unit" size="small"
                                                                    name={`ingredients.${index}.unit`}
                                                                    value={values.ingredients[index].unit} onChange={handleChange}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={1}>
                                                                <IconButton color="error" onClick={() => remove(index)} disabled={values.ingredients.length === 1}>
                                                                    <Delete />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                                </Box>
                                            )}
                                        </FieldArray>
                                    </CardContent>
                                </Card>

                                {/* Specifications Section */}
                                <Card elevation={0} sx={{ mb: 2 }}>
                                    <CardHeader avatar={<Gavel />} title="Specifications"
                                        action={
                                            <Button startIcon={<Add />} onClick={() => {
                                                const newSpec: Specification = { parameter_name: '', unit: '%', spec_type: 'minimum', value: '', sort_order: values.specifications.length + 1 };
                                                setFieldValue('specifications', [...values.specifications, newSpec]);
                                            }}>Add</Button>
                                        }
                                    />
                                    <CardContent sx={{ pt: 0 }}>
                                        <FieldArray name="specifications">
                                            {({ remove }) => (
                                                <Box>
                                                    {values.specifications.map((_, index) => (
                                                        <Grid container spacing={1} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                                                            <Grid item xs={4}>
                                                                <TextField fullWidth label="Parameter Name" size="small"
                                                                    name={`specifications.${index}.parameter_name`}
                                                                    value={values.specifications[index].parameter_name} onChange={handleChange}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <TextField fullWidth select label="Type" size="small"
                                                                    name={`specifications.${index}.spec_type`}
                                                                    value={values.specifications[index].spec_type} onChange={handleChange}
                                                                >
                                                                    {SPEC_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                                                </TextField>
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <TextField fullWidth label="Value" size="small"
                                                                    name={`specifications.${index}.value`}
                                                                    value={values.specifications[index].value} onChange={handleChange}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <TextField fullWidth label="Unit" size="small"
                                                                    name={`specifications.${index}.unit`}
                                                                    value={values.specifications[index].unit} onChange={handleChange}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={1}>
                                                                <IconButton color="error" onClick={() => remove(index)} disabled={values.specifications.length === 1}>
                                                                    <Delete />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                                </Box>
                                            )}
                                        </FieldArray>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* --- RIGHT COLUMN (Sidebar) --- */}
                            <Grid item xs={12} lg={4}>
                                {/* Status */}
                                <Card elevation={0} sx={{ mb: 2 }}>
                                    <CardHeader title="Status" />
                                    <CardContent sx={{ pt: 0 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch name="is_active" checked={values.is_active}
                                                    onChange={(e) => setFieldValue('is_active', e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label={values.is_active ? 'Active' : 'Inactive'}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Pricing & Inventory */}
                                <Card elevation={0} sx={{ mb: 2 }}>
                                    <CardHeader title="Pricing & Stock" />
                                    <CardContent sx={{ pt: 0 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth label="MRP" type="number" name="mrp"
                                                    value={values.mrp} onChange={handleChange}
                                                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                                    error={touched.mrp && Boolean(errors.mrp)}
                                                    helperText={touched.mrp && errors.mrp}
                                                    size="small" required
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth label="Selling Price" type="number" name="selling_price"
                                                    value={values.selling_price} onChange={handleChange}
                                                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                                                    error={touched.selling_price && Boolean(errors.selling_price)}
                                                    helperText={touched.selling_price && errors.selling_price}
                                                    size="small" required
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth label="Stock Qty" type="number" name="stock_qty"
                                                    value={values.stock_qty} onChange={handleChange}
                                                    size="small" required
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth select label="Unit" name="unit"
                                                    value={values.unit} onChange={handleChange}
                                                    size="small"
                                                >
                                                    {UNITS.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                                                </TextField>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                {/* Usage Section */}
                                <Card elevation={0} sx={{ mb: 2 }}>
                                    <CardHeader avatar={<Agriculture />} title="Usage & Dosage" />
                                    <CardContent sx={{ pt: 0 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    multiple
                                                    options={COMMON_CROPS}
                                                    freeSolo
                                                    value={values.usage.crops}
                                                    onChange={(_, newValue) => setFieldValue('usage.crops', newValue)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Crops"
                                                            placeholder="Add crop"
                                                            size="small"
                                                            error={touched.usage?.crops && Boolean(errors.usage?.crops)}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth label="Dosage" name="usage.dose"
                                                    value={values.usage.dose} onChange={handleChange}
                                                    multiline rows={2}
                                                    size="small"
                                                    placeholder="e.g. Three foliar sprays..."
                                                    error={touched.usage?.dose && Boolean(errors.usage?.dose)}
                                                    helperText={touched.usage?.dose && errors.usage?.dose}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <Card elevation={0}>
                                    <CardContent>
                                        <Button
                                            fullWidth type="submit" variant="contained"
                                            size="large" disabled={isSubmitting} sx={{ mb: 1 }}
                                        >
                                            {isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'Save Product'}
                                        </Button>
                                        <Button
                                            fullWidth variant="outlined" size="large"
                                            onClick={handleBackNavigation} disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default ProductForm;