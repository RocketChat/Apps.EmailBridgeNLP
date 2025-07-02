import { IHttp, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { IOAuthService } from '../../definition/auth/IAuth';
import { IEmailStatistics, IEmailStatsParams } from '../../definition/lib/IEmailStatistics';
import { t, Language } from '../../lib/Translation/translation';
import { getProviderDisplayName } from '../../enums/ProviderDisplayNames';
import { EmailProviders } from '../../enums/EmailProviders';
import { Translations } from '../../constants/Translations';
import { ApiEndpoints, HeaderBuilders } from '../../constants/AuthConstants';

export class OutlookService {
    private oauthService: IOAuthService;
    private http: IHttp;
    private logger: ILogger;

    constructor(oauthService: IOAuthService, http: IHttp, logger: ILogger) {
        this.oauthService = oauthService;
        this.http = http;
        this.logger = logger;
    }

    /**
     * Get Outlook email statistics for the specified time period
     */
    public async getEmailStatistics(params: IEmailStatsParams, userInfo: any, language: Language = Language.en): Promise<IEmailStatistics> {
        const accessToken = await this.oauthService.getValidAccessToken(params.userId);
        
        // Calculate time range for last 24 hours
        const now = new Date();
        const yesterday = new Date(now.getTime() - (params.hoursBack * 60 * 60 * 1000));
        const timeFilter = `receivedDateTime ge ${yesterday.toISOString()}`;
        
        // Get received emails in the last 24 hours
        const receivedResponse = await this.http.get(`${ApiEndpoints.OUTLOOK_API_BASE_URL}/mailFolders/inbox/messages?$filter=${encodeURIComponent(timeFilter)}&$count=true&$top=1`, {
            headers: HeaderBuilders.createOutlookJsonHeaders(accessToken)
        });

        // Get unread emails from the last 24 hours
        const unreadResponse = await this.http.get(`${ApiEndpoints.OUTLOOK_API_BASE_URL}/mailFolders/inbox/messages?$filter=${encodeURIComponent(`isRead eq false and ${timeFilter}`)}&$count=true&$top=1`, {
            headers: HeaderBuilders.createOutlookJsonHeaders(accessToken)
        });

        // Get sent emails in the last 24 hours
        const sentTimeFilter = `sentDateTime ge ${yesterday.toISOString()}`;
        const sentResponse = await this.http.get(`${ApiEndpoints.OUTLOOK_API_BASE_URL}/mailFolders/sentitems/messages?$filter=${encodeURIComponent(sentTimeFilter)}&$count=true&$top=1`, {
            headers: HeaderBuilders.createOutlookJsonHeaders(accessToken)
        });

        // Get total inbox count
        const totalResponse = await this.http.get(`${ApiEndpoints.OUTLOOK_API_BASE_URL}/mailFolders/inbox/messages?$count=true&$top=1`, {
            headers: HeaderBuilders.createOutlookJsonHeaders(accessToken)
        });

        // Check for API errors
        if (receivedResponse.statusCode === 401 || unreadResponse.statusCode === 401 || 
            sentResponse.statusCode === 401 || totalResponse.statusCode === 401) {
            const providerName = getProviderDisplayName(EmailProviders.OUTLOOK);
            throw new Error(t(Translations.REPORT_TOKEN_EXPIRED, language, { provider: providerName }));
        }

        const receivedData = JSON.parse(receivedResponse.content || '{}');
        const unreadData = JSON.parse(unreadResponse.content || '{}');
        const sentData = JSON.parse(sentResponse.content || '{}');
        const totalData = JSON.parse(totalResponse.content || '{}');

        const receivedToday = receivedData['@odata.count'] || 0;
        const unreadEmails = unreadData['@odata.count'] || 0;
        const sentToday = sentData['@odata.count'] || 0;
        const totalEmails = totalData['@odata.count'] || 0;
        const readEmails = Math.max(0, totalEmails - unreadEmails);

        const categoryStats: { [category: string]: { total: number, unread: number } } = {};
        if (params.categories && params.categories.length > 0) {
            for (const category of params.categories) {
                const categoryFilter = `contains(subject, '${category}') or contains(body, '${category}')`;
                
                const categoryResponse = await this.http.get(`${ApiEndpoints.OUTLOOK_API_BASE_URL}/messages?$filter=${encodeURIComponent(`${timeFilter} and (${categoryFilter})`)}&$count=true&$top=1`, {
                    headers: HeaderBuilders.createOutlookHeaders(accessToken)
                });

                const unreadCategoryResponse = await this.http.get(`${ApiEndpoints.OUTLOOK_API_BASE_URL}/messages?$filter=${encodeURIComponent(`${timeFilter} and isRead eq false and (${categoryFilter})`)}&$count=true&$top=1`, {
                    headers: HeaderBuilders.createOutlookHeaders(accessToken)
                });

                const categoryData = JSON.parse(categoryResponse.content || '{}');
                const unreadCategoryData = JSON.parse(unreadCategoryResponse.content || '{}');

                categoryStats[category] = {
                    total: categoryData['@odata.count'] || 0,
                    unread: unreadCategoryData['@odata.count'] || 0,
                };
            }
        }

        return {
            totalEmails,
            unreadEmails,
            readEmails,
            receivedToday,
            receivedUnreadToday: unreadEmails,
            sentToday,
            categoryStats,
            timeRange: `Last ${params.hoursBack} hours`,
            emailAddress: userInfo.email,
            provider: 'Outlook'
        };
    }

    // Future methods will be added here:
    // public async sendEmail(params: ISendEmailParams): Promise<boolean> { ... }
    // public async searchEmails(params: ISearchParams): Promise<IEmailSearchResult[]> { ... }
    // public async getEmailContent(messageId: string): Promise<IEmailContent> { ... }
}
