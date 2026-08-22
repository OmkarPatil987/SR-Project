import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Chip,
    Grid,
    Stack,
    Paper,
    alpha,
    CircularProgress,
    Link,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Security,
    Description,
    Domain,
    History,
    ContentCopy,
    Science
} from '@mui/icons-material';
import { Fragment, ReactNode, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
import { GuestProductDetailsService } from '../../../utils/services/guest.service';
import dayjs from 'dayjs';
import { getProductCategoryLabel, getProductCategorySingularLabel } from '../../../utils/productCategory';
import { resolveProductComposition } from '../../../utils/gazette';
import DetailTable from '../../../components/common/DetailTable';

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
    description: string;
    gtin: string;
    web_link: string;
    gazette_notification_number: string;
    gazette_notification_date: string;
    biostimulant_title: string;
    /** Legacy field: free prose, or the pre-array JSON envelope. */
    biostimulant_composition: string;
    /**
     * Current fields. Typed `unknown[]` because the API declares them as
     * `List[Dict[str, Any]]` — they are validated in `resolveProductComposition`
     * before anything is rendered from them.
     */
    biostimulant_composition_new?: unknown[];
    biostimulant_specification?: unknown[];
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
    const isBiopesticideCategory = categoryLabel === 'Bio Pesticides';

    const gazetteDate = product_detail.gazette_notification_date
        ? dayjs(product_detail.gazette_notification_date).format('MMM DD, YYYY')
        : '';

    // Prefers the API's array fields, falling back to the legacy string for
    // QRs stored before they existed. Exactly one of the tables and the prose
    // row renders — `legacyText` is empty whenever structured rows were found.
    const resolvedComposition = resolveProductComposition(product_detail);
    const compositionRows = resolvedComposition.composition.map((row) => ({ key: row.ingredient, value: row.content }));
    const specificationRows = resolvedComposition.specifications.map((row) => ({ key: row.parameter, value: row.value }));
    const legacyCompositionText = resolvedComposition.legacyText;

    const createDetailItem = (label: string, value?: string | null) => {
        if (!value) return null;
        return { label, value };
    };

    const renderTextWithLinks = (text: string): ReactNode => {
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (!part) return null;

            if (/^(https?:\/\/[^\s]+|www\.[^\s]+)$/i.test(part)) {
                const href = part.startsWith('http') ? part : `https://${part}`;

                return (
                    <Link
                        key={`${part}-${index}`}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ fontWeight: 700, wordBreak: 'break-all' }}
                    >
                        {part}
                    </Link>
                );
            }

            return (
                <Fragment key={`${part}-${index}`}>
                    {part}
                </Fragment>
            );
        });
    };

    const handleCopyLink = async (link: string) => {
        try {
            await navigator.clipboard.writeText(link);
            dispatch(showSnackbar({ type: 'success', message: 'Link copied to clipboard' }));
        } catch {
            dispatch(showSnackbar({ type: 'error', message: 'Failed to copy link' }));
        }
    };

    const dateDetails = isStatic
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
        : [];

    // Rows shown ahead of the composition tables. Manufacturer details, Product
    // Information and the batch dates are split into `trailingDetails` so the
    // composition and specifications render before them.
    const primaryDetails = (
        isBiopesticideCategory
            ? [
                { label: '(a) Unique Identifier or Global Trade Item Number (GTIN)', value: product_detail.gtin || '-' },
                { label: '(b) Batch Number', value: product_detail.batch_name || '-' },
                { label: '(c) Date of Manufacturing', value: product_detail.manufacturing_date ? dayjs(product_detail.manufacturing_date).format('MMM DD, YYYY') : '-' },
                { label: '(d) Date of Expiry', value: product_detail.expiry_date ? dayjs(product_detail.expiry_date).format('MMM DD, YYYY') : '-' },
                { label: '(e) Web Link or Uniform Resource Locator', value: product_detail.web_link || '-' },
            ]
            : [
                ...(isBiostimulantCategory ? [createDetailItem('Gazette No.', product_detail.gazette_notification_number)] : []),
                ...(isBiostimulantCategory ? [createDetailItem('Gazette Date', gazetteDate)] : []),
                // The gazette title picked on the QR form is the title of record — it
                // names the notified product, which the brand name does not. The product
                // name is only a fallback for QRs saved without a gazette selection.
                createDetailItem(`Title of ${categorySingularLabel}`, product_detail.biostimulant_title || product_master.name),
                // Structured composition renders as a table below, not as a row here.
                createDetailItem(`Composition of ${categorySingularLabel}`, legacyCompositionText),
                createDetailItem('Crops', product_detail.crops),
                createDetailItem('Dosage', product_detail.doses),
                createDetailItem('Application method', product_detail.application_method),
            ]
    ).filter(Boolean) as { label: string; value: string }[];

    const trailingDetails = (
        isBiopesticideCategory
            ? []
            : [
                createDetailItem('Manufacturer details', product_detail.manufacturer_details),
                createDetailItem('Product Information', product_detail.description),
                ...dateDetails,
            ]
    ).filter(Boolean) as { label: string; value: string }[];

    const hasCompositionTables = compositionRows.length > 0 || specificationRows.length > 0;
    const totalDetailRows = primaryDetails.length + trailingDetails.length;

    /**
     * One row of the details card. `index` is the position across both row
     * groups combined, so the zebra striping and the "last row has no border"
     * rule stay correct with the composition tables sitting between them.
     */
    const renderDetailRow = (item: { label: string; value: string }, index: number) => {
        const isLinkField = item.label === 'Website' || item.label.includes('Web Link');

        return (
            <Box
                key={item.label}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '280px 1fr' },
                    gap: { xs: 0.5, sm: 2 },
                    px: { xs: 2, sm: 2.5 },
                    py: 2,
                    bgcolor: index % 2 === 0 ? 'grey.50' : 'white',
                    borderBottom: index === totalDetailRows - 1 ? 'none' : '1px solid',
                    borderColor: 'grey.200',
                }}
            >
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {item.label}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap">
                    <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {item.label === 'Product Information' || isLinkField ? renderTextWithLinks(item.value) : item.value}
                    </Typography>
                    {isLinkField && item.value && item.value !== '-' && (
                        <Tooltip title="Copy link">
                            <IconButton size="small" onClick={() => handleCopyLink(item.value)}>
                                <ContentCopy fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            </Box>
        );
    };

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

            <Box sx={{ maxWidth: '1200px', mx: 'auto', py: 2, px: { xs: 2, md: 3 } }}>
                {/* Title Section */}
                <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>

                    {/* Company name leads at h2 for every category; the product
                        name sits below it at h3 — bold, one step smaller. */}
                    <Typography variant="h2" sx={{ fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.03em', mb: 1, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '1.875rem' }, wordBreak: 'break-word' }}>
                        {company.company_name}
                    </Typography>
                    <Typography variant="h3" sx={{ color: '#0f5132', fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5, fontSize: { xs: '1.125rem', sm: '1.35rem', md: '1.5rem' }, wordBreak: 'break-word' }}>
                        {product_master.name || product_detail.biostimulant_title}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Stack spacing={3}>
                            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 4 }}>
                                <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                                    <Box sx={{ width: 32, height: 32, flexShrink: 0, bgcolor: alpha('#13ae47', 0.1), borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#13ae47' }}>
                                        <Description fontSize="small" />
                                    </Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
                                        {isBiopesticideCategory ? 'QR code for bio pesticide' : 'QR View Details'}
                                    </Typography>
                                </Stack>
                                <Box sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2, overflow: 'hidden' }}>
                                    {primaryDetails.map(renderDetailRow)}

                                    {/* Composition and specifications sit inside this card, ahead of
                                        Product Information rather than in a card below it. */}
                                    {hasCompositionTables && (
                                        <Box
                                            sx={{
                                                px: { xs: 2, sm: 2.5 },
                                                py: 3,
                                                bgcolor: 'white',
                                                borderBottom: trailingDetails.length > 0 ? '1px solid' : 'none',
                                                borderColor: 'grey.200',
                                            }}
                                        >
                                            <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                                                <Box sx={{ width: 32, height: 32, flexShrink: 0, bgcolor: alpha('#13ae47', 0.1), borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#13ae47' }}>
                                                    <Science fontSize="small" />
                                                </Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
                                                    Composition &amp; Specifications
                                                </Typography>
                                            </Stack>
                                            <Stack spacing={3}>
                                                <DetailTable
                                                    title={`Composition of ${categorySingularLabel}`}
                                                    keyHeader="Ingredient"
                                                    valueHeader="Content"
                                                    rows={compositionRows}
                                                />
                                                <DetailTable
                                                    title="Specifications"
                                                    keyHeader="Parameter"
                                                    valueHeader="Value"
                                                    rows={specificationRows}
                                                />
                                            </Stack>
                                        </Box>
                                    )}

                                    {trailingDetails.map((item, index) => renderDetailRow(item, primaryDetails.length + index))}
                                </Box>
                            </Paper>

                            {!isBiopesticideCategory && (
                                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 4 }}>
                                    <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                                        <Box sx={{ width: 32, height: 32, flexShrink: 0, bgcolor: '#f5f5f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
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
                            )}
                        </Stack>
                    </Grid>
                </Grid>

          
            </Box>
        </Box>
    );
};

export default GuestProductDetail;
