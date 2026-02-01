import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Box, Paper, Button, TextField, IconButton, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Tooltip,
    Chip, Stack, TablePagination, Skeleton, InputAdornment, Typography, Avatar,
    Switch, CircularProgress
} from "@mui/material";
import {
    Add, Edit, Search, FileDownload, Visibility
} from "@mui/icons-material";
import { jsPDF } from "jspdf"; // Import jsPDF
import { RootState } from "../../../redux/store";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { resetRefresh } from "../../../redux/reducer/refreshSlice";
import { FetchQRListService } from "../../../utils/services/product.service";

const loadImageAsBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

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

    /**
     * Modified handleDownload
     * Uses jsPDF to create a formatted document from the image URL
     */
    const handleDownload = async (row: any) => {
        const path = row.qr_path;
        if (!path) return;

        setDownloadingId(row.detail_uuid);

        try {
            const doc = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [80, 100],
            });

            // 🔥 Load QR as base64
            const base64Image = await loadImageAsBase64(path);

            // Add QR
            doc.addImage(base64Image, "PNG", 15, 10, 50, 50);

            // Text
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text(row.product_name || "Product", 40, 70, { align: "center" });


            const safeName = (row.product_name || "QR").replace(/\s+/g, "_");
            doc.save(`${safeName}_Badge.pdf`);

            dispatch(showSnackbar({ type: "success", message: "PDF Downloaded" }));
        } catch (err) {
            console.error(err);
            dispatch(showSnackbar({ type: "error", message: "Failed to generate PDF" }));
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <Box sx={{ mx: "auto", px: 4, py: 4 }}>
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
                                                <Tooltip title="View Public Page">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => window.open(`/p/${row.qr_uuid}`, '_blank')}
                                                        sx={{ color: '#4c9a74' }}
                                                    >
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Download PDF Badge">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDownload(row)}
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