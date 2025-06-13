import { EmailProviders } from '../../enums/EmailProviders';

/**
 * OAuth credentials interface for token storage
 */
export interface IOAuthCredentials {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expiry_date: number;
    scope?: string;
    email: string;
}

/**
 * OAuth service interface for authentication operations
 */
export interface IOAuthService {
    initialize(): Promise<void>;
    isAuthenticated(userId: string): Promise<boolean>;
    getAuthorizationUrl(userId: string): Promise<string>;
    getUserInfo(userId: string): Promise<any>;
    getValidAccessToken(userId: string): Promise<string>;
    saveCredentials(userId: string, credentials: IOAuthCredentials): Promise<void>;
    getCredentials(userId: string): Promise<IOAuthCredentials | undefined>;
    deleteCredentials(userId: string): Promise<void>;
    revokeToken(userId: string): Promise<boolean>;
    exchangeCodeForTokens(code: string): Promise<IOAuthCredentials>;
    validateState(state: string): Promise<{userId: string} | undefined>;
    refreshAccessToken(refreshToken: string): Promise<Partial<IOAuthCredentials>>;
}

/**
 * Email settings interface for provider configuration
 */
export interface IEmailSettings {
    email: string;
    provider: EmailProviders;
} 