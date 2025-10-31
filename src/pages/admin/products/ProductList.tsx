import { Box, Paper, Grid, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Add, Inventory2Outlined } from "@mui/icons-material";
import { RootState } from "../../../redux/store";
import { showSnackbar } from "../../../redux/reducer/snackbarSlice";
import { openDialog } from "../../../redux/reducer/dialogSlice";
import PageHead from "../../../components/common/page/PageHead";
import CustomPagination from "../../../components/common/table/TablePagination";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import ProductCard from "./ProductCard";
import { MOCK_PRODUCTS } from "./constants/productConstants";

const ProductList: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [productList, setProductList] = useState<any>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [viewMode, setViewMode] = useState<"table" | "cards">("table");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [sortBy, setSortBy] = useState("created_at");
    const [payload, setPayload] = useState({
        offset: 0,
        limit: 15,
        search: "",
        categories: [] as string[],
        status: "all",
        min_price: 0,
        max_price: 10000,
        sort_by: "created_at",
        order_by: "desc",
    });

    const refresh = useSelector((state: RootState) => state.refresh.createProduct);

    useEffect(() => {
        setPayload((prev) => ({
            ...prev,
            search: searchKeyword,
            categories: selectedCategories,
            status: statusFilter,
            min_price: priceRange[0],
            max_price: priceRange[1],
            sort_by: sortBy,
            offset: 0,
        }));
    }, [searchKeyword, selectedCategories, statusFilter, priceRange, sortBy]);

    const getProductList = useCallback(async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProductList(MOCK_PRODUCTS);
        setTotalCount(MOCK_PRODUCTS.length);
        setLoading(false);
    }, [payload, refresh]);

    useEffect(() => {
        getProductList();
    }, [getProductList]);

    const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, newPage: number) => {
        setPayload((prev) => ({ ...prev, offset: newPage - 1 }));
    }, []);

    const handleRowsPerPageChange = useCallback((event: any) => {
        setPayload((prev) => ({
            ...prev,
            limit: Number(event.target.value),
            offset: 0,
        }));
    }, []);

    const handleViewProduct = (product: any) => {
        navigate(`/admin/products/details?uuid=${product.id}`);
    };

    const handleEditProduct = (product: any) => {
        navigate(`/admin/products/edit?uuid=${product.id}`);
    };

    const handleGenerateQR = (product: any) => {
        dispatch(
            showSnackbar({
                type: "info",
                message: `Generating QR code for ${product.name}...`,
            })
        );
    };

    const handleDownloadQR = (product: any) => {
        dispatch(
            showSnackbar({
                type: "success",
                message: `Downloading QR code for ${product.name}`,
            })
        );
    };

    const handleDeleteProduct = (product: any) => {
        dispatch(
            openDialog({
                title: `Delete Product`,
                type: "CommonDeleteDialog",
                isFullScreen: false,
                size: "sm",
                moduleType: "product",
                payload: {
                    data: product.id,
                    request: { id: product.id },
                    url: "product/delete",
                    message: `Are you sure you want to delete ${product.name}? This action cannot be undone.`,
                    refresh: "createProduct",
                },
            })
        );
    };

    const handleCreateProduct = () => {
        navigate("/admin/products/create");
    };

    return (
        <Box>
            <Box sx={{ px: 2 }}>
                <PageHead
                    primary="Product Management"
                    back={<Inventory2Outlined />}
                    secondary={
                        <Button onClick={handleCreateProduct} endIcon={<Add />} variant="contained">
                            Add Product
                        </Button>
                    }
                />
            </Box>

            <Box>
                <Paper sx={{ width: "100%", overflow: "hidden", pb: 1 }}>
                    <ProductFilters
                        searchKeyword={searchKeyword}
                        selectedCategories={selectedCategories}
                        statusFilter={statusFilter}
                        sortBy={sortBy}
                        viewMode={viewMode}
                        onSearchChange={setSearchKeyword}
                        onCategoryChange={setSelectedCategories}
                        onStatusChange={setStatusFilter}
                        onSortChange={setSortBy}
                        onViewModeChange={setViewMode}
                    />

                    {viewMode === "table" && (
                        <ProductTable
                            products={productList}
                            loading={loading}
                            onView={handleViewProduct}
                            onEdit={handleEditProduct}
                            onGenerateQR={handleGenerateQR}
                            onDownloadQR={handleDownloadQR}
                            onDelete={handleDeleteProduct}
                        />
                    )}

                    {viewMode === "cards" && (
                        <Box sx={{ p: 2, minHeight: "calc(90vh - 300px)" }}>
                            <Grid container spacing={3}>
                                {!loading &&
                                    productList.map((product: any) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                            <ProductCard
                                                product={product}
                                                onView={handleViewProduct}
                                                onEdit={handleEditProduct}
                                                onGenerateQR={handleGenerateQR}
                                                onDownloadQR={handleDownloadQR}
                                                onDelete={handleDeleteProduct}
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        </Box>
                    )}

                    <CustomPagination
                        count={totalCount}
                        rowsPerPage={payload.limit}
                        page={payload.offset + 1}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
                </Paper>
            </Box>
        </Box>
    );
};

export default ProductList;
