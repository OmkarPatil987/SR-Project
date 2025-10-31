export interface AuthUserState {
    userDetails: UserDetails | null;
    token: string | null;
    session_expires: string | null;
}

export interface LoginResponse {
    ExpiresAt: string | null;
    Token: string | null;
    User: UserDetails | null;
}
export interface UserDetails {
    id: number;
    uuid: string;
    name: string;
    email: string;
    mobile: string;
    user_type: string;
    reference_user_id: number;
    password: string;
    role_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    department_id: number;
    new_user: boolean;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    user_id: string;
}
export type ForgotPassword = {
    email: string;
}