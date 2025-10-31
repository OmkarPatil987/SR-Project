import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, IconButton, Typography, MenuItem, Menu, Tooltip, Avatar, Divider, useTheme, Badge, } from '@mui/material';

import { CircleNotificationsOutlined, Logout } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import MenuIcon from '@mui/icons-material/Menu';

import { RootState } from '../../../redux/store';
import { useSettings } from '../../../providers/SettingsProvider';
import { NAVIGATE_AUTH } from '../../../constant';
import useResponsive from '../../../hooks/useResponsive';
import { showSnackbar } from '../../../redux/reducer/snackbarSlice';
// import NotificationMenu from '../../../pages/admin/notification/components/NotificationMenu';

export default function AdminTopBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isTablet, isDesktop, isMobile } = useResponsive();
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const theme = useTheme();
    const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null);
    const isNotificationMenuOpen = Boolean(notificationAnchorEl);

    const authUser = useSelector((state: RootState) => state.authUser);

    const { setIsDashboardDrawerOpened } = useSettings();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleNotificationMenuClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleProfileNavigate = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
        setTimeout(() => {
            // navigate(NAVIGATE_USERS.COMPANY_DETAILS_PAGE)
        }, 100)
    }

    const formatUserType = (userType?: string) => {
        if (!userType) return "";
        return userType
            .replace(/_/g, " ") // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleLogout = React.useCallback(() => {
        navigate(NAVIGATE_AUTH.LOGOUT_PAGE);
    }, [navigate]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleuserdevelopment = () => {
        dispatch(showSnackbar({ type: 'warning', message: 'Feature coming soon. Stay tuned!' }));
    }

    const renderNotificationMenu = (
        // <NotificationMenu
        //     anchorEl={notificationAnchorEl}
        //     open={isNotificationMenuOpen}
        //     onClose={handleNotificationMenuClose}
        // />
        <></>
    );

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleProfileNavigate}>
                <Avatar sx={{ width: 25, height: 25, mr: 1, bgcolor: 'primary.light' }} />
                <Box>
                    <Typography variant='body1' sx={{ lineHeight: 1 }}>{authUser.userDetails ? authUser.userDetails.name : ''}</Typography>
                    <Typography variant='caption' sx={{ fontSize: '0.7rem' }}>{formatUserType(authUser?.userDetails?.user_type) || 'NA'}</Typography>
                </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
                <Avatar sx={{ width: 22, height: 22, mr: 1, bgcolor: '#fff' }}>
                    <Logout sx={{ color: '#000', fontSize: 18 }} />
                </Avatar>
                Logout
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleProfileNavigate}>
                <Avatar sx={{ width: 25, height: 25, mr: 1, bgcolor: 'primary.light' }} />
                <Box>
                    <Typography variant='body1' sx={{ lineHeight: 1 }}>{authUser.userDetails ? authUser.userDetails.name : ''}</Typography>
                    <Typography variant='caption' sx={{ fontSize: '0.7rem' }}>{formatUserType(authUser?.userDetails?.user_type) || 'NA'}</Typography>
                </Box>
            </MenuItem>
            <MenuItem onClick={handleuserdevelopment}>
                <Avatar sx={{ width: 22, height: 22, mr: 1, bgcolor: '#fff' }}>
                    <ContactPhoneOutlinedIcon sx={{ color: '#000', fontSize: 18 }} />
                </Avatar>
                Support
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <Avatar sx={{ width: 22, height: 22, mr: 1, bgcolor: '#fff' }}>
                    <Logout sx={{ color: '#000', fontSize: 18 }} />
                </Avatar>
                Logout
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ zIndex: 101 }}>
            <AppBar elevation={5} sx={{ backgroundColor: 'common.white' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '59px !important' }}>
                    <Box display="flex" alignItems="center" sx={{ flexGrow: 1, cursor: "pointer" }}>
                        <IconButton color='primary' onClick={() => setIsDashboardDrawerOpened()}>
                            <MenuIcon fontSize='large' />
                        </IconButton>
                        <Box sx={{ borderRight: { xs: "none", md: `2px solid ${theme.palette.primary.main}` }, height: "35px", mx: 1 }} />
                        <Box sx={{ maxWidth: "500px", flexShrink: 1, p: { xs: 1, md: 1 } }}>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                color={theme.palette.primary.main}
                                sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}
                            >
                                Product Management & QR Code System
                            </Typography>
                            <Typography
                                variant="body2"
                                color={theme.palette.text.secondary}
                                sx={{ display: { xs: "0.1rem", md: "block" }, fontSize: { xs: "0.6rem", md: "0.8rem" } }}
                            >
                                Manage products, generate QR codes, and track inventory
                            </Typography>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="center">
                        {isDesktop && (
                            <>
                                <IconButton color="primary" onClick={handleuserdevelopment}>
                                    <ContactPhoneOutlinedIcon />
                                </IconButton>
                                <IconButton color="primary" onClick={toggleFullscreen}>
                                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                                </IconButton>
                            </>
                        )}
                        {isDesktop && (
                            <Tooltip title="Profile">
                                <IconButton
                                    onClick={handleProfileMenuOpen}
                                    size="small"
                                    aria-controls={anchorEl ? 'profile-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={anchorEl ? 'true' : undefined}
                                >
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        {(isMobile || isTablet) && (
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            {renderNotificationMenu}
        </Box>
    );
}
