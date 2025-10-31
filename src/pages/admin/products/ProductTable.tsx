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
    Stack,
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

// Dummy Product Data with Image Links


const ProductTable: React.FC<ProductTableProps> = ({
    products ,
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
        <Table
            stickyHeader
            aria-label="Product table"
            size="small"
            sx={{ minWidth: 1200, tableLayout: "auto" }}
        >
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
                        <TableCell colSpan={productHeadCells.length} style={{ textAlign: "center", padding: "40px 20px" }}>
                            <Typography variant="body1" color="textSecondary">
                                No products found
                            </Typography>
                        </TableCell>
                    </TableRow>
                )}
                {!loading &&
                    products.length > 0 &&
                    products.map((product: any) => (
                        <TableRow
                            key={product.id}
                            hover
                            sx={{
                                "&:hover": {
                                    backgroundColor: "action.hover",
                                },
                            }}
                        >
                            {/* Actions */}
                            <TableCell
                                align="center"
                                sx={{
                                    padding: "12px 8px",
                                    width: "80px",
                                    minWidth: "80px",
                                }}
                            >
                                <ProductActions
                                    variant="table"
                                    product={product}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onGenerateQR={onGenerateQR}
                                    onDownloadQR={onDownloadQR}
                                    onDelete={onDelete}
                                />
                            </TableCell>

                            {/* Product ID */}
                            <TableCell
                                sx={{
                                    padding: "12px 8px",
                                    width: "120px",
                                    minWidth: "120px",
                                    position: "sticky",
                                    left: 80,
                                    zIndex: 4,
                                    backgroundColor: "background.paper",
                                }}
                            >
                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{
                                        p: 0,
                                        fontSize: "0.85rem",
                                        fontWeight: 600,
                                        color: "primary.main",
                                        textTransform: "none",
                                        "&:hover": {
                                            textDecoration: "underline",
                                            backgroundColor: "transparent",
                                        },
                                    }}
                                    onClick={() => onView(product)}
                                >
                                    {product.id}
                                </Button>
                            </TableCell>

                            {/* Image + Name Combined */}
                            <TableCell
                                sx={{
                                    padding: "8px 12px",
                                    width: "280px",
                                    minWidth: "280px",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        cursor: "pointer",
                                        "&:hover .product-name": {
                                            color: "primary.main",
                                        },
                                    }}
                                    onClick={() => onView(product)}
                                >
                                    <Box
                                        sx={{
                                            flexShrink: 0,
                                            width: 60,
                                            height: 60,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "grey.100",
                                            borderRadius: 1,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <img
                                            src={product.thumbnail}
                                            alt={product.name}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                            }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            className="product-name"
                                            sx={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                transition: "color 0.2s",
                                                color: "text.primary",
                                            }}
                                            title={product.name}
                                        >
                                            {product.name}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            sx={{
                                                display: "block",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                            title={product.brand}
                                        >
                                            {product.brand || "No Brand"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>

                            {/* Category */}
                            <TableCell
                                sx={{
                                    padding: "12px 8px",
                                    width: "140px",
                                    minWidth: "140px",
                                }}
                            >
                                <CategoryChip category={product.category} />
                            </TableCell>

                            {/* Price */}
                            <TableCell
                                sx={{
                                    padding: "12px 8px",
                                    width: "120px",
                                    minWidth: "120px",
                                }}
                            >
                                <Typography variant="body2" fontWeight={600} color="success.main">
                                    ₹{product.price.toLocaleString()}
                                </Typography>
                            </TableCell>

                            {/* Stock */}
                            <TableCell
                                align="center"
                                sx={{
                                    padding: "12px 8px",
                                    width: "100px",
                                    minWidth: "100px",
                                }}
                            >
                                <StockChip stock={product.stock} />
                            </TableCell>

                            {/* Status */}
                            <TableCell
                                align="center"
                                sx={{
                                    padding: "12px 8px",
                                    width: "110px",
                                    minWidth: "110px",
                                }}
                            >
                                <StatusChip status={product.status} />
                            </TableCell>

                            {/* QR Status */}
                            <TableCell
                                align="center"
                                sx={{
                                    padding: "12px 8px",
                                    width: "100px",
                                    minWidth: "100px",
                                }}
                            >
                                <QRStatusChip generated={product.qr_generated} />
                            </TableCell>

                            {/* Created Date */}
                            <TableCell
                                sx={{
                                    padding: "12px 8px",
                                    width: "130px",
                                    minWidth: "130px",
                                }}
                            >
                                <Typography variant="body2">
                                    {dayjs(product.created_at).format("DD MMM YYYY")}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    </TableContainer>
);

export default ProductTable;
