import { IHttp, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { IOAuthService } from '../../definition/auth/IAuth';
import { IEmailStatistics, IEmailStatsParams } from '../../definition/lib/IEmailStatistics';
import { t, Language } from '../../lib/Translation/translation';
import { getProviderDisplayName } from '../../enums/ProviderDisplayNames';
import { EmailProviders } from '../../enums/EmailProviders';
import { Translations } from '../../constants/Translations';
import { ApiEndpoints, HeaderBuilders } from '../../constants/constants';
import { LLMEmailAnalysisService } from './LLMEmailAnalysisService';
import { IEmailData } from '../../definition/lib/IEmailUtils';
import { IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';

export class OutlookService {
    private oauthService: IOAuthService;
    private http: IHttp;
    private logger: ILogger;
    private persistence?: IPersistence;
    private read?: IRead;

    constructor(oauthService: IOAuthService, http: IHttp, logger: ILogger, persistence?: IPersistence, read?: IRead) {
        this.oauthService = oauthService;
        this.http = http;
        this.logger = logger;
        this.persistence = persistence;
        this.read = read;
    }

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
            throw new Error(t(Translations.STATS_TOKEN_EXPIRED, language, { provider: providerName }));
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

        let categoryStats: { [category: string]: { total: number, unread: number } } = {};
        
        // Only do email provider categorization if LLM categorization is NOT selected
        if (!params.useLLMCategorization && params.categories && params.categories.length > 0) {
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

        // Create user-friendly time range description
        const days = Math.floor(params.hoursBack / 24);
        const timeRangeDescription = days === 1 ? 
            t(Translations.STATS_TIME_RANGE_24_HOURS, language) : 
            t(Translations.STATS_TIME_RANGE_DAYS, language, { days: days.toString() });

        // Enhanced LLM analysis if requested
        let enhancedAnalysis;
        if (params.useLLMCategorization && this.persistence && this.read) {
            try {
                // Fetch detailed email data for LLM analysis (limit 450 emails)
                const detailedEmails = await this.fetchDetailedEmailsForLLMAnalysis(accessToken, timeFilter, language);
                
                if (detailedEmails.length > 0) {
                    const llmAnalysisService = new LLMEmailAnalysisService(this.http, this.persistence, this.read, this.logger);
                    enhancedAnalysis = await llmAnalysisService.analyzeEmails(detailedEmails, params, language);
                    
                    // Replace provider categories with LLM categories
                    categoryStats = {};
                    if (enhancedAnalysis.userCategories) {
                        Object.assign(categoryStats, enhancedAnalysis.userCategories);
                    }
                    if (enhancedAnalysis.additionalCategories) {
                        Object.assign(categoryStats, enhancedAnalysis.additionalCategories);
                    }
                }
            } catch (error) {
                this.logger.error('LLM email analysis failed for Outlook:', error);
                // Continue with regular stats if LLM analysis fails
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
            timeRange: timeRangeDescription,
            emailAddress: userInfo.email,
            provider: 'Outlook',
            enhancedAnalysis
        };
    }

    private async fetchDetailedEmailsForLLMAnalysis(accessToken: string, timeFilter: string, language: Language): Promise<IEmailData[]> {
        try {
            // Get up to 450 recent emails with detailed info from inbox
            const emailsResponse = await this.http.get(`${ApiEndpoints.OUTLOOK_API_BASE_URL}/mailFolders/inbox/messages?$filter=${encodeURIComponent(timeFilter)}&$top=450&$select=from,subject,bodyPreview,isRead,receivedDateTime`, {
                headers: HeaderBuilders.createOutlookJsonHeaders(accessToken)
            });

            if (emailsResponse.statusCode !== 200) {
                throw new Error('Failed to fetch emails list');
            }

            const emailsData = JSON.parse(emailsResponse.content || '{}');
            const messages = emailsData.value || [];

            // Convert Outlook messages to IEmailData format
            const detailedEmails: IEmailData[] = messages.map((message: any) => ({
                sender: message.from?.emailAddress?.address || 'Unknown',
                subject: message.subject || 'No Subject',
                bodyPreview: message.bodyPreview || '',
                isRead: message.isRead || false,
                receivedDateTime: message.receivedDateTime || new Date().toISOString()
            }));

            this.logger.info(`Fetched ${detailedEmails.length} emails for LLM analysis from Outlook`);
            return detailedEmails;

        } catch (error) {
            this.logger.error('Failed to fetch detailed emails from Outlook for LLM analysis:', error);
            return [];
        }
    }
}
