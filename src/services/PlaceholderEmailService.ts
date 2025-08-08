import { IHttp, IRead, ILogger, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { ISendEmailData } from '../definition/lib/IEmailUtils';
import { EmailProviders } from '../enums/EmailProviders';
import { Language } from '../lib/Translation/translation';
import { PlaceholderUtils } from '../utils/PlaceholderUtils';
import { IRecipientInfo, IPlaceholderDetection, IPlaceholderEmailResult } from '../definition/lib/IPlaceholder';
import { EmailServiceFactory } from './auth/EmailServiceFactory';
import { PlaceholderStatus } from '../enums/EmailPlaceholders';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { GmailService } from './email/GmailService';
import { OutlookService } from './email/OutlookService';
import { CacheService, ICachedUserData } from './CacheService';



export class PlaceholderEmailService {

    constructor(
        private readonly app: EmailBridgeNlpApp,
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly persistence: IPersistence,
        private readonly logger: ILogger
    ) {}

    // Store room ID for cache access
    private currentRoomId: string = '';

    public static shouldUsePlaceholderProcessing(
        emailData: ISendEmailData,
        toolContext: string
    ): boolean {
        // Only process placeholders for specific tools
        const allowedTools = [
            'send-email-to-channel-or-team',
            'summarize-and-send-email-to-channel-or-team'
        ];

        if (!allowedTools.includes(toolContext)) {
            return false;
        }

        // Check if content contains any placeholders
        const detection = PlaceholderUtils.detectPlaceholders(emailData.content || '');
        return detection.hasUserPlaceholders;
    }

    public async sendEmailWithPlaceholders(
        emailData: ISendEmailData,
        user: IUser,
        emailProvider: EmailProviders,
        fromEmail: string,
        toolContext: string,
        language: Language,
        roomId?: string
    ): Promise<IPlaceholderEmailResult> {
        // Store room ID for cache access
        if (roomId) {
            this.currentRoomId = roomId;
        }
        try {
            // Detect placeholders in content
            const placeholderDetection = PlaceholderUtils.detectPlaceholders(emailData.content || '');


            if (!placeholderDetection.hasUserPlaceholders) {
                return await this.sendNormalEmail(emailData, user, emailProvider, fromEmail, language);
            }
            return await this.sendIndividualEmails(
                emailData,
                user,
                emailProvider,
                fromEmail,
                placeholderDetection,
                language
            );

        } catch (error) {
            this.logger.error('Error in placeholder email processing:', error);
            return {
                success: false,
                message: `Failed to process email with placeholders: ${error.message}`
            };
        }
    }

    private async sendIndividualEmails(
        emailData: ISendEmailData,
        user: IUser,
        emailProvider: EmailProviders,
        fromEmail: string,
        placeholderDetection: IPlaceholderDetection,
        language: Language
    ): Promise<IPlaceholderEmailResult> {
        const allRecipients = [...(emailData.to || [])];
        if (emailData.cc) {
            allRecipients.push(...emailData.cc);
        }


        // Try to get cached user data first (much faster)
        const recipientInfoMap = await this.getCachedOrFetchUserInfo(allRecipients);

        const oauthService = await EmailServiceFactory.createOAuthService(
            emailProvider,
            this.http,
            this.persistence,
            this.read,
            this.logger
        );

        const accessToken = await oauthService.getValidAccessToken(user.id);
        if (!accessToken) {
            throw new Error('No valid access token available');
        }

        const batchSize = 5;
        let successCount = 0;
        const failedEmails: string[] = [];

        for (let i = 0; i < allRecipients.length; i += batchSize) {
            const batch = allRecipients.slice(i, i + batchSize);
            
            // Process batch in parallel
            const batchPromises = batch.map(async (recipient) => {
                try {
                    const recipientInfo = recipientInfoMap.get(recipient);
                    if (!recipientInfo) {
                        return { recipient, success: false };
                    }

                    const personalizedContent = await PlaceholderUtils.processContentWithPlaceholders(
                        emailData.content || '',
                        recipientInfo
                    );

                    const individualEmailData: ISendEmailData = {
                        ...emailData,
                        to: [recipient], // Single recipient
                        cc: undefined, // Remove CC for individual emails
                        content: personalizedContent
                    };

                    // Send individual email using provider-specific service
                    let success: boolean;

                    switch (emailProvider) {
                        case EmailProviders.GMAIL:
                            const gmailService = new GmailService(oauthService, this.http, this.logger, this.persistence, this.read);
                            success = await gmailService.sendEmail(individualEmailData, accessToken, fromEmail);
                            break;
                        case EmailProviders.OUTLOOK:
                            const outlookService = new OutlookService(oauthService, this.http, this.logger, this.persistence, this.read);
                            success = await outlookService.sendEmail(individualEmailData, accessToken, fromEmail);
                            break;
                        default:
                            throw new Error(`Unsupported provider: ${emailProvider}`);
                    }

                    return { recipient, success };

                } catch (error) {
                    this.logger.error(`Error sending individual email to ${recipient}:`, error);
                    return { recipient, success: false };
                }
            });

            // Wait for batch to complete
            const batchResults = await Promise.all(batchPromises);
            
            // Count results
            batchResults.forEach(result => {
                if (result.success) {
                    successCount++;
                } else {
                    failedEmails.push(result.recipient);
                }
            });

            // Small delay between batches to respect rate limits
            if (i + batchSize < allRecipients.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        // Return results
        const totalEmails = allRecipients.length;
        const result: IPlaceholderEmailResult = {
            success: successCount > 0,
            message: this.formatIndividualEmailResults(successCount, totalEmails, failedEmails, language),
            individualEmailsSent: successCount,
            failedEmails: failedEmails.length > 0 ? failedEmails : undefined
        };

        if (this.currentRoomId) {
            try {
                const { CacheService } = await import('./CacheService');
                const cacheService = new CacheService(
                    this.persistence,
                    this.read.getPersistenceReader(),
                    this.currentRoomId,
                    this.logger
                );
                await cacheService.cleanupAfterEmailCompletion(successCount, totalEmails);
            } catch (error) {
                // Cache cleanup failed - not critical
            }
        }

        return result;
    }

    private async sendNormalEmail(
        emailData: ISendEmailData,
        user: IUser,
        emailProvider: EmailProviders,
        fromEmail: string,
        language: Language
    ): Promise<IPlaceholderEmailResult> {
        try {
            // Process date placeholder if present (but not user placeholders)
            let processedContent = emailData.content || '';
            if (processedContent.includes('[date]')) {
                processedContent = PlaceholderUtils.replaceDatePlaceholder(processedContent);
            }

            const processedEmailData: ISendEmailData = {
                ...emailData,
                content: processedContent
            };

            // Get OAuth service and send normally
            const oauthService = await EmailServiceFactory.createOAuthService(
                emailProvider,
                this.http,
                this.persistence,
                this.read,
                this.logger
            );

            const accessToken = await oauthService.getValidAccessToken(user.id);
            if (!accessToken) {
                throw new Error('No valid access token available');
            }

            // Send email using provider-specific service
            let success: boolean;

            switch (emailProvider) {
                case EmailProviders.GMAIL:
                    const gmailService = new GmailService(oauthService, this.http, this.logger, this.persistence, this.read);
                    success = await gmailService.sendEmail(processedEmailData, accessToken, fromEmail);
                    break;
                case EmailProviders.OUTLOOK:
                    const outlookService = new OutlookService(oauthService, this.http, this.logger, this.persistence, this.read);
                    success = await outlookService.sendEmail(processedEmailData, accessToken, fromEmail);
                    break;
                default:
                    throw new Error(`Unsupported provider: ${emailProvider}`);
            }

            return {
                success,
                message: success
                    ? 'Email sent successfully'
                    : 'Failed to send email'
            };

        } catch (error) {
            this.logger.error('Error sending normal email:', error);
            return {
                success: false,
                message: `Failed to send email: ${error.message}`
            };
        }
    }

    private formatIndividualEmailResults(
        successCount: number,
        totalCount: number,
        failedEmails: string[],
        language: Language
    ): string {
        if (successCount === totalCount) {
            return `Successfully sent ${successCount} personalized email${successCount > 1 ? 's' : ''}`;
        } else if (successCount > 0) {
            return `Sent ${successCount} of ${totalCount} emails. Failed: ${failedEmails.length}`;
        } else {
            return `Failed to send all ${totalCount} emails`;
        }
    }

    private async getCachedOrFetchUserInfo(emails: string[]): Promise<Map<string, IRecipientInfo>> {
        // First try to get from cache using the stored room ID
        if (!this.currentRoomId) {
            return await PlaceholderUtils.batchGetUserInfoFromEmails(emails, this.read);
        }

        const cacheService = new CacheService(
            this.persistence,
            this.read.getPersistenceReader(),
            this.currentRoomId
        );

        try {
            const cachedUsers = await cacheService.getCachedUsersMap();
            
            if (cachedUsers && cachedUsers.size > 0) {
                
                const recipientInfoMap = new Map<string, IRecipientInfo>();
                
                emails.forEach(email => {
                    const cachedUser = cachedUsers.get(email);
                    if (cachedUser) {
                        recipientInfoMap.set(email, {
                            email: cachedUser.email,
                            name: cachedUser.name,
                            username: cachedUser.username,
                            realName: cachedUser.name
                        });
                    }
                });

                if (recipientInfoMap.size === emails.length) {
                    return recipientInfoMap;
                }
                
                const missingEmails = emails.filter(email => !recipientInfoMap.has(email));
                if (missingEmails.length > 0) {
                    const fallbackMap = await PlaceholderUtils.batchGetUserInfoFromEmails(
                        missingEmails,
                        this.read
                    );
                    
                    // Merge with cached results
                    fallbackMap.forEach((value, key) => {
                        recipientInfoMap.set(key, value);
                    });
                }
                
                return recipientInfoMap;
            }
        } catch (error) {
            // Cache lookup failed, falling back to API
        }

        return await PlaceholderUtils.batchGetUserInfoFromEmails(emails, this.read);
    }


}
