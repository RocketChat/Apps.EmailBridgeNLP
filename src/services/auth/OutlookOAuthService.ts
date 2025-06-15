import { IHttp, ILogger, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IOAuthCredentials, IOAuthService } from '../../definition/auth/IAuth';
import { OAuthStorage } from '../../storage/OAuthStorage';

export class OutlookOAuthService implements IOAuthService {
    private clientId: string = '';
    private clientSecret: string = '';
    private redirectUri: string = '';
    private initialized: boolean = false;
    private oauthStorage: OAuthStorage;

    constructor(
        private readonly http: IHttp,
        private readonly persistence: IPersistence,
        private readonly read: IRead,
        private readonly logger: ILogger,
        private readonly settings: any
    ) {
        this.oauthStorage = new OAuthStorage(persistence, read.getPersistenceReader());
    }

    /**
     * Initialize the service with settings
     */
    public async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        try {
            this.clientId = await this.settings.get('outlook_client_id');
            this.clientSecret = await this.settings.get('outlook_client_secret');
            this.redirectUri = await this.settings.get('outlook_redirect_uri');

            if (!this.clientId || !this.clientSecret || !this.redirectUri) {
                throw new Error('Missing required Outlook OAuth settings. Please configure the Outlook OAuth settings in the app configuration.');
            }

            this.initialized = true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error('Failed to initialize Outlook OAuth Service: ' + errorMessage);
        }
    }

    /**
     * Generate a random state string for OAuth security
     */
    public generateState(): string {
        return Math.random().toString(36).substring(2, 15) +
               Math.random().toString(36).substring(2, 15);
    }

    /**
     * Save the OAuth state for a user
     */
    public async saveState(state: string, userId: string): Promise<void> {
        await this.oauthStorage.saveState(state, userId);
    }

    /**
     * Validate OAuth state and return user info
     */
    public async validateState(state: string): Promise<{userId: string} | undefined> {
        try {
            const result = await this.oauthStorage.validateState(state);
            if (!result) {
                return undefined;
            }
            return result;
        } catch (error) {
            return undefined;
        }
    }

    /**
     * Generate OAuth authorization URL for the user
     */
    public async getAuthorizationUrl(userId: string): Promise<string> {
        // Generate a state parameter for security
        const state = this.generateState();

        // Save the state for this user
        await this.saveState(state, userId);

        // Get the authorization URL with the state parameter
        const url = this.getAuthUrl(state);

        return url;
    }

    /**
     * Generate OAuth authorization URL for Microsoft/Outlook
     */
    public getAuthUrl(state: string): string {
        const scopes = [
            'https://graph.microsoft.com/Mail.ReadWrite',
            'https://graph.microsoft.com/Mail.Send',
            'https://graph.microsoft.com/User.Read',
            'offline_access'
        ];

        // Handle localhost development - use http for localhost
        let finalRedirectUri = this.redirectUri;
        if (this.redirectUri.includes('localhost') && this.redirectUri.startsWith('https://')) {
            finalRedirectUri = this.redirectUri.replace('https://', 'http://');
            this.logger.warn('Development mode: Converting HTTPS redirect URI to HTTP for localhost');
        }

        const url = new URL('https://login.microsoftonline.com/common/oauth2/v2.0/authorize');
        url.searchParams.append('client_id', this.clientId);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('redirect_uri', finalRedirectUri);
        url.searchParams.append('response_mode', 'query');
        url.searchParams.append('scope', scopes.join(' '));
        url.searchParams.append('state', state);
        url.searchParams.append('prompt', 'select_account'); // Always show account selector

        return url.toString();
    }

    /**
     * Exchange authorization code for tokens
     */
    public async exchangeCodeForTokens(code: string): Promise<IOAuthCredentials> {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            // Handle localhost development - use http for localhost
            let finalRedirectUri = this.redirectUri;
            if (this.redirectUri.includes('localhost') && this.redirectUri.startsWith('https://')) {
                finalRedirectUri = this.redirectUri.replace('https://', 'http://');
            }

            const response = await this.http.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                content: `code=${encodeURIComponent(code)}&client_id=${encodeURIComponent(this.clientId)}&client_secret=${encodeURIComponent(this.clientSecret)}&redirect_uri=${encodeURIComponent(finalRedirectUri)}&grant_type=authorization_code`,
            });

            if (response.statusCode !== 200) {
                let errorContent = 'Unknown error';
                try {
                    const errorData = JSON.parse(response.content || '{}');
                    errorContent = errorData.error_description || errorData.error || response.content;
                } catch {
                    errorContent = response.content || 'Unknown error';
                }
                throw new Error(`Failed to exchange code for tokens: HTTP ${response.statusCode} - ${errorContent}`);
            }

            const data = JSON.parse(response.content || '{}');

            if (!data.access_token) {
                throw new Error('No access token received from OAuth provider');
            }

            // Get user info to get email
            const userInfo = await this.getUserInfoFromToken(data.access_token);

            if (!userInfo || (!userInfo.mail && !userInfo.userPrincipalName)) {
                throw new Error('Failed to get user email from Microsoft');
            }

            return {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                token_type: data.token_type || 'Bearer',
                expiry_date: Date.now() + (data.expires_in * 1000),
                scope: data.scope,
                email: userInfo.mail || userInfo.userPrincipalName
            };
        } catch (error) {
            this.logger.error('Outlook OAuth token exchange failed:', error);
            throw new Error(`Failed to exchange code for tokens: ${error.message}`);
        }
    }

    /**
     * Get user info from Microsoft Graph API using access token
     */
    private async getUserInfoFromToken(accessToken: string): Promise<any> {
        try {
            const response = await this.http.get('https://graph.microsoft.com/v1.0/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.statusCode !== 200) {
                throw new Error(`Failed to get user info: HTTP ${response.statusCode}`);
            }

            return JSON.parse(response.content || '{}');
        } catch (error) {
            throw new Error(`Failed to get user info: ${error.message}`);
        }
    }

    /**
     * Get user info using stored credentials
     */
    public async getUserInfo(userId: string): Promise<any> {
        try {
            const accessToken = await this.getValidAccessToken(userId);
            const userInfo = await this.getUserInfoFromToken(accessToken);
            
            if (!userInfo || (!userInfo.mail && !userInfo.userPrincipalName)) {
                throw new Error('User info incomplete or missing email');
            }
            
            return {
                ...userInfo,
                email: userInfo.mail || userInfo.userPrincipalName
            };
        } catch (error) {
            throw new Error(`Failed to get user info: ${error.message}`);
        }
    }

    /**
     * Save OAuth credentials for a user
     */
    public async saveCredentials(userId: string, credentials: IOAuthCredentials): Promise<void> {
        await this.oauthStorage.saveCredentials(userId, credentials);
    }

    /**
     * Get OAuth credentials for a user
     */
    public async getCredentials(userId: string): Promise<IOAuthCredentials | undefined> {
        try {
            return await this.oauthStorage.getCredentials(userId);
        } catch (error) {
            return undefined;
        }
    }

    /**
     * Delete OAuth credentials for a user 
     */
    public async deleteCredentials(userId: string): Promise<void> {
        await this.oauthStorage.deleteCredentials(userId);
    }

    /**
     * Check if user is authenticated
     */
    public async isAuthenticated(userId: string): Promise<boolean> {
        const credentials = await this.getCredentials(userId);
        return credentials !== undefined && credentials.access_token !== undefined;
    }

    /**
     * Get valid access token (refresh if necessary)
     */
    public async getValidAccessToken(userId: string): Promise<string> {
        const credentials = await this.getCredentials(userId);
        
        if (!credentials) {
            throw new Error('User not authenticated, please use /email login to connect your email account');
        }

        // Check if token is expired (with 5-minute buffer)
        const bufferTime = 5 * 60 * 1000; // 5 minutes
        if (credentials.expiry_date && (Date.now() + bufferTime) >= credentials.expiry_date) {
            if (credentials.refresh_token) {
                try {
                    const refreshedCredentials = await this.refreshAccessToken(credentials.refresh_token);
                    const updatedCredentials = { ...credentials, ...refreshedCredentials };
                    await this.saveCredentials(userId, updatedCredentials);
                    return updatedCredentials.access_token;
                } catch (error) {
                    throw new Error('Your authentication has expired. Please use /email login to reconnect your account');
                }
            } else {
                throw new Error('Your authentication has expired. Please use /email login to reconnect your account');
            }
        }

        return credentials.access_token;
    }

    /**
     * Refresh access token using refresh token
     */
    public async refreshAccessToken(refreshToken: string): Promise<Partial<IOAuthCredentials>> {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            const response = await this.http.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                content: `client_id=${encodeURIComponent(this.clientId)}&client_secret=${encodeURIComponent(this.clientSecret)}&refresh_token=${encodeURIComponent(refreshToken)}&grant_type=refresh_token`,
            });

            if (response.statusCode !== 200) {
                throw new Error(`Failed to refresh token: HTTP ${response.statusCode}`);
            }

            const data = JSON.parse(response.content || '{}');

            if (!data.access_token) {
                throw new Error('No access token received when refreshing');
            }

            return {
                access_token: data.access_token,
                refresh_token: data.refresh_token || refreshToken, // Keep old refresh token if new one not provided
                expiry_date: Date.now() + (data.expires_in * 1000),
                scope: data.scope,
            };
        } catch (error) {
            throw new Error(`Failed to refresh access token: ${error.message}`);
        }
    }

    /**
     * Revoke access token for a user
     */
    public async revokeToken(userId: string): Promise<boolean> {
        try {
            const credentials = await this.getCredentials(userId);
            if (!credentials) {
                return true; // Already not authenticated
            }

            // Microsoft doesn't have a specific revoke endpoint for personal accounts
            // So we just delete the stored credentials
            await this.deleteCredentials(userId);
            return true;
        } catch (error) {
            return false;
        }
    }
} 