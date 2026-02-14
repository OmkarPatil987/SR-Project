import React from 'react';
import { Box, Card, Container, Grid, Stack, Typography } from '@mui/material';
import {
    Shield,
    FlashOn,
    Dashboard,
    CurrencyRupee,
    ThumbUp,
    Groups,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Benefits: React.FC = () => {
    const data = [
        { name: 'Q1', value: 20 },
        { name: 'Q2', value: 45 },
        { name: 'Q3', value: 70 },
        { name: 'Q4', value: 95 },
    ];

    const benefits = [
        { icon: <Shield fontSize="small" />, title: 'Govt Compliant', desc: 'Designed strictly as per FCO 1985 guidelines.' },
        { icon: <FlashOn fontSize="small" />, title: 'Easy Generation', desc: 'Generate thousands of QRs in seconds.' },
        { icon: <Dashboard fontSize="small" />, title: 'Single Dashboard', desc: 'Manage multiple products from one place.' },
        { icon: <Groups fontSize="small" />, title: 'Farmer Trust', desc: 'Builds confidence with transparent data.' },
        { icon: <CurrencyRupee fontSize="small" />, title: 'Cost Effective', desc: 'Affordable plans for all manufacturer sizes.' },
        { icon: <ThumbUp fontSize="small" />, title: 'Brand Safety', desc: 'Prevents counterfeit and duplicate products.' },
    ];

    return (
        <Box component="section" id="benefits" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#f8fafc' }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={{ xs: 5, md: 8 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>
                        Why Choose apnaQR?
                    </Typography>
                    <Typography sx={{ color: '#64748b', mt: 2, maxWidth: 680, mx: 'auto' }}>
                        The preferred choice for Biostimulant manufacturers across India for compliance and digital growth.
                    </Typography>
                </Box>

                <Grid container spacing={{ xs: 3, md: 4 }}>
                    <Grid item xs={12} lg={4}>
                        <Card
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
                                height: '100%',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                Rising Farmer Trust
                            </Typography>
                            <Typography sx={{ color: '#64748b', fontSize: 14, mt: 0.5, mb: 3 }}>
                                Adoption of verified QR codes leads to higher brand engagement.
                            </Typography>
                            <Box sx={{ height: 240 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <XAxis dataKey="name" stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis hide />
                                        <Tooltip
                                            cursor={{ fill: '#f1f5f9' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 3 ? '#065f46' : '#86efac'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                            <Typography sx={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', mt: 2 }}>
                                *Illustrative data representation
                            </Typography>
                        </Card>
                    </Grid>

                    <Grid item xs={12} lg={8}>
                        <Grid container spacing={{ xs: 2, md: 3 }}>
                            {benefits.map((item) => (
                                <Grid key={item.title} item xs={12} sm={6}>
                                    <Card
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 3,
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 6px 16px rgba(15, 23, 42, 0.06)',
                                            height: '100%',
                                        }}
                                    >
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            <Box
                                                sx={{
                                                    bgcolor: '#ecfdf5',
                                                    color: '#047857',
                                                    p: 1.2,
                                                    borderRadius: 2,
                                                    display: 'inline-flex',
                                                }}
                                            >
                                                {item.icon}
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                                                    {item.title}
                                                </Typography>
                                                <Typography sx={{ color: '#64748b', fontSize: 14 }}>{item.desc}</Typography>
                                            </Box>
                                        </Stack>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Benefits;
