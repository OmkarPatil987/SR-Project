import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import { isAuthorizedPage, isLoggedIn } from '../utils/utils';

import AdminTopBar from '../components/admin/topbar';
import AdminNavBar from '../components/admin/navbar';

import { Box } from '@mui/material';
import { Navigate } from 'react-router-dom';
import Error403 from '../pages/error/Error403';
import { NAVIGATE_AUTH } from '../constant';

const NAVBAR_WIDTH = 240; 

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const authUser = useSelector((state: RootState) => state.authUser);

    if (!isLoggedIn(authUser)) {
        return <Navigate to={NAVIGATE_AUTH.LOGOUT_PAGE} replace />;
    }

    const userType = authUser?.userDetails?.user_type;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minHeight: '100vh',
                position: 'relative',
                minWidth: '290px',
                overflow: 'hidden',
                backgroundColor: 'background.default',
            }}
        >
            <AdminTopBar />
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    mt: { xs: '60px', sm: '65px' },
                    flex: '1 1',
                    display: 'flex',
                }}
            >
                <AdminNavBar />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: `calc(100% - ${NAVBAR_WIDTH}px)`,
                        borderRightWidth: 1,
                        borderRightColor: 'grey.400',
                    }}
                >
                    <Box sx={{ position: 'relative', minHeight: '100%' }}>
                        {isAuthorizedPage(userType || '') ? children : <Error403 />}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminLayout;
