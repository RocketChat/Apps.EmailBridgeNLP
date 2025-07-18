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
}

export interface IEmailStatsParams {
    userId: string;
    hoursBack: number;
    categories?: string[];
} 