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
import { t, Language } from '../lib/Translation/translation';
import { Translations } from '../constants/Translations';
import { LLMService } from '../services/LLMService';
import { ToolExecutorService } from '../services/ToolExecutorService';
import { IToolCall } from '../definition/lib/ToolInterfaces';
import { ISendEmailData, ISummarizeParams } from '../definition/lib/IEmailUtils';
import { LlmTools } from '../enums/LlmTools';
import { UsernameService } from '../services/UsernameService';
import { MessageFormatter } from '../lib/MessageFormatter';
import { RoomInteractionStorage } from '../storage/RoomInteractionStorage';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { ActionIds } from '../enums/ActionIds';
import { EmailFormats } from '../lib/formats/EmailFormats';
import { handleError } from '../helper/errorHandler';
import { getLLMSettings, getEffectiveLLMSettings } from '../config/SettingsManager';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';

export class NLQueryHandler {
    private originalQuery: string = '';

    constructor(
        private readonly app: EmailBridgeNlpApp,
        private readonly read: IRead,
        private readonly modify: IModify,
        private readonly http: IHttp,
        private readonly persis: IPersistence,
        private readonly sender: IUser,
        private readonly room: IRoom,
        private readonly language: Language,
        private readonly triggerId?: string,
        private readonly threadId?: string
    ) {}

    private extractUsernamesFromCurrentQuery(): string[] {
        const usernameService = new UsernameService(this.read);
        return usernameService.extractUsernamesFromQuery(this.originalQuery);
    }

    private async mapEmailsToUsernames(args: any, usernameService: UsernameService): Promise<{ toUsernames: string[], ccUsernames: string[] }> {
        // Get enhanced query with email mappings
        const enhancedQuery = await usernameService.enhanceQueryWithEmails(this.originalQuery);
        const usernamePairs = UsernameService.extractUsernameEmailPairs(enhancedQuery);

        const toEmails = Array.isArray(args.to) ? args.to : [args.to].filter(Boolean);
        const ccEmails = args.cc ? (Array.isArray(args.cc) ? args.cc : [args.cc].filter(Boolean)) : [];

        // Map emails back to usernames
        const toUsernames: string[] = [];
        const ccUsernames: string[] = [];

        for (const pair of usernamePairs) {
            if (toEmails.includes(pair.email)) {
                toUsernames.push(pair.username);
            } else if (ccEmails.includes(pair.email)) {
                ccUsernames.push(pair.username);
            }
        }

        return { toUsernames, ccUsernames };
    }

    public async processNaturalLanguageQuery(query: string): Promise<void> {
        const appUser = (await this.read.getUserReader().getAppUser()) as IUser;

        // Store the original query for username extraction
        this.originalQuery = query;

        try {
            // Send initial query message with AI thinking indicator
            await this.sendQueryMessage(query, appUser);

            // Process the query with LLM
            const { toolCalls, error } = await this.processWithLLM(query);

            if (error) {
                await this.sendUserFriendlyError(error, appUser);
                return;
            }

            if (toolCalls && toolCalls.length > 0) {
                await this.handleToolExecution(toolCalls[0], appUser);
            } else {
                await this.sendUserFriendlyError(
                    t(Translations.LLM_NO_RESPONSE, this.language),
                    appUser,
                    'no_response'
                );
            }

        } catch (error) {
            this.app.getLogger().error('ProcessNaturalLanguageQuery error:', error);
            await this.sendUserFriendlyError(
                t(Translations.LLM_API_OR_URL_ERROR, this.language),
                appUser,
                'system_error'
            );
        }
    }

    private async sendQueryMessage(query: string, appUser: IUser): Promise<void> {
        const queryMessage = this.modify
            .getCreator()
            .startMessage()
            .setSender(appUser)
            .setRoom(this.room)
            .setGroupable(false)
            .setText(MessageFormatter.formatQueryMessage(query, this.language));

        await this.read.getNotifier().notifyUser(this.sender, queryMessage.getMessage());
    }

    private async processWithLLM(query: string): Promise<{ toolCalls: IToolCall[] | null, error: string | null }> {
        try {
            // Enhance query with email addresses for mentioned users
            const usernameService = new UsernameService(this.read);
            const enhancedQuery = await usernameService.enhanceQueryWithEmails(query);

            // Get user preference for LLM settings
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persis,
                this.read.getPersistenceReader(),
                this.sender.id
            );
            const userPreference = await userPreferenceStorage.getUserPreference();

            // Get effective LLM settings (user preference over admin settings)
            const llmSettings = await getEffectiveLLMSettings(
                this.read.getEnvironmentReader().getSettings(),
                userPreference
            );
            const llmService = new LLMService(this.http, llmSettings, this.app, this.language);
            const result = await llmService.processNaturalLanguageQuery(enhancedQuery);

            return {
                toolCalls: result.toolCalls,
                error: result.error || null
            };
        } catch (error) {
            this.app.getLogger().error('LLM processing error:', error);
            return {
                toolCalls: null,
                error: this.categorizeError(error)
            };
        }
    }

    private async sendUserFriendlyError(error: string, appUser: IUser, errorType?: string): Promise<void> {
        // Only send user notifications for actionable errors
        if (this.shouldNotifyUser(errorType)) {
            const errorMessage = this.modify
                .getCreator()
                .startMessage()
                .setSender(appUser)
                .setRoom(this.room)
                .setGroupable(false)
                .setText(error);

            await this.read.getNotifier().notifyUser(this.sender, errorMessage.getMessage());
        }
    }

    private shouldNotifyUser(errorType?: string): boolean {
        // Only notify users for specific error types that they can act on
        const notifiableErrors = [
            'no_response',
            'parsing_error',
            'authentication_error',
            'data_not_found',
            'network_error',
            'system_error'
        ];

        return !errorType || notifiableErrors.includes(errorType);
    }

    private categorizeError(error: any): string {
        const errorMessage = error.message?.toLowerCase() || '';

        if (errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('timeout')) {
            return t(Translations.ERROR_NETWORK_FAILURE, this.language);
        }

        if (errorMessage.includes('auth') || errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
            return t(Translations.ERROR_PERMISSION_DENIED, this.language);
        }

        if (errorMessage.includes('not found') || errorMessage.includes('missing')) {
            return t(Translations.ERROR_EMAIL_DATA_UNAVAILABLE, this.language);
        }

        // Default to a user-friendly generic error
        return t(Translations.COMMON_UNKNOWN_ERROR, this.language);
    }

    private async handleToolExecution(toolCall: IToolCall, appUser: IUser): Promise<void> {
        // Parse tool arguments - LLM now provides clean JSON
        let args: any;
        try {
            args = JSON.parse(toolCall.function.arguments);
        } catch (parseError) {
            await this.sendUserFriendlyError(
                t(Translations.LLM_PARSING_ERROR, this.language),
                appUser,
                'parsing_error'
            );
            return;
        }

        // Handle email tools with UI buttons
        if (toolCall.function.name === LlmTools.SEND_EMAIL || toolCall.function.name === LlmTools.SUMMARIZE_AND_SEND_EMAIL) {
            await this.handleEmailTools(toolCall, args, appUser);
        } else {
            // Use ToolExecutorService for other tools
            await this.executeOtherTools(toolCall, args, appUser);
        }
    }

    private async handleEmailTools(toolCall: IToolCall, args: any, appUser: IUser): Promise<void> {
        try {
            let emailData: ISendEmailData;

            if (toolCall.function.name === LlmTools.SEND_EMAIL) {
                // Map emails back to usernames for To and CC separately
                const usernameService = new UsernameService(this.read);
                const { toUsernames, ccUsernames } = await this.mapEmailsToUsernames(args, usernameService);

                const toEmails = Array.isArray(args.to) ? args.to as string[] : [args.to].filter(Boolean) as string[];
                const ccEmails = args.cc ? (Array.isArray(args.cc) ? args.cc as string[] : [args.cc].filter(Boolean) as string[]) : undefined;

                emailData = {
                    to: [...new Set(toEmails)],
                    cc: ccEmails ? [...new Set(ccEmails)] : undefined,
                    subject: args.subject || '',
                    content: args.content || '',
                    toUsernames: [...new Set(toUsernames)], // Remove duplicate usernames
                    ccUsernames: [...new Set(ccUsernames)], // Remove duplicate usernames
                };
            } else {
                // Handle summarize-and-send-email tool
                emailData = await this.prepareSummarizeEmailData(args);
            }



            // Store email data for button handlers
            await this.storeEmailDataForButtons(emailData);

            // Create and send formatted response with button
            await this.sendEmailReadyMessage(emailData, toolCall, appUser);
        } catch (error) {
            this.app.getLogger().error('Error handling email tools:', error);
            await this.sendUserFriendlyError(
                this.categorizeError(error),
                appUser,
                'data_processing_error'
            );
        }
    }

    private async prepareSummarizeEmailData(args: any): Promise<ISendEmailData> {
        try {
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

            // Create services for summarization
            const { MessageService } = await import('../services/MessageService');
            const messageService = new MessageService();

            // Get user preference for LLM settings
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persis,
                this.read.getPersistenceReader(),
                this.sender.id
            );
            const userPreference = await userPreferenceStorage.getUserPreference();

            // Get effective LLM settings (user preference over admin settings)
            const llmSettings = await getEffectiveLLMSettings(
                this.read.getEnvironmentReader().getSettings(),
                userPreference
            );
            const llmService = new LLMService(this.http, llmSettings, this.app, this.language);

            // Retrieve messages from the current room or thread
            const messages = await messageService.getMessages(this.room, this.read, this.sender, summarizeParams, this.threadId);

            if (messages.length === 0) {
                throw new Error(t(Translations.NO_MESSAGES_TO_SUMMARIZE, this.language));
            }

            // Format messages for summarization
            const formattedMessages = messageService.formatMessagesForSummary(messages);

            // Generate summary using LLM
            const channelName = this.room.displayName || 'Channel';
            const summaryContent = await llmService.generateSummary(formattedMessages, channelName);

            if (!summaryContent || summaryContent === "Failed to generate summary due to an error.") {
                throw new Error(t(Translations.SUMMARY_GENERATION_FAILED, this.language));
            }

            // Format email using EmailFormats utility
            const emailResult = EmailFormats.formatSummaryEmail(
                channelName,
                summaryContent,
                messages.length,
                args,
                summarizeParams
            );

            const toEmails = Array.isArray(args.to) ? args.to as string[] : [args.to].filter(Boolean) as string[];
            const ccEmails = args.cc ? (Array.isArray(args.cc) ? args.cc as string[] : [args.cc].filter(Boolean) as string[]) : undefined;
            const toUsernames = this.extractUsernamesFromCurrentQuery();

            return {
                to: [...new Set(toEmails)],
                cc: ccEmails ? [...new Set(ccEmails)] : undefined,
                subject: emailResult.subject,
                content: emailResult.content,
                toUsernames: [...new Set(toUsernames)], // Remove duplicate usernames
                ccUsernames: [], // No CC usernames for summarize
            };
        } catch (error) {
            this.app.getLogger().error('Error preparing summarize email data:', error);
            // Re-throw user-friendly error messages, but convert system errors to generic ones
            if (error.message === t(Translations.NO_MESSAGES_TO_SUMMARIZE, this.language) ||
                error.message === t(Translations.SUMMARY_GENERATION_FAILED, this.language)) {
                throw error;
            }

            // For any other system errors, throw a generic user-friendly message
            throw new Error(t(Translations.ERROR_PROCESSING_SUMMARY_REQUEST, this.language));
        }
    }

    private async storeEmailDataForButtons(emailData: ISendEmailData): Promise<void> {
        const roomInteractionStorage = new RoomInteractionStorage(
            this.persis,
            this.read.getPersistenceReader(),
            this.sender.id,
        );

        // Use ROOM association to match retrieval logic
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.ROOM,
            this.room.id
        );

        // Store email data with proper structure for retrieval
        await this.persis.updateByAssociation(association, { emailData }, true);
        await roomInteractionStorage.storeInteractionRoomId(this.room.id);
    }

    private async sendEmailReadyMessage(emailData: ISendEmailData, toolCall: IToolCall, appUser: IUser): Promise<void> {
        const messageBuilder = this.modify
            .getCreator()
            .startMessage()
            .setSender(appUser)
            .setRoom(this.room)
            .setGroupable(false);

        const block = this.modify.getCreator().getBlockBuilder();

        // Use MessageFormatter for consistent formatting
        const channelName = toolCall.function.name === LlmTools.SUMMARIZE_AND_SEND_EMAIL
            ? this.room.displayName || 'Channel'
            : undefined;

        const formattedMessage = await MessageFormatter.formatEmailReadyMessage(
            this.sender.name || this.sender.username,
            emailData,
            this.language,
            this.read,
            channelName
        );

        block.addSectionBlock({
            text: block.newMarkdownTextObject(formattedMessage),
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

        messageBuilder.setBlocks(block.getBlocks());
        await this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
    }

    private async executeOtherTools(toolCall: IToolCall, args: any, appUser: IUser): Promise<void> {
        try {
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

            if (result.success) {
                const successMessage = this.modify
                    .getCreator()
                    .startMessage()
                    .setSender(appUser)
                    .setRoom(this.room)
                    .setGroupable(false)
                    .setText(result.message);

                await this.read.getNotifier().notifyUser(this.sender, successMessage.getMessage());
            } else {
                await this.sendUserFriendlyError(result.message, appUser, 'tool_execution_error');
            }
        } catch (error) {
            this.app.getLogger().error('Error executing tool:', error);
            await this.sendUserFriendlyError(
                this.categorizeError(error),
                appUser,
                'tool_execution_error'
            );
        }
    }
}
