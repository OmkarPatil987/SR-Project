import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Chip,
    Grid,
    Stack,
    Paper,
    alpha,
    CircularProgress
} from '@mui/material';
import {
    Security,
    Description,
    Domain,
    History
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
import { GuestProductDetailsService } from '../../../utils/services/guest.service';
import dayjs from 'dayjs';
import { getProductCategoryLabel, getProductCategorySingularLabel } from '../../../utils/productCategory';

// --- Interfaces based on new API structure ---
interface QRData {
    qr_id: number;
    qr_type: string;
    qr_path: string;
    created_at: string;
    updated_at: string;
}

interface ProductMaster {
    id: number;
    uuid: string;
    product_code: string;
    name: string;
    description: string;
    category: string;
    sub_category: string;
    status: boolean;
    created_at: string;
}

interface ProductDetail {
    id: number;
    uuid: string;
    type: string;
    gazette_notification_number: string;
    gazette_notification_date: string;
    biostimulant_title: string;
    biostimulant_composition: string;
    crops: string;
    doses: string;
    application_method: string;
    manufacturer_details: string;
    batch_name: string;
    company_name: string;
    manufacturing_date: string;
    expiry_date: string;
}

interface Company {
    id: number;
    company_name: string;
    address: string;
    gst_no: string;
    license_no?: string;
}

interface ProductDetailsResponse {
    qr: QRData;
    product_master: ProductMaster;
    product_detail: ProductDetail;
    company: Company;
}

const GuestProductDetail: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const dispatch = useDispatch();
    const [data, setData] = useState<ProductDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!uuid) return;
            setLoading(true);
            const res = await GuestProductDetailsService({ qr_uuid: uuid });
            if (res.code === 200 && res.data) {
                setData(res.data);
            } else {
                dispatch(showSnackbar({ type: 'error', message: 'Verification failed or product not found' }));
            }
            setLoading(false);
        };
        fetchProduct();
    }, [uuid, dispatch]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6f8' }}>
                <CircularProgress sx={{ color: '#13ae47' }} />
            </Box>
        );
    }

    if (!data) {
        return (
            <Box sx={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 3 }}>
                <Security sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h5" fontWeight={700}>Verification Failed</Typography>
                <Typography color="text.secondary">This product code is invalid or has been revoked.</Typography>
            </Box>
        );
    }

    const { qr, product_master, product_detail, company } = data;
    const qrType = (qr.qr_type || '').toLowerCase();
    const isStatic = qrType.includes('static');
    const categorySingularLabel = getProductCategorySingularLabel(product_master.category);
    const categoryLabel = getProductCategoryLabel(product_master.category);
    const isBiostimulantCategory = categoryLabel === 'Biostimulants';

    const gazetteDate = product_detail.gazette_notification_date
        ? dayjs(product_detail.gazette_notification_date).format('MMM DD, YYYY')
        : '';

    const createDetailItem = (label: string, value?: string | null) => {
        if (!value) return null;
        return { label, value };
    };

    const primaryDetails = [
        ...(isBiostimulantCategory ? [createDetailItem('Gazette No.', product_detail.gazette_notification_number)] : []),
        ...(isBiostimulantCategory ? [createDetailItem('Gazette Date', gazetteDate)] : []),
        createDetailItem(`Title of ${categorySingularLabel}`, product_detail.biostimulant_title || product_master.name),
        createDetailItem(`Composition of ${categorySingularLabel}`, product_detail.biostimulant_composition),
        createDetailItem('Crops', product_detail.crops),
        createDetailItem('Dosage', product_detail.doses),
        createDetailItem('Application method', product_detail.application_method),
        createDetailItem('Manufacturer details', product_detail.manufacturer_details),
        createDetailItem('Product Description', product_master.description),
        ...(isStatic
            ? [
                createDetailItem(
                    'Mfg Date',
                    product_detail.manufacturing_date
                        ? dayjs(product_detail.manufacturing_date).format('MMM DD, YYYY')
                        : ''
                ),
                createDetailItem(
                    'Expire Date',
                    product_detail.expiry_date
                        ? dayjs(product_detail.expiry_date).format('MMM DD, YYYY')
                        : ''
                ),
                createDetailItem('Batch No', product_detail.batch_name),
            ]
            : []),
    ].filter(Boolean) as { label: string; value: string }[];

    const otherDetails = [
        createDetailItem('Category', categoryLabel),
        createDetailItem('Sub-category', product_master.sub_category),
        createDetailItem('Product Code', product_master.product_code),
    ].filter(Boolean) as { label: string; value: string }[];

    const manufacturerDetails = [
        createDetailItem('Company Name', company.company_name),
        createDetailItem('Registration (GSTIN)', company.gst_no),
        createDetailItem('License Number', company.license_no),
        createDetailItem('Registered Address', company.address),
    ].filter(Boolean) as { label: string; value: string }[];

    return (
        <Box sx={{bgcolor: '#f4f6f8', minHeight: '100vh' }}>

            <Box sx={{ maxWidth: '1200px', mx: 'auto',py:2 }}>
                {/* Title Section */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Chip
                        label={`Authenticated Code: ${product_master.product_code}`}
                        sx={{ bgcolor: alpha('#13ae47', 0.1), color: '#13ae47', fontWeight: 800, fontSize: '11px', mb: 2, height: 28 }}
                    />
                    <Typography variant="h2" sx={{ fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.03em', mb: 1 }}>
                        {product_detail.biostimulant_title || product_master.name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#0f5132', fontWeight: 800, mb: 0.5 }}>
                        {company.company_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        Secure product verification details
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Stack spacing={3}>
                            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
                                <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                                    <Box sx={{ width: 32, height: 32, bgcolor: alpha('#13ae47', 0.1), borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#13ae47' }}>
                                        <Description fontSize="small" />
                                    </Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>QR View Details</Typography>
                                </Stack>
                                <Box sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2, overflow: 'hidden' }}>
                                    {primaryDetails.map((item, index) => (
                                        <Box
                                            key={item.label}
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: { xs: '1fr', sm: '280px 1fr' },
                                                gap: { xs: 0.5, sm: 2 },
                                                px: 2.5,
                                                py: 2,
                                                bgcolor: index % 2 === 0 ? 'grey.50' : 'white',
                                                borderBottom: index === primaryDetails.length - 1 ? 'none' : '1px solid',
                                                borderColor: 'grey.200',
                                            }}
                                        >
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                {item.label}
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                {item.value}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>

                            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
                                <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                                    <Box sx={{ width: 32, height: 32, bgcolor: '#f5f5f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                                        <Domain fontSize="small" />
                                    </Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>Manufacturer Information</Typography>
                                </Stack>
                                <Grid container spacing={2}>
                                    {manufacturerDetails.map((item) => (
                                        <Grid item xs={12} md={4} key={item.label}>
                                            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 1, display: 'block' }}>{item.label}</Typography>
                                            {item.label === 'Registration (GSTIN)' ? (
                                                <Box sx={{ px: 2, py: 1, bgcolor: alpha('#13ae47', 0.05), border: '1px solid', borderColor: alpha('#13ae47', 0.1), borderRadius: 1, display: 'inline-block' }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace', color: '#13ae47' }}>
                                                        {item.value}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant={item.label === 'Company Name' ? 'h6' : 'body2'} sx={{ fontWeight: item.label === 'Company Name' ? 800 : 500, color: item.label === 'Registered Address' ? 'text.secondary' : 'text.primary', lineHeight: item.label === 'Registered Address' ? 1.6 : undefined }}>
                                                    {item.value}
                                                </Typography>
                                            )}
                                            {item.label === 'Company Name' && (
                                                <Stack direction="row" spacing={1} alignItems="center" mt={1} color="text.secondary">
                                                    <History sx={{ fontSize: 14 }} />
                                                    <Typography variant="caption">Authorized Manufacturer</Typography>
                                                </Stack>
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>

                            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
                                <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                                    <Box sx={{ width: 32, height: 32, bgcolor: '#f5f5f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                                        <Description fontSize="small" />
                                    </Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>Other Details</Typography>
                                </Stack>
                                <Grid container spacing={2}>
                                    {otherDetails.map((item) => (
                                        <Grid item xs={12} md={4} key={item.label}>
                                            <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                                            <Typography variant="body2" fontWeight={800}>{item.value}</Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>

          
            </Box>
        </Box>
    );
};

export default GuestProductDetail;
