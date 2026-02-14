import React from 'react';
import { Box, Card, Container, Grid, Stack, Typography } from '@mui/material';
import {
    CheckCircle,
    WarningAmber,
    Search,
    Article,
} from '@mui/icons-material';

const ComplianceSection: React.FC = () => {
    const purposes = [
        { icon: <CheckCircle sx={{ color: '#16a34a' }} />, text: 'Verify authenticity of Biostimulant Products' },
        { icon: <WarningAmber sx={{ color: '#f59e0b' }} />, text: 'Prevent fake and duplicate products' },
        { icon: <Search sx={{ color: '#2563eb' }} />, text: 'Provide transparent product information' },
        { icon: <Article sx={{ color: '#57534e' }} />, text: 'Enable farmers to access correct usage details' },
    ];

    return (
        <Box component="section" id="compliance" sx={{ py: { xs: 6, md: 10 }, bgcolor: '#fff' }}>
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="overline"
                            sx={{ color: '#047857', fontWeight: 800, letterSpacing: '0.2em' }}
                        >
                            Government Mandate
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mt: 1, lineHeight: 1.2 }}>
                            Why QR Code on Biostimulant Product Labels?
                        </Typography>

                        <Card
                            variant="outlined"
                            sx={{
                                mt: 3,
                                p: { xs: 2.5, md: 3 },
                                borderLeft: '4px solid #f59e0b',
                                bgcolor: '#fafaf9',
                            }}
                        >
                            <Typography sx={{ color: '#44403c', fontStyle: 'italic', lineHeight: 1.7 }}>
                                "As per the Fertilizer Control Order (FCO), 1985 and the Ministry of Agriculture & Farmers Welfare,
                                Government of India, it is mandatory to print a QR Code on biostimulant product labels."
                            </Typography>
                        </Card>

                        <Typography sx={{ color: '#64748b', mt: 3 }}>
                            <Box component="span" sx={{ fontWeight: 700, color: '#065f46' }}>apnaQR</Box> is developed specifically to
                            support these Government requirements in a simple, reliable, and cost-effective way for manufacturers across India.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                p: { xs: 3, md: 4 },
                                borderRadius: 4,
                                border: '1px solid #d1fae5',
                                bgcolor: '#ecfdf5',
                                boxShadow: '0 10px 30px rgba(2, 44, 34, 0.08)',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
                                Key Objectives of the Mandate
                            </Typography>
                            <Stack spacing={2.5}>
                                {purposes.map((item, index) => (
                                    <Stack key={index} direction="row" spacing={2} alignItems="flex-start">
                                        <Box
                                            sx={{
                                                bgcolor: '#fff',
                                                p: 1,
                                                borderRadius: 2,
                                                boxShadow: '0 6px 16px rgba(15, 23, 42, 0.08)',
                                            }}
                                        >
                                            {item.icon}
                                        </Box>
                                        <Typography sx={{ color: '#334155', fontWeight: 600, lineHeight: 1.5 }}>
                                            {item.text}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ComplianceSection;
