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
import { t } from '../lib/Translation/translation';
import { EmailProviders } from '../enums/EmailProviders';
import { UserPreferenceModal } from '../modal/UserPreferenceModal';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';
import { RoomInteractionStorage } from '../storage/RoomInteractionStorage';
import { ActionIds } from '../enums/ActionIds';
import { getProviderDisplayName } from '../enums/ProviderDisplayNames';

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
                        // Silent error handling for async action
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
                        // Silent error handling for async action
                    }
                });
            }

            // Return immediate success response to prevent UI timeout
            return this.context.getInteractionResponder().successResponse();
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
            // Silent error handling
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
                const message = t('Provider_Not_Supported_Logout', language, { provider: providerName });
                
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
                messageBuilder.setText(t('Logout_Success', language, { provider: providerName }));
                await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
                return;
            } else {
                messageBuilder.setText(t('Logout_Failed', language));
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
            
            messageBuilder.setText(t('Logout_Error', language, { error: error.message }));
            await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
        }
    }
} 