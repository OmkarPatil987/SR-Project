import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Box, Paper, Button, TextField, IconButton, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Tooltip,
    Chip, Stack, TablePagination, Skeleton, InputAdornment, Typography, Avatar,
    Grid, Switch, CircularProgress
} from "@mui/material";
import {
    Add, QrCode2, Edit, Search, FileDownload,
    TrendingUp, CheckCircle, Warning, Sensors, Visibility // Added Visibility icon
} from "@mui/icons-material";
import { RootState } from "../../../redux/store";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { resetRefresh } from "../../../redux/reducer/refreshSlice";
import { FetchQRListService } from "../../../utils/services/product.service";

const DynamicQRList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const refresh = useSelector((state: RootState) => state.refresh.createQR);

    const [loading, setLoading] = useState(true);
    const [qrList, setQrList] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const [payload, setPayload] = useState({
        offset: 0,
        limit: 10,
        search: "",
        type: "dynamic",
    });

    const getQRList = useCallback(async () => {
        setLoading(true);
        try {
            const { code, data } = await FetchQRListService(payload);
            if (code === 200 && data) {
                setQrList(data.data || []);
                setTotalCount(data.total_count || 0);
                dispatch(resetRefresh());
            }
        } catch (error) {
            dispatch(showSnackbar({ type: "error", message: "Failed to fetch QR list" }));
        } finally {
            setLoading(false);
        }
    }, [payload, refresh, dispatch]);

    useEffect(() => {
        getQRList();
    }, [getQRList]);

    const handleDownload = async (path: string, fileName: string, uuid: string) => {
        if (!path) return;
        setDownloadingId(uuid);

        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error();

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName.replace(/\s+/g, '_')}_QR.png`;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            dispatch(showSnackbar({ type: "success", message: "Download successful" }));
        } catch (error) {
            window.open(path, '_blank');
            dispatch(showSnackbar({ type: "warning", message: "Direct download blocked. Opening in new tab." }));
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <Box sx={{ mx: "auto", px: 4, py: 4 }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: "#0e1b12", mb: 0.5 }}>Dynamic QR Inventory</Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>Manage and track your agricultural product QR codes.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/admin/create-qr?type=dynamic")}
                    sx={{ bgcolor: '#13ae47', height: 48, px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                >
                    Generate Dynamic QR
                </Button>
            </Box>

            {/* Table Container */}
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" size="small" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, bgcolor: '#13ae47' }}>
                            All Dynamic QRs
                        </Button>
                    </Stack>

                    <TextField
                        size="small"
                        placeholder="Search by product or code..."
                        value={payload.search}
                        onChange={(e) => setPayload(p => ({ ...p, search: e.target.value, offset: 0 }))}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: '#13ae47' }} /></InputAdornment> }}
                        sx={{ width: 280, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f6f8f6', border: 'none', '& fieldset': { border: 'none' } } }}
                    />
                </Box>

                {loading ? (
                    <Box sx={{ p: 2 }}>{[1, 2, 3, 4, 5].map(i => <Skeleton key={i} height={70} sx={{ mb: 1 }} />)}</Box>
                ) : (
                    <TableContainer>
                        <Table sx={{ minWidth: 1000 }}>
                            <TableHead sx={{ bgcolor: '#f9fafb' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>QR Code</TableCell>
                                    <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Product Details</TableCell>
                                    <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>ID & Type</TableCell>
                                    <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Dates</TableCell>
                                    <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Created</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {qrList.map((row) => (
                                    <TableRow key={row.detail_uuid} hover>
                                        <TableCell>
                                            <Avatar src={row.qr_path} variant="rounded" sx={{ width: 48, height: 48, border: '1px solid #eee' }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700 }}>{row.product_name}</Typography>
                                            <Typography variant="caption" color="text.secondary">Batch #{row.product_code}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>#{row.qr_id}</Typography>
                                            <Chip label={row.qr_type?.toUpperCase()} size="small" sx={{ ml: 1, fontSize: '10px', height: 20 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.75rem' }}>M: {row.manufacturing_date}</Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: '#13ae47', fontWeight: 700 }}>E: {row.expiry_date}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.875rem' }}>{row.detail_created_at?.split('T')[0]}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Switch checked={row.status} size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                {/* View Icon Button */}
                                                <Tooltip title="View Public Page">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => window.open(`/p/${row.qr_uuid}`, '_blank')}
                                                        sx={{ color: '#4c9a74' }}
                                                    >
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Download PNG">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDownload(row.qr_path, row.product_name, row.detail_uuid)}
                                                        disabled={downloadingId === row.detail_uuid}
                                                    >
                                                        {downloadingId === row.detail_uuid ? <CircularProgress size={18} /> : <FileDownload fontSize="small" />}
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => navigate(`/admin/create-qr?uuid=${row.product_master_uuid}&detail_uuid=${row.qr_uuid}`)}>
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={payload.offset / payload.limit}
                    onPageChange={(_, page) => setPayload(p => ({ ...p, offset: page * payload.limit }))}
                    rowsPerPage={payload.limit}
                    onRowsPerPageChange={(e) => setPayload(p => ({ ...p, limit: +e.target.value, offset: 0 }))}
                />
            </Paper>
        </Box>
    );
};

export default DynamicQRList;