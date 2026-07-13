import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Skeleton, Chip, IconButton, Tooltip, Button, Stack, SelectChangeEvent,
} from '@mui/material';
import { Visibility, Download, Add } from '@mui/icons-material';
import { FetchLabelPdfHistoryService } from '../../../utils/services/label.service';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
import { LabelPdfHistoryItem } from '../../../utils/dto/response/label';
import CustomPagination from '../../../components/common/table/TablePagination';
import FilePreviewDrawer from '../../../components/common/FilePreview';
import { NAVIGATE_MODULES, NAVIGATE_ADMIN } from '../../../constant';

const LabelHistory: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<LabelPdfHistoryItem[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        const { code, data } = await FetchLabelPdfHistoryService({ limit, offset: (page - 1) * limit });
        if (code === 200 && data) {
            setItems(data.product_label_pdfs ?? []);
            setTotal(data.pagination?.total ?? (data.product_label_pdfs?.length ?? 0));
        } else {
            setItems([]);
            setTotal(0);
            dispatch(showSnackbar({ type: 'error', message: 'Failed to fetch label history.' }));
        }
        setLoading(false);
    }, [limit, page, dispatch]);

    useEffect(() => { fetchHistory(); }, [fetchHistory]);

    return (
        <Box className="w-full px-4 py-4">
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                    <Typography variant="h4" sx={{ color: '#0e1b15', fontWeight: 900 }}>Label History</Typography>
                    <Typography variant="body2" sx={{ color: '#509574' }}>All previously generated product label PDFs.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate(`${NAVIGATE_MODULES.ADMIN}${NAVIGATE_ADMIN.LABEL}`)}
                    sx={{ bgcolor: '#19b369', '&:hover': { bgcolor: '#159658' }, textTransform: 'none', fontWeight: 700, borderRadius: '0.75rem' }}
                >
                    Generate New Label
                </Button>
            </Stack>

            <Paper elevation={0} sx={{ border: '1px solid #d1e6dc', borderRadius: '1rem', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fbfa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Products</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Created At</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={4}><Skeleton height={40} /></TableCell></TableRow>
                                ))
                            ) : items.length > 0 ? items.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                            {item.products?.map((product) => (
                                                <Chip key={product.id} label={product.product_name} size="small" sx={{ mb: 0.5 }} />
                                            ))}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{item.company_name}</TableCell>
                                    <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="View">
                                            <IconButton size="small" onClick={() => setPreviewUrl(item.file_url)}>
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Download">
                                            <IconButton size="small" component="a" href={item.file_url} target="_blank" rel="noopener noreferrer" download>
                                                <Download fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 8, color: '#509574' }}>No label PDFs have been generated yet.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ p: 2, bgcolor: '#f8fbfa', borderTop: '1px solid #d1e6dc' }}>
                    <CustomPagination
                        count={total}
                        rowsPerPage={limit}
                        page={page}
                        onPageChange={(_, value) => setPage(value)}
                        onRowsPerPageChange={(e: SelectChangeEvent) => { setLimit(Number(e.target.value)); setPage(1); }}
                        rowsPerPageOptions={[10, 15, 25]}
                    />
                </Box>
            </Paper>

            <FilePreviewDrawer open={Boolean(previewUrl)} onClose={() => setPreviewUrl(null)} fileUrl={previewUrl ?? undefined} title="Label Preview" />
        </Box>
    );
};

export default LabelHistory;
