import { ICategoryStats } from '../formats/IEmailFormats';

export interface IEmailStatistics {
    totalEmails: number;
    unreadEmails: number;
    readEmails: number;
    receivedToday: number;
    receivedUnreadToday: number;
    sentToday: number;
    categoryStats?: ICategoryStats;
    timeRange: string;
    emailAddress: string;
    provider: string;
    enhancedAnalysis?: IEnhancedEmailAnalysis;
}

export interface IEnhancedEmailAnalysis {
    topSenders?: Array<{ email: string; count: number; name?: string }>;
    userCategories?: ICategoryStats;
    additionalCategories?: ICategoryStats;
    trends?: string[];
    insights?: string[];
    totalEmailsAnalyzed?: number;
    isLLMGenerated: boolean;
}

export interface IEmailStatsParams {
    userId: string;
    hoursBack: number;
    categories?: string[];
    useLLMCategorization?: boolean;
    language?: string;
} 