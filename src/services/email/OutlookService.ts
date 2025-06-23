import { IHttp, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { IOAuthService } from '../../definition/auth/IAuth';
import { IEmailStatistics, IEmailStatsParams } from '../../definition/lib/IEmailStatistics';

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
    public async getEmailStatistics(params: IEmailStatsParams, userInfo: any): Promise<IEmailStatistics> {
        try {
            const accessToken = await this.oauthService.getValidAccessToken(params.userId);
            
            // Calculate time range for last 24 hours
            const now = new Date();
            const yesterday = new Date(now.getTime() - (params.hoursBack * 60 * 60 * 1000));
            const timeFilter = `receivedDateTime ge ${yesterday.toISOString()}`;
            
            // Get received emails in the last 24 hours
            const receivedResponse = await this.http.get(`https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$filter=${encodeURIComponent(timeFilter)}&$count=true&$top=1`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'ConsistencyLevel': 'eventual'
                }
            });

            // Get unread emails from the last 24 hours
            const unreadResponse = await this.http.get(`https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$filter=${encodeURIComponent(`isRead eq false and ${timeFilter}`)}&$count=true&$top=1`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'ConsistencyLevel': 'eventual'
                }
            });

            // Get sent emails in the last 24 hours
            const sentTimeFilter = `sentDateTime ge ${yesterday.toISOString()}`;
            const sentResponse = await this.http.get(`https://graph.microsoft.com/v1.0/me/mailFolders/sentitems/messages?$filter=${encodeURIComponent(sentTimeFilter)}&$count=true&$top=1`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'ConsistencyLevel': 'eventual'
                }
            });

            // Get total inbox count
            const totalResponse = await this.http.get(`https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$count=true&$top=1`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'ConsistencyLevel': 'eventual'
                }
            });

            const receivedData = JSON.parse(receivedResponse.content || '{}');
            const unreadData = JSON.parse(unreadResponse.content || '{}');
            const sentData = JSON.parse(sentResponse.content || '{}');
            const totalData = JSON.parse(totalResponse.content || '{}');

            const receivedToday = receivedData['@odata.count'] || 0;
            const unreadEmails = unreadData['@odata.count'] || 0;
            const sentToday = sentData['@odata.count'] || 0;
            const totalEmails = totalData['@odata.count'] || 0;
            const readEmails = Math.max(0, totalEmails - unreadEmails);

            return {
                totalEmails,
                unreadEmails,
                readEmails,
                receivedToday,
                sentToday,
                timeRange: `Last ${params.hoursBack} hours`,
                emailAddress: userInfo.email,
                provider: 'Outlook'
            };

        } catch (error) {
            this.logger.error('Outlook statistics error:', error);
            throw new Error(`Failed to get Outlook statistics: ${error.message}`);
        }
    }

    // Future methods will be added here:
    // public async sendEmail(params: ISendEmailParams): Promise<boolean> { ... }
    // public async searchEmails(params: ISearchParams): Promise<IEmailSearchResult[]> { ... }
    // public async getEmailContent(messageId: string): Promise<IEmailContent> { ... }
}
