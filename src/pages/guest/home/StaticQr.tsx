import React from 'react';
import { Box, Button, Card, Container, Grid, Stack, Typography } from '@mui/material';
import {
    Lock,
    Gavel,
    Spa,
    Science,
} from '@mui/icons-material';

const StaticQr: React.FC = () => {
    return (
        <Box component="section" id="static-qr" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={{ xs: 6, md: 8 }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#e2e8f0',
                            borderRadius: '999px',
                            p: 1.5,
                            mb: 2,
                        }}
                    >
                        <Lock sx={{ color: '#475569' }} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>
                        Static QR Code by apnaQR
                    </Typography>
                    <Typography sx={{ mt: 2, color: '#64748b', maxWidth: 760, mx: 'auto' }}>
                        Mandatory for Government compliance. Contains fixed information that cannot be changed once generated.
                    </Typography>
                </Box>

                <Grid container spacing={{ xs: 3, md: 4 }}>
                    {[
                        {
                            icon: <Gavel sx={{ color: '#047857' }} />,
                            title: 'Govt Notification',
                            desc: 'Displays the Gazette Notification Number & Date as required by verification authorities.',
                        },
                        {
                            icon: <Spa sx={{ color: '#047857' }} />,
                            title: 'Product Details',
                            desc: 'Encodes the Title of the Biostimulant and specific Crops it is intended for.',
                        },
                        {
                            icon: <Science sx={{ color: '#047857' }} />,
                            title: 'Composition & Dosage',
                            desc: 'Permanent record of chemical composition and recommended dosage instructions.',
                        },
                    ].map((item) => (
                        <Grid key={item.title} item xs={12} md={6} lg={4}>
                            <Card
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 3,
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
                                    transition: 'transform 200ms ease, box-shadow 200ms ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        bgcolor: '#dcfce7',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
                                    {item.title}
                                </Typography>
                                <Typography sx={{ color: '#64748b' }}>{item.desc}</Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Card
                    sx={{
                        mt: { xs: 5, md: 7 },
                        p: { xs: 2.5, md: 3 },
                        borderRadius: 3,
                        bgcolor: '#fffbeb',
                        border: '1px solid #fde68a',
                        maxWidth: 900,
                        mx: 'auto',
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{ p: 1, bgcolor: '#fef3c7', borderRadius: '999px' }}>
                            <Lock sx={{ color: '#b45309' }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#92400e' }}>
                                Important Note
                            </Typography>
                            <Typography sx={{ color: '#92400e' }}>
                                Once generated, Static QR data is permanent and cannot be edited. It serves as a digital seal of authenticity
                                for Government inspectors and farmers.
                            </Typography>
                        </Box>
                    </Stack>
                </Card>

                <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        href="/faq/static"
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
                        Have more questions? See Static FAQs
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default StaticQr;
