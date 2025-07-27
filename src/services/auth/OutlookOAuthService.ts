import { IHttp, ILogger, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IOAuthCredentials, IOAuthService } from '../../definition/auth/IAuth';
import { OAuthStorage } from '../../storage/OAuthStorage';
import {
    MicrosoftOauthUrls,
    MicrosoftOauthScopes,
    OauthConfig,
    ProtocolConstants,
    ContentTypes,
    HttpHeaders
} from '../../constants/constants';
import { Translations } from '../../constants/Translations';

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
                throw new Error(Translations.AUTH_MISSING_OAUTH_SETTINGS);
            }

            this.initialized = true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(Translations.AUTH_OUTLOOK_INITIALIZATION_FAILED + ': ' + errorMessage);
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
        // Handle localhost development - use http for localhost
        let finalRedirectUri = this.redirectUri;
        if (this.redirectUri.includes(ProtocolConstants.LOCALHOST) && this.redirectUri.startsWith(ProtocolConstants.HTTPS)) {
            finalRedirectUri = this.redirectUri.replace(ProtocolConstants.HTTPS, ProtocolConstants.HTTP);
            this.logger.warn(Translations.DEV_HTTPS_TO_HTTP_CONVERSION);
        }

        const url = new URL(MicrosoftOauthUrls.AUTHORIZATION);
        url.searchParams.append('client_id', this.clientId);
        url.searchParams.append('response_type', OauthConfig.RESPONSE_TYPE);
        url.searchParams.append('redirect_uri', finalRedirectUri);
        url.searchParams.append('response_mode', OauthConfig.RESPONSE_MODE);
        url.searchParams.append('scope', MicrosoftOauthScopes.join(' '));
        url.searchParams.append('state', state);
        url.searchParams.append('prompt', OauthConfig.PROMPT_SELECT_ACCOUNT);

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
            if (this.redirectUri.includes(ProtocolConstants.LOCALHOST) && this.redirectUri.startsWith(ProtocolConstants.HTTPS)) {
                finalRedirectUri = this.redirectUri.replace(ProtocolConstants.HTTPS, ProtocolConstants.HTTP);
            }

            const response = await this.http.post(MicrosoftOauthUrls.TOKEN, {
                headers: {
                    [HttpHeaders.CONTENT_TYPE]: ContentTypes.APPLICATION_FORM_URLENCODED,
                },
                content: `code=${encodeURIComponent(code)}&client_id=${encodeURIComponent(this.clientId)}&client_secret=${encodeURIComponent(this.clientSecret)}&redirect_uri=${encodeURIComponent(finalRedirectUri)}&grant_type=${OauthConfig.GRANT_TYPE_AUTHORIZATION_CODE}`,
            });

            if (response.statusCode !== 200) {
                let errorContent: string = Translations.COMMON_UNKNOWN_ERROR;
                try {
                    const errorData = JSON.parse(response.content || '{}');
                    errorContent = errorData.error_description || errorData.error || response.content;
                } catch {
                    errorContent = response.content || Translations.COMMON_UNKNOWN_ERROR;
                }
                throw new Error(`${Translations.COMMON_FAILED_EXCHANGE_CODE}: HTTP ${response.statusCode} - ${errorContent}`);
            }

            const data = JSON.parse(response.content || '{}');

            if (!data.access_token) {
                throw new Error(Translations.AUTH_NO_ACCESS_TOKEN);
            }

            // Get user info to get email
            const userInfo = await this.getUserInfoFromToken(data.access_token);

            if (!userInfo || (!userInfo.mail && !userInfo.userPrincipalName)) {
                throw new Error(Translations.AUTH_NO_USER_EMAIL_MICROSOFT);
            }

            return {
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                token_type: data.token_type || OauthConfig.TOKEN_TYPE_BEARER,
                expiry_date: Date.now() + (data.expires_in * 1000),
                scope: data.scope,
                email: userInfo.mail || userInfo.userPrincipalName
            };
        } catch (error) {
            this.logger.error(Translations.DEV_OUTLOOK_TOKEN_EXCHANGE_FAILED, error);
            throw new Error(`${Translations.AUTH_EXCHANGE_CODE_FAILED}: ${error.message}`);
        }
    }

    /**
     * Get user info from Microsoft Graph API using access token
     */
    private async getUserInfoFromToken(accessToken: string): Promise<any> {
        try {
            const response = await this.http.get(MicrosoftOauthUrls.USER_INFO, {
                headers: {
                    [HttpHeaders.AUTHORIZATION]: `${OauthConfig.AUTHORIZATION_HEADER_PREFIX} ${accessToken}`
                }
            });

            if (response.statusCode !== 200) {
                throw new Error(`${Translations.COMMON_FAILED_GET_USER_INFO}: HTTP ${response.statusCode}`);
            }

            return JSON.parse(response.content || '{}');
        } catch (error) {
            throw new Error(`${Translations.AUTH_GET_USER_INFO_FAILED}: ${error.message}`);
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
                throw new Error(Translations.COMMON_USER_INFO_INCOMPLETE);
            }
            
            return {
                ...userInfo,
                email: userInfo.mail || userInfo.userPrincipalName
            };
        } catch (error) {
            throw new Error(`${Translations.AUTH_GET_USER_INFO_FAILED}: ${error.message}`);
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
            throw new Error(Translations.AUTH_USER_NOT_AUTHENTICATED);
        }

        // Check if token is expired (with buffer)
        if (credentials.expiry_date && (Date.now() + OauthConfig.TOKEN_BUFFER_TIME) >= credentials.expiry_date) {
            if (credentials.refresh_token) {
                try {
                    const refreshedCredentials = await this.refreshAccessToken(credentials.refresh_token);
                    const updatedCredentials = { ...credentials, ...refreshedCredentials };
                    await this.saveCredentials(userId, updatedCredentials);
                    return updatedCredentials.access_token;
                } catch (error) {
                    throw new Error(Translations.AUTH_TOKEN_EXPIRED);
                }
            } else {
                throw new Error(Translations.AUTH_TOKEN_EXPIRED);
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

            const response = await this.http.post(MicrosoftOauthUrls.TOKEN, {
                headers: {
                    [HttpHeaders.CONTENT_TYPE]: ContentTypes.APPLICATION_FORM_URLENCODED,
                },
                content: `client_id=${encodeURIComponent(this.clientId)}&client_secret=${encodeURIComponent(this.clientSecret)}&refresh_token=${encodeURIComponent(refreshToken)}&grant_type=${OauthConfig.GRANT_TYPE_REFRESH_TOKEN}`,
            });

            if (response.statusCode !== 200) {
                throw new Error(`${Translations.COMMON_FAILED_REFRESH_TOKEN}: HTTP ${response.statusCode}`);
            }

            const data = JSON.parse(response.content || '{}');

            if (!data.access_token) {
                throw new Error(Translations.COMMON_NO_ACCESS_TOKEN_REFRESH);
            }

            return {
                access_token: data.access_token,
                refresh_token: data.refresh_token || refreshToken, // Keep old refresh token if new one not provided
                expiry_date: Date.now() + (data.expires_in * 1000),
                scope: data.scope,
            };
        } catch (error) {
            throw new Error(`${Translations.AUTH_REFRESH_TOKEN_FAILED}: ${error.message}`);
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