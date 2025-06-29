import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    IUIKitResponse,
    UIKitViewSubmitInteractionContext,
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
import { EmailServiceFactory } from '../services/auth/EmailServiceFactory';
import { Handler } from './Handler';
import { ActionIds } from '../enums/ActionIds';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { getProviderDisplayName } from '../enums/ProviderDisplayNames';
import { Translations } from '../constants/Translations';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { SendEmailModalEnum } from '../enums/modals/SendEmailModal';
import { ToolExecutorService } from '../services/ToolExecutorService';
import { ISendEmailData } from '../modal/SendEmailModal';

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

        if (view.id === UserPreferenceModalEnum.VIEW_ID) {
            return await this.handleUserPreferenceSubmit(user, view);
        }

        if (view.id === SendEmailModalEnum.VIEW_ID) {
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
            const selectedCategories = this.getFormValue(view.state, UserPreferenceModalEnum.REPORT_CATEGORIES_INPUT_ACTION_ID) || [];
            const newCategoriesRaw = this.getFormValue(view.state, UserPreferenceModalEnum.NEW_CATEGORY_INPUT_ACTION_ID) || "";

            // Process and combine categories
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
                reportCategories: [...new Set(combinedCategories as string[])],
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

            // Notify user about successful update with provider-specific handling
            if (room) {
                if (oldEmailProvider !== emailProviderValue && wasLoggedOut) {
                    // Provider changed and user was logged out - show login button for new provider
                    const message = t(Translations.PROVIDER_CHANGED_AUTO_LOGOUT, userLanguage, { 
                        oldProvider: this.getProviderDisplayName(oldEmailProvider, userLanguage)
                    });
                    
                    await this.sendNotificationWithLoginButton(
                        user, 
                        room, 
                        message, 
                        emailProviderValue as EmailProviders, 
                        userLanguage
                    );
                } else {
                    // Regular preference update - show simple success message
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
                    message: result.message
                });
            }

            if (result.success) {
                return this.context.getInteractionResponder().successResponse();
            } else {
                return this.context.getInteractionResponder().errorResponse();
            }

        } catch (error) {
            // Get user's current language for error message
            const currentLanguage = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );
            this.app.getLogger().error('Send email error:', error);

            try {
                if (room) {
                    await sendNotification(this.read, this.modify, user, room, {
                        message: t(Translations.SEND_EMAIL_FAILED, currentLanguage, { error: error.message })
                    });
                }
            } catch (notificationError) {
                this.app.getLogger().error(t(Translations.LOG_NOTIF_ERR, currentLanguage), notificationError);
            }

            return this.context.getInteractionResponder().errorResponse();
        }
    }

    private async sendSuccessNotification(
        user: any, 
        room: any, 
        oldPreference: IPreference | null, 
        newPreference: IPreference, 
        language: Language,
        wasLoggedOut: boolean = false,
        providerChanged: boolean = false
    ): Promise<void> {
        try {
            // Build detailed success message showing what changed
            let message = t(Translations.SUCCESS_CONFIGURATION_UPDATED, language);
            
            // Add details about what changed
            const changes: string[] = [];
            
            if (!oldPreference || oldPreference.language !== newPreference.language) {
                changes.push(t(Translations.LANGUAGE_CHANGED, language, { 
                    language: this.getLanguageDisplayName(newPreference.language, language) 
                }));
            }
            
            if (!oldPreference || oldPreference.emailProvider !== newPreference.emailProvider) {
                changes.push(t(Translations.EMAIL_PROVIDER_CHANGED, language, { 
                    provider: this.getProviderDisplayName(newPreference.emailProvider, language) 
                }));
            }

            if (changes.length > 0) {
                message += '\n' + changes.join('\n');
            }

            // If provider changed and user was logged out, show login message
            if (wasLoggedOut && oldPreference && oldPreference.emailProvider !== newPreference.emailProvider) {
                message += '\n' + t(Translations.PROVIDER_CHANGED_AUTO_LOGOUT, language, {
                    oldProvider: this.getProviderDisplayName(oldPreference.emailProvider, language),
                    newProvider: this.getProviderDisplayName(newPreference.emailProvider, language)
                });
            }

            // Send notification using room context
            if (room) {
                if (providerChanged && wasLoggedOut) {
                    // Send message with login button for provider change
                    await this.sendNotificationWithLoginButton(user, room, message, newPreference.emailProvider, language);
                } else {
                    // Send regular text notification
                    await sendNotification(this.read, this.modify, user, room, {
                        message: message
                    });
                }
            }
        } catch (error) {
            this.app.getLogger().error(t(Translations.LOG_SUCCESS_ERR, Language.en), error);
        }
    }

    private getLanguageDisplayName(targetLanguage: Language, displayLanguage: Language): string {
        // Use proper translation keys for language names
        switch (targetLanguage) {
            case Language.en:
                return t(Translations.LANGUAGE_EN, displayLanguage);
            case Language.es:
                return t(Translations.LANGUAGE_ES, displayLanguage);
            case Language.ru:
                return t(Translations.LANGUAGE_RU, displayLanguage);
            case Language.de:
                return t(Translations.LANGUAGE_DE, displayLanguage);
            case Language.pl:
                return t(Translations.LANGUAGE_PL, displayLanguage);
            case Language.pt:
                return t(Translations.LANGUAGE_PT, displayLanguage);
            default:
                return targetLanguage;
        }
    }

    private getProviderDisplayName(provider: EmailProviders, displayLanguage: Language): string {
        // Use proper translation keys for provider names
        switch (provider) {
            case EmailProviders.GMAIL:
                return t(Translations.GMAIL_LABEL, displayLanguage);
            case EmailProviders.OUTLOOK:
                return t(Translations.OUTLOOK_LABEL, displayLanguage);
            default:
                return provider;
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
        const blockBuilder = this.modify.getCreator().getBlockBuilder();
        blockBuilder.addSectionBlock({
            text: blockBuilder.newMarkdownTextObject(message)
        });

        blockBuilder.addActionsBlock({
            blockId: 'login-block',
            elements: [
                blockBuilder.newButtonElement({
                    actionId: ActionIds.EMAIL_LOGIN_ACTION,
                    text: blockBuilder.newPlainTextObject(t(Translations.LOGIN_ACTION_TEXT, language)),
                    style: ButtonStyle.PRIMARY
                }),
            ]
        });

        const appUser = await this.read.getUserReader().getAppUser();
        if (!appUser) return;
        
        const messageBuilder = this.modify.getCreator().startMessage()
            .setSender(appUser)
            .setRoom(room)
            .setGroupable(false)
            .setBlocks(blockBuilder.getBlocks());

        await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
    }
} 