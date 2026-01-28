import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Typography,
    Chip,
    IconButton,
    InputAdornment,
    Button,
    Avatar,
    Stack,
    Tooltip,
    useTheme,
    alpha
} from '@mui/material';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Business as BusinessIcon,
    VerifiedUser as VerifiedIcon,
    GppBad as InactiveIcon,
    ContentCopy as CopyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHead from '../../../components/common/page/PageHead';
import { FetchCompanyListService } from '../../../utils/services/product.service';

// --- Helper for Random Avatar Colors ---
function stringToColor(string: string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            width: 36,
            height: 36,
            fontSize: '0.875rem',
            fontWeight: 600
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1] ? name.split(' ')[1][0] : ''}`.toUpperCase(),
    };
}

const CompanyList = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    // State
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Fetch Data
    const fetchCompanies = async () => {
        setLoading(true);
        const payload = {
            offset: page * rowsPerPage,
            limit: rowsPerPage,
            search: searchQuery,
        };
        try {
            const { code, data } = await FetchCompanyListService(payload);
            if (code === 200 && data && data.data) {
                setCompanies(data.data);
                setTotalCount(data.total_count);
            } else {
                setCompanies([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error(error);
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [page, rowsPerPage]);

    // Handlers
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleEdit = (uuid: string) => {
        navigate(`/companies/edit/${uuid}`);
    };

    return (
        <Box sx={{ p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            {/* Header Section */}
            <PageHead
                primary="Company Management"
                back={<BusinessIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />}
                secondary={
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/companies/create')}
                        sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
                    >
                        New Company
                    </Button>
                }
            />

            <Card elevation={0} sx={{ mt: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                {/* Search Bar */}
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <TextField
                        size="small"
                        placeholder="Search companies..."
                        value={searchQuery}
                        onChange={handleSearch}
                        onKeyDown={(e) => e.key === 'Enter' && fetchCompanies()}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            width: 320,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'background.paper'
                            }
                        }}
                    />
                </Box>

                {/* Table */}
                <TableContainer>
                    <Table sx={{ minWidth: 1200 }} aria-label="company table">
                        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Company Name</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email Address</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Mobile Number</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>GST Number</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>PAN Number</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                        <Typography variant="body1" color="text.secondary">Loading data...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : companies.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                        <Typography variant="body1" color="text.secondary">No companies found.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                companies.map((row) => (
                                    <TableRow
                                        key={row.uuid}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        {/* 1. Company Name & ID */}
                                        <TableCell component="th" scope="row">
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar {...stringAvatar(row.company_name)} variant="rounded" />
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'text.primary' }}>
                                                        {row.company_name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                                                        ID: {row.id}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>

                                        {/* 2. Email */}
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                                {row.email}
                                            </Typography>
                                        </TableCell>

                                        {/* 3. Mobile */}
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                                {row.mobile}
                                            </Typography>
                                        </TableCell>

                                        {/* 4. GST No */}
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.primary', bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1, width: 'fit-content' }}>
                                                {row.gst_no}
                                            </Typography>
                                        </TableCell>

                                        {/* 5. PAN No */}
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>
                                                {row.pan_no}
                                            </Typography>
                                        </TableCell>

                                        {/* 6. Status */}
                                        <TableCell>
                                            <Chip
                                                icon={row.is_active ? <VerifiedIcon sx={{ fontSize: '1rem !important' }} /> : <InactiveIcon sx={{ fontSize: '1rem !important' }} />}
                                                label={row.is_active ? "Active" : "Inactive"}
                                                color={row.is_active ? "success" : "default"}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 600,
                                                    borderRadius: 1,
                                                    bgcolor: row.is_active ? alpha(theme.palette.success.main, 0.05) : 'transparent',
                                                    borderColor: row.is_active ? alpha(theme.palette.success.main, 0.3) : 'default',
                                                }}
                                            />
                                        </TableCell>

                                        {/* 7. Actions */}
                                        <TableCell align="right">
                                            <Tooltip title="Edit Company">
                                                <IconButton
                                                    onClick={() => handleEdit(row.uuid)}
                                                    sx={{
                                                        color: 'primary.main',
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                                                    }}
                                                    size="small"
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                />
            </Card>
        </Box>
    );
};

export default CompanyList;