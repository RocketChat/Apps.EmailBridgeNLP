import { IHttp, ILogger, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IEmailSettings, IOAuthService } from '../../definition/auth/IAuth';
import { EmailProviders } from '../../enums/EmailProviders';
import { GoogleOAuthService } from '../auth/GoogleOAuthService';
import { OutlookOAuthService } from '../auth/OutlookOAuthService';
import { getGoogleOAuthSettings, getOutlookOAuthSettings } from '../../config/SettingsManager';
import { Translations } from '../../constants/Translations';
import { IEmailStatistics, IEmailStatsParams } from '../../definition/lib/IEmailStatistics';
import { GmailService } from '../email/GmailService';
import { OutlookService } from '../email/OutlookService';
import { t, Language } from '../../lib/Translation/translation';
import { getProviderDisplayName } from '../../enums/ProviderDisplayNames';

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
                throw new Error(`${Translations.COMMON_UNSUPPORTED_PROVIDER}: ${provider}`);
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
            throw new Error(Translations.AUTH_PROVIDER_NOT_SUPPORTED.replace('{provider}', provider));
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
            
            // Don't just check if authenticated, but actually try to get a valid token
            // This will automatically refresh expired tokens or fail if refresh is not possible
            await oauthService.getValidAccessToken(userId);
            return true;
        } catch (error) {
            // If we can't get a valid access token, user is not properly authenticated
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
            throw new Error(`${Translations.COMMON_UNSUPPORTED_PROVIDER}: ${provider}`);
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

    /**
     * Get email statistics for the specified time period
     */
    public static async getEmailStatistics(
        provider: EmailProviders,
        params: IEmailStatsParams,
        http: IHttp,
        persistence: IPersistence,
        read: IRead,
        logger: ILogger,
        language: Language = Language.en
    ): Promise<IEmailStatistics> {
        if (!this.isProviderSupported(provider)) {
            throw new Error(t(Translations.STATISTICS_PROVIDER_NOT_SUPPORTED, language, { provider }));
        }

        const oauthService = await this.createOAuthService(provider, http, persistence, read, logger);
        
        let userInfo;
        try {
            userInfo = await oauthService.getUserInfo(params.userId);
        } catch (error) {
            const providerName = getProviderDisplayName(provider);
            throw new Error(t(Translations.REPORT_TOKEN_EXPIRED, language, { provider: providerName }));
        }
        
        switch (provider) {
            case EmailProviders.GMAIL:
                const gmailService = new GmailService(oauthService, http, logger);
                return await gmailService.getEmailStatistics(params, userInfo, language);
            case EmailProviders.OUTLOOK:
                const outlookService = new OutlookService(oauthService, http, logger);
                return await outlookService.getEmailStatistics(params, userInfo, language);
            default:
                throw new Error(t(Translations.STATISTICS_NOT_IMPLEMENTED, language, { provider }));
        }
    }
} 