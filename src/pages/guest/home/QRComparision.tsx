import React from 'react';
import { Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import {
    CheckCircle,
    Cancel,
    Update,
    Lock,
    Bolt,
    Description,
} from '@mui/icons-material';

const QRComparison: React.FC = () => {
    const comparisonData = [
        { feature: 'Use Case', static: 'Fixed information', dynamic: 'Future updates', icon: <Description fontSize="small" /> },
        { feature: 'Data Editability', static: 'Not editable', dynamic: 'Editable anytime', icon: <Update fontSize="small" /> },
        { feature: 'QR Lifespan', static: 'New QR for changes', dynamic: 'Same QR for years', icon: <Bolt fontSize="small" /> },
        { feature: 'History & Versions', static: 'Version history maintained', dynamic: 'Updates tracked online', icon: <Lock fontSize="small" /> },
        { feature: 'Best For', static: 'Fixed data labels', dynamic: 'Ongoing updates', icon: <CheckCircle fontSize="small" /> },
    ];

    return (
        <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: '#fff' }}>
            <Container maxWidth="lg">
                <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f172a' }}>
                        Static vs Dynamic QR Codes
                    </Typography>
                    <Typography sx={{ color: '#64748b', mt: 1 }}>
                        Choose the right technology for your agricultural packaging
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
                    }}
                >
                    <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ bgcolor: '#f8fafc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 12 }}>
                                        Feature
                                    </TableCell>
                                    <TableCell align="center" sx={{ bgcolor: '#f1f5f9', fontWeight: 800 }}>
                                        Static QR Code
                                    </TableCell>
                                    <TableCell align="center" sx={{ bgcolor: '#ecfdf5', fontWeight: 800, color: '#047857' }}>
                                        Dynamic QR Code
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {comparisonData.map((item) => (
                                    <TableRow key={item.feature} hover>
                                        <TableCell sx={{ fontWeight: 600, color: '#334155' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{ color: '#10b981' }}>{item.icon}</Box>
                                                {item.feature}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center" sx={{ color: '#64748b' }}>
                                            {typeof item.static === 'boolean'
                                                ? item.static
                                                    ? <CheckCircle sx={{ color: '#16a34a' }} />
                                                    : <Cancel sx={{ color: '#f43f5e' }} />
                                                : item.static}
                                        </TableCell>
                                        <TableCell align="center" sx={{ bgcolor: '#f0fdf4', fontWeight: 600, color: '#065f46' }}>
                                            {typeof item.dynamic === 'boolean'
                                                ? item.dynamic
                                                    ? <CheckCircle sx={{ color: '#16a34a' }} />
                                                    : <Cancel sx={{ color: '#f43f5e' }} />
                                                : item.dynamic}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell sx={{ bgcolor: '#0f172a', color: '#fff', fontWeight: 800 }}>
                                        Typical Use Cases
                                    </TableCell>
                                    <TableCell sx={{ bgcolor: '#111827', color: '#cbd5f5' }}>
                                        Fixed product info, MFG Date, Expiry Date, Batch Number.
                                    </TableCell>
                                    <TableCell sx={{ bgcolor: '#064e3b', color: '#d1fae5' }}>
                                        Product updates, customer support, long-term labels.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
        </Box>
    );
};

export default QRComparison;
