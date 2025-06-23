export interface IEmailStatistics {
    totalEmails: number;
    unreadEmails: number;
    readEmails: number;
    receivedToday: number;
    sentToday: number;
    timeRange: string;
    emailAddress: string;
    provider: string;
}

export interface IEmailStatsParams {
    userId: string;
    hoursBack: number;
} 