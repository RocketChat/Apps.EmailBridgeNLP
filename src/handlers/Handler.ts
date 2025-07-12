import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { IHandlerParams, IHandler } from '../definition/handlers/IHandler';
import {
    sendDefaultNotification,
    sendHelperNotification,
} from '../helper/notification';
import { EmailServiceFactory } from '../services/auth/EmailServiceFactory';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { t, Language } from '../lib/Translation/translation';
import { UserPreferenceModal } from '../modal/UserPreferenceModal';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';
import { RoomInteractionStorage } from '../storage/RoomInteractionStorage';
import { ActionIds } from '../enums/ActionIds';
import { getProviderDisplayName } from '../enums/ProviderDisplayNames';
import { Translations } from '../constants/Translations';
import { IEmailStatistics, IEmailStatsParams } from '../definition/lib/IEmailStatistics';
import { LLMService } from '../services/LLMService';
import { ToolExecutorService } from '../services/ToolExecutorService';
import { SendEmailModal } from '../modal/SendEmailModal';
import { IToolCall } from '../definition/lib/ToolInterfaces';
import { ISendEmailData, ISummarizeParams } from '../definition/lib/IEmailUtils';
import { LlmTools } from '../enums/LlmTools';
import { UsernameService } from '../services/UsernameService';

export class Handler implements IHandler {
    public app: EmailBridgeNlpApp;
    public sender: IUser;
    public room: IRoom;
    public read: IRead;
    public modify: IModify;
    public http: IHttp;
    public persis: IPersistence;
    public triggerId?: string;
    public threadId?: string;
    public language: Language;

    constructor(params: IHandlerParams) {
        this.app = params.app;
        this.sender = params.sender;
        this.room = params.room;
        this.read = params.read;
        this.modify = params.modify;
        this.http = params.http;
        this.persis = params.persis;
        this.triggerId = params.triggerId;
        this.threadId = params.threadId;
        this.language = params.language;
    }

    public async Help(): Promise<void> {
        await sendHelperNotification(
            this.read,
            this.modify,
            this.sender,
            this.room,
            this.language,
        );
    }

    public async sendDefault(): Promise<void> {
        // Create a UI block with a user preferences button
        const appUser = (await this.read.getUserReader().getAppUser()) as IUser;
        const messageBuilder = this.modify
            .getCreator()
            .startMessage()
            .setSender(appUser)
            .setRoom(this.room)
            .setGroupable(false);

        const block = this.modify.getCreator().getBlockBuilder();

        block.addSectionBlock({
            text: block.newMarkdownTextObject(
                t(Translations.DEFAULT_GREETING, this.language, { name: this.sender.name })
            ),
        });

        block.addSectionBlock({
            text: block.newMarkdownTextObject(
                t(Translations.USE_HELP_COMMAND, this.language)
            ),
        });

        // Add user preferences button
        block.addActionsBlock({
            elements: [
                block.newButtonElement({
                    actionId: ActionIds.USER_PREFERENCE_ACTION,
                    text: block.newPlainTextObject(t(Translations.USER_PREFERENCE_BUTTON_LABEL, this.language)),
                    style: ButtonStyle.PRIMARY,
                }),
            ],
        });

        messageBuilder.setBlocks(block.getBlocks());
        return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
    }

    public async Login(): Promise<void> {
        const appUser = (await this.read.getUserReader().getAppUser()) as IUser;

        const messageBuilder = this.modify
            .getCreator()
            .startMessage()
            .setSender(appUser)
            .setRoom(this.room)
            .setGroupable(false);

        try {
            // Get user's preferred email provider from their personal settings
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persis,
                this.read.getPersistenceReader(),
                this.sender.id,
            );
            const userPreference = await userPreferenceStorage.getUserPreference();
            const emailProvider = userPreference.emailProvider;

            // Check if provider is supported
            if (!EmailServiceFactory.isProviderSupported(emailProvider)) {
                const providerName = getProviderDisplayName(emailProvider);
                const message = t(Translations.PROVIDER_NOT_IMPLEMENTED, this.language, { provider: providerName });
                
                messageBuilder.setText(message);
                return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
            }

            // Check if user is already authenticated
            const isAuthenticated = await EmailServiceFactory.isUserAuthenticated(
                emailProvider,
                this.sender.id,
                this.http,
                this.persis,
                this.read,
                this.app.getLogger()
            );

            if (isAuthenticated) {
                try {
                    const userInfo = await EmailServiceFactory.getUserInfo(
                        emailProvider,
                        this.sender.id,
                        this.http,
                        this.persis,
                        this.read,
                        this.app.getLogger()
                    );
                    messageBuilder.setText(
                        t(Translations.ALREADY_LOGGED_IN, this.language, { 
                            provider: getProviderDisplayName(emailProvider), 
                            email: userInfo.email 
                        })
                    );
                    return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
                } catch (error) {
                    // If we can't get user info, the authentication might be stale or corrupted
                    // Clear the corrupted authentication and proceed with fresh login
                    try {
                        await EmailServiceFactory.logoutUser(
                            emailProvider,
                            this.sender.id,
                            this.http,
                            this.persis,
                            this.read,
                            this.app.getLogger()
                        );
                    } catch (logoutError) {
                        this.app.getLogger().error(t(Translations.LOG_LOGOUT_ERR, this.language), logoutError);
                    }
                    
                    // Fall through to show login button
                }
            }

            // Generate the authorization URL
            const authUrl = await EmailServiceFactory.getAuthenticationUrl(
                emailProvider,
                this.sender.id,
                this.http,
                this.persis,
                this.read,
                this.app.getLogger()
            );

            // Create a UI block with a button
            const block = this.modify.getCreator().getBlockBuilder();

            block.addSectionBlock({
                text: block.newMarkdownTextObject(
                    t(Translations.CONNECT_ACCOUNT_MESSAGE, this.language, { provider: getProviderDisplayName(emailProvider) })
                ),
            });

            block.addActionsBlock({
                elements: [
                    block.newButtonElement({
                        actionId: ActionIds.EMAIL_LOGIN_ACTION,
                        text: block.newPlainTextObject(t(Translations.LOGIN_WITH_PROVIDER, this.language, { provider: getProviderDisplayName(emailProvider) })),
                        url: authUrl,
                        style: ButtonStyle.PRIMARY,
                    }),
                ],
            });

            messageBuilder.setBlocks(block.getBlocks());
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());

        } catch (error) {
            messageBuilder.setText(
                t(Translations.ERROR_PROCESSING_LOGIN, this.language, { error: error.message })
            );
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
        }
    }

    public async Logout(): Promise<void> {
        const appUser = (await this.read.getUserReader().getAppUser()) as IUser;

        const messageBuilder = this.modify
            .getCreator()
            .startMessage()
            .setSender(appUser)
            .setRoom(this.room)
            .setGroupable(false);

        try {
            // Get user's preferred email provider from their personal settings
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persis,
                this.read.getPersistenceReader(),
                this.sender.id,
            );
            const userPreference = await userPreferenceStorage.getUserPreference();
            const emailProvider = userPreference.emailProvider;

            // Check if provider is supported
            if (!EmailServiceFactory.isProviderSupported(emailProvider)) {
                const providerName = getProviderDisplayName(emailProvider);
                const message = t(Translations.PROVIDER_NOT_IMPLEMENTED, this.language, { provider: providerName });
                
                messageBuilder.setText(message);
                return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
            }

            // Check if user is authenticated first
            const isAuthenticated = await EmailServiceFactory.isUserAuthenticated(
                emailProvider,
                this.sender.id,
                this.http,
                this.persis,
                this.read,
                this.app.getLogger()
            );

            if (!isAuthenticated) {
                messageBuilder.setText(t(Translations.NOT_AUTHENTICATED, this.language, { provider: getProviderDisplayName(emailProvider) }));
                return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
            }

            // Get user info to show in confirmation message
            let userInfo;
            try {
                userInfo = await EmailServiceFactory.getUserInfo(
                    emailProvider,
                    this.sender.id,
                    this.http,
                    this.persis,
                    this.read,
                    this.app.getLogger()
                );
            } catch (error) {
                // If we can't get user info, use generic email
                userInfo = { email: t(Translations.GENERIC_ACCOUNT, this.language) };
            }

            // Create a UI block with a confirmation button
            const block = this.modify.getCreator().getBlockBuilder();

            block.addSectionBlock({
                text: block.newMarkdownTextObject(
                    t(Translations.LOGOUT_CONFIRMATION, this.language, { 
                        provider: getProviderDisplayName(emailProvider), 
                        email: userInfo.email 
                    })
                ),
            });

            block.addActionsBlock({
                elements: [
                    block.newButtonElement({
                        actionId: ActionIds.EMAIL_LOGOUT_ACTION,
                        text: block.newPlainTextObject(t(Translations.CONFIRM_LOGOUT, this.language)),
                        style: ButtonStyle.DANGER,
                    }),
                ],
            });

            // Set the blocks in the message
            messageBuilder.setBlocks(block.getBlocks());
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());

        } catch (error) {
            messageBuilder.setText(t(Translations.ERROR_PREPARING_LOGOUT, this.language, { error: error.message }));
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
        }
    }

    public async Config(): Promise<void> {
        try {
            // Store room ID for later use in ExecuteViewSubmitHandler (similar to how the button works)
            const roomInteractionStorage = new RoomInteractionStorage(
                this.persis,
                this.read.getPersistenceReader(),
                this.sender.id,
            );
            
            await roomInteractionStorage.storeInteractionRoomId(this.room.id);

            const userPreference = new UserPreferenceStorage(
                this.persis,
                this.read.getPersistenceReader(),
                this.sender.id,
            );
            const existingPreference = await userPreference.getUserPreference();

            const modal = await UserPreferenceModal({
                app: this.app,
                modify: this.modify,
                existingPreference: existingPreference,
            });

            if (!modal) {
                throw new Error(t(Translations.ERROR_MODAL_CREATION_FAILED, this.language));
            }

            if (!this.triggerId) {
                throw new Error(t(Translations.ERROR_TRIGGER_ID_MISSING, this.language));
            }

            await this.modify
                .getUiController()
                .openSurfaceView(modal, { triggerId: this.triggerId }, this.sender);

        } catch (error) {
            const appUser = (await this.read.getUserReader().getAppUser()) as IUser;
            const messageBuilder = this.modify
                .getCreator()
                .startMessage()
                .setSender(appUser)
                .setRoom(this.room)
                .setGroupable(false);

            messageBuilder.setText(t(Translations.CONFIG_ERROR, this.language, { error: error.message }));
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
        }
    }

    public async Report(): Promise<void> {
        const appUser = (await this.read.getUserReader().getAppUser()) as IUser;

        const messageBuilder = this.modify
            .getCreator()
            .startMessage()
            .setSender(appUser)
            .setRoom(this.room)
            .setGroupable(false);

        try {
            // Get user's preferred email provider from their personal settings
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persis,
                this.read.getPersistenceReader(),
                this.sender.id,
            );
            const userPreference = await userPreferenceStorage.getUserPreference();
            const emailProvider = userPreference.emailProvider;
            const categories = userPreference.reportCategories;

            // Check if provider is supported
            if (!EmailServiceFactory.isProviderSupported(emailProvider)) {
                const providerName = getProviderDisplayName(emailProvider);
                const message = t(Translations.REPORT_PROVIDER_NOT_SUPPORTED, this.language, { provider: providerName });
                
                messageBuilder.setText(message);
                return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
            }

            // Check if user is authenticated
            const isAuthenticated = await EmailServiceFactory.isUserAuthenticated(
                emailProvider,
                this.sender.id,
                this.http,
                this.persis,
                this.read,
                this.app.getLogger()
            );

            if (!isAuthenticated) {
                messageBuilder.setText(t(Translations.REPORT_NOT_AUTHENTICATED, this.language, { provider: getProviderDisplayName(emailProvider) }));
                return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
            }

            // Get email statistics for last 24 hours
            const statsParams: IEmailStatsParams = {
                userId: this.sender.id,
                hoursBack: 24,
                categories,
            };

            const statistics = await EmailServiceFactory.getEmailStatistics(
                emailProvider,
                statsParams,
                this.http,
                this.persis,
                this.read,
                this.app.getLogger(),
                this.language
            );

            let categoryReport = '';
            if (statistics.categoryStats) {
                for (const category in statistics.categoryStats) {
                    if (statistics.categoryStats.hasOwnProperty(category)) {
                        const stats = statistics.categoryStats[category];
                        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                        categoryReport += `**${categoryName}**: ${stats.total} emails (${stats.unread} unread)\n`;
                    }
                }
            }

            // Create a comprehensive report
            const reportMessage = t(Translations.REPORT_HEADER, this.language) + '\n\n' +
                                 t(Translations.REPORT_STATISTICS, this.language, {
                                     receivedToday: statistics.receivedToday.toString(),
                                     receivedUnreadToday: statistics.receivedUnreadToday.toString(),
                                     sentToday: statistics.sentToday.toString()
                                 }) + '\n\n' +
                                 categoryReport +
                                 '---';
            messageBuilder.setText(reportMessage);
            
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());

        } catch (error) {
            this.app.getLogger().error('Report generation error:', error);
            messageBuilder.setText(
                t(Translations.REPORT_ERROR, this.language, { error: error.message })
            );
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
        }
    }

    public async OpenSendEmailModal(emailData: ISendEmailData): Promise<void> {
        try {
            // Store room ID for later use in ExecuteViewSubmitHandler
            const roomInteractionStorage = new RoomInteractionStorage(
                this.persis,
                this.read.getPersistenceReader(),
                this.sender.id,
            );
            
            await roomInteractionStorage.storeInteractionRoomId(this.room.id);

            const modal = await SendEmailModal({
                app: this.app,
                modify: this.modify,
                language: this.language,
                emailData,
                context: 'llm',
            });

            if (!modal) {
                throw new Error(t(Translations.ERROR_MODAL_CREATION_FAILED, this.language));
            }

            if (!this.triggerId) {
                throw new Error(t(Translations.ERROR_TRIGGER_ID_MISSING, this.language));
            }

            await this.modify
                .getUiController()
                .openSurfaceView(modal, { triggerId: this.triggerId }, this.sender);

        } catch (error) {
            const appUser = (await this.read.getUserReader().getAppUser()) as IUser;
            const messageBuilder = this.modify
                .getCreator()
                .startMessage()
                .setSender(appUser)
                .setRoom(this.room)
                .setGroupable(false);

            messageBuilder.setText(t(Translations.ERROR_MODAL_CREATION_FAILED, this.language));
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
        }
    }

    public async ProcessNaturalLanguageQuery(query: string): Promise<void> {
        const appUser = (await this.read.getUserReader().getAppUser()) as IUser;
        const messageBuilder = this.modify
            .getCreator()
            .startMessage()
            .setSender(appUser)
            .setRoom(this.room)
            .setGroupable(false);

        try {
            // Show user query first
            const queryDisplayMessage = `${t(Translations.LLM_USER_QUERY_DISPLAY, this.language, { query })}\n\n🤖 ${t(Translations.LLM_AI_THINKING, this.language)}`;
            messageBuilder.setText(queryDisplayMessage);
            await this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());

            // Enhance query with email addresses for mentioned users
            const usernameService = new UsernameService(this.read);
            const enhancedQuery = await usernameService.enhanceQueryWithEmails(query);

            // Process enhanced query with LLM
            const llmService = new LLMService(this.http, this.app.getLogger());
            const { toolCalls, error } = await llmService.processNaturalLanguageQuery(enhancedQuery);

            // Create new message for results
            const resultMessageBuilder = this.modify
                .getCreator()
                .startMessage()
                .setSender(appUser)
                .setRoom(this.room)
                .setGroupable(false);

            if (error) {
                resultMessageBuilder.setText(error);
                return this.read.getNotifier().notifyUser(this.sender, resultMessageBuilder.getMessage());
            }

            if (toolCalls && toolCalls.length > 0) {
                const toolCall = toolCalls[0];
                const toolDisplayName = this.getToolDisplayName(toolCall.function.name);
                const args = JSON.parse(toolCall.function.arguments);
                
                // Handle send-email and summarize-and-send-email tools with buttons instead of immediate modal
                if (toolCall.function.name === 'send-email' || toolCall.function.name === 'summarize-and-send-email') {
                    let emailData: ISendEmailData;
                    
                    if (toolCall.function.name === 'send-email') {
                        // Store email data for later use in button handlers
                        emailData = {
                            to: Array.isArray(args.to) ? args.to : [args.to].filter(Boolean),
                            cc: args.cc ? (Array.isArray(args.cc) ? args.cc : [args.cc].filter(Boolean)) : undefined,
                            subject: args.subject || '',
                            content: args.content || '',
                        };
                    } else {
                        // Handle summarize-and-send-email tool
                        try {
                            // Create summarize parameters
                            const summarizeParams: ISummarizeParams = {
                                start_date: args.start_date,
                                end_date: args.end_date,
                                people: args.people,
                                format: args.format,
                            };

                            // Calculate days if date range is provided
                            if (args.start_date && args.end_date) {
                                const startDate = new Date(args.start_date);
                                const endDate = new Date(args.end_date);
                                const timeDiff = endDate.getTime() - startDate.getTime();
                                summarizeParams.days = Math.ceil(timeDiff / (1000 * 3600 * 24));
                            }

                            // Create services
                            const { MessageService } = await import('../services/MessageService');
                            const messageService = new MessageService();
                            const llmService = new LLMService(this.http, this.app.getLogger());

                            // Retrieve messages from the current room
                            const messages = await messageService.getMessages(this.room, this.read, this.sender, summarizeParams, this.threadId);

                            if (messages.length === 0) {
                                resultMessageBuilder.setText(t(Translations.NO_MESSAGES_TO_SUMMARIZE, this.language));
                                return this.read.getNotifier().notifyUser(this.sender, resultMessageBuilder.getMessage());
                            }

                            // Format messages for summarization
                            const formattedMessages = messageService.formatMessagesForSummary(messages);

                            // Generate summary using LLM
                            const channelName = this.room.displayName || 'Channel';
                            const summary = await llmService.generateSummary(formattedMessages, channelName);

                            if (!summary || summary === "Failed to generate summary due to an error.") {
                                resultMessageBuilder.setText(t(Translations.SUMMARY_GENERATION_FAILED, this.language));
                                return this.read.getNotifier().notifyUser(this.sender, resultMessageBuilder.getMessage());
                            }

                            // Prepare email content
                            const subject = args.subject || `Summary of ${channelName} conversation`;
                            
                            let emailContent = `CONVERSATION SUMMARY: ${channelName}\n\n`;
                            emailContent += `${summary}\n\n`;
                            emailContent += `--------------------------------------------------\n\n`;
                            emailContent += `SUMMARY DETAILS:\n`;
                            emailContent += `- Messages included: ${messages.length}\n`;
                            emailContent += `- Channel: ${channelName}\n`;
                            
                            if (args.people && args.people.length > 0) {
                                emailContent += `- Participants: ${args.people.join(', ')}\n`;
                            }
                            
                            if (summarizeParams.days) {
                                emailContent += `- Time period: Last ${summarizeParams.days} day(s)\n`;
                            } else if (args.start_date && args.end_date) {
                                emailContent += `- Time period: ${args.start_date} to ${args.end_date}\n`;
                            }
                            
                            emailContent += `\nThis summary was generated automatically by EmailBridge NLP.`;

                            emailData = {
                                to: Array.isArray(args.to) ? args.to : [args.to].filter(Boolean),
                                cc: args.cc ? (Array.isArray(args.cc) ? args.cc : [args.cc].filter(Boolean)) : undefined,
                                subject,
                                content: emailContent,
                            };

                        } catch (error) {
                            resultMessageBuilder.setText(`Failed to generate summary: ${error.message}`);
                            return this.read.getNotifier().notifyUser(this.sender, resultMessageBuilder.getMessage());
                        }
                    }

                    // Store email data in room interaction storage for button handlers
                    const roomInteractionStorage = new RoomInteractionStorage(
                        this.persis,
                        this.read.getPersistenceReader(),
                        this.sender.id,
                    );
                    await roomInteractionStorage.storeInteractionRoomId(this.room.id);
                    // Store email data with room interaction
                    await this.persis.updateByAssociation(
                        new RocketChatAssociationRecord(
                            RocketChatAssociationModel.ROOM,
                            this.room.id,
                        ),
                        { emailData },
                        true,
                    );

                    // Show simplified email ready message with buttons
                    const block = this.modify.getCreator().getBlockBuilder();
                    
                    const messageText = toolCall.function.name === 'summarize-and-send-email' 
                        ? t(Translations.LLM_SUMMARY_EMAIL_READY_USER, this.language, { 
                            name: this.sender.name || this.sender.username,
                            channelName: this.room.displayName || 'Channel',
                            subject: emailData.subject 
                          })
                        : t(Translations.LLM_EMAIL_READY_USER, this.language, { 
                            name: this.sender.name || this.sender.username, 
                            subject: emailData.subject 
                          });
                    
                    block.addSectionBlock({
                        text: block.newMarkdownTextObject(messageText),
                    });

                    block.addActionsBlock({
                        elements: [
                            block.newButtonElement({
                                actionId: ActionIds.SEND_EMAIL_EDIT_ACTION,
                                text: block.newPlainTextObject(t(Translations.EMAIL_EDIT_AND_SEND_BUTTON, this.language)),
                                style: ButtonStyle.PRIMARY,
                            }),
                        ],
                    });

                    resultMessageBuilder.setBlocks(block.getBlocks());
                    return this.read.getNotifier().notifyUser(this.sender, resultMessageBuilder.getMessage());
                }

                // Use the ToolExecutorService for all other tools
                const toolExecutorService = new ToolExecutorService(
                    this.app,
                    this.read,
                    this.modify,
                    this.http,
                    this.persis
                );
                
                const result = await toolExecutorService.executeTool(
                    toolCall,
                    this.sender,
                    this.room,
                    this.triggerId
                );
                
                // Create formatted message showing the tool execution result
                const block = this.modify.getCreator().getBlockBuilder();
                
                if (result.success) {
                block.addSectionBlock({
                    text: block.newMarkdownTextObject(
                        t(Translations.LLM_TOOL_DETECTED, this.language, { 
                            query,
                            tool: toolDisplayName 
                        })
                    ),
                });

                    if (result.modal_opened) {
                        block.addSectionBlock({
                            text: block.newMarkdownTextObject(
                                `✅ ${result.message}`
                            ),
                        });
                    } else {
                block.addSectionBlock({
                    text: block.newMarkdownTextObject(
                        `**${t(Translations.TOOL_NAME_LABEL, this.language)}:** ${toolDisplayName}\n` +
                                `**${t(Translations.TOOL_ARGS_LABEL, this.language)}:** \`${JSON.stringify(args, null, 2)}\`\n` +
                                `**Result:** ${result.message}`
                            ),
                        });
                    }
                } else {
                    block.addSectionBlock({
                        text: block.newMarkdownTextObject(
                            `❌ **Tool Execution Failed**\n` +
                            `**Tool:** ${toolDisplayName}\n` +
                            `**Error:** ${result.error || result.message}`
                    ),
                });
                }

                resultMessageBuilder.setBlocks(block.getBlocks());
            } else {
                resultMessageBuilder.setText(
                    t(Translations.LLM_NO_TOOL_DETECTED, this.language, { query })
                );
            }

            return this.read.getNotifier().notifyUser(this.sender, resultMessageBuilder.getMessage());

        } catch (error) {
            messageBuilder.setText(
                t(Translations.LLM_ERROR_PROCESSING, this.language, { 
                    query, 
                    error: error.message 
                })
            );
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
        }
    }

    private getToolDisplayName(toolName: string): string {
        switch (toolName) {
            case LlmTools.SEND_EMAIL:
                return t(Translations.TOOL_SEND_EMAIL, this.language);
            case LlmTools.EXTRACT_ATTACHMENT:
                return t(Translations.TOOL_EXTRACT_ATTACHMENT, this.language);
            case LlmTools.SUMMARIZE_AND_SEND_EMAIL:
                return t(Translations.TOOL_SUMMARIZE_AND_SEND, this.language);
            case LlmTools.REPORT:
                return t(Translations.TOOL_REPORT, this.language);
            default:
                return toolName;
        }
    }
} 