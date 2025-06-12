export interface IOAuthCredentials {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expiry_date: number;
    scope?: string;
    email: string;
} 