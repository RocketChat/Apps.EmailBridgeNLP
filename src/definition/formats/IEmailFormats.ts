export interface ISummaryEmailResult {
    subject: string;
    content: string;
}

export interface ISummaryTimeInfo {
    days?: number;
    startDate?: string;
    endDate?: string;
}

export interface IFormatSummaryDetailsParams {
    channelName: string;
    messageCount: number;
    participants?: string[];
    timeInfo?: ISummaryTimeInfo;
}

export interface IStatsFormattingOptions {
    includeCategoryStats?: boolean;
    includeFooter?: boolean;
    customFooter?: string;
}

export interface ICategoryStats {
    [category: string]: {
        total: number;
        unread: number;
    };
} 