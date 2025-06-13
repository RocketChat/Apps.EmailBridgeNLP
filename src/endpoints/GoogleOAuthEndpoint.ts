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
import { GoogleOAuthService } from '../services/auth/GoogleOAuthService';
import { oauthErrorHtml, oauthSuccessHtml } from '../templates/OAuthHtmlTemplates';

export class GoogleOAuthEndpoint implements IApiEndpoint {
    public path = 'oauth-callback';

    constructor(private readonly app: EmailBridgeNlpApp) {}

    public async get(
        request: IApiRequest,
        endpoint: IApiEndpointInfo,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence
    ): Promise<IApiResponse> {
        try {
            // Initialize OAuth service
            const settings = {
                get: async (key: string) => {
                    const settingsReader = read.getEnvironmentReader().getSettings();
                    return await settingsReader.getValueById(key) as string;
                }
            };

            const oauthService = new GoogleOAuthService(http, persistence, read, this.app.getLogger(), settings);
            await oauthService.initialize();

            // Get code and state from query
            const code = request.query.code;
            const state = request.query.state;

            if (!code || !state) {
                return this.createErrorResponse('Missing required parameters (code or state)');
            }

            // Validate the state parameter and get user ID
            const stateInfo = await oauthService.validateState(state);
            if (!stateInfo) {
                return this.createErrorResponse('Invalid or expired authorization request');
            }

            // Exchange code for tokens
            try {
                const credentials = await oauthService.exchangeCodeForTokens(code);

                // Save credentials
                await oauthService.saveCredentials(stateInfo.userId, credentials);

                // Return success page
                return this.createSuccessResponse(credentials.email);
            } catch (error) {
                return this.createErrorResponse(`Error obtaining access token: ${error.message}`);
            }
        } catch (error) {
            return this.createErrorResponse(`An error occurred: ${error.message}`);
        }
    }

    /**
     * Page shown when authentication fails
     */
    private createErrorResponse(errorMessage: string): IApiResponse {
        return {
            status: 400,
            headers: {
                'Content-Type': 'text/html',
            },
            content: oauthErrorHtml(errorMessage)
        };
    }

    /**
     * Page shown when authentication is successful
     */
    private createSuccessResponse(email: string): IApiResponse {
        return {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
            content: oauthSuccessHtml(email)
        };
    }
} 