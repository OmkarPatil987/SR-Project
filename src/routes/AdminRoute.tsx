import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import LoaderText from '../components/loader/LoaderText';
import Error404 from '../pages/error/Error404';
import AdminLayout from '../layout/AdminLayout';
import { NAVIGATE_ADMIN } from '../constant';
import ProductForm from '../pages/admin/products/Components/CreateProduct';
import ProductDetail from '../pages/admin/products/Components/ProductDetails';
import ProductList from '../pages/admin/products/ProductList';


const DashboardPage = lazy(() => import('../pages/admin/dashboard'))


const AdminRoute = () => {
    return (
        <Suspense fallback={<AdminLayout><LoaderText /></AdminLayout>}>
            <AdminLayout>
                <Routes>
                    <Route path='*' element={<Error404 />} />
                    <Route path={NAVIGATE_ADMIN.DASHBAORD} element={<DashboardPage />} />
                    <Route path={NAVIGATE_ADMIN.PRODUCT} element={<ProductList />} />
                    <Route path={NAVIGATE_ADMIN.PRODUCT_CREATE} element={<ProductForm />} />
                    <Route path={NAVIGATE_ADMIN.PRODUCT_DETAILS} element={<ProductDetail />} />

                    {/* <Route path={NAVIGATE_ADMIN.STATASTICS} element={<Statastics />} /> */}
                </Routes>
            </AdminLayout>
        </Suspense>
    );
};

export default AdminRoute;
