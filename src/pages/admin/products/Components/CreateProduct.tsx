import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, FormikHelpers } from 'formik';
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
    Typography,
    FormControlLabel,
    Switch,
    IconButton,
    Paper,
    Chip,
    Stack,
    FormControl,
    FormLabel,
} from '@mui/material';
import { ArrowBack, CloudUpload, Close, Inventory } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../../redux/reducer/snackbarSlice';
import PageHead from '../../../../components/common/page/PageHead';

// Types
interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    brand: string;
    status: 'active' | 'inactive';
}

interface FormValues {
    name: string;
    category: string;
    description: string;
    price: number | string;
    stock: number | string;
    brand: string;
    status: 'active' | 'inactive';
    images: File[];
}

// Constants
const CATEGORIES = ['Electronics', 'Furniture', 'Appliances', 'Accessories'] as const;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 5;
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

// Mock data - replace with actual API call
const mockProducts: Product[] = [
    {
        id: 'PRD-001',
        name: 'Wireless Mouse XZ-200',
        category: 'Electronics',
        description: 'High-precision wireless mouse with ergonomic design',
        price: 1299,
        stock: 150,
        brand: 'TechCorp',
        status: 'active',
    },
];

// Validation Schema
const productValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Product name is required')
        .max(100, 'Product name must not exceed 100 characters')
        .trim(),
    category: Yup.string()
        .required('Category is required')
        .oneOf(CATEGORIES as unknown as string[], 'Invalid category'),
    brand: Yup.string()
        .max(50, 'Brand name must not exceed 50 characters')
        .trim(),
    description: Yup.string()
        .max(500, 'Description must not exceed 500 characters')
        .trim(),
    price: Yup.number()
        .required('Price is required')
        .min(0.01, 'Price must be greater than 0')
        .max(9999999.99, 'Price is too high')
        .typeError('Price must be a valid number'),
    stock: Yup.number()
        .required('Stock quantity is required')
        .min(0, 'Stock cannot be negative')
        .integer('Stock must be a whole number')
        .typeError('Stock must be a valid number'),
    status: Yup.string()
        .oneOf(['active', 'inactive'], 'Invalid status')
        .required('Status is required'),
    images: Yup.array()
        .max(MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`)
        .test('fileSize', 'One or more files exceed 5MB', (files) => {
            if (!files || files.length === 0) return true;
            return files.every((file) => file.size <= MAX_IMAGE_SIZE);
        })
        .test('fileType', 'Only PNG, JPG, and JPEG files are allowed', (files) => {
            if (!files || files.length === 0) return true;
            return files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
        }),
});

const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isEdit = Boolean(id);

    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (isEdit && id) {
            // Replace with actual API call
            const foundProduct = mockProducts.find((p) => p.id === id);
            setProduct(foundProduct || null);
        }
    }, [id, isEdit]);

    const initialValues: FormValues = {
        name: product?.name || '',
        category: product?.category || '',
        description: product?.description || '',
        price: product?.price || '',
        stock: product?.stock || '',
        brand: product?.brand || '',
        status: product?.status || 'active',
        images: [],
    };

    const handleSubmit = async (
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
    ) => {
        try {
            // Format the data
            const formattedValues = {
                ...values,
                price: Number(values.price),
                stock: Number(values.stock),
                name: values.name.trim(),
                brand: values.brand.trim(),
                description: values.description.trim(),
            };

            // Replace with actual API call
            console.log('Submitting:', formattedValues);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            dispatch(
                showSnackbar({
                    type: 'success',
                    message: isEdit
                        ? 'Product updated successfully!'
                        : 'Product created successfully!',
                })
            );
            navigate('/admin/products');
        } catch (error) {
            console.error('Error submitting form:', error);
            dispatch(
                showSnackbar({
                    type: 'error',
                    message: 'Something went wrong. Please try again.',
                })
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleBackNavigation = () => {
        navigate('/admin/products');
    };

    return (
        <Box sx={{ pb: 4 }}>
            {/* Header */}
            {/* <Box sx={{ px: { xs: 2, sm: 3 }, mb:  }}> */}
                <PageHead primary={isEdit ? 'Edit Product' : 'Add New Product'} back={<IconButton
                    onClick={handleBackNavigation}
                    size="small"
                    aria-label="Go back to products"
                >
                    <ArrowBack />
                </IconButton>}/>
            {/* </Box> */}

            <Formik
                initialValues={initialValues}
                validationSchema={productValidationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    isSubmitting,
                    setFieldValue,
                    setFieldTouched
                }) => (
                    <Form noValidate>
                        <Grid container spacing={3} sx={{p:1}}>
                            {/* Main Content - Left Side */}
                            <Grid item xs={12} lg={8}>
                                {/* Product Information Card */}
                                <Card elevation={0} sx={{ mb: 2 }}>
                                    <CardHeader
                                        avatar={<Inventory />}
                                        title="Product Information"
                                    />
                                    <CardContent sx={{ pt: 0 }}>
                                        <Grid container spacing={2}>
                                            {/* Product Name */}
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <FormLabel>
                                                        Product Name{' '}
                                                        <Typography component="span" color="error">
                                                            *
                                                        </Typography>
                                                    </FormLabel>
                                                    <TextField
                                                        fullWidth
                                                        name="name"
                                                        value={values.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.name && Boolean(errors.name)}
                                                        helperText={touched.name && errors.name}
                                                        placeholder="e.g., Wireless Mouse XZ-200"
                                                        size="small"
                                                        inputProps={{ maxLength: 100 }}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            {/* Category */}
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <FormLabel>
                                                        Category{' '}
                                                        <Typography component="span" color="error">
                                                            *
                                                        </Typography>
                                                    </FormLabel>
                                                    <TextField
                                                        fullWidth
                                                        select
                                                        name="category"
                                                        value={values.category}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.category && Boolean(errors.category)}
                                                        helperText={touched.category && errors.category}
                                                        size="small"
                                                    >
                                                        <MenuItem value="">
                                                            <em>Select a category</em>
                                                        </MenuItem>
                                                        {CATEGORIES.map((cat) => (
                                                            <MenuItem key={cat} value={cat}>
                                                                {cat}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </FormControl>
                                            </Grid>

                                            {/* Brand */}
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <FormLabel>Brand</FormLabel>
                                                    <TextField
                                                        fullWidth
                                                        name="brand"
                                                        value={values.brand}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.brand && Boolean(errors.brand)}
                                                        helperText={touched.brand && errors.brand}
                                                        placeholder="e.g., TechCorp"
                                                        size="small"
                                                        inputProps={{ maxLength: 50 }}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            {/* Price */}
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <FormLabel>
                                                        Price (₹){' '}
                                                        <Typography component="span" color="error">
                                                            *
                                                        </Typography>
                                                    </FormLabel>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        name="price"
                                                        value={values.price}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.price && Boolean(errors.price)}
                                                        helperText={touched.price && errors.price}
                                                        placeholder="0.00"
                                                        size="small"
                                                        inputProps={{
                                                            min: 0,
                                                            step: 0.01,
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            {/* Stock */}
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth>
                                                    <FormLabel>
                                                        Stock Quantity{' '}
                                                        <Typography component="span" color="error">
                                                            *
                                                        </Typography>
                                                    </FormLabel>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        name="stock"
                                                        value={values.stock}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.stock && Boolean(errors.stock)}
                                                        helperText={touched.stock && errors.stock}
                                                        placeholder="0"
                                                        size="small"
                                                        inputProps={{
                                                            min: 0,
                                                            step: 1,
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>

                                            {/* Description */}
                                            <Grid item xs={12}>
                                                <FormControl fullWidth>
                                                    <FormLabel>Description</FormLabel>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={4}
                                                        name="description"
                                                        value={values.description}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.description && Boolean(errors.description)}
                                                        helperText={
                                                            touched.description && errors.description
                                                                ? errors.description
                                                                : `${values.description.length}/500 characters`
                                                        }
                                                        placeholder="Provide a detailed description of the product"
                                                        size="small"
                                                        inputProps={{ maxLength: 500 }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                {/* Product Images Card */}
                                <Card elevation={0} sx={{ mb: 2 }}>
                                    <CardHeader
                                        avatar={<CloudUpload />}
                                        title="Product Images"
                                        subheader={`Upload up to ${MAX_IMAGES} images (max 5MB each)`}
                                    />
                                    <CardContent sx={{ pt: 0 }}>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 4,
                                                textAlign: 'center',
                                                borderStyle: 'dashed',
                                                borderWidth: 2,
                                                bgcolor: 'background.default',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                    borderColor: 'primary.main',
                                                },
                                            }}
                                        >
                                            <CloudUpload
                                                sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                                            />
                                            <Typography variant="body1" fontWeight={500} mb={0.5}>
                                                Drag and drop or click to upload
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                                                PNG, JPG up to 5MB (max {MAX_IMAGES} images)
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                component="label"
                                                startIcon={<CloudUpload />}
                                                size="small"
                                            >
                                                Browse Files
                                                <input
                                                    type="file"
                                                    hidden
                                                    multiple
                                                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                                    onChange={(event) => {
                                                        const files = event.currentTarget.files;
                                                        if (files) {
                                                            const fileArray = Array.from(files).slice(0, MAX_IMAGES);
                                                            setFieldValue('images', fileArray);
                                                            setFieldTouched('images', true);
                                                        }
                                                    }}
                                                />
                                            </Button>
                                        </Paper>

                                        {/* Display selected images */}
                                        {values.images.length > 0 && (
                                            <Box mt={2}>
                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    {values.images.map((file, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={file.name}
                                                            onDelete={() => {
                                                                const newImages = values.images.filter(
                                                                    (_, i) => i !== index
                                                                );
                                                                setFieldValue('images', newImages);
                                                            }}
                                                            deleteIcon={<Close />}
                                                            size="small"
                                                            sx={{ mb: 1 }}
                                                        />
                                                    ))}
                                                </Stack>
                                            </Box>
                                        )}

                                        {/* Display errors */}
                                        {touched.images && errors.images && (
                                            <Typography
                                                variant="caption"
                                                color="error"
                                                display="block"
                                                mt={1}
                                            >
                                                {Array.isArray(errors.images) ? errors.images.join(', ') : errors.images}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Sidebar - Right Side */}
                            <Grid item xs={12} lg={4}>
                                {/* Status Card */}
                                <Card elevation={0} sx={{ mb: 2 }}>
                                    <CardHeader title="Status" />
                                    <CardContent sx={{ pt: 0 }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    name="status"
                                                    checked={values.status === 'active'}
                                                    onChange={(e) =>
                                                        setFieldValue(
                                                            'status',
                                                            e.target.checked ? 'active' : 'inactive'
                                                        )
                                                    }
                                                    color="primary"
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {values.status === 'active' ? 'Active' : 'Inactive'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {values.status === 'active'
                                                            ? 'Product is visible to customers'
                                                            : 'Product is hidden from customers'}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </CardContent>
                                </Card>

                                {/* Actions Card */}
                                <Card elevation={0}>
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Button
                                                fullWidth
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting
                                                    ? 'Saving...'
                                                    : isEdit
                                                        ? 'Update Product'
                                                        : 'Create Product'}
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                size="large"
                                                onClick={handleBackNavigation}
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
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