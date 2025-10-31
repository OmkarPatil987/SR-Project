import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Chip,
    Tabs,
    Tab,
    IconButton,
    Grid,
    Stack,
    Divider,
    Paper,
    Avatar,
    Badge,
    Dialog,
    DialogContent,
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    Download,
    QrCode2,
    ZoomIn,
    ChevronLeft,
    ChevronRight,
    Close,
    Inventory2,
    CalendarToday,
    Person,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../../redux/reducer/snackbarSlice';
import PageHead from '../../../../components/common/page/PageHead';

interface ProductImage {
    id: string;
    url: string;
    alt: string;
    isPrimary?: boolean;
}

interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    brand?: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive';
    attachments: ProductImage[];
    qrCode: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
}

const mockProducts: Product[] = [
    {
        id: 'PRD-001',
        name: 'Wireless Mouse XZ-200',
        description: 'High-precision wireless mouse with ergonomic design. Features include adjustable DPI, programmable buttons, and long battery life. Perfect for both gaming and professional work.',
        category: 'Electronics',
        brand: 'TechCorp',
        price: 1299,
        stock: 150,
        status: 'active',
        attachments: [
            { id: 'img-1', url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800', alt: 'Wireless Mouse - Front View', isPrimary: true },
            { id: 'img-2', url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800', alt: 'Wireless Mouse - Side View' },
            { id: 'img-3', url: 'https://images.unsplash.com/photo-1586920740099-e81fc4c14407?w=800', alt: 'Wireless Mouse - Top View' },
            { id: 'img-4', url: 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=800', alt: 'Wireless Mouse - In Use' },
        ],
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=PRD-001',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-10-20T14:45:00Z',
        createdBy: 'Admin',
        updatedBy: 'John Doe',
    },
    {
        id: 'PRD-002',
        name: 'Office Chair Pro',
        description: 'Ergonomic office chair with lumbar support and adjustable features',
        category: 'Furniture',
        brand: 'OfficeMax',
        price: 8999,
        stock: 45,
        status: 'active',
        attachments: [
            { id: 'img-1', url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800', alt: 'Office Chair - Main', isPrimary: true },
        ],
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=PRD-002',
        createdAt: '2024-02-10T08:15:00Z',
        updatedAt: '2024-10-22T16:30:00Z',
        createdBy: 'Admin',
        updatedBy: 'Jane Smith',
    },
];

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
    return (
        <div role="tabpanel" hidden={value !== index} id={`product-tabpanel-${index}`} aria-labelledby={`product-tab-${index}`} {...other}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
};

const ProductDetail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [tabValue, setTabValue] = useState(0);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const uuid = searchParams.get('uuid');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const foundProduct = mockProducts.find((p) => p.id === uuid);
                setProduct(foundProduct || null);
            } catch (error) {
                dispatch(showSnackbar({ type: 'error', message: 'Failed to load product details' }));
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

    const handleGenerateQR = () => {
        dispatch(showSnackbar({ type: 'success', message: 'QR code generated!' }));
    };

    const handleDownloadQR = () => {
        dispatch(showSnackbar({ type: 'success', message: 'QR code downloaded!' }));
    };

    const handleEdit = () => {
        if (uuid) {
            navigate(`/admin/products/edit?uuid=${uuid}`);
        }
    };

    const handleImageSelect = (index: number) => {
        setSelectedImage(index);
    };

    const handleLightboxOpen = (index: number) => {
        setSelectedImage(index);
        setLightboxOpen(true);
    };

    const handleLightboxClose = () => {
        setLightboxOpen(false);
    };

    const handleNextImage = () => {
        if (product) {
            setSelectedImage((prev) => (prev + 1) % product.attachments.length);
        }
    };

    const handlePrevImage = () => {
        if (product) {
            setSelectedImage((prev) => (prev - 1 + product.attachments.length) % product.attachments.length);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', minHeight: '400px', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6">Loading...</Typography>
            </Box>
        );
    }

    if (!uuid || !product) {
        return (
            <Box sx={{ display: 'flex', minHeight: '400px', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Product not found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        {!uuid ? 'No product UUID provided in the URL' : 'The product you are looking for does not exist'}
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/admin/products')}>
                        Back to Products
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ pb: 4, bgcolor: 'background.default' }}>
            <PageHead
                primary={
                    <>
                        <Typography variant="h2" fontWeight={700}>
                            {product.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                            <Chip label={product.id} size="small" variant="outlined" />
                            <Chip label={product.status} size="small" color={product.status === 'active' ? 'success' : 'default'} />
                        </Stack>
                    </>
                }
                back={
                    <IconButton onClick={() => navigate('/admin/products')} size="small">
                        <ArrowBack />
                    </IconButton>
                }
                secondary={
                    <>
                        <Button variant="contained" startIcon={<QrCode2 />} onClick={handleGenerateQR}>
                            Generate QR
                        </Button>
                        <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadQR}>
                            Download QR
                        </Button>
                        <Button variant="contained" startIcon={<Edit />} onClick={handleEdit}>
                            Edit Product
                        </Button>
                    </>
                }
            />

            <Grid container spacing={3} sx={{ px: { xs: 2, sm: 3 } }}>
                <Grid item xs={12} lg={8}>
                    <Card elevation={0} sx={{ mb: 3, overflow: 'hidden' }}>
                        <Box
                            sx={{
                                position: 'relative',
                                bgcolor: 'grey.50',
                                aspectRatio: '16/10',
                                overflow: 'hidden',
                                cursor: 'zoom-in',
                            }}
                            onClick={() => handleLightboxOpen(selectedImage)}
                        >
                            <Box
                                component="img"
                                src={product.attachments[selectedImage]?.url}
                                alt={product.attachments[selectedImage]?.alt}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'scale(1.05)' },
                                }}
                            />
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    bgcolor: 'background.paper',
                                    '&:hover': { bgcolor: 'background.paper' },
                                }}
                            >
                                <ZoomIn />
                            </IconButton>
                            {product.attachments.length > 1 && (
                                <Chip
                                    label={`${selectedImage + 1} / ${product.attachments.length}`}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 16,
                                        right: 16,
                                        bgcolor: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                    }}
                                />
                            )}
                        </Box>

                        {product.attachments.length > 1 && (
                            <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                                <Grid container spacing={1}>
                                    {product.attachments.map((image, index) => (
                                        <Grid item xs={3} sm={2} md={1.5} key={image.id}>
                                            <Paper
                                                elevation={selectedImage === index ? 4 : 1}
                                                sx={{
                                                    aspectRatio: '1',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    border: 2,
                                                    borderColor: selectedImage === index ? 'primary.main' : 'transparent',
                                                    transition: 'all 0.2s',
                                                    '&:hover': { borderColor: 'primary.light' },
                                                }}
                                                onClick={() => handleImageSelect(index)}
                                            >
                                                <Box
                                                    component="img"
                                                    src={image.url}
                                                    alt={image.alt}
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                    </Card>

                    <Card elevation={0}>
                        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tab label="Details" icon={<Inventory2 />} iconPosition="start" />
                            <Tab label="QR Code" icon={<QrCode2 />} iconPosition="start" />
                            <Tab label="History" icon={<CalendarToday />} iconPosition="start" />
                        </Tabs>

                        <TabPanel value={tabValue} index={0}>
                            <CardContent>
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="overline" color="text.secondary">
                                            Description
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.8 }}>
                                            {product.description}
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    <Grid container spacing={3}>
                                        <Grid item xs={6} sm={3}>
                                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Category
                                                </Typography>
                                                <Typography variant="body1" fontWeight={600} mt={1}>
                                                    {product.category}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Brand
                                                </Typography>
                                                <Typography variant="body1" fontWeight={600} mt={1}>
                                                    {product.brand || 'N/A'}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Created
                                                </Typography>
                                                <Typography variant="body1" fontWeight={600} mt={1}>
                                                    {new Date(product.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Updated
                                                </Typography>
                                                <Typography variant="body1" fontWeight={600} mt={1}>
                                                    {new Date(product.updatedAt).toLocaleDateString()}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </CardContent>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <CardContent>
                                <Stack alignItems="center" spacing={3}>
                                    <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, bgcolor: 'background.default' }}>
                                        <Box component="img" src={product.qrCode} alt="QR Code" sx={{ width: 256, height: 256, display: 'block' }} />
                                    </Paper>
                                    <Typography variant="body2" color="text.secondary">
                                        Scan this QR code to view product details
                                    </Typography>
                                    <Stack direction="row" spacing={2} flexWrap="wrap">
                                        <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadQR}>
                                            PNG
                                        </Button>
                                        <Button variant="outlined" startIcon={<Download />} onClick={handleDownloadQR}>
                                            SVG
                                        </Button>
                                        <Button variant="contained" startIcon={<QrCode2 />} onClick={handleGenerateQR}>
                                            Regenerate
                                        </Button>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <CardContent>
                                <Stack spacing={2}>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <Person />
                                            </Avatar>
                                            <Box flex={1}>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    Product Updated
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(product.updatedAt).toLocaleString()}
                                                </Typography>
                                                <Chip label={`By ${product.updatedBy || 'System'}`} size="small" sx={{ mt: 1 }} />
                                            </Box>
                                        </Stack>
                                    </Paper>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            <Avatar sx={{ bgcolor: 'success.main' }}>
                                                <Person />
                                            </Avatar>
                                            <Box flex={1}>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    Product Created
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(product.createdAt).toLocaleString()}
                                                </Typography>
                                                <Chip label={`By ${product.createdBy || 'System'}`} size="small" sx={{ mt: 1 }} />
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </CardContent>
                        </TabPanel>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Card elevation={0} sx={{ mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <CardContent>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="overline" sx={{ opacity: 0.9 }}>
                                        Price
                                    </Typography>
                                    <Typography variant="h3" fontWeight={700}>
                                        ₹{product.price.toLocaleString()}
                                    </Typography>
                                </Box>
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                                <Stack direction="row" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="overline" sx={{ opacity: 0.9 }}>
                                            Stock
                                        </Typography>
                                        <Typography variant="h4" fontWeight={700}>
                                            {product.stock}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="overline" sx={{ opacity: 0.9 }}>
                                            Status
                                        </Typography>
                                        <Chip
                                            label={product.status}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                textTransform: 'capitalize',
                                                mt: 1,
                                            }}
                                        />
                                    </Box>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Product Information
                            </Typography>
                            <Stack spacing={2} mt={2}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Product ID
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {product.id}
                                    </Typography>
                                </Stack>
                                <Divider />
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Category
                                    </Typography>
                                    <Chip label={product.category} size="small" />
                                </Stack>
                                <Divider />
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Brand
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {product.brand || 'N/A'}
                                    </Typography>
                                </Stack>
                                <Divider />
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Images
                                    </Typography>
                                    <Badge badgeContent={product.attachments.length} color="primary">
                                        <Chip label="Photos" size="small" />
                                    </Badge>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card elevation={0}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Quick Actions
                            </Typography>
                            <Stack spacing={2} mt={2}>
                                <Button fullWidth variant="contained" startIcon={<Edit />} onClick={handleEdit}>
                                    Edit Product
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog open={lightboxOpen} onClose={handleLightboxClose} maxWidth="lg" fullWidth PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}>
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    <IconButton
                        onClick={handleLightboxClose}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 1,
                            bgcolor: 'background.paper',
                            '&:hover': { bgcolor: 'background.paper' },
                        }}
                    >
                        <Close />
                    </IconButton>
                    <Box
                        sx={{
                            position: 'relative',
                            bgcolor: 'black',
                            minHeight: '80vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            component="img"
                            src={product.attachments[selectedImage]?.url}
                            alt={product.attachments[selectedImage]?.alt}
                            sx={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                            }}
                        />
                        {product.attachments.length > 1 && (
                            <>
                                <IconButton
                                    onClick={handlePrevImage}
                                    sx={{
                                        position: 'absolute',
                                        left: 16,
                                        bgcolor: 'background.paper',
                                        '&:hover': { bgcolor: 'background.paper' },
                                    }}
                                >
                                    <ChevronLeft />
                                </IconButton>
                                <IconButton
                                    onClick={handleNextImage}
                                    sx={{
                                        position: 'absolute',
                                        right: 16,
                                        bgcolor: 'background.paper',
                                        '&:hover': { bgcolor: 'background.paper' },
                                    }}
                                >
                                    <ChevronRight />
                                </IconButton>
                                <Chip
                                    label={`${selectedImage + 1} / ${product.attachments.length}`}
                                    sx={{
                                        position: 'absolute',
                                        bottom: 16,
                                        bgcolor: 'background.paper',
                                    }}
                                />
                            </>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ProductDetail;
