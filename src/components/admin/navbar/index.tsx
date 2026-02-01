import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Theme } from '@mui/material/styles';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, Collapse ,} from '@mui/material'
import {
	Description,
	ExpandLess, Dashboard,
	ExpandMore, AccountTree, Ballot, WaterDamage, Assignment, PhotoLibrary, MonetizationOn, PersonAdd, VolunteerActivism,
    Category, ReceiptLong, Business, Inventory, QrCode, QrCodeScanner
} from '@mui/icons-material';

import { RootState } from '../../../redux/store';
import MiniDrawerStyled from './MiniDrawerStyled';
import { useSettings } from '../../../providers/SettingsProvider';
import { clearSorting } from '../../../redux/reducer/sortingSlice';
import { handleNav } from '../../../utils/permission';
const Icons = {
	Description, Dashboard, AccountTree, Ballot,
	WaterDamage,        
	Assignment,         
	PhotoLibrary,    
	MonetizationOn,     
    PersonAdd, VolunteerActivism, Category, ReceiptLong, Business, Inventory, QrCode, QrCodeScanner
};

interface MenuItem {
	id: number;
	title: string;
	icon: keyof typeof Icons; 
	url: string;
	uuid: string;
	subMenus: MenuItem[];
}

const handleIcons = (iconName: keyof typeof Icons) => {
	if (!iconName || !(iconName in Icons)) return null;
	const IconComponent = Icons[iconName];
	return <IconComponent sx={{ fontSize: '24px' }} />;
};

const RenderNavs = ({ authUser }: { authUser: any }) => {
	const dispatch = useDispatch();
	const location = useLocation();

	const [navigationTabs, setNavigationTabs] = useState([]);
	const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
	const underOfselectedSubMenus: any = useSelector((state: RootState) => state.permission?.getFilterPermissionsObject?.parent_id ?? "");

	useEffect(() => {
		!openDropdowns?.hasOwnProperty(underOfselectedSubMenus) && underOfselectedSubMenus !== "" && underOfselectedSubMenus !== "0" && handleShowSubMenus(underOfselectedSubMenus ?? "")
	}, [underOfselectedSubMenus, openDropdowns]);

	useEffect(() => {
		const navigation_Tabs: any = handleNav(dispatch);
		setNavigationTabs(navigation_Tabs ?? []);
	}, [openDropdowns, dispatch]);


	const handleShowSubMenus = (menuSlug: string) => {
		setOpenDropdowns((prevState) => {
			return { [menuSlug]: !prevState[menuSlug] };
		});
	};

	const isMenuActive = (menu: MenuItem): boolean => {
		return location.pathname.startsWith(menu.url);
	};

	const isMasterActive = (menu: MenuItem): boolean => {
		return menu.subMenus?.some((subMenu: MenuItem) => isMenuActive(subMenu));
	};

	const handleSideNavClick = () => {
		dispatch(clearSorting());
	}
	const renderMenuItems = (menu: MenuItem, depth: number = 0.3) => {
		const hasSubMenus = menu?.subMenus && menu?.subMenus.length > 0;

		return (
			<React.Fragment key={menu.uuid}>
				<ListItem disablePadding sx={{ mb: 0.4 }} onClick={() => handleSideNavClick()}>
					<NavLink to={!hasSubMenus ? menu.url || "" : ""}
						className={({ isActive }) => {
							if (hasSubMenus) {
								return isMasterActive(menu) ? "menu-bar-item-active" : "menu-bar-item-inactive";
							}
							return isMenuActive(menu) ? "menu-bar-item-active" : "menu-bar-item-inactive";
						}}
						onClick={(e) => {
							if (hasSubMenus) {
								e.preventDefault()
								handleShowSubMenus(menu.uuid);
							}
						}}
						style={{ width: "100%" }}
					>
						<ListItemButton
							sx={{
								"&:hover": { backgroundColor: "transparent" },
								position: "relative",
								overflow: "hidden",
								borderRadius: "18px",
								pl: depth * 3,
							}}
						>
							<ListItemIcon sx={{ minWidth: "30px" }}>
								{handleIcons(menu.icon as any)}
							</ListItemIcon>
							<ListItemText primary={menu.title} />
							{hasSubMenus && (
								<ListItemIcon sx={{ minWidth: "30px" }}>
									{openDropdowns[menu.uuid] ? (
										<ExpandLess sx={{ fontSize: "25px" }} />
									) : (
										<ExpandMore sx={{ fontSize: "25px" }} />
									)}
								</ListItemIcon>
							)}
						</ListItemButton>
					</NavLink>
				</ListItem>
				{hasSubMenus && (
					<Collapse in={openDropdowns[menu.uuid] ?? false} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							{menu?.subMenus?.map((subMenu) => renderMenuItems(subMenu, depth + 1))}
						</List>
					</Collapse>
				)}
			</React.Fragment>
		);
	};

	return (
		<List component="nav" sx={{ pt: 0, ml: 1, mr: 1, mt: 9 }}>
			{navigationTabs.map((menu, index) => renderMenuItems(menu))}
		</List>
	);
}

const AdminNavBar = ({ window }: any) => {
	const authUser = useSelector((state: RootState) => state.authUser);
	const { isDashboardDrawerOpened, setIsDashboardDrawerOpened } = useSettings();
	const container = window !== undefined ? () => window().document.body : undefined;
	const matchDownMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

	return (
		<Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 100, mt: '59px' }} aria-label="mailbox folders">
			{!matchDownMD ? (
				<MiniDrawerStyled variant="permanent" open={isDashboardDrawerOpened}>
					<RenderNavs authUser={authUser} />
				</MiniDrawerStyled>
			) : (
				<Drawer
					container={container}
					variant="temporary"
					open={isDashboardDrawerOpened}
					onClose={setIsDashboardDrawerOpened}
					ModalProps={{ keepMounted: true }}
					sx={{
						zIndex: 100,
						display: { xs: 'block', lg: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: 260,
							borderRight: '1px solid',
							borderRightColor: 'divider',
							backgroundColor: '#fff',
							boxShadow: 'inherit',
						}
					}}
				>
					<RenderNavs authUser={authUser} />
				</Drawer>
			)}
		</Box>
	)
}

export default AdminNavBar