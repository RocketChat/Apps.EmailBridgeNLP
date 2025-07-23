import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    IUIKitResponse,
    UIKitBlockInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { getUserPreferredLanguage } from '../helper/userPreference';
import { t, Language } from '../lib/Translation/translation';
import { RoomInteractionStorage } from '../storage/RoomInteractionStorage';
import { ActionIds } from '../enums/ActionIds';
import { Translations } from '../constants/Translations';
import { Handler } from './Handler';
import { SendEmailModal } from '../modal/SendEmailModal';
import { ToolExecutorService } from '../services/ToolExecutorService';
import { ISendEmailData } from '../definition/lib/IEmailUtils';
import { UserPreferenceModalEnum } from '../enums/modals/UserPreferenceModal';
import { UserPreferenceModal } from '../modal/UserPreferenceModal';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';
import { EmailServiceFactory } from '../services/auth/EmailServiceFactory';
import { EmailProviders } from '../enums/EmailProviders';
import { getProviderDisplayName } from '../enums/ProviderDisplayNames';
import { MessageFormatter } from '../lib/MessageFormatter';
import { handleError } from '../helper/errorHandler';
import { LLMUsagePreferenceEnum, LLMProviderEnum } from '../definition/lib/IUserPreferences';

export class ExecuteBlockActionHandler {
    private context: UIKitBlockInteractionContext;

    constructor(
        protected readonly app: EmailBridgeNlpApp,
        protected readonly read: IRead,
        protected readonly http: IHttp,
        protected readonly persistence: IPersistence,
        protected readonly modify: IModify,
        context: UIKitBlockInteractionContext,
    ) {
        this.context = context;
    }

    public async handleActions(): Promise<IUIKitResponse> {
        try {
            const { actionId, user, triggerId, message, value } = this.context.getInteractionData();
            let { room } = this.context.getInteractionData();
            this.app.getLogger().info('🔥 ExecuteBlockActionHandler triggered with actionId:', actionId, 'value:', value);

            // QuickReplies pattern: Handle missing room context in modal interactions
            const persistenceRead = this.read.getPersistenceReader();
            const roomInteractionStorage = new RoomInteractionStorage(
                this.persistence,
                persistenceRead,
                user.id,
            );

            const roomId = await roomInteractionStorage.getInteractionRoomId();
            this.app.getLogger().info('🔥 Retrieved roomId from storage:', roomId);
            let roomPersistance: any = null;
            if (roomId) {
                this.app.getLogger().info('🔥 Getting room by ID:', roomId);
                roomPersistance = await this.read.getRoomReader().getById(roomId);
                this.app.getLogger().info('🔥 Room retrieved:', !!roomPersistance);
            } else {
                this.app.getLogger().info('🔥 No roomId found in storage');
            }

            if (room === undefined) {
                if (roomPersistance) {
                    room = roomPersistance;
                    this.app.getLogger().info('🔥 Room assigned from storage. Room now defined:', !!room);
                    this.app.getLogger().info('🔥 Room object type:', typeof room);
                    this.app.getLogger().info('🔥 Room ID from assigned room:', room?.id);
                } else {
                    this.app.getLogger().error("Room doesn't exist in persistence");
                    return this.context.getInteractionResponder().errorResponse();
                }
            }

            // Ensure room is defined before proceeding
            if (!room) {
                this.app.getLogger().error("Room is still undefined after retrieval attempts");
                this.app.getLogger().info('🔥 roomPersistance was:', !!roomPersistance);
                this.app.getLogger().info('🔥 roomPersistance type:', typeof roomPersistance);
                return this.context.getInteractionResponder().errorResponse();
            }

            this.app.getLogger().info('🔥 Creating userPreferenceStorage...');
            // Add QuickReplies pattern variables
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            
            this.app.getLogger().info('🔥 Getting existingPreference...');
            const existingPreference = await userPreferenceStorage.getUserPreference();
            this.app.getLogger().info('🔥 existingPreference retrieved:', !!existingPreference);

        const language = await getUserPreferredLanguage(
            this.read.getPersistenceReader(),
            this.persistence,
            user.id,
        );

        const handler = new Handler({
            app: this.app,
            sender: user,
            room: room,
            read: this.read,
            modify: this.modify,
            http: this.http,
            persis: this.persistence,
            triggerId: triggerId,
            language: language,
        });

        this.app.getLogger().info('🔥 About to enter switch statement with actionId:', actionId);
        this.app.getLogger().info('🔥 UserPreferenceModalEnum.LLM_USAGE_PREFERENCE_DROPDOWN_ACTION_ID =', UserPreferenceModalEnum.LLM_USAGE_PREFERENCE_DROPDOWN_ACTION_ID);
        this.app.getLogger().info('🔥 Checking if actionId matches enum:', actionId === UserPreferenceModalEnum.LLM_USAGE_PREFERENCE_DROPDOWN_ACTION_ID);
        switch (actionId) {
            case ActionIds.USER_PREFERENCE_ACTION:
                this.app.getLogger().info('🔥 Hit USER_PREFERENCE_ACTION case');
                await handler.Config();
                break;
            case ActionIds.EMAIL_LOGOUT_ACTION: {
                await handler.Logout();
                break;
            }
            case ActionIds.EMAIL_LOGOUT_CONFIRM_ACTION: {
                await this.handleLogoutConfirm(user, room, language);
                break;
            }
            case UserPreferenceModalEnum.EMAIL_PROVIDER_DROPDOWN_ACTION_ID:
                return await this.handleProviderChange(user);
            case UserPreferenceModalEnum.LLM_USAGE_PREFERENCE_DROPDOWN_ACTION_ID:
                // QuickReplies pattern: Handle directly in switch case
                this.app.getLogger().info('🔥 Hit LLM_USAGE_PREFERENCE_DROPDOWN_ACTION_ID case!');
                this.app.getLogger().info('🔥 LLM_USAGE_PREFERENCE_DROPDOWN_ACTION_ID triggered with value:', value);
                if (value === LLMUsagePreferenceEnum.Personal) {
                    existingPreference.llmConfiguration = {
                        ...(existingPreference.llmConfiguration || {}),
                        llmUsagePreference: LLMUsagePreferenceEnum.Personal
                    } as any;
                    await userPreferenceStorage.storeUserPreference(existingPreference);
                    
                    const updatedPreference = await userPreferenceStorage.getUserPreference();
                    const updatedModal = await UserPreferenceModal({
                        app: this.app,
                        modify: this.modify,
                        existingPreference: updatedPreference,
                    });
                    
                    return this.context.getInteractionResponder().updateModalViewResponse(updatedModal);
                } else {
                    existingPreference.llmConfiguration = {
                        llmUsagePreference: LLMUsagePreferenceEnum.Workspace
                    } as any;
                    
                    await userPreferenceStorage.storeUserPreference(existingPreference);
                    
                    const updatedPreference = await userPreferenceStorage.getUserPreference();
                    const updatedModal = await UserPreferenceModal({
                        app: this.app,
                        modify: this.modify,
                        existingPreference: updatedPreference,
                    });
                    
                    return this.context.getInteractionResponder().updateModalViewResponse(updatedModal);
                }
                break;
            case UserPreferenceModalEnum.LLM_PROVIDER_DROPDOWN_ACTION_ID:
                // QuickReplies pattern: Handle directly in switch case
                this.app.getLogger().info('🔥 LLM_PROVIDER_DROPDOWN_ACTION_ID triggered with value:', value);
                const option = value as LLMProviderEnum;
                if (value) {
                    if (Object.values(LLMProviderEnum).includes(option)) {
                        existingPreference.llmConfiguration = {
                            ...(existingPreference.llmConfiguration || {}),
                            llmProvider: option,
                            // Clear all provider-specific settings
                            selfHosted: undefined,
                            openai: undefined,
                            gemini: undefined,
                            groq: undefined
                        } as any;
                        
                        await userPreferenceStorage.storeUserPreference(existingPreference);
                        
                        const updatedPreference = await userPreferenceStorage.getUserPreference();
                        const updatedModal = await UserPreferenceModal({
                            app: this.app,
                            modify: this.modify,
                            existingPreference: updatedPreference,
                        });
                        
                        return this.context.getInteractionResponder().updateModalViewResponse(updatedModal);
                    } else {
                        this.app.getLogger().info('value is not part of LLMProviderEnum enum');
                    }
                } else {
                    this.app.getLogger().info('no value');
                }
                break;
            case ActionIds.SEND_EMAIL_DIRECT_ACTION:
                await this.handleDirectSendEmail(user, room);
                break;
            case ActionIds.SEND_EMAIL_EDIT_ACTION:
                await this.handleEditAndSendEmail(user, room, triggerId);
                break;
            default:
                this.app.getLogger().info('🔥 Hit DEFAULT case - no matching actionId found!');
                this.app.getLogger().info('🔥 Available UserPreference enum values:', Object.values(UserPreferenceModalEnum));
                break;
        }

        return this.context.getInteractionResponder().successResponse();
        } catch (error) {
            this.app.getLogger().error('🔥 ERROR in ExecuteBlockActionHandler:', error);
            return this.context.getInteractionResponder().successResponse();
        }
    }

    private async handleProviderChange(user: any): Promise<IUIKitResponse> {
        try {
            // Get user's preferred language
            const language = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );

            // Get current user preferences
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            const currentPreference = await userPreferenceStorage.getUserPreference();

            // Get the selected provider from the dropdown
            const { value } = this.context.getInteractionData();
            const selectedProvider = value as EmailProviders;

            // Check if provider changed and user is currently authenticated
            if (selectedProvider !== currentPreference.emailProvider) {
                const isAuthenticated = await EmailServiceFactory.isUserAuthenticated(
                    currentPreference.emailProvider,
                    user.id,
                    this.http,
                    this.persistence,
                    this.read,
                    this.app.getLogger()
                );

                // Create updated preference with warning flag for modal
                const tempPreference = {
                    ...currentPreference,
                    emailProvider: selectedProvider,
                    showProviderWarning: isAuthenticated // Add flag to show warning
                };

                // Update the modal to show warning
                const updatedModal = await UserPreferenceModal({
                    app: this.app,
                    modify: this.modify,
                    existingPreference: tempPreference,
                });

                return this.context.getInteractionResponder().updateModalViewResponse(updatedModal);
            }

            return this.context.getInteractionResponder().successResponse();
        } catch (error) {
            return this.context.getInteractionResponder().successResponse();
        }
    }

    private async handleDirectSendEmail(user: any, room: any): Promise<void> {
        const language = await getUserPreferredLanguage(
            this.read.getPersistenceReader(),
            this.persistence,
            user.id,
        );

        try {
            // Retrieve stored email data
            const emailData = await this.getStoredEmailData(room.id);
            if (!emailData) {
                await this.showMessage(
                    user,
                    room,
                    MessageFormatter.formatDataNotAvailableMessage(language),
                    language
                );
                return;
            }

            // Send email directly using ToolExecutorService
            const toolExecutorService = new ToolExecutorService(
                this.app,
                this.read,
                this.modify,
                this.http,
                this.persistence
            );

            const result = await toolExecutorService.sendEmail(emailData, user);

            // Show result message
            await this.showMessage(
                user,
                room,
                MessageFormatter.formatSendEmailResultMessage(result.success, result.message, language),
                language
            );

        } catch (error) {
            await handleError(
                this.app,
                this.read,
                this.modify,
                user,
                room,
                language,
                'Direct send email',
                error
            );
        }
    }

    private async handleEditAndSendEmail(user: any, room: any, triggerId?: string): Promise<void> {
        const language = await getUserPreferredLanguage(
            this.read.getPersistenceReader(),
            this.persistence,
            user.id,
        );

        try {
            // Retrieve stored email data
            const emailData = await this.getStoredEmailData(room.id);
            if (!emailData) {
                await this.showMessage(
                    user,
                    room,
                    MessageFormatter.formatDataNotAvailableMessage(language),
                    language
                );
                return;
            }

            if (!triggerId) {
                await this.showMessage(
                    user,
                    room,
                    t(Translations.ERROR_TRIGGER_ID_MISSING, language),
                    language
                );
                return;
            }

            // Store room ID for later use in ExecuteViewSubmitHandler
            const roomInteractionStorage = new RoomInteractionStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            await roomInteractionStorage.storeInteractionRoomId(room.id);

            // Create and open modal
            const modal = await SendEmailModal({
                app: this.app,
                modify: this.modify,
                read: this.read,
                language: language,
                emailData,
                context: 'edit',
            });

            if (!modal) {
                await this.showMessage(
                    user,
                    room,
                    t(Translations.ERROR_MODAL_CREATION_FAILED, language),
                    language
                );
                return;
            }

            await this.modify
                .getUiController()
                .openSurfaceView(modal, { triggerId }, user);

        } catch (error) {
            await handleError(
                this.app,
                this.read,
                this.modify,
                user,
                room,
                language,
                'Edit and send email',
                error
            );
        }
    }

    private async getStoredEmailData(roomId: string): Promise<ISendEmailData | null> {
        try {
            const association = new RocketChatAssociationRecord(
                RocketChatAssociationModel.ROOM,
                roomId,
            );

            const data = await this.read.getPersistenceReader().readByAssociation(association);

            // Handle both array and single object responses
            if (Array.isArray(data) && data.length > 0) {
                return (data[0] as any)?.emailData || null;
            } else if (data && typeof data === 'object') {
                return (data as any)?.emailData || null;
            }

            return null;
        } catch (error) {
            this.app.getLogger().error('Error retrieving stored email data:', error);
            return null;
        }
    }

    private async handleLogoutConfirm(user: any, room: any, language: any): Promise<void> {
        try {
            // Get user's preferred email provider
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            const userPreference = await userPreferenceStorage.getUserPreference();
            const emailProvider = userPreference.emailProvider;

            // Check if provider is supported
            if (!EmailServiceFactory.isProviderSupported(emailProvider)) {
                const providerName = getProviderDisplayName(emailProvider);
                const message = t(Translations.PROVIDER_NOT_IMPLEMENTED, language, { provider: providerName });
                await this.showMessage(user, room, message, language);
                return;
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
                const message = t(Translations.NOT_AUTHENTICATED, language, { provider: getProviderDisplayName(emailProvider) });
                await this.showMessage(user, room, message, language);
                return;
            }

            // Perform actual logout
            await EmailServiceFactory.logoutUser(
                emailProvider,
                user.id,
                this.http,
                this.persistence,
                this.read,
                this.app.getLogger()
            );

            // Show success message
            const successMessage = t(Translations.LOGOUT_SUCCESS, language, { provider: getProviderDisplayName(emailProvider) });
            await this.showMessage(user, room, successMessage, language);

        } catch (error) {
            await handleError(
                this.app,
                this.read,
                this.modify,
                user,
                room,
                language,
                'User logout',
                error
            );
        }
    }

    private async showMessage(user: any, room: any, message: string, language: any): Promise<void> {
        try {
            const appUser = await this.read.getUserReader().getAppUser();
            if (!appUser) return;

            const messageBuilder = this.modify
                .getCreator()
                .startMessage()
                .setSender(appUser)
                .setRoom(room)
                .setGroupable(false)
                .setText(message);

            await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
        } catch (error) {
            this.app.getLogger().error('Error showing message:', error);
        }
    }


}