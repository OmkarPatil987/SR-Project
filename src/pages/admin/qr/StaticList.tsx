import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Box, Paper, Button, TextField, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Tooltip,
    Chip, Stack, TablePagination, Skeleton, InputAdornment, Typography, Avatar,
    IconButton, Switch, CircularProgress
} from "@mui/material";
import {
    Add, QrCode2, Edit, Search, FileDownload,
    TrendingUp, CheckCircle, Warning, Sensors, Visibility
} from "@mui/icons-material";
import { RootState } from "../../../redux/store";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { resetRefresh } from "../../../redux/reducer/refreshSlice";
import { FetchQRListService } from "../../../utils/services/product.service";

const StaticQRList: React.FC = () => {
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
        type: "static",
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
            dispatch(showSnackbar({ type: "error", message: "Failed to fetch Static QR list" }));
        } finally {
            setLoading(false);
        }
    }, [payload, refresh, dispatch]);

    useEffect(() => {
        getQRList();
    }, [getQRList]);

    // --- Forced Download Logic using full API path ---
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
            link.download = `${fileName.replace(/\s+/g, '_')}_Static_QR.png`;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            dispatch(showSnackbar({ type: "success", message: "Download successful" }));
        } catch (error) {
            // Fallback: If fetch fails, open image in new tab
            window.open(path, '_blank');
            dispatch(showSnackbar({ type: "warning", message: "Direct download blocked. Opened in new tab." }));
        } finally {
            setDownloadingId(null);
        }
    };

    const StatsCard = ({ title, value, sub, icon, color }: any) => (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e0e0', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>{title}</Typography>
                {icon}
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{value}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ color: color, fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    {sub}
                </Typography>
            </Box>
        </Paper>
    );

    return (
        <Box sx={{ mx: "auto", px: 4, py: 4 }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: "#0e1b12", mb: 0.5 }}>Static QR Inventory</Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>Manage and track your agricultural product QR codes.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/admin/create-qr?type=static")}
                    sx={{ bgcolor: '#13ae47', height: 48, px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                >
                    Generate Static QR
                </Button>
            </Box>

            {/* Table Container */}
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" size="small" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, bgcolor: '#13ae47' }}>
                            All Static QRs
                        </Button>
                    </Stack>
                    <TextField
                        size="small"
                        placeholder="Search QRs, products..."
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
                                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>QR Code</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Product Name</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>ID & Type</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Dates (Mfg/Exp)</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Created Date</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Status</TableCell>
                                    <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {qrList.map((row) => (
                                    <TableRow key={row.detail_uuid} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            <Avatar src={row.qr_path} variant="rounded" sx={{ width: 48, height: 48, border: '1px solid #eee', p: 0.5, bgcolor: '#fff' }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#0e1b12' }}>{row.product_name}</Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Batch #{row.product_code}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.disabled', display: 'block', mb: 0.5 }}>#{row.qr_id}</Typography>
                                            <Chip label={row.qr_type?.toUpperCase()} size="small" sx={{ fontSize: '0.65rem', fontWeight: 800, bgcolor: '#f3f4f6', color: '#374151', borderRadius: 1 }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>M: {row.manufacturing_date}</Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: '#13ae47', fontWeight: 700 }}>E: {row.expiry_date}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>{row.detail_created_at?.split('T')[0]}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Switch checked={row.status} size="small" color="primary" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                {/* Visibility Icon to open public page */}
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
                                                        sx={{ color: 'text.secondary' }}
                                                    >
                                                        {downloadingId === row.detail_uuid ? <CircularProgress size={18} color="inherit" /> : <FileDownload fontSize="small" />}
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Edit Details">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => navigate(`/admin/create-qr?uuid=${row.product_master_uuid}&detail_uuid=${row.qr_uuid}&type=static`)}
                                                        sx={{ color: 'text.secondary' }}
                                                    >
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
                    sx={{ borderTop: '1px solid #f0f0f0' }}
                />
            </Paper>
        </Box>
    );
};

export default StaticQRList;