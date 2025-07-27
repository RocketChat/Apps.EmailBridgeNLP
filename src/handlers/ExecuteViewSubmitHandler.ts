import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    IUIKitResponse,
    UIKitViewSubmitInteractionContext,
    UIKitInteractionType,
} from '@rocket.chat/apps-engine/definition/uikit';

import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { UserPreferenceModalEnum } from '../enums/modals/UserPreferenceModal';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';
import { RoomInteractionStorage } from '../storage/RoomInteractionStorage';
import { getUserPreferredLanguage } from '../helper/userPreference';
import { t, Language } from '../lib/Translation/translation';
import { EmailProviders } from '../enums/EmailProviders';
import { IPreference } from '../definition/lib/IUserPreferences';
import { sendNotification } from '../helper/notification';
import { handleErrorAndGetMessage, handleError, handleLLMErrorAndGetMessage } from '../helper/errorHandler';
import { EmailServiceFactory } from '../services/auth/EmailServiceFactory';
import { ActionIds } from '../enums/ActionIds';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { Translations } from '../constants/Translations';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { SendEmailModalEnum } from '../enums/modals/SendEmailModal';
import { LLMConfigurationModalEnum } from '../enums/modals/LLMConfigurationModal';
import { ToolExecutorService } from '../services/ToolExecutorService';
import { ISendEmailData } from '../definition/lib/IEmailUtils';
import { getProviderDisplayName } from '../enums/ProviderDisplayNames';
import { LLMUsagePreferenceEnum, LLMProviderEnum } from '../definition/lib/IUserPreferences';

export class ExecuteViewSubmitHandler {
    private context: UIKitViewSubmitInteractionContext;

    constructor(
        protected readonly app: EmailBridgeNlpApp,
        protected readonly read: IRead,
        protected readonly http: IHttp,
        protected readonly persistence: IPersistence,
        protected readonly modify: IModify,
        context: UIKitViewSubmitInteractionContext,
    ) {
        this.context = context;
    }

    public async handleActions(): Promise<IUIKitResponse> {
        const { user, view } = this.context.getInteractionData();

        if (view.id.startsWith(UserPreferenceModalEnum.VIEW_ID)) {
            return await this.handleUserPreferenceSubmit(user, view);
        }

        if (view.id === LLMConfigurationModalEnum.VIEW_ID) {
            return await this.handleLLMConfigurationSubmit(user, view);
        }

        if (view.id.startsWith(SendEmailModalEnum.VIEW_ID)) {
            return await this.handleSendEmailSubmit(user, view);
        }

        return this.context.getInteractionResponder().successResponse();
    }

    private async handleUserPreferenceSubmit(user: any, view: any): Promise<IUIKitResponse> {
        let room: IRoom | undefined;

        try {
            // Get room context first (outside try block to avoid scope issues)
            const roomInteractionStorage = new RoomInteractionStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            const roomId = await roomInteractionStorage.getInteractionRoomId();
            room = roomId ? await this.read.getRoomReader().getById(roomId) : undefined;

            // Parse form data
            const languageValue = this.getFormValue(view.state, UserPreferenceModalEnum.LANGUAGE_INPUT_DROPDOWN_ACTION_ID);
            const emailProviderValue = this.getFormValue(view.state, UserPreferenceModalEnum.EMAIL_PROVIDER_DROPDOWN_ACTION_ID);
            const selectedCategories = this.getFormValue(view.state, UserPreferenceModalEnum.STATS_CATEGORIES_INPUT_ACTION_ID) || [];
            const newCategoriesRaw = this.getFormValue(view.state, UserPreferenceModalEnum.NEW_CATEGORY_INPUT_ACTION_ID) || "";
            const systemPromptValue = this.getFormValue(view.state, UserPreferenceModalEnum.SYSTEM_PROMPT_INPUT_ACTION_ID) || "";

            // Process and combine categories - store what user actually selected
            const newCategories = newCategoriesRaw.split(',').map(c => c.trim().toLowerCase()).filter(c => c);
            const combinedCategories = [...selectedCategories, ...newCategories];

            // Validate required fields
            if (!languageValue || !emailProviderValue) {
                const currentLanguage = await getUserPreferredLanguage(
                    this.read.getPersistenceReader(),
                    this.persistence,
                    user.id,
                );

                if (room) {
                    await sendNotification(this.read, this.modify, user, room, {
                        message: t(Translations.ERROR_FILL_REQUIRED_FIELDS, currentLanguage)
                    });
                }
                return this.context.getInteractionResponder().errorResponse();
            }

            // Get current user preference
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            const currentPreference = await userPreferenceStorage.getUserPreference();
            const oldEmailProvider = currentPreference.emailProvider;

            // Create preference object
            const preference: IPreference = {
                userId: user.id,
                language: languageValue,
                emailProvider: emailProviderValue as EmailProviders,
                statsCategories: [...new Set(combinedCategories as string[])],
                systemPrompt: systemPromptValue.trim() || undefined,
            };

            // Update user preference
            await userPreferenceStorage.storeUserPreference(preference);

            // Get updated language for messages
            const userLanguage = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );

            // Handle email provider change - logout if provider changed
            let wasLoggedOut = false;
            if (oldEmailProvider !== emailProviderValue) {
                try {
                    // Check if user is authenticated with the old provider
                    const isAuthenticated = await EmailServiceFactory.isUserAuthenticated(
                        oldEmailProvider,
                        user.id,
                        this.http,
                        this.persistence,
                        this.read,
                        this.app.getLogger()
                    );

                    if (isAuthenticated) {
                        // Logout from old provider
                        await EmailServiceFactory.logoutUser(
                            oldEmailProvider,
                            user.id,
                            this.http,
                            this.persistence,
                            this.read,
                            this.app.getLogger()
                        );
                        wasLoggedOut = true;
                    }
                } catch (logoutError) {
                    this.app.getLogger().error(t(Translations.LOG_AUTO_LOGOUT, userLanguage), logoutError);
                    // Continue with preference update even if logout fails
                }
            }

            // Check if anything actually changed before showing success message
            const hasChanges = (
                currentPreference.language !== languageValue ||
                currentPreference.emailProvider !== emailProviderValue ||
                JSON.stringify(currentPreference.statsCategories?.sort()) !== JSON.stringify(combinedCategories.sort())
            );

            // Notify user about successful update with provider-specific handling
            if (room) {
                if (oldEmailProvider !== emailProviderValue && wasLoggedOut) {
                    // Provider changed and user was logged out - show login button for new provider
                    const logoutMessage = t(Translations.PROVIDER_CHANGED_AUTO_LOGOUT, userLanguage, {
                        oldProvider: getProviderDisplayName(oldEmailProvider)
                    });
                    const loginMessage = t(Translations.PROVIDER_CHANGED_LOGIN_MESSAGE, userLanguage, {
                        provider: getProviderDisplayName(emailProviderValue as EmailProviders)
                    });
                    const combinedMessage = `${logoutMessage}\n${loginMessage}`;

                    await this.sendNotificationWithLoginButton(
                        user,
                        room,
                        combinedMessage,
                        emailProviderValue as EmailProviders,
                        userLanguage
                    );
                } else if (hasChanges) {
                    await sendNotification(this.read, this.modify, user, room, {
                        message: t(Translations.SUCCESS_CONFIGURATION_UPDATED, userLanguage)
                    });
                }
            }

            return this.context.getInteractionResponder().successResponse();

        } catch (error) {
            // Log the error and get user's current language for error message
            const currentLanguage = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );
            this.app.getLogger().error(t(Translations.LOG_PREF_SUBMIT, currentLanguage), error);

            try {
                if (room) {
                    // Determine specific error type and use appropriate granular message
                    let errorMessage: string;

                    if (error.message?.includes('network') || error.message?.includes('connection')) {
                        errorMessage = t(Translations.ERROR_NETWORK_FAILURE, currentLanguage);
                    } else if (error.message?.includes('config') || error.message?.includes('setting')) {
                        errorMessage = t(Translations.ERROR_MISSING_CONFIGURATION, currentLanguage);
                    } else if (error.message?.includes('permission') || error.message?.includes('access')) {
                        errorMessage = t(Translations.ERROR_PERMISSION_DENIED, currentLanguage);
                    } else {
                        errorMessage = t(Translations.ERROR_FAIL_INTERNAL, currentLanguage);
                    }

                    await sendNotification(this.read, this.modify, user, room, {
                        message: errorMessage
                    });
                }
            } catch (notificationError) {
                this.app.getLogger().error(t(Translations.LOG_NOTIF_ERR, currentLanguage), notificationError);
            }

            return this.context.getInteractionResponder().successResponse();
        }
    }

    private async handleSendEmailSubmit(user: any, view: any): Promise<IUIKitResponse> {
        let room: IRoom | undefined;

        try {
            // Get room context
            const roomInteractionStorage = new RoomInteractionStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            const roomId = await roomInteractionStorage.getInteractionRoomId();
            room = roomId ? await this.read.getRoomReader().getById(roomId) : undefined;

            // Parse form data
            const toValue = this.getFormValue(view.state, SendEmailModalEnum.TO_ACTION_ID);
            const ccValue = this.getFormValue(view.state, SendEmailModalEnum.CC_ACTION_ID);
            const subjectValue = this.getFormValue(view.state, SendEmailModalEnum.SUBJECT_ACTION_ID);
            const contentValue = this.getFormValue(view.state, SendEmailModalEnum.CONTENT_ACTION_ID);

            // Get user's current language
            const userLanguage = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );

            // Validate required fields
            if (!toValue || !subjectValue || !contentValue) {
                if (room) {
                    await sendNotification(this.read, this.modify, user, room, {
                        message: t(Translations.ERROR_FILL_REQUIRED_FIELDS, userLanguage)
                    });
                }
                return this.context.getInteractionResponder().errorResponse();
            }

            // Parse email addresses (comma separated)
            const toEmails = toValue.split(',').map((email: string) => email.trim()).filter((email: string) => email);
            const ccEmails = ccValue ? ccValue.split(',').map((email: string) => email.trim()).filter((email: string) => email) : undefined;

            // Create email data object
            const emailData: ISendEmailData = {
                to: toEmails,
                cc: ccEmails,
                subject: subjectValue,
                content: contentValue,
            };

            // Send email using ToolExecutorService
            const toolExecutorService = new ToolExecutorService(
                this.app,
                this.read,
                this.modify,
                this.http,
                this.persistence
            );

            const result = await toolExecutorService.sendEmail(emailData, user);

            // Notify user about result
            if (room) {
                await sendNotification(this.read, this.modify, user, room, {
                    message: result.success ? t(Translations.SEND_EMAIL_SUCCESS, userLanguage) : t(Translations.SEND_EMAIL_FAILED, userLanguage, { error: result.message })
                });
            }

            if (result.success) {
                // Get the messageId from persistence
                const roomInteractionStorage = new RoomInteractionStorage(this.persistence, this.read.getPersistenceReader(), user.id);
                const messageId = await roomInteractionStorage.getInteractionMessageId();

                if (messageId) {
                    const appUser = await this.read.getUserReader().getAppUser();
                    if (!appUser) return this.context.getInteractionResponder().successResponse();

                    const message = await this.read.getMessageReader().getById(messageId);
                    if (!message) return this.context.getInteractionResponder().successResponse();

                    // Replace the buttons with a confirmation message
                    const messageBuilder = await this.modify.getUpdater().message(messageId, appUser);
                    const blockBuilder = this.modify.getCreator().getBlockBuilder();

                    blockBuilder.addSectionBlock({
                        text: blockBuilder.newMarkdownTextObject('Email sent.')
                    });

                    messageBuilder.setEditor(appUser).setBlocks(blockBuilder.getBlocks());
                    await this.modify.getUpdater().finish(messageBuilder);
                }

                return this.context.getInteractionResponder().successResponse();
            } else {
                return this.context.getInteractionResponder().errorResponse();
            }

        } catch (error) {
            const userLanguage = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );

            if (room) {
                await handleError(
                    this.app,
                    this.read,
                    this.modify,
                    user,
                    room,
                    userLanguage,
                    'Send email submission',
                    error
                );
            }
            return this.context.getInteractionResponder().errorResponse();
        }
    }

    private getFormValue(viewState: any, actionId: string): any {
        for (const blockId in viewState) {
            if (viewState.hasOwnProperty(blockId) && viewState[blockId][actionId]) {
                const value = viewState[blockId][actionId];
                if (typeof value === 'object' && value && value.hasOwnProperty('value')) {
                    return value.value;
                }
                // Handle multi-select which can be an array of strings or an empty object if nothing is selected
                if (Array.isArray(value)) {
                    return value;
                }
                if (typeof value === 'object' && Object.keys(value).length === 0) {
                    return [];
                }
                return value;
            }
        }
        return null;
    }

    private async sendNotificationWithLoginButton(
        user: any,
        room: IRoom,
        message: string,
        provider: EmailProviders,
        language: Language
    ): Promise<void> {
        try {
            const appUser = await this.read.getUserReader().getAppUser();
            if (!appUser) {
                this.app.getLogger().error('App user not found');
                return;
            }

            // Generate the OAuth URL for the provider
            const authUrl = await EmailServiceFactory.getAuthenticationUrl(
                provider,
                user.id,
                this.http,
                this.persistence,
                this.read,
                this.app.getLogger()
            );

            const blockBuilder = this.modify.getCreator().getBlockBuilder();

            // Add message section
            blockBuilder.addSectionBlock({
                text: blockBuilder.newMarkdownTextObject(message),
            });

            // Add login button with direct OAuth URL
            blockBuilder.addActionsBlock({
                elements: [
                    blockBuilder.newButtonElement({
                        text: blockBuilder.newPlainTextObject(
                            t(Translations.LOGIN_WITH_PROVIDER, language, { provider: getProviderDisplayName(provider) })
                        ),
                        url: authUrl,
                        style: ButtonStyle.PRIMARY,
                    }),
                ],
            });

            const messageBuilder = this.modify.getCreator().startMessage()
                .setSender(appUser)
                .setRoom(room)
                .setGroupable(false)
                .setBlocks(blockBuilder.getBlocks());

            await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());

        } catch (error) {
            // Fallback to simple text notification
            await sendNotification(this.read, this.modify, user, room, { message });
        }
    }

    private async handleLLMConfigurationSubmit(user: any, view: any): Promise<IUIKitResponse> {
        let room: IRoom | undefined;

        try {
            const roomInteractionStorage = new RoomInteractionStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            const roomId = await roomInteractionStorage.getInteractionRoomId();
            room = roomId ? await this.read.getRoomReader().getById(roomId) : undefined;

            const currentLanguage = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );

            const llmUsagePreferenceValue = this.getFormValue(view.state, LLMConfigurationModalEnum.LLM_USAGE_PREFERENCE_DROPDOWN_ACTION_ID);
            const llmProviderValue = this.getFormValue(view.state, LLMConfigurationModalEnum.LLM_PROVIDER_DROPDOWN_ACTION_ID);
            const selfHostedUrlValue = this.getFormValue(view.state, LLMConfigurationModalEnum.SELF_HOSTED_URL_ACTION_ID);
            const openaiApiKeyValue = this.getFormValue(view.state, LLMConfigurationModalEnum.OPENAI_API_KEY_ACTION_ID);
            const geminiApiKeyValue = this.getFormValue(view.state, LLMConfigurationModalEnum.GEMINI_API_KEY_ACTION_ID);
            const groqApiKeyValue = this.getFormValue(view.state, LLMConfigurationModalEnum.GROQ_API_KEY_ACTION_ID);

            if (llmUsagePreferenceValue === LLMUsagePreferenceEnum.Personal) {
                const validationError = this.validatePersonalLLMConfig(
                    llmProviderValue,
                    selfHostedUrlValue,
                    openaiApiKeyValue,
                    geminiApiKeyValue,
                    groqApiKeyValue,
                    currentLanguage
                );

                if (validationError) {
                    if (room) {
                        await sendNotification(this.read, this.modify, user, room, {
                            message: validationError
                        });
                    }

                    return this.context.getInteractionResponder().errorResponse();
                }
            }

            const userPreferenceStorage = new UserPreferenceStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            const existingPreference = await userPreferenceStorage.getUserPreference();

            const updatedPreference = this.buildUpdatedLLMPreference(
                existingPreference,
                llmUsagePreferenceValue,
                llmProviderValue,
                selfHostedUrlValue,
                openaiApiKeyValue,
                geminiApiKeyValue,
                groqApiKeyValue
            );

            await userPreferenceStorage.storeUserPreference(updatedPreference);

            if (room) {
                await sendNotification(this.read, this.modify, user, room, {
                    message: t(Translations.LLM_CONFIGURATION_SUCCESS, currentLanguage)
                });
            }

            return this.context.getInteractionResponder().successResponse();

        } catch (error) {
            this.app.getLogger().error('Error saving LLM configuration:', error);

            try {
                if (room) {
                    const errorLanguage = await getUserPreferredLanguage(
                        this.read.getPersistenceReader(),
                        this.persistence,
                        user.id,
                    );
                    if (error.message) {
                        const errorMessage = handleLLMErrorAndGetMessage(this.app, 'LLM Configuration', error, errorLanguage);
                        await sendNotification(this.read, this.modify, user, room, {
                            message: `⚠️ ${errorMessage}`
                        });
                    } else {
                        await handleError(
                            this.app,
                            this.read,
                            this.modify,
                            user,
                            room,
                            errorLanguage,
                            'LLM Configuration',
                            error as Error
                        );
                    }
                }
            } catch (notificationError) {
                this.app.getLogger().error('Error sending notification:', notificationError);
            }

            return this.context.getInteractionResponder().successResponse();
        }
    }

    private buildUpdatedLLMPreference(
        existingPreference: any,
        llmUsagePreferenceValue: string,
        llmProviderValue: string,
        selfHostedUrlValue: string,
        openaiApiKeyValue: string,
        geminiApiKeyValue: string,
        groqApiKeyValue: string
    ): any {
        const currentLLMConfig = existingPreference.llmConfiguration || {};
        
        const newLLMConfig: any = {
            llmUsagePreference: llmUsagePreferenceValue || currentLLMConfig.llmUsagePreference || LLMUsagePreferenceEnum.Workspace,
            llmProvider: llmProviderValue || currentLLMConfig.llmProvider || LLMProviderEnum.Groq,
        };

        // Handle provider-specific configurations
        if (selfHostedUrlValue) {
            newLLMConfig.selfHosted = { url: selfHostedUrlValue };
        } else if (currentLLMConfig.selfHosted) {
            newLLMConfig.selfHosted = currentLLMConfig.selfHosted;
        }

        if (openaiApiKeyValue) {
            newLLMConfig.openai = { apiKey: openaiApiKeyValue };
        } else if (currentLLMConfig.openai) {
            newLLMConfig.openai = currentLLMConfig.openai;
        }

        if (geminiApiKeyValue) {
            newLLMConfig.gemini = { apiKey: geminiApiKeyValue };
        } else if (currentLLMConfig.gemini) {
            newLLMConfig.gemini = currentLLMConfig.gemini;
        }

        if (groqApiKeyValue) {
            newLLMConfig.groq = { apiKey: groqApiKeyValue };
        } else if (currentLLMConfig.groq) {
            newLLMConfig.groq = currentLLMConfig.groq;
        }

        return {
            ...existingPreference,
            llmConfiguration: newLLMConfig,
        };
    }

    private validatePersonalLLMConfig(
        provider: string,
        selfHostedUrl: string,
        openaiApiKey: string,
        geminiApiKey: string,
        groqApiKey: string,
        language: Language
    ): string | null {
        if (!provider) {
            return t(Translations.LLM_CONFIG_PROVIDER_REQUIRED, language);
        }

        switch (provider) {
            case LLMProviderEnum.SelfHosted:
                if (!selfHostedUrl || selfHostedUrl.trim() === '') {
                    return t(Translations.LLM_CONFIG_SELFHOSTED_URL_REQUIRED, language);
                }
                try {
                    new URL(selfHostedUrl);
                } catch {
                    return t(Translations.LLM_CONFIG_INVALID_URL, language);
                }
                break;

            case LLMProviderEnum.OpenAI:
                if (!openaiApiKey || openaiApiKey.trim() === '') {
                    return t(Translations.LLM_CONFIG_OPENAI_KEY_REQUIRED, language);
                }
                if (!openaiApiKey.startsWith('sk-')) {
                    return t(Translations.LLM_CONFIG_INVALID_OPENAI_KEY, language);
                }
                break;

            case LLMProviderEnum.Gemini:
                if (!geminiApiKey || geminiApiKey.trim() === '') {
                    return t(Translations.LLM_CONFIG_GEMINI_KEY_REQUIRED, language);
                }
                break;

            case LLMProviderEnum.Groq:
                if (!groqApiKey || groqApiKey.trim() === '') {
                    return t(Translations.LLM_CONFIG_GROQ_KEY_REQUIRED, language);
                }
                break;

            default:
                return t(Translations.LLM_CONFIG_INVALID_PROVIDER, language);
        }

        return null;
    }
}
