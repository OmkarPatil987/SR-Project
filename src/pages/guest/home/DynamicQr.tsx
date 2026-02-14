import React from 'react';
import { Box, Button, Card, Container, Grid, Stack, Typography } from '@mui/material';
import {
    Update,
    Smartphone,
    SmartDisplay,
    Description,
    BarChart,
} from '@mui/icons-material';

const DynamicQr: React.FC = () => {
    return (
        <Box component="section" id="dynamic-qr" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fff', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'transparent', background: 'linear-gradient(180deg, #ffffff 0%, rgba(236,253,245,0.6) 100%)' }} />
            <Container maxWidth="lg" sx={{ position: 'relative' }}>
                <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                    <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                            <Card
                                sx={{
                                    width: { xs: '100%', sm: 340 },
                                    borderRadius: 5,
                                    bgcolor: '#0f172a',
                                    p: 1.5,
                                    boxShadow: '0 18px 50px rgba(15,23,42,0.35)',
                                    border: '6px solid #1f2937',
                                }}
                            >
                                <Box sx={{ bgcolor: '#fff', borderRadius: 4, overflow: 'hidden' }}>
                                    <Box sx={{ bgcolor: '#047857', py: 2, textAlign: 'center' }}>
                                        <Typography sx={{ color: '#fff', fontWeight: 800 }}>Product Profile</Typography>
                                    </Box>
                                    <Box sx={{ height: 520, bgcolor: '#f8fafc' }}>
                                        <img
                                            src="/images/home/p6.webp"
                                            alt="Dynamic QR Content Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                                        />
                                    </Box>
                                </Box>
                            </Card>

                            <Card
                                sx={{
                                    position: 'absolute',
                                    right: { xs: 0, md: -24 },
                                    top: { xs: '10%', md: '20%' },
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: '0 12px 30px rgba(15,23,42,0.18)',
                                    border: '1px solid #e2e8f0',
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Box sx={{ bgcolor: '#dbeafe', p: 1, borderRadius: '999px' }}>
                                        <Update sx={{ color: '#2563eb' }} fontSize="small" />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: 13 }}>Real-time Updates</Typography>
                                        <Typography sx={{ color: '#64748b', fontSize: 12 }}>Changes reflect instantly</Typography>
                                    </Box>
                                </Stack>
                            </Card>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
                        <Box sx={{ mb: 2, display: 'inline-flex', p: 1.5, bgcolor: '#dcfce7', borderRadius: 2 }}>
                            <Smartphone sx={{ color: '#047857' }} />
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
                            Dynamic QR Code <Box component="span" sx={{ color: '#10b981' }}>Smart Features</Box>
                        </Typography>
                        <Typography sx={{ mt: 2.5, color: '#64748b' }}>
                            Go beyond compliance. Use Dynamic QR codes to engage with farmers, build trust, and update product information
                            instantly without reprinting labels.
                        </Typography>

                        <Stack spacing={3} sx={{ mt: 4 }}>
                            {[
                                { icon: <Update sx={{ color: '#2563eb' }} />, title: 'Update Anytime', desc: 'Change product details, safety instructions, or dosage without changing the QR label.' },
                                { icon: <SmartDisplay sx={{ color: '#ef4444' }} />, title: 'Rich Media', desc: 'Show usage videos, PDF manuals, and high-quality product images.' },
                                { icon: <Description sx={{ color: '#10b981' }} />, title: 'Detailed Description', desc: 'Crop-wise application methods and safety precautions in local languages.' },
                                { icon: <BarChart sx={{ color: '#8b5cf6' }} />, title: 'Manufacturer Dashboard', desc: 'Manage all your products and updates from a single, easy-to-use apnaQR dashboard.' },
                            ].map((item) => (
                                <Stack key={item.title} direction="row" spacing={2} alignItems="flex-start">
                                    <Box sx={{ bgcolor: '#fff', p: 1.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>{item.title}</Typography>
                                        <Typography sx={{ color: '#64748b' }}>{item.desc}</Typography>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>

                <Box sx={{ mt: { xs: 5, md: 7 }, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        href="/faq/dynamic"
                        variant="contained"
                        sx={{
                            bgcolor: '#047857',
                            '&:hover': { bgcolor: '#065f46' },
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 700,
                        }}
                    >
                        Have more questions? See Dynamic FAQs
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default DynamicQr;
