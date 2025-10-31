export const USER_TYPE = {
    HOME: '/',
    GUEST: '',
    ADMIN: '/admin',
} as const;

export const NAVIGATE_AUTH = {
    AUTH: '/auth',
    LOGIN: '/login',
    LOGOUT: '/logout',
    get LOGIN_PAGE() { return `${NAVIGATE_AUTH.AUTH}${NAVIGATE_AUTH.LOGIN}`; },
    get LOGOUT_PAGE() { return `${NAVIGATE_AUTH.AUTH}${NAVIGATE_AUTH.LOGOUT}`; },
} as const;

export const ERROR = {
    ERROR_403: '/403',
    get ERROR_403_PAGE() { return ERROR.ERROR_403; },
} as const;

export const NAVIGATE_MODULES = {
    DASHBOARD: '/dashboard',
    ADMIN: '/admin',
} as const;



export const NAVIGATE_ADMIN = {
    DASHBAORD: '/dashboard',
    PRODUCT :'/products',
    PRODUCT_CREATE :'/products/create',
    PRODUCT_DETAILS :'/products/details',
    get DASHBOARD_PAGE() { return `${NAVIGATE_MODULES.ADMIN}${this.DASHBAORD}`; },
  
}

export const UserTypeWisePagesConfig: Record<keyof typeof USER_TYPE, string[]> = {
    HOME: [],
    GUEST: [],
    ADMIN: [USER_TYPE.ADMIN],
};

export const NAVIGATE_GUEST = {
    HOME: "/home",

}