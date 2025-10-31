import { Card, CardMedia, CardContent, CardActions, Typography, Box } from "@mui/material";
import CategoryChip from "./chips/CategoryChip";
import StatusChip from "./chips/StatusChip";
import StockChip from "./chips/StockChip";
import ProductActions from "./ProductActions";

interface ProductCardProps {
    product: any;
    onView: (product: any) => void;
    onEdit: (product: any) => void;
    onGenerateQR: (product: any) => void;
    onDownloadQR: (product: any) => void;
    onDelete: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onView,
    onEdit,
    onGenerateQR,
    onDownloadQR,
    onDelete,
}) => (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardMedia
            component="img"
            height="180"
            image={product.thumbnail}
            alt={product.name}
            sx={{ objectFit: "cover", bgcolor: "grey.200" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="caption" color="text.secondary">
                {product.id}
            </Typography>
            <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
                {product.name}
            </Typography>
            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                <CategoryChip category={product.category} />
                <StatusChip status={product.status} />
            </Box>
            <Typography variant="h6" color="primary" fontWeight={700} mb={1}>
                ₹{product.price.toLocaleString()}
            </Typography>
            <StockChip stock={product.stock} />
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0 }}>
            <ProductActions
                product={product}
                onView={onView}
                onEdit={onEdit}
                onGenerateQR={onGenerateQR}
                onDownloadQR={onDownloadQR}
                onDelete={onDelete}
            />
        </CardActions>
    </Card>
);

export default ProductCard;
