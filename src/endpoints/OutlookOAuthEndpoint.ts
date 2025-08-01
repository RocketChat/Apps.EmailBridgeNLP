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
import { OAuthHtmlTemplates } from '../lib/templates/OAuthHtmlTemplates';
import { getOutlookOAuthSettings } from '../config/SettingsManager';
import { OauthEndpointPaths, ContentTypes, HttpHeaders } from '../constants/AuthConstants';
import { Translations } from '../constants/Translations';
import { t, Language } from '../lib/Translation/translation';

export class OutlookOAuthEndpoint implements IApiEndpoint {
    public path = OauthEndpointPaths.OUTLOOK_CALLBACK;

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
                const errorDescription = request.query.error_description || t(Translations.OAUTH_ENDPOINT_AUTHENTICATION_FAILED, Language.en);
                return this.createErrorResponse(t(Translations.OAUTH_ENDPOINT_OAUTH_ERROR, Language.en, { error, description: errorDescription }));
            }

            if (!code || !state) {
                return this.createErrorResponse(t(Translations.OAUTH_ENDPOINT_MISSING_PARAMETERS, Language.en));
            }

            // Validate the state parameter and get user ID
            const stateInfo = await oauthService.validateState(state);
            if (!stateInfo) {
                return this.createErrorResponse(t(Translations.OAUTH_ENDPOINT_INVALID_STATE, Language.en));
            }

            // Exchange code for tokens
            const credentials = await oauthService.exchangeCodeForTokens(code);

            // Save credentials for the user
            await oauthService.saveCredentials(stateInfo.userId, credentials);

            // Return success page
            return this.createSuccessResponse(credentials.email);

        } catch (error) {
            return this.createErrorResponse(t(Translations.OAUTH_ENDPOINT_GENERAL_ERROR, Language.en, { error: error.message }));
        }
    }

    /**
     * Create error response page
     */
    private createErrorResponse(errorMessage: string): IApiResponse {
        return {
            status: 400,
            headers: {
                [HttpHeaders.CONTENT_TYPE]: ContentTypes.TEXT_HTML,
            },
            content: OAuthHtmlTemplates.createErrorPage(errorMessage, false),
        };
    }

    /**
     * Create success response page
     */
    private createSuccessResponse(email: string): IApiResponse {
        return {
            status: 200,
            headers: {
                [HttpHeaders.CONTENT_TYPE]: ContentTypes.TEXT_HTML,
            },
            content: OAuthHtmlTemplates.createSuccessPage(email, 'Outlook'),
        };
    }
} 