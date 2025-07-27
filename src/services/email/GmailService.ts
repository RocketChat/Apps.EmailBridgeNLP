import { IHttp, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { IOAuthService } from '../../definition/auth/IAuth';
import { IEmailStatistics, IEmailStatsParams } from '../../definition/lib/IEmailStatistics';
import { t, Language } from '../../lib/Translation/translation';
import { getProviderDisplayName } from '../../enums/ProviderDisplayNames';
import { EmailProviders } from '../../enums/EmailProviders';
import { Translations } from '../../constants/Translations';
import { ApiEndpoints, HeaderBuilders } from '../../constants/constants';

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
        const accessToken = await this.oauthService.getValidAccessToken(params.userId);
        
        // Calculate time range for last 24 hours
        const now = new Date();
        const yesterday = new Date(now.getTime() - (params.hoursBack * 60 * 60 * 1000));
        const timeQuery = `after:${Math.floor(yesterday.getTime() / 1000)}`;
        
        // Get all emails in the last 24 hours
        const allEmailsResponse = await this.http.get(`${ApiEndpoints.GOOGLE_API_BASE_URL}/messages?q=${encodeURIComponent(timeQuery)}`, {
            headers: HeaderBuilders.createJsonAuthHeaders(accessToken)
        });

        // Get unread emails count from the last 24 hours
        const unreadResponse = await this.http.get(`${ApiEndpoints.GOOGLE_API_BASE_URL}/messages?q=${encodeURIComponent(`is:unread ${timeQuery}`)}`, {
            headers: HeaderBuilders.createJsonAuthHeaders(accessToken)
        });

        // Get received emails in the last 24 hours (inbox)
        const receivedResponse = await this.http.get(`${ApiEndpoints.GOOGLE_API_BASE_URL}/messages?q=${encodeURIComponent(`in:inbox ${timeQuery}`)}`, {
            headers: HeaderBuilders.createJsonAuthHeaders(accessToken)
        });

        // Get unread received emails in the last 24 hours
        const receivedUnreadResponse = await this.http.get(`${ApiEndpoints.GOOGLE_API_BASE_URL}/messages?q=${encodeURIComponent(`in:inbox is:unread ${timeQuery}`)}`, {
            headers: HeaderBuilders.createJsonAuthHeaders(accessToken)
        });

        // Get sent emails in the last 24 hours
        const sentResponse = await this.http.get(`${ApiEndpoints.GOOGLE_API_BASE_URL}/messages?q=${encodeURIComponent(`in:sent ${timeQuery}`)}`, {
            headers: HeaderBuilders.createJsonAuthHeaders(accessToken)
        });

        const categoryStats: { [category: string]: { total: number, unread: number } } = {};
        if (params.categories && params.categories.length > 0) {
            for (const category of params.categories) {
                let categoryQuery = '';
                if (category === 'github') {
                    categoryQuery = '(from:github.com OR from:github OR from:noreply@github.com OR subject:github OR github)';
                } else if (category === 'calendar') {
                    categoryQuery = '(subject:calendar OR "calendar" OR "invitation" OR "meeting" OR filename:ics)';
                } else if (category === 'social') {
                    categoryQuery = 'category:social';
                } else {
                    // More robust generic query for custom categories
                    categoryQuery = `"${category}"`;
                }

                if (categoryQuery) {
                    const query = `${timeQuery} ${categoryQuery}`;
                    const response = await this.http.get(`${ApiEndpoints.GOOGLE_API_BASE_URL}/messages?q=${encodeURIComponent(query)}`, {
                        headers: HeaderBuilders.createJsonAuthHeaders(accessToken)
                    });
                    const unreadResponse = await this.http.get(`${ApiEndpoints.GOOGLE_API_BASE_URL}/messages?q=${encodeURIComponent(`${query} is:unread`)}`, {
                        headers: HeaderBuilders.createJsonAuthHeaders(accessToken)
                    });

                    if (response.statusCode === 401 || unreadResponse.statusCode === 401) {
                        const providerName = getProviderDisplayName(EmailProviders.GMAIL);
                        throw new Error(t(Translations.STATS_TOKEN_EXPIRED, language, { provider: providerName }));
                    }

                    const data = JSON.parse(response.content || '{}');
                    const unreadData = JSON.parse(unreadResponse.content || '{}');

                    categoryStats[category] = {
                        total: data.resultSizeEstimate || 0,
                        unread: unreadData.resultSizeEstimate || 0,
                    };
                }
            }
        }

        // Check for API errors
        if (allEmailsResponse.statusCode === 401 || unreadResponse.statusCode === 401 || 
            receivedResponse.statusCode === 401 || sentResponse.statusCode === 401 ||
            receivedUnreadResponse.statusCode === 401) {
            const providerName = getProviderDisplayName(EmailProviders.GMAIL);
            throw new Error(t(Translations.STATS_TOKEN_EXPIRED, language, { provider: providerName }));
        }

        const allEmailsData = JSON.parse(allEmailsResponse.content || '{}');
        const unreadData = JSON.parse(unreadResponse.content || '{}');
        const receivedData = JSON.parse(receivedResponse.content || '{}');
        const receivedUnreadData = JSON.parse(receivedUnreadResponse.content || '{}');
        const sentData = JSON.parse(sentResponse.content || '{}');

        const totalEmails = allEmailsData.resultSizeEstimate || 0;
        const unreadEmails = unreadData.resultSizeEstimate || 0;
        const receivedToday = receivedData.resultSizeEstimate || 0;
        const receivedUnreadToday = receivedUnreadData.resultSizeEstimate || 0;
        const sentToday = sentData.resultSizeEstimate || 0;
        const readEmails = Math.max(0, totalEmails - unreadEmails);

        return {
            totalEmails,
            unreadEmails,
            readEmails,
            receivedToday,
            receivedUnreadToday,
            sentToday,
            categoryStats,
            timeRange: `Last ${params.hoursBack} hours`,
            emailAddress: userInfo.email,
            provider: 'Gmail'
        };
    }

    // Future methods will be added here:
    // public async sendEmail(params: ISendEmailParams): Promise<boolean> { ... }
    // public async searchEmails(params: ISearchParams): Promise<IEmailSearchResult[]> { ... }
    // public async getEmailContent(messageId: string): Promise<IEmailContent> { ... }
}
