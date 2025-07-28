import { Language, t } from '../Translation/translation';
import { Translations } from '../../constants/Translations';
import { IEmailStatistics } from '../../definition/lib/IEmailStatistics';
import { ISummarizeParams } from '../../definition/lib/IEmailUtils';
import { 
    ISummaryEmailResult, 
    ISummaryTimeInfo, 
    IFormatSummaryDetailsParams,
    ICategoryStats 
} from '../../definition/formats/IEmailFormats';

export class EmailFormats {

    public static formatSummaryEmail(
        channelName: string,
        summaryContent: string,
        messageCount: number,
        args: any,
        summarizeParams: ISummarizeParams
    ): ISummaryEmailResult {
        // Generate subject
        const subject = args.subject || `Summary of ${channelName} conversation`;
        
        // Generate email content with consistent formatting
        let emailContent = `CONVERSATION SUMMARY: ${channelName}\n\n`;
        emailContent += `${summaryContent}\n\n`;
        
        // Add details section
        const timeInfo: ISummaryTimeInfo = {
            days: summarizeParams.days,
            startDate: args.start_date,
            endDate: args.end_date
        };
        
        emailContent += this.formatSummaryDetails(
            channelName,
            messageCount,
            args.people,
            timeInfo
        );
        
        emailContent += `\nThis summary was generated automatically by EmailBridge NLP.`;

        return { subject, content: emailContent };
    }

    public static formatEmailStats(
        statistics: IEmailStatistics,
        language: Language
    ): string {
        // Build category stats section
        const categoryStats = this.formatCategoryStats(statistics.categoryStats);

        // Build complete stats message
        const statsMessage = t(Translations.STATS_HEADER, language, { timeRange: statistics.timeRange }) + '\n\n' +
            t(Translations.STATS_STATISTICS, language, {
                receivedToday: statistics.receivedToday.toString(),
                receivedUnreadToday: statistics.receivedUnreadToday.toString(),
                sentToday: statistics.sentToday.toString()
            }) + '\n\n' +
            categoryStats +
            '---';

        return statsMessage;
    }



    public static formatSummaryDetails(
        channelName: string,
        messageCount: number,
        participants?: string[],
        timeInfo?: ISummaryTimeInfo
    ): string {
        let details = `--------------------------------------------------\n\n`;
        details += `SUMMARY DETAILS:\n`;
        details += `- Messages included: ${messageCount}\n`;
        details += `- Channel: ${channelName}\n`;
        
        if (participants && participants.length > 0) {
            details += `- Participants: ${participants.join(', ')}\n`;
        }
        
        if (timeInfo?.days) {
            details += `- Time period: Last ${timeInfo.days} day(s)\n`;
        } else if (timeInfo?.startDate && timeInfo?.endDate) {
            details += `- Time period: ${timeInfo.startDate} to ${timeInfo.endDate}\n`;
        }
        
        return details;
    }



    public static formatCategoryStats(categoryStats?: ICategoryStats): string {
        let categoryReport = '';
        if (categoryStats) {
            for (const category in categoryStats) {
                if (categoryStats.hasOwnProperty(category)) {
                    const stats = categoryStats[category];
                    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                    categoryReport += `**${categoryName}**: ${stats.total} emails (${stats.unread} unread)\n`;
                }
            }
        }
        return categoryReport;
    }
} 