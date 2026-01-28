import { useNavigate, useParams } from 'react-router-dom';
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
    IconButton,
} from '@mui/material';
import {
    ArrowBack,
    Inventory2,
    Science,
    Agriculture,
    LocalFlorist,
    Description,
    Category,
    BrandingWatermark,
    Timeline,
    Download
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
import { GuestProductDetailsService } from '../../../utils/services/guest.service';


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
    stock_qty: number; // Might want to hide actual stock number for guests? Kept for now.
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

const GuestProductDetail: React.FC = () => {
    // 1. Get UUID from URL path parameter /p/:uuid
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    console.log("Guest Product Detail UUID:", uuid);
    const [tabValue, setTabValue] = useState(0);
    const [productData, setProductData] = useState<ProductDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!uuid) return;
            setLoading(true);
      
                // 2. Call Guest Service
                const { data, code } = await GuestProductDetailsService({ product_uuid: uuid });
                if (code === 200 && data) {
                    setProductData(data);
                } else {
                    dispatch(showSnackbar({ type: 'error', message: 'Failed to fetch product details' }));
                }

                setLoading(false);
            
        };

        fetchProduct();
    }, [uuid, dispatch]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // removed generate QR logic as guests shouldn't regenerate it
    const handleDownloadQR = () => dispatch(showSnackbar({ type: 'success', message: 'QR code downloaded!' }));

    if (loading) {
        return (
            <Box sx={{ display: 'flex', minHeight: '400px', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6">Loading Product...</Typography>
            </Box>
        );
    }

    if (!uuid || !productData) {
        return (
            <Box sx={{ display: 'flex', minHeight: '400px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>Product Not Found</Typography>
                <Typography variant="body1" color="text.secondary">The product you are looking for does not exist or is inactive.</Typography>
            </Box>
        );
    }

    const { product, ingredients, specifications, usage } = productData;

    return (
        <Box sx={{ pb: 4, bgcolor: '#f4f6f8', minHeight: '100vh', pt: 4 }}>
            {/* Simplified Header for Guests */}
            <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3 } }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                    <Box flex={1}>
                        <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={1}>
                            PRODUCT CATALOG
                        </Typography>
                        <Typography variant="h3" fontWeight={800} sx={{ color: 'text.primary', mt: 0.5 }}>
                            {product.product_name}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                CODE: {product.product_code}
                            </Typography>
                            <Divider orientation="vertical" flexItem sx={{ height: 16, alignSelf: 'center' }} />
                            <Chip label={`Grade: ${product.grade}`} size="small" sx={{ borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 600 }} />
                        </Stack>
                    </Box>
                </Stack>

                <Grid container spacing={4}>

                    {/* --- LEFT COLUMN: MAIN CONTENT (lg=8) --- */}
                    <Grid item xs={12} lg={8}>

                        {/* 1. Overview Card */}
                        <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                            <CardHeader
                                avatar={<Description color="primary" />}
                                title={<Typography variant="h6" fontWeight={700}>Product Overview</Typography>}
                            />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                                            {product.description || 'No detailed description available for this product.'}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Paper variant="outlined" sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: 2 }}>
                                            <Grid container spacing={3}>
                                                <Grid item xs={6} sm={3}>
                                                    <Stack spacing={0.5}>
                                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>CATEGORY</Typography>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <Category fontSize="small" color="action" />
                                                            <Typography fontWeight={500}>{product.category}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <Stack spacing={0.5}>
                                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>SUB CATEGORY</Typography>
                                                        <Typography fontWeight={500}>{product.sub_category || '-'}</Typography>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <Stack spacing={0.5}>
                                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>BRAND</Typography>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <BrandingWatermark fontSize="small" color="action" />
                                                            <Typography fontWeight={500}>{product.brand || '-'}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <Stack spacing={0.5}>
                                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>UNIT</Typography>
                                                        <Typography fontWeight={500}>{product.unit}</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* 2. Technical Specs & Usage (Tabbed) */}
                        <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
                                <Tabs value={tabValue} onChange={handleTabChange} aria-label="technical details tabs" variant="scrollable" scrollButtons="auto">
                                    <Tab label="Ingredients" icon={<Science fontSize="small" />} iconPosition="start" />
                                    <Tab label="Specifications" icon={<Inventory2 fontSize="small" />} iconPosition="start" />
                                    <Tab label="Usage Guide" icon={<Agriculture fontSize="small" />} iconPosition="start" />
                                </Tabs>
                            </Box>

                            <TabPanel value={tabValue} index={0}>
                                <CardContent sx={{ pt: 0 }}>
                                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
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
                                                    <TableRow key={item.id} hover>
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
                                                {ingredients.length === 0 && <TableRow><TableCell colSpan={3} align="center">No ingredients listed</TableCell></TableRow>}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </TabPanel>

                            <TabPanel value={tabValue} index={1}>
                                <CardContent sx={{ pt: 0 }}>
                                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
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
                                                    <TableRow key={item.id} hover>
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
                                                {specifications.length === 0 && <TableRow><TableCell colSpan={3} align="center">No specifications listed</TableCell></TableRow>}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </TabPanel>

                            <TabPanel value={tabValue} index={2}>
                                <CardContent sx={{ pt: 0 }}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Paper variant="outlined" sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                                                <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center" gap={1} color="success.main">
                                                    <LocalFlorist fontSize="small" /> Recommended Crops
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {usage.crops.map((crop, index) => (
                                                        <Chip key={index} label={crop} color="success" variant="outlined" sx={{ fontWeight: 600 }} />
                                                    ))}
                                                    {usage.crops.length === 0 && <Typography variant="caption" color="text.secondary">No crops specified</Typography>}
                                                </Box>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Paper variant="outlined" sx={{ p: 3, height: '100%', borderRadius: 2, bgcolor: 'grey.50' }}>
                                                <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center" gap={1} color="primary.main">
                                                    <Science fontSize="small" /> Dosage Instructions
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: 'text.secondary' }}>
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
                        <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                            <CardContent>
                                <Stack alignItems="center" spacing={2} py={2}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            bgcolor: 'white',
                                            border: '2px dashed',
                                            borderColor: 'divider',
                                            display: 'inline-block'
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={product.qr_code_path ? `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${product.uuid}` : ''}
                                            alt="Product QR"
                                            sx={{ width: 160, height: 160, display: 'block' }}
                                        />
                                    </Paper>

                                    <Box width="100%" textAlign="center">
                                        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                            Verify Authenticity
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, px: 2 }}>
                                            Scan this code to verify product details and authenticity on the go.
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Download />}
                                            onClick={handleDownloadQR}
                                            size="small"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Save QR Code
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
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                            <Box sx={{ position: 'absolute', bottom: -40, left: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />

                            <CardContent>
                                <Stack spacing={3} py={1}>
                                    <Box>
                                        <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1, fontWeight: 600 }}>PRICE</Typography>
                                        <Stack direction="row" alignItems="baseline" spacing={1}>
                                            <Typography variant="h3" fontWeight={700}>
                                                ₹{product.selling_price.toLocaleString()}
                                            </Typography>
                                            <Typography variant="h6" sx={{ opacity: 0.7, fontWeight: 400 }}>
                                                / {product.unit}
                                            </Typography>
                                        </Stack>
                                        {product.mrp > product.selling_price && (
                                            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                                MRP: <span style={{ textDecoration: 'line-through' }}>₹{product.mrp.toLocaleString()}</span>
                                            </Typography>
                                        )}
                                    </Box>

                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: 600 }}>AVAILABILITY</Typography>
                                            <Typography variant="h5" fontWeight={600} display="flex" alignItems="center" gap={1}>
                                                <Inventory2 fontSize="medium" />
                                                {product.stock_qty > 0 ? 'In Stock' : 'Out of Stock'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* 3. System Metadata */}
                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'transparent' }}>
                            <CardContent>
                                <Stack spacing={2}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Timeline color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" display="block">LAST UPDATED</Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {new Date(product.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>

                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default GuestProductDetail;