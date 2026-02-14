import React from 'react';
import { Box, Card, Container, Grid, Stack, Typography } from '@mui/material';
import {
    PersonAdd,
    CloudUpload,
    QrCode2,
    Verified,
} from '@mui/icons-material';

const HowItWorks: React.FC = () => {
    const steps = [
        {
            icon: <PersonAdd />,
            title: 'Register',
            desc: 'Manufacturer registers on www.apnaQR.co.in',
            color: '#dbeafe',
            iconColor: '#2563eb',
        },
        {
            icon: <CloudUpload />,
            title: 'Upload Details',
            desc: 'Enter product composition, dosage, and select Static or Dynamic QR.',
            color: '#ffedd5',
            iconColor: '#ea580c',
        },
        {
            icon: <QrCode2 />,
            title: 'Generate QR',
            desc: 'apnaQR instantly creates the compliant QR Code for your label.',
            color: '#dcfce7',
            iconColor: '#16a34a',
        },
        {
            icon: <Verified />,
            title: 'Farmer Scans',
            desc: 'Farmers scan the label to verify authenticity and view details.',
            color: '#ede9fe',
            iconColor: '#7c3aed',
        },
    ];

    return (
        <Box component="section" id="how-it-works" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fff' }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={{ xs: 5, md: 8 }}>
                    <Typography variant="overline" sx={{ color: '#047857', fontWeight: 800, letterSpacing: '0.2em' }}>
                        Simple Process
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mt: 1 }}>
                        How apnaQR Works
                    </Typography>
                    <Typography sx={{ color: '#64748b', mt: 2, maxWidth: 680, mx: 'auto' }}>
                        Get your products compliant and market-ready in 4 simple steps.
                    </Typography>
                </Box>

                <Grid container spacing={{ xs: 3, md: 4 }}>
                    {steps.map((step, index) => (
                        <Grid key={step.title} item xs={12} sm={6} md={3}>
                            <Stack spacing={2} alignItems="center">
                                <Box
                                    sx={{
                                        width: 84,
                                        height: 84,
                                        bgcolor: step.color,
                                        color: step.iconColor,
                                        borderRadius: '999px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 10px 24px rgba(15,23,42,0.08)',
                                    }}
                                >
                                    {step.icon}
                                </Box>
                                <Card
                                    sx={{
                                        p: 2.5,
                                        borderRadius: 3,
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 6px 16px rgba(15,23,42,0.06)',
                                        textAlign: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            display: 'inline-block',
                                            bgcolor: '#f1f5f9',
                                            color: '#475569',
                                            px: 1.2,
                                            py: 0.3,
                                            borderRadius: 999,
                                            fontSize: 12,
                                            fontWeight: 800,
                                            mb: 1,
                                        }}
                                    >
                                        STEP 0{index + 1}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                                        {step.title}
                                    </Typography>
                                    <Typography sx={{ color: '#64748b', fontSize: 14 }}>{step.desc}</Typography>
                                </Card>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default HowItWorks;
