import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Chip,
    Tabs,
    Tab,
    IconButton,
    Grid,
    Stack,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
    alpha,
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    Download,
    QrCode2,
    Inventory2,
    CalendarToday,
    Science,
    Agriculture,
    LocalFlorist,
    Description,
    Category,
    BrandingWatermark,
    Timeline,
    Refresh
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../../redux/reducer/snackbarSlice';
import PageHead from '../../../../components/common/page/PageHead';
import { FetchProductDetailsService } from '../../../../utils/services/product.service';

// --- Interfaces ---
interface Product {
    id: number;
    uuid: string;
    product_code: string;
    product_name: string;
    category: string;
    sub_category: string;
    grade: string;
    brand: string;
    description: string;
    mrp: number;
    selling_price: number;
    unit: string;
    stock_qty: number;
    qr_code_path: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Ingredient {
    id: number;
    ingredient_name: string;
    unit: string;
    spec_type: 'minimum' | 'maximum';
    value: string;
    sort_order: number;
}

interface Specification {
    id: number;
    parameter_name: string;
    unit: string;
    spec_type: 'minimum' | 'maximum';
    value: string;
    sort_order: number;
}

interface Usage {
    crops: string[];
    dose: string;
}

interface ProductDetailsResponse {
    product: Product;
    ingredients: Ingredient[];
    specifications: Specification[];
    usage: Usage;
}

// --- Tab Panel Component ---
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
    return (
        <div role="tabpanel" hidden={value !== index} id={`tech-tabpanel-${index}`} aria-labelledby={`tech-tab-${index}`} {...other}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
};

const ProductDetail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();

    const [tabValue, setTabValue] = useState(0);
    const [productData, setProductData] = useState<ProductDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const uuid = searchParams.get('uuid');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data, code } = await FetchProductDetailsService({ product_uuid: uuid });
                if (code === 200 && data) {
                    setProductData(data);
                } else {
                    dispatch(showSnackbar({ type: 'error', message: 'Failed to fetch product details' }));
                }
            } catch (error) {
                dispatch(showSnackbar({ type: 'error', message: 'Error loading product' }));
            } finally {
                setLoading(false);
            }
        };

        if (uuid) {
            fetchProduct();
        } else {
            setLoading(false);
        }
    }, [uuid, dispatch]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleGenerateQR = () => dispatch(showSnackbar({ type: 'success', message: 'QR code regenerated!' }));
    const handleDownloadQR = () => dispatch(showSnackbar({ type: 'success', message: 'QR code downloaded!' }));
    const handleEdit = () => uuid && navigate(`/admin/products/create?uuid=${uuid}`);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', minHeight: '400px', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6">Loading...</Typography>
            </Box>
        );
    }

    if (!uuid || !productData) {
        return (
            <Box sx={{ display: 'flex', minHeight: '400px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>Product not found</Typography>
                <Button variant="contained" onClick={() => navigate('/admin/products')}>Back to Products</Button>
            </Box>
        );
    }

    const { product, ingredients, specifications, usage } = productData;

    return (
        <Box sx={{ pb: 4, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
            <PageHead
                primary={
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="h2" fontWeight={700} sx={{ color: 'text.primary' }}>
                                {product.product_name}
                            </Typography>
                            <Chip
                                label={product.is_active ? 'Active' : 'Inactive'}
                                color={product.is_active ? 'success' : 'default'}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                CODE: {product.product_code}
                            </Typography>
                            <Divider orientation="vertical" flexItem sx={{ height: 16, alignSelf: 'center' }} />
                            <Chip label={`Grade: ${product.grade}`} size="small" color="primary" sx={{ borderRadius: 1 }} />
                        </Stack>
                    </Box>
                }
                back={
                    <IconButton onClick={() => navigate('/admin/products')} sx={{ bgcolor: 'white', border: 1, borderColor: 'divider' }}>
                        <ArrowBack />
                    </IconButton>
                }
                secondary={
                    <Button variant="contained" startIcon={<Edit />} onClick={handleEdit} sx={{ px: 3 }}>
                        Edit Details
                    </Button>
                }
            />

            <Grid container spacing={3} sx={{ px: { xs: 2, sm: 3 } }}>

                {/* --- LEFT COLUMN: MAIN CONTENT (lg=8) --- */}
                <Grid item xs={12} lg={8}>

                    {/* 1. Overview Card */}
                    <Card elevation={0} sx={{ mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <CardHeader
                            avatar={<Description color="primary" />}
                            title={<Typography variant="h6" fontWeight={600}>Product Overview</Typography>}
                        />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="overline" color="text.secondary" fontWeight={600}>Description</Typography>
                                    <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.6, color: 'text.primary' }}>
                                        {product.description || 'No description available for this product.'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} sm={3}>
                                                <Stack spacing={0.5}>
                                                    <Typography variant="caption" color="text.secondary">Category</Typography>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Category fontSize="small" color="action" />
                                                        <Typography fontWeight={600}>{product.category}</Typography>
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Stack spacing={0.5}>
                                                    <Typography variant="caption" color="text.secondary">Sub Category</Typography>
                                                    <Typography fontWeight={600}>{product.sub_category || '-'}</Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Stack spacing={0.5}>
                                                    <Typography variant="caption" color="text.secondary">Brand</Typography>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <BrandingWatermark fontSize="small" color="action" />
                                                        <Typography fontWeight={600}>{product.brand || '-'}</Typography>
                                                    </Stack>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Stack spacing={0.5}>
                                                    <Typography variant="caption" color="text.secondary">Unit</Typography>
                                                    <Typography fontWeight={600}>{product.unit}</Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* 2. Technical Specs & Usage (Tabbed) */}
                    <Card elevation={0} sx={{ mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="technical details tabs">
                                <Tab label="Ingredients" icon={<Science fontSize="small" />} iconPosition="start" />
                                <Tab label="Specifications" icon={<Inventory2 fontSize="small" />} iconPosition="start" />
                                <Tab label="Usage Guide" icon={<Agriculture fontSize="small" />} iconPosition="start" />
                            </Tabs>
                        </Box>

                        <TabPanel value={tabValue} index={0}>
                            <CardContent sx={{ pt: 0 }}>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                                            <TableRow>
                                                <TableCell>Ingredient Name</TableCell>
                                                <TableCell>Value</TableCell>
                                                <TableCell>Type</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {ingredients.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell sx={{ fontWeight: 500 }}>{item.ingredient_name}</TableCell>
                                                    <TableCell>{item.value} {item.unit}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={item.spec_type}
                                                            size="small"
                                                            color={item.spec_type === 'minimum' ? 'info' : 'warning'}
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {ingredients.length === 0 && <TableRow><TableCell colSpan={3} align="center">No Data</TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <CardContent sx={{ pt: 0 }}>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                                            <TableRow>
                                                <TableCell>Parameter</TableCell>
                                                <TableCell>Value</TableCell>
                                                <TableCell>Type</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {specifications.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell sx={{ fontWeight: 500 }}>{item.parameter_name}</TableCell>
                                                    <TableCell>{item.value} {item.unit}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={item.spec_type}
                                                            size="small"
                                                            color={item.spec_type === 'minimum' ? 'info' : 'warning'}
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {specifications.length === 0 && <TableRow><TableCell colSpan={3} align="center">No Data</TableCell></TableRow>}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <CardContent sx={{ pt: 0 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center" gap={1}>
                                            <LocalFlorist color="success" fontSize="small" /> Recommended Crops
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                                            {usage.crops.map((crop, index) => (
                                                <Chip key={index} label={crop} color="success" size="small" sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.dark', fontWeight: 600 }} />
                                            ))}
                                            {usage.crops.length === 0 && <Typography variant="caption">No crops specified</Typography>}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center" gap={1}>
                                            <Science color="primary" fontSize="small" /> Dosage Instructions
                                        </Typography>
                                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                                {usage.dose || 'No dosage information available.'}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </TabPanel>
                    </Card>
                </Grid>

                {/* --- RIGHT COLUMN: SIDEBAR (lg=4) --- */}
                <Grid item xs={12} lg={4}>

                    {/* 1. QR Code Section (Moved Here) */}
                    <Card elevation={0} sx={{ mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <CardHeader
                            avatar={<QrCode2 color="primary" />}
                            title={<Typography variant="subtitle1" fontWeight={600}>Product QR Code</Typography>}
                            action={
                                <IconButton size="small" onClick={handleGenerateQR}>
                                    <Refresh fontSize="small" />
                                </IconButton>
                            }
                        />
                        <Divider />
                        <CardContent>
                            <Stack alignItems="center" spacing={2}>
                                {/* QR Image Container */}
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: 'white',
                                        border: '1px dashed',
                                        borderColor: 'divider',
                                        display: 'inline-block'
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={product.qr_code_path ? `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${product.uuid}` : ''}
                                        alt="Product QR"
                                        sx={{ width: 140, height: 140, display: 'block' }}
                                    />
                                </Paper>

                                <Box width="100%">
                                    <Typography variant="caption" display="block" align="center" color="text.secondary" gutterBottom>
                                        UUID: <span style={{ fontFamily: 'monospace' }}>{product.uuid.substring(0, 18)}...</span>
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<Download />}
                                        onClick={handleDownloadQR}
                                        sx={{ mt: 1 }}
                                    >
                                        Download PNG
                                    </Button>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* 2. Price & Stock Card */}
                    <Card
                        elevation={0}
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Decorative Circle */}
                        <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />

                        <CardContent>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>Selling Price</Typography>
                                    <Stack direction="row" alignItems="baseline" spacing={1}>
                                        <Typography variant="h3" fontWeight={700}>
                                            ₹{product.selling_price.toLocaleString()}
                                        </Typography>
                                        <Typography variant="h6" sx={{ opacity: 0.7, fontWeight: 400 }}>
                                            / {product.unit}
                                        </Typography>
                                    </Stack>
                                    {product.mrp > product.selling_price && (
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            MRP: <span style={{ textDecoration: 'line-through' }}>₹{product.mrp.toLocaleString()}</span>
                                        </Typography>
                                    )}
                                </Box>

                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="overline" sx={{ opacity: 0.8 }}>Available Stock</Typography>
                                        <Typography variant="h5" fontWeight={600} display="flex" alignItems="center" gap={1}>
                                            <Inventory2 fontSize="medium" /> {product.stock_qty}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* 3. System Metadata */}
                    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <CardHeader
                            avatar={<Timeline color="action" />}
                            title={<Typography variant="subtitle1" fontWeight={600}>System Information</Typography>}
                        />
                        <Divider />
                        <CardContent>
                            <Stack spacing={2.5}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                        System ID
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500} fontFamily="monospace">
                                        #{product.id}
                                    </Typography>
                                </Box>

                                <Stack direction="row" spacing={2}>
                                    <Box flex={1}>
                                        <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                                            <CalendarToday fontSize="inherit" /> Created
                                        </Typography>
                                        <Typography variant="body2" mt={0.5}>
                                            {new Date(product.created_at).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Box flex={1}>
                                        <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
                                            <CalendarToday fontSize="inherit" /> Updated
                                        </Typography>
                                        <Typography variant="body2" mt={0.5}>
                                            {new Date(product.updated_at).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductDetail;