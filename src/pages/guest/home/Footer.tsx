import React from 'react';
import { Box, Button, Container, Grid, Stack, Typography, Link as MuiLink } from '@mui/material';
import { ArrowForward, QrCode2 } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <Box component="footer" sx={{ bgcolor: '#0f172a', color: '#cbd5f5' }}>
            <Box sx={{ bgcolor: '#059669', py: { xs: 5, md: 7 } }}>
                <Container maxWidth="lg">
                    <Grid container spacing={3} alignItems="center" justifyContent="space-between">
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900 }}>
                                Make Your Biostimulant Products Government-Compliant
                            </Typography>
                            <Typography sx={{ color: '#dcfce7', mt: 1 }}>
                                Start generating Static & Dynamic QR codes today.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                            <Button
                                component={RouterLink}
                                to="/auth/login"
                                variant="contained"
                                endIcon={<ArrowForward />}
                                sx={{
                                    bgcolor: '#fff',
                                    color: '#047857',
                                    '&:hover': { bgcolor: '#f1f5f9' },
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 800,
                                }}
                            >
                                Get Started with apnaQR
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
                <Grid container spacing={{ xs: 4, md: 6 }}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                <QrCode2 sx={{ color: '#10b981' }} />
                                <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff' }}>
                                    apna<Box component="span" sx={{ color: '#10b981' }}>QR</Box>
                                </Typography>
                            </Stack>
                            <Typography sx={{ color: '#94a3b8', maxWidth: 420 }}>
                                The trusted platform for digital compliance in Indian Agriculture. Bridging the gap between authenticity and technology.
                            </Typography>
                            <Typography sx={{ color: '#fff', fontWeight: 700 }}>Visit: www.apnaQR.co.in</Typography>
                            <Box sx={{ color: '#cbd5f5', fontSize: 14 }}>
                                <Typography sx={{ color: '#fff', fontWeight: 700 }}>Company: NextGEN AI Services</Typography>
                                <Typography>Email: support@apnaqr.co.in</Typography>
                                <Typography>Phone: +91 9834521541, +91 9975937510</Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography sx={{ color: '#fff', fontWeight: 800, mb: 2 }}>Quick Links</Typography>
                        <Stack spacing={1.5}>
                            <MuiLink href="#compliance" sx={{ color: '#cbd5f5', textDecoration: 'none', '&:hover': { color: '#10b981' } }}>Compliance</MuiLink>
                            <MuiLink href="#static-qr" sx={{ color: '#cbd5f5', textDecoration: 'none', '&:hover': { color: '#10b981' } }}>Static QR</MuiLink>
                            <MuiLink href="#dynamic-qr" sx={{ color: '#cbd5f5', textDecoration: 'none', '&:hover': { color: '#10b981' } }}>Dynamic QR</MuiLink>
                            <MuiLink href="/faq/static" sx={{ color: '#cbd5f5', textDecoration: 'none', '&:hover': { color: '#10b981' } }}>Static FAQs</MuiLink>
                            <MuiLink href="/faq/dynamic" sx={{ color: '#cbd5f5', textDecoration: 'none', '&:hover': { color: '#10b981' } }}>Dynamic FAQs</MuiLink>
                            <MuiLink href="#pricing" sx={{ color: '#cbd5f5', textDecoration: 'none', '&:hover': { color: '#10b981' } }}>Pricing</MuiLink>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography sx={{ color: '#fff', fontWeight: 800, mb: 2 }}>Legal & Support</Typography>
                        <Stack spacing={1.5}>
                            <MuiLink component={RouterLink} to="/privacy-policy" sx={{ color: '#cbd5f5', textDecoration: 'none', '&:hover': { color: '#10b981' } }}>Privacy Policy</MuiLink>
                            <MuiLink component={RouterLink} to="/terms-of-service" sx={{ color: '#cbd5f5', textDecoration: 'none', '&:hover': { color: '#10b981' } }}>Terms of Service</MuiLink>
                            <MuiLink component={RouterLink} to="/contact-support" sx={{ color: '#10b981', textDecoration: 'none', fontWeight: 700 }}>Contact Support</MuiLink>
                        </Stack>
                    </Grid>
                </Grid>

                <Box sx={{ borderTop: '1px solid #1f2937', mt: 6, pt: 3, textAlign: 'center' }}>
                    <Typography sx={{ color: '#94a3b8', fontSize: 13 }}>
                        &copy; {new Date().getFullYear()} apnaQR. All rights reserved. Made for Indian Agriculture.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
