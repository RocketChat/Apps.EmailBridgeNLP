import { IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { EmailPlaceholders, PlaceholderStatus } from '../enums/EmailPlaceholders';
import { IRecipientInfo, IPlaceholderDetection } from '../definition/lib/IPlaceholderInterfaces';

export class PlaceholderUtils {

    public static detectPlaceholders(content: string): IPlaceholderDetection {
        const hasDatePlaceholder = content.includes(EmailPlaceholders.DATE);
        const hasNamePlaceholder = content.includes(EmailPlaceholders.NAME);
        const hasUsernamePlaceholder = content.includes(EmailPlaceholders.USERNAME);
        const hasUserPlaceholders = hasNamePlaceholder || hasUsernamePlaceholder;

        let status: PlaceholderStatus;
        if (!hasDatePlaceholder && !hasUserPlaceholders) {
            status = PlaceholderStatus.NOT_FOUND;
        } else if (hasDatePlaceholder && !hasUserPlaceholders) {
            status = PlaceholderStatus.FOUND_DATE_ONLY;
        } else if (!hasDatePlaceholder && hasUserPlaceholders) {
            status = PlaceholderStatus.FOUND_USER_PLACEHOLDERS;
        } else {
            status = PlaceholderStatus.FOUND_ALL;
        }

        return {
            status,
            hasDatePlaceholder,
            hasNamePlaceholder,
            hasUsernamePlaceholder,
            hasUserPlaceholders,
        };
    }

    public static replaceDatePlaceholder(content: string, currentDate?: string): string {
        const dateToUse = currentDate || new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return content.replace(new RegExp(EmailPlaceholders.DATE.replace(/[[\]]/g, '\\$&'), 'g'), dateToUse);
    }

    public static replaceUserPlaceholders(content: string, recipientInfo: IRecipientInfo): string {
        let processedContent = content;

        if (recipientInfo.realName || recipientInfo.name) {
            const nameToUse = recipientInfo.realName || recipientInfo.name || recipientInfo.email;
            processedContent = processedContent.replace(
                new RegExp(EmailPlaceholders.NAME.replace(/[[\]]/g, '\\$&'), 'g'), 
                nameToUse
            );
        }

        if (recipientInfo.username) {
            processedContent = processedContent.replace(
                new RegExp(EmailPlaceholders.USERNAME.replace(/[[\]]/g, '\\$&'), 'g'), 
                recipientInfo.username
            );
        }

        return processedContent;
    }

    public static async getUserInfoFromEmail(email: string, read: IRead): Promise<IRecipientInfo> {
        try {
            const emailParts = email.split('@');
            const potentialUsername = emailParts[0];
            
            try {
                const user = await read.getUserReader().getByUsername(potentialUsername);
                if (user && user.emails && user.emails.length > 0) {
                    const userEmail = user.emails.find(e => e.address === email);
                    if (userEmail) {
                        return {
                            email,
                            name: user.name,
                            username: user.username,
                            realName: user.name,
                        };
                    }
                }
            } catch {
                // Username lookup failed, continue to fallback
            }

            return {
                email,
                name: email,
                username: email,
            };
        } catch (error) {
            return {
                email,
                name: email,
                username: email,
            };
        }
    }

    public static async processContentWithPlaceholders(
        originalContent: string, 
        recipientInfo: IRecipientInfo
    ): Promise<string> {
        let processedContent = this.replaceDatePlaceholder(originalContent);
        processedContent = this.replaceUserPlaceholders(processedContent, recipientInfo);
        return processedContent;
    }

    public static async batchGetUserInfoFromEmails(
        emails: string[], 
        read: IRead
    ): Promise<Map<string, IRecipientInfo>> {
        const recipientInfoMap = new Map<string, IRecipientInfo>();
        const uniqueEmails = [...new Set(emails)];

        const promises = uniqueEmails.map(email => this.getUserInfoFromEmail(email, read));
        const results = await Promise.all(promises);

        uniqueEmails.forEach((email, index) => {
            recipientInfoMap.set(email, results[index]);
        });

        return recipientInfoMap;
    }
}
