import { IHttp, ILogger, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IEmailSettings, IOAuthService } from '../../definition/auth/IAuth';
import { EmailProviders } from '../../enums/EmailProviders';
import { GoogleOAuthService } from '../auth/GoogleOAuthService';
import { OutlookOAuthService } from '../auth/OutlookOAuthService';
import { getGoogleOAuthSettings, getOutlookOAuthSettings } from '../../config/SettingsManager';
import { AUTH_ERRORS } from '../../constants/AuthConstants';

export class EmailServiceFactory {
    /**
     * Create an OAuth service instance based on the email provider
     */
    public static async createOAuthService(
        provider: EmailProviders,
        http: IHttp,
        persistence: IPersistence,
        read: IRead,
        logger: ILogger
    ): Promise<IOAuthService> {

        switch (provider) {
            case EmailProviders.GMAIL:
                const oauthSettings = await getGoogleOAuthSettings(read.getEnvironmentReader().getSettings());
                const settings = {
                    get: async (key: string) => oauthSettings[key] || ''
                };
                
                const googleOAuthService = new GoogleOAuthService(http, persistence, read, logger, settings);
                await googleOAuthService.initialize();
                return googleOAuthService;

            case EmailProviders.OUTLOOK:
                const outlookOauthSettings = await getOutlookOAuthSettings(read.getEnvironmentReader().getSettings());
                const outlookSettings = {
                    get: async (key: string) => outlookOauthSettings[key] || ''
                };
                
                const outlookOAuthService = new OutlookOAuthService(http, persistence, read, logger, outlookSettings);
                await outlookOAuthService.initialize();
                return outlookOAuthService;

            default:
                throw new Error(`Unsupported email provider: ${provider}`);
        }
    }

    /**
     * Check if a provider is supported for authentication
     */
    public static isProviderSupported(provider: EmailProviders): boolean {
        return provider === EmailProviders.GMAIL || provider === EmailProviders.OUTLOOK;
    }

    /**
     * Get authentication URL for a provider
     */
    public static async getAuthenticationUrl(
        provider: EmailProviders,
        userId: string,
        http: IHttp,
        persistence: IPersistence,
        read: IRead,
        logger: ILogger
    ): Promise<string> {
        if (!this.isProviderSupported(provider)) {
            throw new Error(AUTH_ERRORS.PROVIDER_NOT_SUPPORTED.replace('{provider}', provider));
        }

        const oauthService = await this.createOAuthService(provider, http, persistence, read, logger);
        return await oauthService.getAuthorizationUrl(userId);
    }

    /**
     * Check if user is authenticated with the selected provider
     */
    public static async isUserAuthenticated(
        provider: EmailProviders,
        userId: string,
        http: IHttp,
        persistence: IPersistence,
        read: IRead,
        logger: ILogger
    ): Promise<boolean> {
        if (!this.isProviderSupported(provider)) {
            return false;
        }

        try {
            const oauthService = await this.createOAuthService(provider, http, persistence, read, logger);
            return await oauthService.isAuthenticated(userId);
        } catch (error) {
            return false;
        }
    }

    /**
     * Get user info for authenticated user
     */
    public static async getUserInfo(
        provider: EmailProviders,
        userId: string,
        http: IHttp,
        persistence: IPersistence,
        read: IRead,
        logger: ILogger
    ): Promise<any> {
        if (!this.isProviderSupported(provider)) {
            throw new Error(`Provider ${provider} is not supported`);
        }

        const oauthService = await this.createOAuthService(provider, http, persistence, read, logger);
        return await oauthService.getUserInfo(userId);
    }

    /**
     * Logout user from the selected provider
     */
    public static async logoutUser(
        provider: EmailProviders,
        userId: string,
        http: IHttp,
        persistence: IPersistence,
        read: IRead,
        logger: ILogger
    ): Promise<boolean> {
        if (!this.isProviderSupported(provider)) {
            return false;
        }

        try {
            const oauthService = await this.createOAuthService(provider, http, persistence, read, logger);
            return await oauthService.revokeToken(userId);
        } catch (error) {
            return false;
        }
    }
} 