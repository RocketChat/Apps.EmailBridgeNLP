import { IModify, IHttp, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { IToolCall } from '../definition/services/ILLMService';
import { SendEmailModal, ISendEmailData } from '../modal/SendEmailModal';
import { getUserPreferredLanguage } from '../helper/userPreference';
import { EmailServiceFactory } from './auth/EmailServiceFactory';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';
import { RoomInteractionStorage } from '../storage/RoomInteractionStorage';
import { t } from '../lib/Translation/translation';
import { Translations } from '../constants/Translations';
import { EmailProviders } from '../enums/EmailProviders';
import { GoogleOauthUrls, MicrosoftOauthUrls } from '../constants/AuthConstants';
import { IToolExecutionResult } from '../definition/services/IToolExecutorService';

export class ToolExecutorService {
    constructor(
        private readonly app: EmailBridgeNlpApp,
        private readonly read: IRead,
        private readonly modify: IModify,
        private readonly http: IHttp,
        private readonly persistence: IPersistence
    ) {}

    public async executeTool(
        toolCall: IToolCall, 
        user: IUser, 
        room: IRoom,
        triggerId?: string
    ): Promise<IToolExecutionResult> {
        const toolName = toolCall.function.name;
        
        try {
            switch (toolName) {
                case 'send-email':
                    return await this.executeSendEmailTool(toolCall, user, room, triggerId);
                default:
                    const language = await getUserPreferredLanguage(this.read.getPersistenceReader(), this.persistence, user.id);
                    return {
                        tool_name: toolName,
                        success: false,
                        error: t(Translations.INVALID_TOOL_NAME, language),
                        message: t(Translations.INVALID_TOOL_NAME, language, { tool: toolName }),
                    };
            }
        } catch (error) {
            const language = await getUserPreferredLanguage(this.read.getPersistenceReader(), this.persistence, user.id);
            return {
                tool_name: toolName,
                success: false,
                error: error.message,
                message: t(Translations.LLM_ERROR_PROCESSING, language, { error: error.message }),
            };
        }
    }

    private async executeSendEmailTool(
        toolCall: IToolCall, 
        user: IUser, 
        room: IRoom,
        triggerId?: string
    ): Promise<IToolExecutionResult> {
        const language = await getUserPreferredLanguage(this.read.getPersistenceReader(), this.persistence, user.id);
        
        if (!triggerId) {
            return {
                tool_name: 'send-email',
                success: false,
                error: t(Translations.ERROR_TRIGGER_ID_MISSING, language),
                message: t(Translations.ERROR_TRIGGER_ID_MISSING, language),
            };
        }

        try {
            // Store room ID for later use in ExecuteViewSubmitHandler (like Config method does)
            const roomInteractionStorage = new RoomInteractionStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            
            await roomInteractionStorage.storeInteractionRoomId(room.id);

            // Parse tool call arguments
            const args = JSON.parse(toolCall.function.arguments);
            
            // Prepare email data from LLM arguments
            const emailData: ISendEmailData = {
                to: Array.isArray(args.to) ? args.to : [args.to].filter(Boolean),
                cc: args.cc ? (Array.isArray(args.cc) ? args.cc : [args.cc].filter(Boolean)) : undefined,
                subject: args.subject || '',
                content: args.content || '',
            };

            // Create and validate the modal
            const modal = await SendEmailModal({
                app: this.app,
                modify: this.modify,
                language,
                emailData,
            });

            if (!modal || !modal.id) {
                return {
                    tool_name: 'send-email',
                    success: false,
                    error: t(Translations.ERROR_MODAL_CREATION_FAILED, language),
                    message: t(Translations.ERROR_MODAL_CREATION_FAILED, language),
                };
            }

            if (triggerId) {
                try {
                    await this.modify.getUiController().openSurfaceView(modal, { triggerId }, user);
                    
                    return {
                        tool_name: 'send-email',
                        success: true,
                        message: t(Translations.SEND_EMAIL_MODAL_OPENED, language),
                        modal_opened: true,
                    };
                } catch (modalError) {
                    return {
                        tool_name: 'send-email',
                        success: false,
                        error: `${t(Translations.MODAL_ERROR_FAILED_TO_OPEN, language)}: ${modalError.message}`,
                        message: t(Translations.MODAL_ERROR_FAILED_TO_OPEN, language),
                    };
                }
            } else {
                return {
                    tool_name: 'send-email',
                    success: false,
                    error: t(Translations.ERROR_TRIGGER_ID_MISSING, language),
                    message: t(Translations.ERROR_TRIGGER_ID_MISSING, language),
                };
            }
        } catch (error) {
            return {
                tool_name: 'send-email',
                success: false,
                error: error.message,
                message: t(Translations.MODAL_ERROR_FAILED_TO_OPEN, language),
            };
        }
    }

    public async sendEmail(emailData: ISendEmailData, user: IUser): Promise<{ success: boolean; message: string }> {
        const language = await getUserPreferredLanguage(this.read.getPersistenceReader(), this.persistence, user.id);
        
        try {
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
                    message: t(Translations.NOT_AUTHENTICATED, language, { provider: emailProvider }),
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
            const success = await this.sendEmailWithProvider(emailData, accessToken, fromEmail, emailProvider);
            
            if (success) {
                return {
                    success: true,
                    message: t(Translations.SEND_EMAIL_SUCCESS, language),
                };
            } else {
                return {
                    success: false,
                    message: t(Translations.SEND_EMAIL_FAILED, language, { error: 'Unknown error' }),
                };
            }

        } catch (error) {
            return {
                success: false,
                message: t(Translations.SEND_EMAIL_FAILED, language, { error: error.message }),
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
            return false;
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
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    raw: encodedEmail
                }
            });

            return response.statusCode === 200;
        } catch (error) {
            return false;
        }
    }

    private async sendEmailViaOutlook(
        emailData: ISendEmailData,
        accessToken: string,
        fromEmail: string
    ): Promise<boolean> {
        try {
            // Create the email payload for Outlook API
            const emailPayload = {
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
                    })),
                    ccRecipients: emailData.cc ? emailData.cc.map(email => ({
                        emailAddress: {
                            address: email
                        }
                    })) : undefined
                }
            };

            // Send the email using Outlook API
            const response = await this.http.post(MicrosoftOauthUrls.SEND_EMAIL, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                data: emailPayload
            });

            return response.statusCode === 202;
        } catch (error) {
            return false;
        }
    }
} 