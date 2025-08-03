import { IModify, IHttp, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { IToolCall } from '../definition/lib/ToolInterfaces';
import { SendEmailModal } from '../modal/SendEmailModal';
import { getUserPreferredLanguage } from '../helper/userPreference';
import { EmailServiceFactory } from './auth/EmailServiceFactory';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';
import { RoomInteractionStorage } from '../storage/RoomInteractionStorage';
import { EmailProviders } from '../enums/EmailProviders';
import { GoogleOauthUrls, MicrosoftOauthUrls, HeaderBuilders, ContentTypes, HttpHeaders } from '../constants/constants';
import { IToolExecutionResult } from '../definition/lib/ToolInterfaces';
import { ISendEmailData } from '../definition/lib/IEmailUtils';
import { LlmTools } from '../enums/LlmTools';
import { t, Language } from '../lib/Translation/translation';
import { Translations } from '../constants/Translations';
import { IEmailStatsParams } from '../definition/lib/IEmailStatistics';
import { EmailFormats } from '../lib/formats/EmailFormats';
import { getProviderDisplayName } from '../enums/ProviderDisplayNames';

export class ToolExecutorService {
    constructor(
        private readonly app: EmailBridgeNlpApp,
        private readonly read: IRead,
        private readonly modify: IModify,
        private readonly http: IHttp,
        private readonly persistence: IPersistence
    ) { }

    public async executeTool(
        toolCall: IToolCall,
        user: IUser,
        room: IRoom,
        triggerId?: string
    ): Promise<IToolExecutionResult> {
        const toolName = toolCall.function.name;

        try {
            switch (toolName) {
                case LlmTools.SEND_EMAIL:
                case LlmTools.SUMMARIZE_AND_SEND_EMAIL:
                    // This tool is now handled directly in Handler.ts with buttons
                    return {
                        tool_name: toolName,
                        success: false,
                        message: `Tool \`${toolName}\` should be handled with buttons, not through ToolExecutorService.`,
                    };
                case LlmTools.STATS:
                    return await this.handleStatsToolCall(toolCall, user);
                case LlmTools.EXTRACT_ATTACHMENT:
                    return {
                        tool_name: toolName,
                        success: true,
                        message: `📎 **Extract Attachments Tool Detected**\n\nThis tool would extract attachments from the specified emails. Implementation coming soon!\n\n**Parameters received:**\n\`\`\`json\n${toolCall.function.arguments}\n\`\`\``,
                    };
                default:
                    return {
                        tool_name: toolName,
                        success: false,
                        message: `Tool \`${toolName}\` is not implemented currently.`,
                    };
            }
        } catch (error) {
            return {
                tool_name: toolName,
                success: false,
                error: error.message,
                message: `Error processing tool '${toolName}': ${error.message}`,
            };
        }
    }

    public async sendEmail(emailData: ISendEmailData, user: IUser): Promise<{ success: boolean; message: string }> {

        try {
            // Get user's preferred language
            const language = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );

            // Validate required fields
            if (!emailData.to || emailData.to.length === 0) {
                return {
                    success: false,
                    message: t(Translations.SEND_EMAIL_VALIDATION_TO_REQUIRED, language),
                };
            }

            if (!emailData.subject) {
                return {
                    success: false,
                    message: t(Translations.SEND_EMAIL_VALIDATION_SUBJECT_REQUIRED, language),
                };
            }

            if (!emailData.content) {
                return {
                    success: false,
                    message: t(Translations.SEND_EMAIL_VALIDATION_CONTENT_REQUIRED, language),
                };
            }

            // Get user's preferred email provider and check authentication
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id
            );
            const userPreference = await userPreferenceStorage.getUserPreference();
            const emailProvider = userPreference.emailProvider;

            // Check if provider is supported
            if (!EmailServiceFactory.isProviderSupported(emailProvider)) {
                return {
                    success: false,
                    message: t(Translations.PROVIDER_NOT_IMPLEMENTED, language, { provider: emailProvider }),
                };
            }

            // Check if user is authenticated
            const isAuthenticated = await EmailServiceFactory.isUserAuthenticated(
                emailProvider,
                user.id,
                this.http,
                this.persistence,
                this.read,
                this.app.getLogger()
            );

            if (!isAuthenticated) {
                return {
                    success: false,
                    message: t(Translations.NOT_AUTHENTICATED, language, { provider: emailProvider }),
                };
            }

            // Get OAuth service and send email
            const oauthService = await EmailServiceFactory.createOAuthService(
                emailProvider,
                this.http,
                this.persistence,
                this.read,
                this.app.getLogger()
            );

            const accessToken = await oauthService.getValidAccessToken(user.id);
            if (!accessToken) {
                return {
                    success: false,
                    message: t(Translations.ERROR_TOKEN_EXPIRED, language),
                };
            }

            // Get user info to get the from email
            const userInfo = await EmailServiceFactory.getUserInfo(
                emailProvider,
                user.id,
                this.http,
                this.persistence,
                this.read,
                this.app.getLogger()
            );

            const fromEmail = userInfo.email;
            if (!fromEmail) {
                return {
                    success: false,
                    message: t(Translations.SEND_EMAIL_ERROR_NO_FROM_EMAIL, language),
                };
            }

            // Send the email
            try {
                const success = await this.sendEmailWithProvider(emailData, accessToken, fromEmail, emailProvider);
                
                if (success) {
                    return {
                        success: true,
                        message: t(Translations.SEND_EMAIL_SUCCESS, language),
                    };
                } else {
                    return {
                        success: false,
                        message: t(Translations.SEND_EMAIL_FAILED, language, { error: t(Translations.COMMON_UNKNOWN_ERROR, language) }),
                    };
                }
            } catch (sendError) {
                return {
                    success: false,
                    message: t(Translations.SEND_EMAIL_FAILED, language, { error: sendError.message }),
                };
            }

        } catch (error) {
            // Fallback to English if language detection fails
            return {
                success: false,
                message: t(Translations.SEND_EMAIL_FAILED, Language.en, { error: error.message }),
            };
        }
    }

    private async sendEmailWithProvider(
        emailData: ISendEmailData,
        accessToken: string,
        fromEmail: string,
        provider: EmailProviders
    ): Promise<boolean> {
        try {
            switch (provider) {
                case EmailProviders.GMAIL:
                    return await this.sendEmailViaGmail(emailData, accessToken, fromEmail);
                case EmailProviders.OUTLOOK:
                    return await this.sendEmailViaOutlook(emailData, accessToken, fromEmail);
                default:
                    throw new Error(`Unsupported provider: ${provider}`);
            }
        } catch (error) {
            this.app.getLogger().error('Error sending email with provider:', error);
            throw error;
        }
    }

    private async sendEmailViaGmail(
        emailData: ISendEmailData,
        accessToken: string,
        fromEmail: string
    ): Promise<boolean> {
        try {
            // Create the email content
            const toList = emailData.to.join(', ');
            const ccList = emailData.cc ? emailData.cc.join(', ') : '';

            let emailContent = `From: ${fromEmail}\r\n`;
            emailContent += `To: ${toList}\r\n`;
            if (ccList) {
                emailContent += `Cc: ${ccList}\r\n`;
            }
            emailContent += `Subject: ${emailData.subject}\r\n`;
            emailContent += `Content-Type: text/plain; charset=utf-8\r\n\r\n`;
            emailContent += emailData.content;

            // Encode the email in base64url format (Gmail specific)
            const encodedEmail = Buffer.from(emailContent)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            // Send the email using Gmail API
            const response = await this.http.post(GoogleOauthUrls.SEND_EMAIL, {
                headers: HeaderBuilders.createJsonAuthHeaders(accessToken),
                data: {
                    raw: encodedEmail
                }
            });

            // Check response status
            if (response.statusCode === 200) {
                return true;
            } else {
                // Log detailed error information
                let errorMessage = `HTTP ${response.statusCode}`;
                try {
                    const errorData = JSON.parse(response.content || '{}');
                    errorMessage += ` - ${errorData.error?.message || errorData.error || response.content}`;
                } catch {
                    errorMessage += ` - ${response.content || 'No error details'}`;
                }
                this.app.getLogger().error('Gmail API error:', errorMessage);
                throw new Error(`Gmail API error: ${errorMessage}`);
            }
        } catch (error) {
            this.app.getLogger().error('Error sending email via Gmail:', error);
            throw error;
        }
    }

    private async sendEmailViaOutlook(
        emailData: ISendEmailData,
        accessToken: string,
        fromEmail: string
    ): Promise<boolean> {
        try {
            // Create the email payload for Outlook API
            const emailPayload: any = {
                message: {
                    subject: emailData.subject,
                    body: {
                        contentType: 'Text',
                        content: emailData.content
                    },
                    toRecipients: emailData.to.map(email => ({
                        emailAddress: {
                            address: email
                        }
                    }))
                }
            };

            // Only add ccRecipients if there are CC recipients
            if (emailData.cc && emailData.cc.length > 0) {
                emailPayload.message.ccRecipients = emailData.cc.map(email => ({
                    emailAddress: {
                        address: email
                    }
                }));
            }

            // Send the email using Outlook API
            const response = await this.http.post(MicrosoftOauthUrls.SEND_EMAIL, {
                headers: HeaderBuilders.createJsonAuthHeaders(accessToken),
                data: emailPayload
            });

            // Check response status
            if (response.statusCode === 202) {
                return true;
            } else {
                // Log detailed error information
                let errorMessage = `HTTP ${response.statusCode}`;
                try {
                    const errorData = JSON.parse(response.content || '{}');
                    errorMessage += ` - ${errorData.error?.message || errorData.error || response.content}`;
                } catch {
                    errorMessage += ` - ${response.content || 'No error details'}`;
                }
                this.app.getLogger().error('Outlook API error:', errorMessage);
                throw new Error(`Outlook API error: ${errorMessage}`);
            }
        } catch (error) {
            this.app.getLogger().error('Error sending email via Outlook:', error);
            throw error;
        }
    }

    private async handleStatsToolCall(toolCall: IToolCall, user: IUser): Promise<IToolExecutionResult> {
        try {
            // Parse tool arguments
            const args = JSON.parse(toolCall.function.arguments);
            const daysRequested = args.days || 1;

            // Get user's preferred language
            const language = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );

            // Validate days parameter (1-15 range)
            if (!Number.isInteger(daysRequested) || daysRequested < 1) {
                return {
                    tool_name: LlmTools.STATS,
                    success: false,
                    message: t(Translations.STATS_DAYS_INVALID, language),
                };
            }

            if (daysRequested > 15) {
                return {
                    tool_name: LlmTools.STATS,
                    success: false,
                    message: t(Translations.STATS_DAYS_RANGE_ERROR, language),
                };
            }

            // Get user's preferred email provider
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id
            );
            const userPreference = await userPreferenceStorage.getUserPreference();
            const emailProvider = userPreference.emailProvider;
            const categories = userPreference.statsCategories;
            const useLLMCategorization = userPreference.emailCategorization === 'llm';

            // Check if provider is supported
            if (!EmailServiceFactory.isProviderSupported(emailProvider)) {
                const providerName = getProviderDisplayName(emailProvider);
                return {
                    tool_name: LlmTools.STATS,
                    success: false,
                    message: t(Translations.STATS_PROVIDER_NOT_SUPPORTED, language, { provider: providerName }),
                };
            }

            // Check if user is authenticated
            const isAuthenticated = await EmailServiceFactory.isUserAuthenticated(
                emailProvider,
                user.id,
                this.http,
                this.persistence,
                this.read,
                this.app.getLogger()
            );

            if (!isAuthenticated) {
                return {
                    tool_name: LlmTools.STATS,
                    success: false,
                    message: t(Translations.STATS_NOT_AUTHENTICATED, language, { provider: getProviderDisplayName(emailProvider) }),
                };
            }

            // Calculate hours based on days (24 hours per day)
            const hoursBack = daysRequested * 24;

            // Get email statistics for the specified time period
            const statsParams: IEmailStatsParams = {
                userId: user.id,
                hoursBack: hoursBack,
                categories,
                useLLMCategorization,
                language,
            };

            const statistics = await EmailServiceFactory.getEmailStatistics(
                emailProvider,
                statsParams,
                this.http,
                this.persistence,
                this.read,
                this.app.getLogger(),
                language
            );

            // Use centralized stats formatting
            const statsMessage = EmailFormats.formatEmailStats(statistics, language);

            return {
                tool_name: LlmTools.STATS,
                success: true,
                message: statsMessage,
            };

        } catch (error) {
            const language = Language.en; // Fallback language
            return {
                tool_name: LlmTools.STATS,
                success: false,
                error: error.message,
                message: t(Translations.STATS_ERROR, language, { error: error.message }),
            };
        }
    }
} 