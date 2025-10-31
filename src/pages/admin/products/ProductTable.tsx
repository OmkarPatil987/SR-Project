import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    TableCell,
    Button,
    Avatar,
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import TableHeadList from "../../../components/common/table/TableHeadList";
import CommonTableCell from "../../../components/common/table/CommonTableCell";
import CategoryChip from "./chips/CategoryChip";
import StatusChip from "./chips/StatusChip";
import StockChip from "./chips/StockChip";
import QRStatusChip from "./chips/QRStatusChip";
import ProductActions from "./ProductActions";
import { productHeadCells } from "./constants/productConstants";

interface ProductTableProps {
    products: any[];
    loading: boolean;
    onView: (product: any) => void;
    onEdit: (product: any) => void;
    onGenerateQR: (product: any) => void;
    onDownloadQR: (product: any) => void;
    onDelete: (product: any) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
    products,
    loading,
    onView,
    onEdit,
    onGenerateQR,
    onDownloadQR,
    onDelete,
}) => (
    <TableContainer
        sx={{
            minHeight: "calc(90vh - 160px)",
            maxHeight: "calc(90vh - 160px)",
        }}
    >
        <Table stickyHeader aria-label="Product table" size="small" sx={{ minWidth: 750, tableLayout: "fixed" }}>
            <TableHeadList headCells={productHeadCells} />
            {loading && (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={productHeadCells.length} style={{ padding: 0 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    minHeight: "300px",
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        </TableCell>
                    </TableRow>
                </TableBody>
            )}

            <TableBody>
                {!loading && products.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={productHeadCells.length} style={{ textAlign: "center" }}>
                            <Typography variant="body1" color="textSecondary">
                                No products found
                            </Typography>
                        </TableCell>
                    </TableRow>
                )}
                {!loading &&
                    products.length > 0 &&
                    products.map((product: any) => (
                        <TableRow key={product.id} hover>
                            <CommonTableCell
                                value={
                                    <ProductActions
                                        variant="table"
                                        product={product}
                                        onView={onView}
                                        onEdit={onEdit}
                                        onGenerateQR={onGenerateQR}
                                        onDownloadQR={onDownloadQR}
                                        onDelete={onDelete}
                                    />
                                }
                            />
                            <CommonTableCell
                                style={{
                                    width: "150px",
                                    position: "sticky",
                                    left: 0,
                                    zIndex: 4,
                                    background: "#fff",
                                }}
                                value={
                                    <Button variant="text" size="small" sx={{ p: 0 }} onClick={() => onView(product)}>
                                        {product.id}
                                    </Button>
                                }
                            />
                            <CommonTableCell
                                value={
                                    <Avatar
                                        src={product.thumbnail}
                                        variant="rounded"
                                        sx={{ width: 50, height: 50 }}
                                    />
                                }
                            />
                            <CommonTableCell value={product.name} />
                            <CommonTableCell value={<CategoryChip category={product.category} />} />
                            <CommonTableCell value={`₹${product.price.toLocaleString()}`} />
                            <CommonTableCell style={{ textAlign: "center" }} value={<StockChip stock={product.stock} />} />
                            <CommonTableCell
                                style={{ textAlign: "center" }}
                                value={<StatusChip status={product.status} />}
                            />
                            <CommonTableCell
                                style={{ textAlign: "center" }}
                                value={<QRStatusChip generated={product.qr_generated} />}
                            />
                            <CommonTableCell value={dayjs(product.created_at).format("DD MMM YYYY")} />
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default ProductTable;
