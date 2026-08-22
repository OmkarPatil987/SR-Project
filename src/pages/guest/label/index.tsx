import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Typography, Chip, Grid, Stack, Paper, alpha, CircularProgress,
} from '@mui/material';
import { Security, Science, Assignment, Agriculture, Domain, Storefront, QrCode2 } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
import { FetchPublicProductLabelService } from '../../../utils/services/guest.service';
import { PublicLabelResponse } from '../../../utils/dto/response/label';
import { qrArtworkSx } from '../../../utils/qrDownload';

const ACCENT = '#13ae47';

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
            <Box sx={{ width: 32, height: 32, bgcolor: alpha(ACCENT, 0.1), borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT }}>
                {icon}
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>{title}</Typography>
        </Stack>
        {children}
    </Paper>
);

const RowTable: React.FC<{ rows: { label: string; value: string }[] }> = ({ rows }) => (
    <Box sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2, overflow: 'hidden' }}>
        {rows.map((row, index) => (
            <Box
                key={`${row.label}-${index}`}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '280px 1fr' },
                    gap: { xs: 0.5, sm: 2 },
                    px: 2.5,
                    py: 1.5,
                    bgcolor: index % 2 === 0 ? 'grey.50' : 'white',
                    borderBottom: index === rows.length - 1 ? 'none' : '1px solid',
                    borderColor: 'grey.200',
                }}
            >
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {row.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {row.value}
                </Typography>
            </Box>
        ))}
    </Box>
);

interface ContactLike {
    name: string;
    contact_person: string;
    mobile: string;
    email: string;
    website: string;
    license_no: string;
    gst_no: string;
    address: string;
}

const ContactGrid: React.FC<{ contact: ContactLike }> = ({ contact }) => {
    const items = [
        { label: 'Company Name', value: contact.name },
        { label: 'Contact Person', value: contact.contact_person },
        { label: 'Mobile', value: contact.mobile },
        { label: 'Email', value: contact.email },
        { label: 'Website', value: contact.website },
        { label: 'License No', value: contact.license_no },
        { label: 'GST No', value: contact.gst_no },
    ].filter((item) => item.value);

    return (
        <Grid container spacing={2}>
            {items.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.label}>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 0.5, display: 'block' }}>
                        {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: item.label === 'Company Name' ? 800 : 500 }}>
                        {item.value}
                    </Typography>
                </Grid>
            ))}
            {contact.address && (
                <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, mb: 0.5, display: 'block' }}>
                        Address
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', lineHeight: 1.6 }}>
                        {contact.address}
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
};

const GuestLabelDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const [data, setData] = useState<PublicLabelResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLabel = async () => {
            if (!id) return;
            setLoading(true);
            const res = await FetchPublicProductLabelService(id);
            if (res.code === 200 && res.data) {
                setData(res.data);
            } else {
                dispatch(showSnackbar({ type: 'error', message: 'Verification failed or label not found' }));
            }
            setLoading(false);
        };
        fetchLabel();
    }, [id, dispatch]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6f8' }}>
                <CircularProgress sx={{ color: ACCENT }} />
            </Box>
        );
    }

    if (!data) {
        return (
            <Box sx={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 3, bgcolor: '#f4f6f8' }}>
                <Security sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h5" fontWeight={700}>Verification Failed</Typography>
                <Typography color="text.secondary">This label code is invalid or has been revoked.</Typography>
            </Box>
        );
    }

    const { company, manufacturer, marketing, product } = data;
    const showMarketing = Boolean(marketing?.name && marketing.name !== manufacturer?.name);

    const compositionRows = (product.composition || []).map((row) => ({ label: row.ingredient, value: row.content }));
    const specificationRows = (product.specifications || []).map((row) => ({ label: row.parameter, value: row.value }));

    const cropName = product.application_details?.crop_name;
    const cropEntries = Array.isArray(cropName)
        ? cropName
        : cropName
            ? [{ name: cropName, dose: product.application_details?.dose ?? '' }]
            : [];

    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 4 }}>
            <Box sx={{ maxWidth: '1000px', mx: 'auto', px: { xs: 2, md: 3 } }}>
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    {company?.logo && (
                        <Box
                            component="img"
                            src={company.logo}
                            alt={company.name}
                            sx={{ width: 72, height: 72, objectFit: 'contain', mx: 'auto', mb: 2, borderRadius: 2, bgcolor: '#fff', border: '1px solid', borderColor: 'grey.200', p: 1 }}
                        />
                    )}
                    <Chip
                        label="Verified Product Label"
                        sx={{ bgcolor: alpha(ACCENT, 0.1), color: ACCENT, fontWeight: 800, fontSize: '11px', mb: 2, height: 28 }}
                    />
                    <Typography variant="h2" sx={{ fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.03em', mb: 1, fontSize: { xs: '28px', md: '40px' } }}>
                        {product.product_name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#0f5132', fontWeight: 800 }}>
                        {company?.name}
                    </Typography>
                </Box>

                <Stack spacing={3}>
                    {compositionRows.length > 0 && (
                        <InfoCard icon={<Science fontSize="small" />} title="Composition">
                            <RowTable rows={compositionRows} />
                        </InfoCard>
                    )}

                    {specificationRows.length > 0 && (
                        <InfoCard icon={<Assignment fontSize="small" />} title="Specifications">
                            <RowTable rows={specificationRows} />
                        </InfoCard>
                    )}

                    {cropEntries.length > 0 && (
                        <InfoCard icon={<Agriculture fontSize="small" />} title="Application Details">
                            <RowTable rows={cropEntries.map((entry) => ({ label: entry.name, value: entry.dose }))} />
                        </InfoCard>
                    )}

                    {product.note && (
                        <InfoCard icon={<Assignment fontSize="small" />} title="Note">
                            <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>{product.note}</Typography>
                        </InfoCard>
                    )}

                    {manufacturer && (
                        <InfoCard icon={<Domain fontSize="small" />} title="Manufacturer Information">
                            <ContactGrid contact={manufacturer} />
                        </InfoCard>
                    )}

                    {showMarketing && (
                        <InfoCard icon={<Storefront fontSize="small" />} title="Marketing Information">
                            <ContactGrid contact={marketing} />
                        </InfoCard>
                    )}

                    {product.qr_path && (
                        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, textAlign: 'center' }}>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} mb={2}>
                                <QrCode2 sx={{ color: ACCENT }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
                                    Scan to Verify
                                </Typography>
                            </Stack>
                            <Box component="img" src={product.qr_path} alt="QR code" sx={{ width: 140, height: 140, mx: 'auto', ...qrArtworkSx }} />
                        </Paper>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};

export default GuestLabelDetail;
