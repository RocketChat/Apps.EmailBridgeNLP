import { IHttp, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { IOAuthService } from '../../definition/auth/IAuth';
import { IEmailStatistics, IEmailStatsParams } from '../../definition/lib/IEmailStatistics';
import { t, Language } from '../../lib/Translation/translation';
import { getProviderDisplayName } from '../../enums/ProviderDisplayNames';
import { EmailProviders } from '../../enums/EmailProviders';
import { Translations } from '../../constants/Translations';

export class GmailService {
    private oauthService: IOAuthService;
    private http: IHttp;
    private logger: ILogger;

    constructor(oauthService: IOAuthService, http: IHttp, logger: ILogger) {
        this.oauthService = oauthService;
        this.http = http;
        this.logger = logger;
    }

    /**
     * Get Gmail email statistics for the specified time period
     */
    public async getEmailStatistics(params: IEmailStatsParams, userInfo: any, language: Language = Language.en): Promise<IEmailStatistics> {
        try {
            const accessToken = await this.oauthService.getValidAccessToken(params.userId);
            
            // Calculate time range for last 24 hours
            const now = new Date();
            const yesterday = new Date(now.getTime() - (params.hoursBack * 60 * 60 * 1000));
            const timeQuery = `after:${Math.floor(yesterday.getTime() / 1000)}`;
            
            // Get all emails in the last 24 hours
            const allEmailsResponse = await this.http.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(timeQuery)}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            // Get unread emails count from the last 24 hours
            const unreadResponse = await this.http.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(`is:unread ${timeQuery}`)}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            // Get received emails in the last 24 hours (inbox)
            const receivedResponse = await this.http.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(`in:inbox ${timeQuery}`)}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            // Get sent emails in the last 24 hours
            const sentResponse = await this.http.get(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(`in:sent ${timeQuery}`)}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            // Check for API errors
            if (allEmailsResponse.statusCode === 401 || unreadResponse.statusCode === 401 || 
                receivedResponse.statusCode === 401 || sentResponse.statusCode === 401) {
                const providerName = getProviderDisplayName(EmailProviders.GMAIL);
                throw new Error(t(Translations.REPORT_TOKEN_EXPIRED, language, { provider: providerName }));
            }

            const allEmailsData = JSON.parse(allEmailsResponse.content || '{}');
            const unreadData = JSON.parse(unreadResponse.content || '{}');
            const receivedData = JSON.parse(receivedResponse.content || '{}');
            const sentData = JSON.parse(sentResponse.content || '{}');

            const totalEmails = allEmailsData.resultSizeEstimate || 0;
            const unreadEmails = unreadData.resultSizeEstimate || 0;
            const receivedToday = receivedData.resultSizeEstimate || 0;
            const sentToday = sentData.resultSizeEstimate || 0;
            const readEmails = Math.max(0, totalEmails - unreadEmails);

            return {
                totalEmails,
                unreadEmails,
                readEmails,
                receivedToday,
                sentToday,
                timeRange: `Last ${params.hoursBack} hours`,
                emailAddress: userInfo.email,
                provider: 'Gmail'
            };

        } catch (error) {
            this.logger.error('Gmail statistics error:', error);
            
            // Provide more specific error messages
            if (error.message.includes('expired') || error.message.includes('authentication') ||
                error.message.includes('TOKEN_EXPIRED') || error.message.includes('USER_NOT_AUTHENTICATED')) {
                const providerName = getProviderDisplayName(EmailProviders.GMAIL);
                throw new Error(t(Translations.REPORT_TOKEN_EXPIRED, language, { provider: providerName }));
            }
            
            throw new Error(`Failed to get Gmail statistics: ${error.message}`);
        }
    }

    // Future methods will be added here:
    // public async sendEmail(params: ISendEmailParams): Promise<boolean> { ... }
    // public async searchEmails(params: ISearchParams): Promise<IEmailSearchResult[]> { ... }
    // public async getEmailContent(messageId: string): Promise<IEmailContent> { ... }
}
