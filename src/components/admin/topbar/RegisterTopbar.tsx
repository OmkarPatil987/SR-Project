import {
    AppBar,
    Box,
    Button,
    Container,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Badge,
    Tooltip,
    Chip,
} from '@mui/material';
import {
    AddCircleOutline,
    NotificationsOutlined,
    SettingsOutlined,
    PersonOutline,
    DashboardOutlined,
    Inventory2Outlined,
    CategoryOutlined,
    BarChartOutlined,
    HelpOutlineOutlined,
    LogoutOutlined,
} from '@mui/icons-material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useResponsive from '../../../hooks/useResponsive';

export default function ProductManagementTopbar() {
    const { isMobile } = useResponsive();
    const navigate = useNavigate();
    const location = useLocation();

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNotifications(event.currentTarget);
    };

    const handleCloseNotifications = () => {
        setAnchorElNotifications(null);
    };

    const handleLogout = () => {
        // Add logout logic
        handleCloseUserMenu();
    };

    const navigationItems = [
        { label: 'Dashboard', icon: <DashboardOutlined />, path: '/dashboard' },
        { label: 'Products', icon: <Inventory2Outlined />, path: '/products' },
        { label: 'Categories', icon: <CategoryOutlined />, path: '/categories' },
        { label: 'Analytics', icon: <BarChartOutlined />, path: '/analytics' },
    ];

    const notifications = [
        { id: 1, message: '5 new products pending approval', time: '2m ago', unread: true },
        { id: 2, message: 'Stock alert: iPhone 15 Pro running low', time: '15m ago', unread: true },
        { id: 3, message: 'Product "Laptop XYZ" updated successfully', time: '1h ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <AppBar
            position="sticky"
            elevation={2}
            sx={{
                backgroundColor: 'common.white',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Toolbar disableGutters>
                <Container
                    maxWidth="xl"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: { xs: 56, sm: 64 },
                        px: { xs: 2, md: 3 },
                    }}
                >
                    {/* Left Section - Logo & Navigation */}
                    <Box display="flex" alignItems="center" gap={{ xs: 1, md: 3 }}>
                        {/* Logo */}
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate('/dashboard')}
                        >
                            <Box
                                sx={{
                                    width: { xs: 36, md: 48 },
                                    height: { xs: 36, md: 48 },
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Inventory2Outlined sx={{ color: 'white', fontSize: { xs: 20, md: 28 } }} />
                            </Box>
                            {!isMobile && (
                                <Box>
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        color="text.primary"
                                        sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, lineHeight: 1.2 }}
                                    >
                                        ProductHub
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                        Product Management System
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Navigation Links - Desktop Only */}
                        {!isMobile && (
                            <Box display="flex" gap={1} ml={2}>
                                {navigationItems.map((item) => (
                                    <Button
                                        key={item.path}
                                        startIcon={item.icon}
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            textTransform: 'none',
                                            color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                                            fontWeight: location.pathname === item.path ? 600 : 500,
                                            backgroundColor: location.pathname === item.path ? 'primary.lighter' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            },
                                            px: 2,
                                            borderRadius: 2,
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Right Section - Actions & Profile */}
                    <Box display="flex" alignItems="center" gap={{ xs: 0.5, md: 1.5 }}>
                        {/* Add Product Button */}
                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutline />}
                            onClick={() => navigate('/products/create')}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2,
                                px: { xs: 1.5, md: 2.5 },
                                display: { xs: 'none', sm: 'flex' },
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5568d3 0%, #66408a 100%)',
                                },
                            }}
                        >
                            Add Product
                        </Button>

                        {/* Mobile Add Button */}
                        {isMobile && (
                            <IconButton
                                color="primary"
                                onClick={() => navigate('/products/create')}
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'primary.dark' },
                                }}
                            >
                                <AddCircleOutline fontSize="small" />
                            </IconButton>
                        )}

                        {/* Notifications */}
                        <Tooltip title="Notifications">
                            <IconButton onClick={handleOpenNotifications} size={isMobile ? 'small' : 'medium'}>
                                <Badge badgeContent={unreadCount} color="error">
                                    <NotificationsOutlined />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Menu
                            anchorEl={anchorElNotifications}
                            open={Boolean(anchorElNotifications)}
                            onClose={handleCloseNotifications}
                            PaperProps={{
                                sx: { width: 320, maxHeight: 400, mt: 1.5 },
                            }}
                        >
                            <Box px={2} py={1.5} borderBottom={1} borderColor="divider">
                                <Typography variant="h6" fontWeight={600}>
                                    Notifications
                                </Typography>
                            </Box>
                            {notifications.map((notification) => (
                                <MenuItem
                                    key={notification.id}
                                    onClick={handleCloseNotifications}
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        backgroundColor: notification.unread ? 'action.hover' : 'transparent',
                                    }}
                                >
                                    <Typography variant="body2" fontWeight={notification.unread ? 600 : 400}>
                                        {notification.message}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {notification.time}
                                    </Typography>
                                </MenuItem>
                            ))}
                            <Box px={2} py={1.5} borderTop={1} borderColor="divider">
                                <Button fullWidth size="small" sx={{ textTransform: 'none' }}>
                                    View All Notifications
                                </Button>
                            </Box>
                        </Menu>

                        {/* Settings - Desktop Only */}
                        {!isMobile && (
                            <Tooltip title="Settings">
                                <IconButton onClick={() => navigate('/settings')}>
                                    <SettingsOutlined />
                                </IconButton>
                            </Tooltip>
                        )}

                        {/* User Profile */}
                        <Tooltip title="Account">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: { xs: 0.5, md: 1 } }}>
                                <Avatar
                                    alt="User Name"
                                    src="/images/avatar.jpg"
                                    sx={{
                                        width: { xs: 32, md: 40 },
                                        height: { xs: 32, md: 40 },
                                        border: '2px solid',
                                        borderColor: 'primary.main',
                                    }}
                                >
                                    UN
                                </Avatar>
                            </IconButton>
                        </Tooltip>

                        <Menu
                            anchorEl={anchorElUser}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            PaperProps={{
                                sx: { width: 240, mt: 1.5 },
                            }}
                        >
                            <Box px={2} py={2} borderBottom={1} borderColor="divider">
                                <Typography variant="subtitle1" fontWeight={600}>
                                    John Doe
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    john.doe@productshub.com
                                </Typography>
                                <Chip
                                    label="Admin"
                                    size="small"
                                    color="primary"
                                    sx={{ mt: 1, height: 20, fontSize: '0.7rem' }}
                                />
                            </Box>

                            <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                                <PersonOutline sx={{ mr: 1.5 }} fontSize="small" />
                                Profile
                            </MenuItem>

                            {isMobile && (
                                <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/settings'); }}>
                                    <SettingsOutlined sx={{ mr: 1.5 }} fontSize="small" />
                                    Settings
                                </MenuItem>
                            )}

                            <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/help'); }}>
                                <HelpOutlineOutlined sx={{ mr: 1.5 }} fontSize="small" />
                                Help & Support
                            </MenuItem>

                            <Box borderTop={1} borderColor="divider" mt={1}>
                                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                    <LogoutOutlined sx={{ mr: 1.5 }} fontSize="small" />
                                    Logout
                                </MenuItem>
                            </Box>
                        </Menu>
                    </Box>
                </Container>
            </Toolbar>
        </AppBar>
    );
}
