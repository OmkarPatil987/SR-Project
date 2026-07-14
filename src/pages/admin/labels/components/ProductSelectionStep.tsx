import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, Typography, Button, Skeleton, Alert, SelectChangeEvent, TextField, InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { FetchProductGazetteListService } from '../../../../utils/services/label.service';
import { showSnackbar } from '../../../../redux/reducer/snackbarSlice';
import { GazetteListItem } from '../../../../utils/dto/response/label';
import CustomPagination from '../../../../components/common/table/TablePagination';
import { MAX_LABEL_SELECTIONS } from '../constants/labelConstants';
import useDebounce from '../../../../hooks/useDebounce';

interface ProductSelectionStepProps {
    selectedIds: number[];
    onSelectionChange: (ids: number[]) => void;
    onNext: () => void;
}

const ProductSelectionStep: React.FC<ProductSelectionStepProps> = ({ selectedIds, onSelectionChange, onNext }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<GazetteListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const fetchList = useCallback(async () => {
        setLoading(true);
        const { code, data } = await FetchProductGazetteListService({
            limit,
            offset: (page - 1) * limit,
            ...(debouncedSearch ? { query: debouncedSearch } : {}),
        });
        if (code === 200 && data) {
            setItems(data.items ?? []);
            setTotal(data.pagination?.total ?? 0);
        } else {
            setItems([]);
            setTotal(0);
            dispatch(showSnackbar({ type: 'error', message: 'Failed to fetch product gazette list.' }));
        }
        setLoading(false);
    }, [limit, page, debouncedSearch, dispatch]);

    useEffect(() => { fetchList(); }, [fetchList]);

    useEffect(() => { setPage(1); }, [debouncedSearch]);

    const isAtLimit = selectedIds.length >= MAX_LABEL_SELECTIONS;

    const handleToggle = (id: number) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
        } else if (!isAtLimit) {
            onSelectionChange([...selectedIds, id]);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Select Products ({selectedIds.length}/{MAX_LABEL_SELECTIONS})</Typography>
                <Button variant="contained" disabled={selectedIds.length === 0} onClick={onNext} sx={{ bgcolor: '#19b369', '&:hover': { bgcolor: '#159658' }, textTransform: 'none', fontWeight: 700, borderRadius: '0.75rem' }}>
                    Next
                </Button>
            </Box>

            {isAtLimit && (
                <Alert severity="info" sx={{ mb: 2 }}>You have reached the maximum of {MAX_LABEL_SELECTIONS} labels. Deselect an item to choose another.</Alert>
            )}

            <TextField
                size="small"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                }}
                sx={{ mb: 2, width: { xs: '100%', sm: 320 } }}
            />

            <Paper elevation={0} sx={{ border: '1px solid #d1e6dc', borderRadius: '1rem', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fbfa' }}>
                            <TableRow>
                                <TableCell padding="checkbox" />
                                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={2}><Skeleton height={40} /></TableCell></TableRow>
                                ))
                            ) : items.length > 0 ? items.map((item) => {
                                const checked = selectedIds.includes(item.id);
                                return (
                                    <TableRow key={item.id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={checked} disabled={!checked && isAtLimit} onChange={() => handleToggle(item.id)} />
                                        </TableCell>
                                        <TableCell>{item.name}</TableCell>
                                    </TableRow>
                                );
                            }) : (
                                <TableRow><TableCell colSpan={2} align="center" sx={{ py: 6 }}>No products found.</TableCell></TableRow>
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
        </Box>
    );
};

export default ProductSelectionStep;
