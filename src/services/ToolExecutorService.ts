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
import { GoogleOauthUrls, MicrosoftOauthUrls } from '../constants/AuthConstants';
import { IToolExecutionResult } from '../definition/lib/ToolInterfaces';
import { ISendEmailData } from '../definition/lib/IEmailUtils';
import { LlmTools } from '../enums/LlmTools';

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
                    return await this.executeSendEmailTool(toolCall, user, room, triggerId);
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

    private async executeSendEmailTool(
        toolCall: IToolCall,
        user: IUser,
        room: IRoom,
        triggerId?: string
    ): Promise<IToolExecutionResult> {

        if (!triggerId) {
            return {
                tool_name: LlmTools.SEND_EMAIL,
                success: false,
                error: 'Trigger ID is missing',
                message: 'A trigger ID is required to open the email modal.',
            };
        }

        try {
            const language = await getUserPreferredLanguage(this.read.getPersistenceReader(), this.persistence, user.id);
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
                    tool_name: LlmTools.SEND_EMAIL,
                    success: false,
                    error: 'Modal creation failed',
                    message: 'Failed to create the send email modal.',
                };
            }

            if (triggerId) {
                try {
                    await this.modify.getUiController().openSurfaceView(modal, { triggerId }, user);

                    return {
                        tool_name: LlmTools.SEND_EMAIL,
                        success: true,
                        message: 'Send email modal opened successfully.',
                        modal_opened: true,
                    };
                } catch (modalError) {
                    return {
                        tool_name: LlmTools.SEND_EMAIL,
                        success: false,
                        error: `Failed to open modal: ${modalError.message}`,
                        message: 'Failed to open the send email modal.',
                    };
                }
            } else {
                return {
                    tool_name: LlmTools.SEND_EMAIL,
                    success: false,
                    error: 'Trigger ID is missing',
                    message: 'A trigger ID is required to open the email modal.',
                };
            }
        } catch (error) {
            return {
                tool_name: LlmTools.SEND_EMAIL,
                success: false,
                error: error.message,
                message: 'Failed to open the send email modal.',
            };
        }
    }

    public async sendEmail(emailData: ISendEmailData, user: IUser): Promise<{ success: boolean; message: string }> {

        try {
            // Validate required fields
            if (!emailData.to || emailData.to.length === 0) {
                return {
                    success: false,
                    message: 'Recipient email address is required.',
                };
            }

            if (!emailData.subject) {
                return {
                    success: false,
                    message: 'Email subject is required.',
                };
            }

            if (!emailData.content) {
                return {
                    success: false,
                    message: 'Email content is required.',
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
                    message: `The selected email provider (${emailProvider}) is not supported.`,
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
                    message: `You are not authenticated with ${emailProvider}. Please log in.`,
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
                    message: `Authentication failed for ${emailProvider}. Please log in again.`,
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
                    message: 'Could not determine your email address.',
                };
            }

            // Send the email
            try {
                const success = await this.sendEmailWithProvider(emailData, accessToken, fromEmail, emailProvider);
                
                if (success) {
                    return {
                        success: true,
                        message: 'Email sent successfully.',
                    };
                } else {
                    return {
                        success: false,
                        message: 'Failed to send email due to an unknown error.',
                    };
                }
            } catch (sendError) {
                return {
                    success: false,
                    message: `Failed to send email: ${sendError.message}`,
                };
            }

        } catch (error) {
            return {
                success: false,
                message: `Failed to send email: ${error.message}`,
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
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
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
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
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
} 