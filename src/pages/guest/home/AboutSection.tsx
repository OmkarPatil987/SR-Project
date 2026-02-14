import React from 'react';
import { Box, Card, Container, Grid, Stack, Typography } from '@mui/material';
import { Factory, AccountBalance, Spa, FormatQuote } from '@mui/icons-material';

const AboutSection: React.FC = () => {
    return (
        <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'rgba(16, 185, 129, 0.08)' }}>
            <Container maxWidth="md">
                <Box textAlign="center" mb={{ xs: 5, md: 7 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>
                        About <Box component="span" sx={{ color: '#047857' }}>apnaQR</Box>
                    </Typography>
                    <Box sx={{ width: 80, height: 6, bgcolor: '#10b981', borderRadius: 999, mx: 'auto', mt: 2 }} />
                </Box>

                <Typography sx={{ color: '#334155', fontSize: { xs: 16, md: 18 }, textAlign: 'center', mb: 6 }}>
                    <Box component="span" sx={{ fontWeight: 800, color: '#047857' }}>apnaQR</Box> is a dedicated QR Code generation platform developed with a singular focus: to support Biostimulant product manufacturers in meeting the strict compliance standards of the
                    <Box component="span" sx={{ fontWeight: 700, bgcolor: '#d1fae5', color: '#047857', px: 1, borderRadius: 1, ml: 0.5 }}>
                        Fertilizer Control Order (FCO) 1985
                    </Box>.
                </Typography>

                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 6 }}>
                    {[
                        { icon: <Factory />, title: 'Manufacturers', desc: 'Empowering brands with digital tools for seamless data management.' },
                        { icon: <AccountBalance />, title: 'Government', desc: 'Ensuring regulatory compliance and transparent audit trails.' },
                        { icon: <Spa />, title: 'Farmers', desc: 'Providing clear usage knowledge and product authenticity.' },
                    ].map((item) => (
                        <Grid key={item.title} item xs={12} md={4}>
                            <Card
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    border: '1px solid #d1fae5',
                                    boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)',
                                    textAlign: 'center',
                                    height: '100%',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        bgcolor: '#d1fae5',
                                        color: '#047857',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2,
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                                    {item.title}
                                </Typography>
                                <Typography sx={{ color: '#64748b', fontSize: 14 }}>{item.desc}</Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Card
                    sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        bgcolor: '#047857',
                        color: '#fff',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 16px 36px rgba(4, 120, 87, 0.3)',
                    }}
                >
                    <FormatQuote sx={{ position: 'absolute', top: -10, left: -10, fontSize: 90, color: 'rgba(255,255,255,0.12)' }} />
                    <Typography sx={{ position: 'relative', fontWeight: 800, fontStyle: 'italic', fontSize: { xs: 18, md: 22 } }}>
                        "Our goal is to create a trusted digital bridge between manufacturers, Government authorities, and farmers."
                    </Typography>
                </Card>
            </Container>
        </Box>
    );
};

export default AboutSection;
