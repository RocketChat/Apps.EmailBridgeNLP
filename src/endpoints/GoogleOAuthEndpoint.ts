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
import * as fs from 'fs';
import * as path from 'path';

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
        const logger = this.app.getLogger();
        logger.debug('OAuth callback received', request.query);

        try {
            // Initialize OAuth service
            const settings = {
                get: async (key: string) => {
                    const settingsReader = read.getEnvironmentReader().getSettings();
                    return await settingsReader.getValueById(key) as string;
                }
            };

            const oauthService = new GoogleOAuthService(http, persistence, read, logger, settings);
            await oauthService.initialize();

            // Get code and state from query
            const code = request.query.code;
            const state = request.query.state;

            logger.debug('OAuth callback parameters', { code: !!code, state });

            if (!code || !state) {
                logger.error('Missing code or state parameter');
                return this.createErrorResponse('Missing required parameters (code or state)');
            }

            // Validate the state parameter and get user ID
            const stateInfo = await oauthService.validateState(state);
            if (!stateInfo) {
                logger.error('Invalid or expired state parameter');
                return this.createErrorResponse('Invalid or expired authorization request');
            }

            logger.debug('State validated, user ID:', stateInfo.userId);

            // Exchange code for tokens
            try {
                const credentials = await oauthService.exchangeCodeForTokens(code);

                // Save credentials
                await oauthService.saveCredentials(stateInfo.userId, credentials);
                logger.info(`Credentials saved for user ${stateInfo.userId}`);

                // Return success page
                return this.createSuccessResponse(credentials.email);
            } catch (error) {
                logger.error('Error exchanging code for tokens:', error);
                return this.createErrorResponse(`Error obtaining access token: ${error.message}`);
            }
        } catch (error) {
            logger.error('Error handling OAuth callback:', error);
            return this.createErrorResponse(`An error occurred: ${error.message}`);
        }
    }

    /**
     * Page shown when authentication fails
     */
    private createErrorResponse(errorMessage: string): IApiResponse {
        // Import HTML template from templates folder
        const templatePath = path.join(__dirname, '../templates/oauth-error.html');
        let content = fs.readFileSync(templatePath, 'utf-8');
        
        // Replace placeholder with actual error message
        content = content.replace('{{ERROR_MESSAGE}}', errorMessage);

        return {
            status: 400,
            headers: {
                'Content-Type': 'text/html',
            },
            content
        };
    }

    /**
     * Page shown when authentication is successful
     */
    private createSuccessResponse(email: string): IApiResponse {
        // Import HTML template from templates folder
        const templatePath = path.join(__dirname, '../templates/oauth-success.html');
        let content = fs.readFileSync(templatePath, 'utf-8');
        
        // Replace placeholder with actual email
        content = content.replace('{{USER_EMAIL}}', email);

        return {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
            content
        };
    }
} 