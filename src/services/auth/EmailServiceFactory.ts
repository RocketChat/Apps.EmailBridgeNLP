import { IHttp, ILogger, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IEmailSettings } from '../../definition/lib/IEmailSettings';
import { EmailProviders } from '../../enums/EmailProviders';
import { GoogleOAuthService } from '../auth/GoogleOAuthService';
import { IOAuthService } from '../../definition/lib/IOAuthService';
import { getGoogleOAuthSettings } from '../../config/SettingsManager';

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
        logger.debug('EmailServiceFactory.createOAuthService -> Creating OAuth service for provider:', provider);

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
                throw new Error(`🚧 **Outlook authentication is coming soon!**\n\nFor now, please use **Gmail** for email authentication.\n\nChange your email provider to Gmail in the app settings to get started.`);

            default:
                throw new Error(`Unsupported email provider: ${provider}`);
        }
    }

    /**
     * Check if a provider is supported for authentication
     */
    public static isProviderSupported(provider: EmailProviders): boolean {
        return provider === EmailProviders.GMAIL;
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
            if (provider === EmailProviders.OUTLOOK) {
                throw new Error(`🚧 **Outlook authentication is coming soon!**\n\nFor now, please use **Gmail** for email authentication.`);
            }
            throw new Error(`Authentication for ${provider} is not yet implemented. Please use Gmail.`);
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
            logger.error('Error checking authentication status:', error);
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
            logger.error('Error during logout:', error);
            return false;
        }
    }
} 