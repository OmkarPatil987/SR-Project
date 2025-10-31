export const responseDataPermissionUsingRole: any = {
    admin: {
        user_locations: {
            stateCodes: null,
            districts: null,
        },
        user_role: [
            {
                role_slug: "admin",
            },
        ],
        user_department: [],
        user_type: [],
        user_number: [],
        user_role_permission: [
            {
                uuid: "dashboard123",
                parent_id: "0",
                name: "Dashboard",
                slug: "dashboard",
                module_url: "/admin/dashboard",
                icon: "Dashboard",
                module_order: "1",
                is_navigation: 1,
            },
            {
                uuid: "product123",
                parent_id: "0",
                name: "Product",
                slug: "product123121",
                module_url: "/admin/products",
                icon: "Dashboard",
                module_order: "2",
                is_navigation: 1,
            },
            {
                uuid: "users123",
                parent_id: "0",
                name: "Users",
                slug: "user123121",
                module_url: "/admin/users",
                icon: "Dashboard",
                module_order: "2",
                is_navigation: 1,
            },
            {
                uuid: "flood-relief-gallery123",
                parent_id: "0",
                name: "Gallery",
                slug: "flood-relief-gallery",
                module_url: "/admin/flood-relief-gallery",
                icon: "PhotoLibrary",
                module_order: "5",
                is_navigation: 1,
            },
           
        ],
    },
};
