import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    Typography,
    Chip,
    Tabs,
    Tab,
    IconButton,
    Grid,
    Stack,
    Divider,
    Paper,
    useTheme,
    alpha,
    Avatar,
    Container,
    CircularProgress,
    Breadcrumbs,
    Link
} from '@mui/material';
import {
    Download,
    CalendarMonth,
    Verified,
    Info,
    QrCode2,
    Person,
    MoreVert,
    NavigateNext,
    History
} from '@mui/icons-material';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../../redux/reducer/snackbarSlice';
import { FetchProductDetailsService } from '../../../../utils/services/product.service';
import { BaseUrls } from '../../../../utils/base-urls';

const S3_URL = BaseUrls.S3_BASE_URL.url;
const ITEMS_PER_PAGE = 6; // How many QR batches to show initially

const ProductDetail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();

    const [tabValue, setTabValue] = useState(0);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    // Pagination Logic
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const uuid = searchParams.get('uuid');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data, code } = await FetchProductDetailsService({ product_master_uuid: uuid });
                if (code === 200 && data) {
                    setProduct(data);
                }
            } catch (error) {
                dispatch(showSnackbar({ type: 'error', message: 'Error loading product' }));
            } finally {
                setLoading(false);
            }
        };
        if (uuid) fetchProduct();
    }, [uuid, dispatch]);

    // Filter and Paginate logic
    const filteredDetails = useMemo(() => {
        if (!product) return [];
        return product.details.filter((d: any) => tabValue === 0 ? d.type === 'static' : d.type === 'dynamic');
    }, [product, tabValue]);

    const paginatedDetails = filteredDetails.slice(0, visibleCount);
    const hasMore = filteredDetails.length > visibleCount;

    const handleTabChange = (_: any, newValue: number) => {
        setTabValue(newValue);
        setVisibleCount(ITEMS_PER_PAGE); // Reset pagination on tab change
    };

    const handleDownload = async (path: string, fileName: string, qrId: number) => {
        if (!path) return;
        setDownloadingId(qrId);
        try {
            const response = await fetch(S3_URL + path);
            const blob = await response.blob();
            const localUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = localUrl;
            link.download = `${fileName || 'QR'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(localUrl);
        } catch (error) {
            window.open(S3_URL + path, '_blank');
        } finally {
            setDownloadingId(null);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
            <CircularProgress sx={{ color: '#13ec83' }} />
            <Typography variant="body2" sx={{ color: '#4c9a74', fontWeight: 700 }}>Fetching Secure Metadata...</Typography>
        </Box>
    );

    if (!product) return (
        <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography mb={2}>Product Not Found</Typography>
            <Button variant="contained" onClick={() => navigate(-1)}>Go Back</Button>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f6f8f7' }}>
            <Container maxWidth="lg" sx={{ pt: 4, flex: 1 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs separator={<NavigateNext fontSize="small" sx={{ color: '#4c9a74' }} />} sx={{ mb: 3 }}>
                    <Link underline="hover" sx={{ color: '#4c9a74', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/admin/dashboard')}>Home</Link>
                    <Link underline="hover" sx={{ color: '#4c9a74', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/admin/products')}>Products</Link>
                    <Typography sx={{ color: '#0d1b15', fontSize: '13px', fontWeight: 700 }}>{product.product_name}</Typography>
                </Breadcrumbs>

                {/* Page Heading */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                            <Typography variant="h3" sx={{ fontWeight: 900, color: '#0d1b15', letterSpacing: '-0.033em', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                                {product.product_name}
                            </Typography>
                            <Chip label={product.status ? "Active" : "Inactive"} sx={{ bgcolor: product.status ? 'rgba(19, 236, 131, 0.2)' : '#eee', color: '#0d1b15', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }} />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography sx={{ color: '#4c9a74', fontWeight: 600, fontSize: '16px' }}>{product.company_name || 'AgroCorp Industries Ltd.'}</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip label="Export Grade" size="small" sx={{ height: 24, borderRadius: '6px', bgcolor: '#e7f3ed', color: '#0d1b15', fontWeight: 700, fontSize: '11px' }} />
                            </Box>
                        </Stack>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<QrCode2 />}
                        onClick={() => navigate(`/admin/create-qr`)}
                        sx={{
                            bgcolor: '#13ec83', color: '#0d1b15', fontWeight: 800, px: 4, height: 48, borderRadius: '12px',
                            textTransform: 'none', boxShadow: '0 8px 16px rgba(19, 236, 131, 0.2)', '&:hover': { bgcolor: '#10c970', transform: 'translateY(-2px)' }, transition: '0.2s'
                        }}
                    >
                        Generate QR Code
                    </Button>
                </Box>

                {/* Product Metadata Card */}
                <Card variant="outlined" sx={{ borderRadius: '16px', borderColor: '#e7f3ed', p: { xs: 2, md: 4 }, mb: 4, boxShadow: 'none', bgcolor: '#fff' }}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={4} sx={{ borderBottom: '1px solid #e7f3ed', pb: 2 }}>
                        <Info sx={{ color: '#13ec83' }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0d1b15' }}>Product Metadata</Typography>
                    </Stack>
                    <Grid container spacing={3}>
                        {[
                            { label: 'Product ID', value: product.product_code },
                            { label: 'Category', value: product.category },
                            { label: 'Sub-Category', value: product.sub_category },
                            { label: 'Manufacturing', value: new Date(product.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                            { label: 'Last Update', value: new Date(product.updated_at).toLocaleDateString() },
                            { label: 'Origin', value: 'Maharashtra, India' },
                            { label: 'Compliance', value: 'A+ Verified', isStatus: true }
                        ].map((item, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Typography sx={{ color: '#4c9a74', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', mb: 0.5, letterSpacing: '0.05em' }}>{item.label}</Typography>
                                {item.isStatus ? (
                                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: '#13ec83' }}>
                                        <Verified sx={{ fontSize: 16 }} />
                                        <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>{item.value}</Typography>
                                    </Stack>
                                ) : (
                                    <Typography sx={{ color: '#0d1b15', fontWeight: 700, fontSize: '14px' }}>{item.value || '—'}</Typography>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </Card>

                {/* Tabs Section */}
                <Box sx={{ borderBottom: '1px solid #e7f3ed', mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', px: 3, fontSize: '14px', color: '#4c9a74' },
                            '& .Mui-selected': { color: '#0d1b15 !important' },
                            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', bgcolor: '#13ec83' }
                        }}
                    >
                        <Tab label="Static QR Codes" />
                        <Tab label="Dynamic QR Codes" />
                    </Tabs>
                    <Typography variant="caption" sx={{ color: '#4c9a74', fontWeight: 700 }}>
                        Showing {paginatedDetails.length} of {filteredDetails.length} batches
                    </Typography>
                </Box>

                {/* QR History Grid */}
                <Grid container spacing={3}>
                    {paginatedDetails.length > 0 ? paginatedDetails.map((detail: any) => (
                        <Grid item xs={12} md={6} lg={4} key={detail.detail_uuid}>
                            <Card variant="outlined" sx={{
                                display: 'flex', gap: 2, p: 2.5, borderRadius: '16px', borderColor: '#e7f3ed', boxShadow: 'none',
                                transition: '0.3s', '&:hover': { borderColor: '#13ec83', transform: 'translateY(-4px)', boxShadow: '0 12px 20px -10px rgba(19, 236, 131, 0.15)' }
                            }}>
                                <Box sx={{
                                    width: 64, height: 64, bgcolor: '#f6f8f7', borderRadius: '12px', border: '1px solid #e7f3ed',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0
                                }}>
                                    <QrCode2 sx={{ fontSize: 36, color: '#0d1b15' }} />
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ maxWidth: '80%' }}>
                                            <Typography noWrap sx={{ fontWeight: 800, color: '#0d1b15', fontSize: '15px' }}>{detail.batch_name || 'Production Batch'}</Typography>
                                            <Typography sx={{ color: '#4c9a74', fontSize: '10px', fontWeight: 800, mt: 0.3 }}>{detail.qr_codes?.length || 1} UNITS GENERATED</Typography>
                                        </Box>
                                        <Box sx={{ width: 8, height: 8, bgcolor: '#13ec83', borderRadius: '50%', mt: 1 }} />
                                    </Box>
                                    <Stack spacing={0.8} mb={2.5}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <CalendarMonth sx={{ fontSize: 14, color: '#4c9a74' }} />
                                            <Typography sx={{ fontSize: '12px', color: '#4c9a74', fontWeight: 600 }}>Gen: {new Date(detail.created_at).toLocaleDateString()}</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Person sx={{ fontSize: 14, color: '#4c9a74' }} />
                                            <Typography sx={{ fontSize: '12px', color: '#4c9a74', fontWeight: 600 }}>By: System Admin</Typography>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            fullWidth size="small" variant="contained" disableElevation
                                            startIcon={downloadingId === detail.qr_codes?.[0]?.qr_id ? <CircularProgress size={14} color="inherit" /> : <Download sx={{ fontSize: '16px !important' }} />}
                                            onClick={() => handleDownload(detail.qr_codes?.[0]?.qr_path, detail.batch_name, detail.qr_codes?.[0]?.qr_id)}
                                            disabled={downloadingId !== null}
                                            sx={{
                                                bgcolor: 'rgba(19, 236, 131, 0.1)', color: '#0d1b15', fontWeight: 800, fontSize: '11px', borderRadius: '8px',
                                                textTransform: 'none', '&:hover': { bgcolor: 'rgba(19, 236, 131, 0.2)' }
                                            }}
                                        >
                                            {downloadingId === detail.qr_codes?.[0]?.qr_id ? 'Wait...' : 'Download'}
                                        </Button>
                                        <IconButton sx={{ bgcolor: '#e7f3ed', borderRadius: '8px', color: '#0d1b15' }} size="small">
                                            <MoreVert fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </Box>
                            </Card>
                        </Grid>
                    )) : (
                        <Grid item xs={12}>
                            <Paper variant="outlined" sx={{ py: 10, textAlign: 'center', borderRadius: '16px', borderStyle: 'dashed', bgcolor: 'transparent' }}>
                                <Typography variant="body1" sx={{ color: '#4c9a74', fontWeight: 600 }}>No batch history found for this type.</Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>

                {/* View More Button */}
                {hasMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                            sx={{
                                borderRadius: '12px', borderColor: '#e7f3ed', color: '#0d1b15', fontWeight: 800, px: 6, py: 1.2,
                                textTransform: 'none', fontSize: '14px', '&:hover': { bgcolor: '#e7f3ed', borderColor: '#4c9a74' }
                            }}
                        >
                            View {filteredDetails.length - visibleCount} more batches
                        </Button>
                    </Box>
                )}
            </Container>

            {/* Footer Section */}
            <Box component="footer" sx={{ mt: '50px', borderTop: '1px solid #e7f3ed', py: 5, textAlign: 'center', bgcolor: '#fff' }}>
                <Typography variant="body2" sx={{ color: '#4c9a74', fontWeight: 600, letterSpacing: '0.02em' }}>
                    © 2026 <Box component="span" sx={{ color: '#0d1b15', fontWeight: 800 }}>apnaQR</Box>. All rights reserved.
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 1 }}>
                        • Secure Agriculture Compliance Tracking •
                    </Box>
                </Typography>
            </Box>
        </Box>
    );
};

export default ProductDetail;