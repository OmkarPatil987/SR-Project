import { useState, useEffect } from "react";
import { Box, Container, Grid, Card, CardContent, CardHeader, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, Skeleton, Alert, useTheme, Divider, ToggleButtonGroup, ToggleButton, } from "@mui/material";
import { Inventory2Outlined, QrCode2Outlined, DownloadOutlined, CloudUploadOutlined, AddCircleOutlineOutlined, ArrowForwardOutlined, } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useResponsive from "../../../hooks/useResponsive";
import PageHead from "../../../components/common/page/PageHead";

// Utility function
const formatInt = (value: number): string => {
    return value.toLocaleString();
};

// Mock data - replace with actual API calls
const mockMetrics = {
    totalProducts: 1247,
    qrGenerated: 1156,
    qrDownloads: 892,
    bulkUploads: 23,
};

const mockRecentActivity = [
    {
        id: 1,
        timestamp: "2025-10-30 09:30 AM",
        actor: "John Doe",
        action: "Created",
        entity: "Product: Wireless Mouse XZ-200",
        type: "create",
    },
    {
        id: 2,
        timestamp: "2025-10-30 09:15 AM",
        actor: "Sarah Smith",
        action: "Generated QR",
        entity: "Product: Laptop Stand Pro",
        type: "qr",
    },
    {
        id: 3,
        timestamp: "2025-10-30 08:45 AM",
        actor: "Mike Johnson",
        action: "Updated",
        entity: "Product: USB-C Cable 3m",
        type: "update",
    },
    {
        id: 4,
        timestamp: "2025-10-30 08:30 AM",
        actor: "Admin",
        action: "Bulk Upload",
        entity: "125 products imported",
        type: "bulk",
    },
    {
        id: 5,
        timestamp: "2025-10-30 08:00 AM",
        actor: "Emma Wilson",
        action: "Downloaded QR",
        entity: "Product: Mechanical Keyboard RGB",
        type: "download",
    },
];

// Components
const SummaryCard: React.FC<{
    title: string;
    subtitle?: string;
    value: number;
    color: string;
    avatarIcon: React.ReactNode;
    loading?: boolean;
}> = ({ title, subtitle, value, color, avatarIcon, loading }) => {
    if (loading) {
        return (
            <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 2 }}>
                <CardHeader
                    avatar={<Skeleton variant="circular" width={48} height={48} />}
                    title={<Skeleton variant="text" width="60%" />}
                    subheader={<Skeleton variant="text" width="40%" />}
                />
                <CardContent sx={{ pt: 0, textAlign: "right" }}>
                    <Skeleton variant="text" width="40%" sx={{ ml: "auto" }} />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 2 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
                        {avatarIcon}
                    </Avatar>
                }
                title={title}
                subheader={subtitle}
                titleTypographyProps={{ variant: "h6", fontWeight: 600 }}
                subheaderTypographyProps={{ variant: "body2", color: "text.secondary" }}
            />
            <CardContent sx={{ pt: 0, textAlign: "right" }}>
                <Typography variant="h4" fontWeight={700}>
                    {formatInt(value)}
                </Typography>
            </CardContent>
        </Card>
    );
};

const InfoChartCard: React.FC<{
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}> = ({ title, subtitle, action, children }) => (
    <Card sx={{ height: "100%", boxShadow: 2, borderRadius: 3 }}>
        <CardHeader
            title={title}
            subheader={subtitle}
            action={action}
            titleTypographyProps={{ variant: "h6", fontWeight: 700 }}
            subheaderTypographyProps={{ variant: "body2", color: "text.secondary" }}
        />
        <Divider />
        <CardContent>{children}</CardContent>
    </Card>
);

const ToggleView: React.FC<{
    value: "cards" | "table";
    onChange: (v: "cards" | "table") => void;
}> = ({ value, onChange }) => (
    <ToggleButtonGroup
        size="small"
        value={value}
        exclusive
        onChange={(_, v) => v && onChange(v)}
    >
        <ToggleButton value="cards">Cards</ToggleButton>
        <ToggleButton value="table">Table</ToggleButton>
    </ToggleButtonGroup>
);

const DashboardPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { isMobile } = useResponsive();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [metrics, setMetrics] = useState(mockMetrics);
    const [recentActivity, setRecentActivity] = useState(mockRecentActivity);
    const [viewMode, setViewMode] = useState<"cards" | "table">("table");

    useEffect(() => {
        // Simulate API call
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // Replace with actual API call
                await new Promise((resolve) => setTimeout(resolve, 1500));
                setMetrics(mockMetrics);
                setRecentActivity(mockRecentActivity);
                setError(null);
            } catch (err) {
                setError("Failed to load dashboard data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getActionColor = (type: string) => {
        switch (type) {
            case "create":
                return theme.palette.success.main;
            case "update":
                return theme.palette.info.main;
            case "qr":
                return theme.palette.primary.main;
            case "download":
                return theme.palette.warning.main;
            case "bulk":
                return theme.palette.secondary.main;
            default:
                return theme.palette.grey[500];
        }
    };

    return (
        <Box sx={{ bgcolor: "grey.100", minHeight: "100vh", }}>
            <Container maxWidth="xl">
                {/* Header */}
                <PageHead primary="Admin Dashboard" />

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Metric Cards */}
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <SummaryCard
                            title="Total Products"
                            subtitle="All products in system"
                            value={metrics.totalProducts}
                            color={theme.palette.primary.main}
                            avatarIcon={<Inventory2Outlined />}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <SummaryCard
                            title="QR Codes Generated"
                            subtitle="Total QR codes created"
                            value={metrics.qrGenerated}
                            color={theme.palette.success.main}
                            avatarIcon={<QrCode2Outlined />}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <SummaryCard
                            title="QR Downloads"
                            subtitle="Total downloads"
                            value={metrics.qrDownloads}
                            color={theme.palette.warning.main}
                            avatarIcon={<DownloadOutlined />}
                            loading={loading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <SummaryCard
                            title="Bulk Uploads"
                            subtitle="Completed uploads"
                            value={metrics.bulkUploads}
                            color={theme.palette.info.main}
                            avatarIcon={<CloudUploadOutlined />}
                            loading={loading}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    {/* Recent Activity */}
                    <Grid item xs={12} md={8}>
                        <InfoChartCard
                            title="Recent Activity"
                            subtitle="Latest actions in the system"
                            action={
                                <Button
                                    endIcon={<ArrowForwardOutlined />}
                                    size="small"
                                    onClick={() => navigate("/admin/activity-log")}
                                >
                                    View All
                                </Button>
                            }
                        >
                            {loading ? (
                                <Box>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Box key={i} display="flex" gap={2} mb={2}>
                                            <Skeleton variant="circular" width={40} height={40} />
                                            <Box flex={1}>
                                                <Skeleton variant="text" width="80%" />
                                                <Skeleton variant="text" width="60%" />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <TableContainer sx={{ maxHeight: 400 }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Details</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {recentActivity.map((activity) => (
                                                <TableRow
                                                    key={activity.id}
                                                    hover
                                                    sx={{
                                                        "&:last-child td": { border: 0 },
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {activity.timestamp}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Avatar
                                                                sx={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    bgcolor: theme.palette.primary.light,
                                                                    fontSize: "0.875rem",
                                                                }}
                                                            >
                                                                {activity.actor.charAt(0)}
                                                            </Avatar>
                                                            <Typography variant="body2">
                                                                {activity.actor}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={activity.action}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: getActionColor(activity.type),
                                                                color: "white",
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" noWrap>
                                                            {activity.entity}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </InfoChartCard>
                    </Grid>

                    {/* Quick Actions */}
                    <Grid item xs={12} md={4}>
                        <InfoChartCard title="Quick Actions" subtitle="Common tasks">
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={<AddCircleOutlineOutlined />}
                                    onClick={() => navigate("/admin/products/new")}
                                    sx={{
                                        py: 1.5,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        boxShadow: 3,
                                        "&:hover": {
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    Add New Product
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    startIcon={<CloudUploadOutlined />}
                                    onClick={() => navigate("/admin/products/bulk-upload")}
                                    sx={{
                                        py: 1.5,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                    }}
                                >
                                    Bulk Upload
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    startIcon={<QrCode2Outlined />}
                                    onClick={() => navigate("/admin/products")}
                                    sx={{
                                        py: 1.5,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                    }}
                                >
                                    Manage Products
                                </Button>
                            </Box>

                            {/* Stats Summary */}
                            <Box mt={4} pt={3} borderTop={1} borderColor="divider">
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                    fontWeight={600}
                                    mb={2}
                                >
                                    Quick Stats
                                </Typography>
                                <Box display="flex" flexDirection="column" gap={1.5}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            Active Products
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            1,143
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            Inactive Products
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            104
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            Low Stock Items
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600} color="error">
                                            23
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            Out of Stock
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600} color="error">
                                            12
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </InfoChartCard>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default DashboardPage;
