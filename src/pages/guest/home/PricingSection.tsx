import React from 'react';
import {
    Box,
    Button,
    Card,
    Container,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import {
    Cloud,
    Apartment,
    CheckCircle,
    Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PricingSection: React.FC = () => {
    const navigate = useNavigate();
    const cloudFeatures = [
        'Hosted on apnaQR Cloud Servers',
        'No Server or IT Team Required',
        'Ready to Use in Minutes',
        'Automatic Updates & Backups',
        '99.9% Uptime Guarantee',
        'Unlimited QR Code Generation',
        'Static & Dynamic QR Options',
        'Email & Chat Support',
    ];

    const onPremFeatures = [
        'Installed on Your Own Server',
        'Complete Data Control & Privacy',
        'Custom Security Configuration',
        'Dedicated Technical Support',
        'One-Time License Fee Option',
        'Annual Maintenance Contract (AMC)',
        'Custom Integrations Available',
        'White-Label Option',
    ];

    return (
        <Box component="section" id="pricing" sx={{ py: { xs: 7, md: 12 }, bgcolor: '#f8fbf9' }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={{ xs: 5, md: 8 }}>
                    <Typography variant="overline" sx={{ color: '#047857', fontWeight: 800, letterSpacing: '0.25em' }}>
                        Flexible Deployment
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a', mt: 1 }}>
                        Choose Your Deployment Model
                    </Typography>
                    <Typography sx={{ color: '#64748b', mt: 2, maxWidth: 720, mx: 'auto' }}>
                        Whether you prefer cloud convenience or full infrastructure control, apnaQR supports both deployment models tailored to your business needs.
                    </Typography>
                </Box>

                <Grid container spacing={{ xs: 3, md: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                p: { xs: 3, md: 4 },
                                borderRadius: 4,
                                border: '2px solid #a7f3d0',
                                boxShadow: '0 14px 36px rgba(15, 23, 42, 0.08)',
                                position: 'relative',
                                overflow: 'visible',
                                pt: { xs: 4, md: 5 },
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -22,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    bgcolor: '#047857',
                                    color: '#fff',
                                    fontSize: 11,
                                    fontWeight: 800,
                                    letterSpacing: '0.22em',
                                    px: 3,
                                    py: 0.6,
                                    borderRadius: 999,
                                    zIndex: 2,
                                    boxShadow: '0 8px 18px rgba(4, 120, 87, 0.35)',
                                    border: '2px solid #bbf7d0',
                                }}
                            >
                                MOST POPULAR
                            </Box>

                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box sx={{ bgcolor: '#ecfdf5', borderRadius: 999, p: 1 }}>
                                    <Cloud sx={{ color: '#047857' }} />
                                </Box>
                                <Typography sx={{ fontWeight: 800, color: '#047857' }}>Cloud SaaS</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                                <Star sx={{ color: '#10b981' }} />
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                        Cloud Hosted Plan
                                    </Typography>
                                    <Typography sx={{ color: '#64748b' }}>
                                        Perfect for manufacturers who want to get started quickly without any infrastructure setup.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: '#064e3b' }}>
                                    ?499 <Box component="span" sx={{ fontSize: 16, color: '#64748b', fontWeight: 600 }}>/month</Box>
                                </Typography>
                                <Typography sx={{ color: '#94a3b8', mt: 1, fontSize: 13 }}>Billed annually (?5,988/year)</Typography>
                                <Typography sx={{ color: '#94a3b8', fontSize: 12 }}>*Terms & Conditions apply</Typography>
                            </Box>

                            <Stack spacing={1.5} sx={{ mt: 3 }}>
                                {cloudFeatures.map((feature) => (
                                    <Stack key={feature} direction="row" spacing={1.5} alignItems="flex-start">
                                        <CheckCircle sx={{ color: '#16a34a', mt: 0.2 }} fontSize="small" />
                                        <Typography sx={{ color: '#334155' }}>{feature}</Typography>
                                    </Stack>
                                ))}
                            </Stack>

                            <Button
                                onClick={() => navigate('/company/register')}
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    width: '100%',
                                    bgcolor: '#047857',
                                    '&:hover': { bgcolor: '#065f46' },
                                    borderRadius: 2,
                                    py: 1.4,
                                    fontWeight: 800,
                                    textTransform: 'none',
                                }}
                            >
                                Get Started Now
                            </Button>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                p: { xs: 3, md: 4 },
                                borderRadius: 4,
                                border: '2px solid #fde68a',
                                background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
                                boxShadow: '0 14px 36px rgba(15, 23, 42, 0.08)',
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box sx={{ bgcolor: '#fef3c7', borderRadius: 999, p: 1 }}>
                                    <Apartment sx={{ color: '#b45309' }} />
                                </Box>
                                <Typography sx={{ fontWeight: 800, color: '#b45309' }}>On-Premise</Typography>
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                                <Apartment sx={{ color: '#b45309' }} />
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a' }}>
                                        Enterprise Deployment
                                    </Typography>
                                    <Typography sx={{ color: '#64748b' }}>
                                        For large manufacturers who need complete control over their data and infrastructure.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: '#92400e' }}>
                                    Custom Pricing
                                </Typography>
                                <Typography sx={{ color: '#64748b', fontStyle: 'italic' }}>
                                    Based on infrastructure & requirements
                                </Typography>
                            </Box>

                            <Stack spacing={1.5} sx={{ mt: 3 }}>
                                {onPremFeatures.map((feature) => (
                                    <Stack key={feature} direction="row" spacing={1.5} alignItems="flex-start">
                                        <CheckCircle sx={{ color: '#b45309', mt: 0.2 }} fontSize="small" />
                                        <Typography sx={{ color: '#334155' }}>{feature}</Typography>
                                    </Stack>
                                ))}
                            </Stack>

                            <Button
                                href="mailto:contact@apnaqr.co.in"
                                variant="outlined"
                                sx={{
                                    mt: 3,
                                    width: '100%',
                                    borderColor: '#92400e',
                                    color: '#92400e',
                                    borderRadius: 2,
                                    py: 1.4,
                                    fontWeight: 800,
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: '#92400e', color: '#fff' },
                                }}
                            >
                                Contact Sales Team
                            </Button>
                        </Card>
                    </Grid>
                </Grid>

                <Card
                    sx={{
                        mt: { xs: 6, md: 8 },
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 900, textAlign: 'center', color: '#0f172a' }}>
                        Feature Comparison
                    </Typography>
                    <TableContainer sx={{ mt: 3, overflowX: 'auto' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Feature</TableCell>
                                    <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>Cloud SaaS</TableCell>
                                    <TableCell sx={{ fontWeight: 800, bgcolor: '#f8fafc' }}>On-Premise</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[
                                    ['Setup Time', '5 Minutes', '1-2 Weeks'],
                                    ['Infrastructure Required', 'None', 'Your Own Server'],
                                    ['Data Hosting', 'apnaQR Cloud', 'Your Server'],
                                    ['Updates', 'Automatic', 'Scheduled with AMC'],
                                    ['Customization', 'Standard Features', 'Fully Customizable'],
                                    ['Support', 'Email & Chat', 'Dedicated Support Team'],
                                    ['Best For', 'MSMEs & Mid-size Manufacturers', 'Large Enterprises'],
                                ].map((row) => (
                                    <TableRow key={row[0]}>
                                        <TableCell sx={{ fontWeight: 700 }}>{row[0]}</TableCell>
                                        <TableCell>{row[1]}</TableCell>
                                        <TableCell>{row[2]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>

                <Card
                    sx={{
                        mt: { xs: 4, md: 6 },
                        p: { xs: 3, md: 3.5 },
                        borderRadius: 3,
                        bgcolor: '#ecfdf5',
                        borderLeft: '5px solid #047857',
                    }}
                >
                    <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>
                        Not sure which option is right for you?
                    </Typography>
                    <Typography sx={{ color: '#334155', mt: 1 }}>
                        Contact us at <Box component="span" sx={{ fontWeight: 700 }}>+91 9834521541</Box> or{' '}
                        <Box component="span" sx={{ fontWeight: 700 }}>contact@apnaqr.co.in</Box> for a free consultation.
                    </Typography>
                </Card>

                <Card
                    sx={{
                        mt: { xs: 4, md: 5 },
                        p: { xs: 3, md: 4 },
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                        Terms & Conditions
                    </Typography>
                    <Box component="ul" sx={{ mt: 2, pl: 3, color: '#64748b' }}>
                        <li>Cloud SaaS plan requires 12 months advance payment (?5,988).</li>
                        <li>No refunds available once the subscription is activated.</li>
                        <li>Subscription auto-renews annually unless cancelled 30 days before renewal date.</li>
                        <li>Service availability is subject to 99.9% uptime SLA.</li>
                        <li>Fair usage policy applies - unlimited QR generation for legitimate business use.</li>
                        <li>On-Premise deployment pricing is customized based on infrastructure requirements and includes one-time setup fee.</li>
                        <li>AMC (Annual Maintenance Contract) for On-Premise is billed separately and includes updates & support.</li>
                        <li>Prices are subject to change with 30 days notice to existing customers.</li>
                        <li>All prices are exclusive of applicable GST.</li>
                    </Box>
                </Card>
            </Container>
        </Box>
    );
};

export default PricingSection;
