
export const productHeadCells: any = [
    { id: "action", label: "Action", width: "80px" },
    {
        id: "product_id",
        label: "Product ID",
        width: "150px",
        isSticky: { position: "left", positionStart: "0", zIndex: 5 },
    },
    { id: "thumbnail", label: "Image", width: "100px" },
    { id: "name", label: "Product Name", width: "240px" },
    { id: "category", label: "Category", width: "150px" },
    { id: "price", label: "Price", width: "120px" },
    { id: "stock", label: "Stock", width: "120px", align: "center" },
    { id: "status", label: "Status", width: "120px", align: "center" },
    { id: "qr_status", label: "QR Status", width: "130px", align: "center" },
    { id: "created_at", label: "Created At", width: "150px" },
];

export const PRODUCT_CATEGORIES = ["Electronics", "Furniture", "Clothing", "Books", "Toys"];

export const SORT_OPTIONS = [
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
    { value: "created_at", label: "Created Date" },
    { value: "stock", label: "Stock" },
];

export const MOCK_PRODUCTS = [
    {
        id: "PRD-001",
        name: "Wireless Mouse XZ-200",
        category: "Electronics",
        price: 1299,
        stock: 150,
        status: "active",
        qr_generated: true,
        thumbnail: "/images/product-placeholder.png",
        created_at: "2025-10-25",
    },
    {
        id: "PRD-002",
        name: "Office Chair Pro",
        category: "Furniture",
        price: 8999,
        stock: 45,
        status: "active",
        qr_generated: true,
        thumbnail: "/images/product-placeholder.png",
        created_at: "2025-10-24",
    },
    {
        id: "PRD-003",
        name: "USB-C Cable 3m",
        category: "Electronics",
        price: 299,
        stock: 0,
        status: "inactive",
        qr_generated: false,
        thumbnail: "/images/product-placeholder.png",
        created_at: "2025-10-23",
    },
];
