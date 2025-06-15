import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    IApiEndpoint,
    IApiEndpointInfo,
    IApiRequest,
    IApiResponse,
} from '@rocket.chat/apps-engine/definition/api';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { OutlookOAuthService } from '../services/auth/OutlookOAuthService';
import { OAuthHtmlTemplates } from '../templates/OAuthHtmlTemplates';
import { getOutlookOAuthSettings } from '../config/SettingsManager';

export class OutlookOAuthEndpoint implements IApiEndpoint {
    public path = 'outlook-oauth-callback';

    constructor(private readonly app: EmailBridgeNlpApp) {}

    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence,
    ): Promise<IApiResponse> {
        try {
            // Initialize OAuth service
            const oauthSettings = await getOutlookOAuthSettings(read.getEnvironmentReader().getSettings());
            const settings = {
                get: async (key: string) => oauthSettings[key] || ''
            };

            const oauthService = new OutlookOAuthService(http, persistence, read, this.app.getLogger(), settings);
            await oauthService.initialize();

            // Get code and state from query parameters
            const code = request.query.code;
            const state = request.query.state;
            const error = request.query.error;

            // Handle OAuth errors
            if (error) {
                const errorDescription = request.query.error_description || 'Authentication failed';
                return this.createErrorResponse(`OAuth Error: ${error} - ${errorDescription}`);
            }

            if (!code || !state) {
                return this.createErrorResponse('Missing required parameters (code or state)');
            }

            // Validate the state parameter and get user ID
            const stateInfo = await oauthService.validateState(state);
            if (!stateInfo) {
                return this.createErrorResponse('Invalid or expired state parameter');
            }

            // Exchange code for tokens
            const credentials = await oauthService.exchangeCodeForTokens(code);

            // Save credentials for the user
            await oauthService.saveCredentials(stateInfo.userId, credentials);

            // Return success page
            return this.createSuccessResponse(credentials.email);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            
            // Enhanced error messaging for common issues
            let enhancedMessage = errorMessage;
            const currentUri = `${endpoint.basePath}/${this.path}`;
            
            if (errorMessage.toLowerCase().includes('redirect_uri_mismatch')) {
                enhancedMessage = `Redirect URI mismatch. Please ensure your Azure app registration includes the exact URI: ${currentUri}`;
            } else if (errorMessage.toLowerCase().includes('ssl') || errorMessage.toLowerCase().includes('protocol')) {
                enhancedMessage = `SSL/TLS Protocol Error. For localhost development, ensure Azure app registration includes HTTP (not HTTPS) redirect URI. Check your redirect URI configuration in Azure Portal.`;
            }
            
            return this.createErrorResponse(`Authentication failed: ${enhancedMessage}`);
        }
    }

    /**
     * Create error response page
     */
    private createErrorResponse(errorMessage: string): IApiResponse {
        const isSSLError = errorMessage.toLowerCase().includes('ssl') || errorMessage.toLowerCase().includes('protocol');
        return {
            status: 400,
            headers: {
                'Content-Type': 'text/html',
            },
            content: OAuthHtmlTemplates.createErrorPage(errorMessage, isSSLError),
        };
    }

    /**
     * Create success response page
     */
    private createSuccessResponse(email: string): IApiResponse {
        return {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
            content: OAuthHtmlTemplates.createSuccessPage(email, 'Outlook'),
        };
    }
} 