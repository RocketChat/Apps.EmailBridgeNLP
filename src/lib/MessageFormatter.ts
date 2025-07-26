import { Language, t } from './Translation/translation';
import { Translations } from '../constants/Translations';
import { ISendEmailData } from '../definition/lib/IEmailUtils';
import { IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { AvatarUtils } from '../constants/AuthConstants';

export class MessageFormatter {
    
    public static formatQueryMessage(query: string, language: Language): string {
        return `${t(Translations.LLM_USER_QUERY_DISPLAY, language, { query })}\n\n${t(Translations.LLM_AI_THINKING, language)}`;
    }

    public static async formatEmailReadyMessage(
        senderName: string, 
        emailData: ISendEmailData, 
        language: Language,
        read?: IRead,
        channelName?: string
    ): Promise<string> {
        // Determine if this is a summary email or regular email
        const responseText = channelName 
            ? t(Translations.LLM_SUMMARY_EMAIL_READY_FORMATTED, language, { 
                name: senderName,
                channelName: channelName
              })
            : t(Translations.LLM_EMAIL_READY_FORMATTED, language, { 
                name: senderName
              });
        
        let formattedMessage = `${responseText}\n\n`;
        
        // Format To recipients with combination of usernames and direct emails
        if (emailData.to && emailData.to.length > 0) {
            const recipientDisplay = await this.formatMixedRecipients(
                emailData.to, 
                emailData.toUsernames || [], 
                read
            );
            formattedMessage += `${t(Translations.LLM_EMAIL_TO_LABEL, language)} ${recipientDisplay}\n`;
        }
        
        // Format CC recipients with combination of usernames and direct emails (only if there are CC recipients)
        if (emailData.cc && emailData.cc.length > 0) {
            const ccDisplay = await this.formatMixedRecipients(
                emailData.cc, 
                emailData.ccUsernames || [], 
                read
            );
            formattedMessage += `${t(Translations.LLM_EMAIL_CC_LABEL, language)} ${ccDisplay}\n`;
        }
        
        formattedMessage += `${t(Translations.LLM_EMAIL_SUBJECT_LABEL, language)} ${emailData.subject}`;
        
        return formattedMessage;
    }

    private static async formatUsernamesWithAvatars(usernames: string[], read: IRead): Promise<string> {
        const formattedUsers: string[] = [];
        
        for (const username of usernames) {
            try {
                const user = await read.getUserReader().getByUsername(username);
                const displayName = user?.name || username;
                formattedUsers.push(displayName);
            } catch (error) {
                formattedUsers.push(username);
            }
        }
        
        return formattedUsers.join(', ');
    }

    private static async formatMixedRecipients(emails: string[], usernames: string[], read?: IRead): Promise<string> {
        const recipients: string[] = [];
        
        // Remove duplicates from input arrays
        const uniqueEmails = [...new Set(emails)];
        const uniqueUsernames = [...new Set(usernames)];
        
        if (read && uniqueUsernames.length > 0) {
            // Add usernames as display names
            for (const username of uniqueUsernames) {
                try {
                    const user = await read.getUserReader().getByUsername(username);
                    const displayName = user?.name || username;
                    recipients.push(displayName);
                } catch (error) {
                    recipients.push(username);
                }
            }
            
            // Add remaining direct emails that don't have corresponding usernames
            const remainingEmails = uniqueEmails.slice(uniqueUsernames.length);
            recipients.push(...remainingEmails);
        } else {
            // If no usernames or read access, just return all emails
            recipients.push(...uniqueEmails);
        }
        
        // Remove any remaining duplicates from final result
        const uniqueRecipients = [...new Set(recipients)];
        return uniqueRecipients.join(', ');
    }

    public static formatErrorMessage(error: string, language: Language, context?: string): string {
        if (context) {
            return `${error}\n\n${context}`;
        }
        return error;
    }

    public static formatToolDetectedMessage(query: string, toolDisplayName: string, language: Language): string {
        return t(Translations.LLM_TOOL_DETECTED, language, { 
            query,
            tool: toolDisplayName 
        });
    }

    public static formatToolResultMessage(toolDisplayName: string, result: any, language: Language): string {
        if (result.modal_opened) {
            return `✅ ${result.message}`;
        } else {
            return `**${t(Translations.TOOL_CALL_RESULT, language)}:**\n` +
                   `**${t(Translations.TOOL_NAME_LABEL, language)}:** ${toolDisplayName}\n` +
                   `**Result:** ${result.message}`;
        }
    }

    public static formatToolErrorMessage(toolDisplayName: string, error: string): string {
        return `❌ **Tool Execution Failed**\n` +
               `**Tool:** ${toolDisplayName}\n` +
               `**Error:** ${error}`;
    }

    public static formatDataNotAvailableMessage(language: Language): string {
        return this.formatErrorMessage(
            t(Translations.ERROR_FAIL_INTERNAL, language), 
            language, 
            t(Translations.ERROR_EMAIL_DATA_UNAVAILABLE, language)
        );
    }

    public static formatRetryErrorMessage(language: Language): string {
        return this.formatErrorMessage(
            t(Translations.ERROR_FAIL_INTERNAL, language), 
            language, 
            t(Translations.ERROR_PLEASE_TRY_AGAIN, language)
        );
    }

    public static formatSendEmailResultMessage(
        success: boolean, 
        message: string, 
        language: Language
    ): string {
        return success
            ? t(Translations.SEND_EMAIL_SUCCESS_WITH_EMOJI, language)
            : t(Translations.SEND_EMAIL_FAILED_WITH_EMOJI, language, { 
                error: message || t(Translations.COMMON_UNKNOWN_ERROR, language) 
              });
    }
}