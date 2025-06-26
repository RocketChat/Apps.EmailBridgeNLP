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

import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { EmailServiceFactory } from '../services/auth/EmailServiceFactory';
import { getUserPreferredLanguage } from '../helper/userPreference';
import { t, Language } from '../lib/Translation/translation';
import { EmailProviders } from '../enums/EmailProviders';
import { UserPreferenceModal } from '../modal/UserPreferenceModal';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';
import { RoomInteractionStorage } from '../storage/RoomInteractionStorage';
import { ActionIds } from '../enums/ActionIds';
import { getProviderDisplayName } from '../enums/ProviderDisplayNames';
import { UserPreferenceModalEnum } from '../enums/modals/UserPreferenceModal';
import { Translations } from '../constants/Translations';

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
        const { actionId, user, room, triggerId } = this.context.getInteractionData();

        if (actionId === ActionIds.EMAIL_LOGOUT_ACTION) {
            if (user && room) {
                // Process logout asynchronously to avoid blocking the interaction response
                Promise.resolve().then(async () => {
                    try {
                        await this.handleLogoutAction(user, room);
                    } catch (error) {
                        const language = await getUserPreferredLanguage(
                            this.read.getPersistenceReader(),
                            this.persistence,
                            user.id,
                        );
                        this.app.getLogger().error(t(Translations.LOG_ASYNC_LOGOUT, language), error);
                    }
                });
            }

            // Return immediate success response to prevent UI timeout
            return this.context.getInteractionResponder().successResponse();
        }

        if (actionId === ActionIds.USER_PREFERENCE_ACTION) {
            if (user && triggerId && room) {
                // Store room ID for later use in ExecuteViewSubmitHandler
                const roomInteractionStorage = new RoomInteractionStorage(
                    this.persistence,
                    this.read.getPersistenceReader(),
                    user.id,
                );
                
                await roomInteractionStorage.storeInteractionRoomId(room.id);
                
                // Process user preference action asynchronously
                Promise.resolve().then(async () => {
                    try {
                        await this.handleUserPreferenceAction(user, triggerId);
                    } catch (error) {
                        const language = await getUserPreferredLanguage(
                            this.read.getPersistenceReader(),
                            this.persistence,
                            user.id,
                        );
                        this.app.getLogger().error(t(Translations.LOG_ASYNC_PREF, language), error);
                    }
                });
            }

            // Return immediate success response to prevent UI timeout
            return this.context.getInteractionResponder().successResponse();
        }

        // Handle provider dropdown change to show warning
        if (actionId === UserPreferenceModalEnum.EMAIL_PROVIDER_DROPDOWN_ACTION_ID) {
            return await this.handleProviderChange(user);
        }

        return this.context.getInteractionResponder().successResponse();
    }

    private async handleUserPreferenceAction(user: any, triggerId: string): Promise<void> {
        try {
            // Get user's preferred language
            const language = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );

            const userPreference = new UserPreferenceStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            const existingPreference = await userPreference.getUserPreference();

            const modal = await UserPreferenceModal({
                app: this.app,
                modify: this.modify,
                existingPreference: existingPreference,
            });

            if (modal instanceof Error) {
                return;
            }

            await this.modify
                .getUiController()
                .openSurfaceView(modal, { triggerId }, user);

        } catch (error) {
            // For errors in this method, use English as fallback since we can't get user language easily here
            this.app.getLogger().error(t(Translations.LOG_PREF_HANDLE, Language.en), error);
        }
    }

    private async handleLogoutAction(user: any, room: any): Promise<void> {
        const appUser = await this.read.getUserReader().getAppUser();
        const messageBuilder = this.modify
            .getCreator()
            .startMessage()
            .setSender(appUser!)
            .setRoom(room)
            .setGroupable(false);

        try {
            // Get user's preferred language
            const language = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );

            // Get user's preferred email provider from their personal settings
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
                const message = t(Translations.PROVIDER_NOT_SUPPORTED_LOGOUT, language, { provider: providerName });
                
                messageBuilder.setText(message);
                await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
                return;
            }

            // Attempt to logout using the service factory
            const success = await EmailServiceFactory.logoutUser(
                emailProvider,
                user.id,
                this.http,
                this.persistence,
                this.read,
                this.app.getLogger()
            );

            if (success) {
                const providerName = getProviderDisplayName(emailProvider);
                messageBuilder.setText(t(Translations.LOGOUT_SUCCESS, language, { provider: providerName }));
                await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
                return;
            } else {
                messageBuilder.setText(t(Translations.LOGOUT_FAILED, language));
                await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
                return;
            }
        } catch (error) {
            // Get user's preferred language for error message
            const language = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );
            
            messageBuilder.setText(t(Translations.LOGOUT_ERROR, language, { error: error.message }));
            await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
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
} 