export interface IEmailStatistics {
    totalEmails: number;
    unreadEmails: number;
    readEmails: number;
    receivedToday: number;
    receivedUnreadToday: number;
    sentToday: number;
    categoryStats?: { [category: string]: { total: number; unread: number } };
    timeRange: string;
    emailAddress: string;
    provider: string;
}

export interface IEmailStatsParams {
    userId: string;
    hoursBack: number;
    categories?: string[];
} 