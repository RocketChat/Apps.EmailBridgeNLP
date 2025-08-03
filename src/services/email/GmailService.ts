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

export class GmailService {
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

        let categoryStats: { [category: string]: { total: number, unread: number } } = {};
        
        // Only do email provider categorization if LLM categorization is NOT selected
        if (!params.useLLMCategorization && params.categories && params.categories.length > 0) {
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
                const detailedEmails = await this.fetchDetailedEmailsForLLMAnalysis(accessToken, timeQuery, language);
                
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
                this.logger.error('LLM email analysis failed for Gmail:', error);
                // Continue with regular stats if LLM analysis fails
            }
        }

        return {
            totalEmails,
            unreadEmails,
            readEmails,
            receivedToday,
            receivedUnreadToday,
            sentToday,
            categoryStats,
            timeRange: timeRangeDescription,
            emailAddress: userInfo.email,
            provider: 'Gmail',
            enhancedAnalysis
        };
    }

    private async fetchDetailedEmailsForLLMAnalysis(accessToken: string, timeQuery: string, language: Language): Promise<IEmailData[]> {
        try {
            // Get up to 450 recent emails with basic info
            const emailsResponse = await this.http.get(`${ApiEndpoints.GOOGLE_API_BASE_URL}/messages?q=${encodeURIComponent(timeQuery)}&maxResults=450`, {
                headers: HeaderBuilders.createJsonAuthHeaders(accessToken)
            });

            if (emailsResponse.statusCode !== 200) {
                throw new Error('Failed to fetch emails list');
            }

            const emailsData = JSON.parse(emailsResponse.content || '{}');
            const messages = emailsData.messages || [];

            // Fetch detailed info for each email (in batches to avoid rate limits)
            const detailedEmails: IEmailData[] = [];
            const batchSize = 50; // Process in smaller batches

            for (let i = 0; i < Math.min(messages.length, 450); i += batchSize) {
                const batch = messages.slice(i, i + batchSize);
                const batchPromises = batch.map(async (message: any) => {
                    try {
                        const detailResponse = await this.http.get(`${ApiEndpoints.GOOGLE_API_BASE_URL}/messages/${message.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`, {
                            headers: HeaderBuilders.createJsonAuthHeaders(accessToken)
                        });

                        if (detailResponse.statusCode === 200) {
                            const detailData = JSON.parse(detailResponse.content || '{}');
                            const headers = detailData.payload?.headers || [];
                            
                            const fromHeader = headers.find((h: any) => h.name === 'From');
                            const subjectHeader = headers.find((h: any) => h.name === 'Subject');
                            
                            return {
                                sender: fromHeader?.value || 'Unknown',
                                subject: subjectHeader?.value || 'No Subject',
                                bodyPreview: detailData.snippet || '',
                                isRead: !(detailData.labelIds || []).includes('UNREAD'),
                                receivedDateTime: new Date(parseInt(detailData.internalDate)).toISOString()
                            };
                        }
                    } catch (error) {
                        this.logger.error('Failed to fetch email detail:', error);
                    }
                    return null;
                });

                const batchResults = await Promise.all(batchPromises);
                detailedEmails.push(...batchResults.filter(email => email !== null) as IEmailData[]);
                
                // Add a small delay between batches to respect rate limits
                if (i + batchSize < messages.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            return detailedEmails;
        } catch (error) {
            this.logger.error('Failed to fetch detailed emails for LLM analysis:', error);
            return [];
        }
    }

    // Future methods will be added here:
    // public async sendEmail(params: ISendEmailParams): Promise<boolean> { ... }
    // public async searchEmails(params: ISearchParams): Promise<IEmailSearchResult[]> { ... }
    // public async getEmailContent(messageId: string): Promise<IEmailContent> { ... }
}
