import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PageLoader from '../components/loader/LoaderText';
import { NAVIGATE_GUEST } from '../constant';
import GuestLayout from '../layout/GuestLayout';
import HomePage from '../pages/guest/home';


const Error404 = lazy(() => import('../pages/error/Error404'));

const GuestRoute = () => {
    return (
        <Suspense fallback={<GuestLayout><PageLoader /></GuestLayout>}>
            <Routes>
                <Route path='*' element={<GuestLayout> <Error404 /></GuestLayout>}></Route>
                <Route path={NAVIGATE_GUEST.HOME} element={<GuestLayout><HomePage /></GuestLayout>} />
                {/* <Route path={NAVIGATE_GUEST.VOLUNTAYREGISTER_PAGE} element={<GuestLayout><VoluntaryRegistrationPage /></GuestLayout>} />
                <Route path={NAVIGATE_GUEST.DONATION_FORM} element={<GuestLayout><DonationFormCard /></GuestLayout>} />             */}
            </Routes>
        </Suspense>
    )
}

export default GuestRoute;