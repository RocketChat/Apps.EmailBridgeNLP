import { IHttp, ILogger, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IOAuthCredentials } from '../../definition/lib/IOAuthCredentials';
import { IOAuthService } from '../../definition/lib/IOAuthService';
import { OAuthStorage } from '../../storage/OAuthStorage';

export class GoogleOAuthService implements IOAuthService {
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
            this.clientId = await this.settings.get('oauth_client_id');
            this.clientSecret = await this.settings.get('oauth_client_secret');
            this.redirectUri = await this.settings.get('oauth_redirect_uri');

            if (!this.clientId || !this.clientSecret || !this.redirectUri) {
                throw new Error('Missing required OAuth settings. Please configure the OAuth settings in the app configuration.');
            }

            this.initialized = true;
            this.logger.debug('OAuth Service initialized successfully');
        } catch (error) {
            this.logger.error('Failed to initialize OAuth Service:', error);
            throw new Error('Failed to initialize OAuth Service: ' + error.message);
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
        this.logger.debug(`Saving OAuth state for user ${userId}`);
        await this.oauthStorage.saveState(state, userId);
        this.logger.debug(`OAuth state saved successfully for user ${userId}`);
    }

    /**
     * Validate OAuth state and return user info
     */
    public async validateState(state: string): Promise<{userId: string} | undefined> {
        try {
            const result = await this.oauthStorage.validateState(state);
            if (!result) {
                this.logger.debug('OAuth state validation failed');
                return undefined;
            }
            return result;
        } catch (error) {
            this.logger.error('Error validating OAuth state:', error);
            return undefined;
        }
    }

    /**
     * Generate OAuth authorization URL for the user
     */
    public async getAuthorizationUrl(userId: string): Promise<string> {
        this.logger.debug(`Generating OAuth URL for user ${userId}`);

        // Generate a state parameter for security
        const state = this.generateState();

        // Save the state for this user
        await this.saveState(state, userId);

        // Get the authorization URL with the state parameter
        const url = this.getAuthUrl(state);

        this.logger.debug(`OAuth URL generated for user ${userId}`);
        return url;
    }

    /**
     * Generate OAuth authorization URL for Google
     */
    public getAuthUrl(state: string): string {
        const scopes = [
            'https://mail.google.com/',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.compose',
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/gmail.readonly',
            'email',
            'profile'
        ];

        const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        url.searchParams.append('client_id', this.clientId);
        url.searchParams.append('redirect_uri', this.redirectUri);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('access_type', 'offline');
        url.searchParams.append('prompt', 'consent');
        url.searchParams.append('scope', scopes.join(' '));
        url.searchParams.append('state', state);

        return url.toString();
    }

    /**
     * Exchange authorization code for tokens
     */
    public async exchangeCodeForTokens(code: string): Promise<IOAuthCredentials> {
        this.logger.debug('Exchanging authorization code for tokens');

        try {
            if (!this.initialized) {
                await this.initialize();
            }

            const response = await this.http.post('https://oauth2.googleapis.com/token', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                content: `code=${encodeURIComponent(code)}&client_id=${encodeURIComponent(this.clientId)}&client_secret=${encodeURIComponent(this.clientSecret)}&redirect_uri=${encodeURIComponent(this.redirectUri)}&grant_type=authorization_code`,
            });

            if (response.statusCode !== 200) {
                const errorContent = response.content || 'Unknown error';
                this.logger.error(`Failed to exchange code for tokens: HTTP ${response.statusCode}:`, errorContent);
                throw new Error(`Failed to exchange code for tokens: HTTP ${response.statusCode}`);
            }

            const data = JSON.parse(response.content || '{}');

            if (!data.access_token) {
                this.logger.error('No access token in response:', data);
                throw new Error('No access token received from OAuth provider');
            }

            // Get user info to get email
            const userInfo = await this.getUserInfoFromToken(data.access_token);

            if (!userInfo || !userInfo.email) {
                this.logger.error('Failed to get user email from token:', userInfo);
                throw new Error('Failed to get user email from Google');
            }

            this.logger.debug('Successfully obtained tokens and user info');

            return {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                token_type: data.token_type,
                expiry_date: Date.now() + (data.expires_in * 1000),
                scope: data.scope,
                email: userInfo.email
            };
        } catch (error) {
            this.logger.error('Error exchanging code for tokens:', error);
            throw new Error(`Failed to exchange code for tokens: ${error.message}`);
        }
    }

    /**
     * Get user info from Google API using access token
     */
    private async getUserInfoFromToken(accessToken: string): Promise<any> {
        try {
            const response = await this.http.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.statusCode !== 200) {
                throw new Error(`Failed to get user info: HTTP ${response.statusCode}`);
            }

            return JSON.parse(response.content || '{}');
        } catch (error) {
            this.logger.error('Error getting user info:', error);
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
            
            if (!userInfo || !userInfo.email) {
                throw new Error('User info incomplete or missing email');
            }
            
            return userInfo;
        } catch (error) {
            this.logger.error(`Failed to get user info for user ${userId}:`, error);
            throw new Error(`Failed to get user info: ${error.message}`);
        }
    }

    /**
     * Save OAuth credentials for a user
     */
    public async saveCredentials(userId: string, credentials: IOAuthCredentials): Promise<void> {
        this.logger.debug(`Saving OAuth credentials for user ${userId}`);
        await this.oauthStorage.saveCredentials(userId, credentials);
        this.logger.debug(`OAuth credentials saved for user ${userId}`);
    }

    /**
     * Get OAuth credentials for a user
     */
    public async getCredentials(userId: string): Promise<IOAuthCredentials | undefined> {
        try {
            const credentials = await this.oauthStorage.getCredentials(userId);
            this.logger.debug(`Retrieved credentials for user ${userId}: ${credentials ? 'found' : 'not found'}`);
            return credentials;
        } catch (error) {
            this.logger.error(`Error getting credentials for user ${userId}:`, error);
            return undefined;
        }
    }

    /**
     * Delete OAuth credentials for a user
     */
    public async deleteCredentials(userId: string): Promise<void> {
        this.logger.debug(`Deleting OAuth credentials for user ${userId}`);
        await this.oauthStorage.deleteCredentials(userId);
        this.logger.debug(`OAuth credentials deleted for user ${userId}`);
    }

    /**
     * Check if user is authenticated
     */
    public async isAuthenticated(userId: string): Promise<boolean> {
        return await this.oauthStorage.hasCredentials(userId);
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
                this.logger.debug(`Access token expired for user ${userId}, refreshing...`);
                try {
                    const refreshedCredentials = await this.refreshAccessToken(credentials.refresh_token);
                    const updatedCredentials = { ...credentials, ...refreshedCredentials };
                    await this.saveCredentials(userId, updatedCredentials);
                    return updatedCredentials.access_token;
                } catch (error) {
                    this.logger.error('Error refreshing access token:', error);
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
        this.logger.debug('Refreshing access token');

        try {
            if (!this.initialized) {
                await this.initialize();
            }

            const response = await this.http.post('https://oauth2.googleapis.com/token', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                content: `refresh_token=${encodeURIComponent(refreshToken)}&client_id=${encodeURIComponent(this.clientId)}&client_secret=${encodeURIComponent(this.clientSecret)}&grant_type=refresh_token`,
            });

            if (response.statusCode !== 200) {
                throw new Error(`Failed to refresh token: HTTP ${response.statusCode}`);
            }

            const data = JSON.parse(response.content || '{}');

            return {
                access_token: data.access_token,
                expiry_date: Date.now() + (data.expires_in * 1000),
                token_type: data.token_type,
                scope: data.scope,
            };
        } catch (error) {
            this.logger.error('Error refreshing access token:', error);
            throw new Error(`Failed to refresh access token: ${error.message}`);
        }
    }

    /**
     * Revoke OAuth token
     */
    public async revokeToken(userId: string): Promise<boolean> {
        try {
            const credentials = await this.getCredentials(userId);
            if (!credentials) {
                return false;
            }

            // Revoke the token with Google
            if (credentials.access_token) {
                await this.http.post(`https://oauth2.googleapis.com/revoke?token=${credentials.access_token}`);
            }

            // Delete stored credentials
            await this.deleteCredentials(userId);
            this.logger.debug(`Token revoked for user ${userId}`);
            return true;
        } catch (error) {
            this.logger.error('Error revoking token:', error);
            // Even if revoking fails, delete local credentials
            await this.deleteCredentials(userId);
            return true;
        }
    }
} 