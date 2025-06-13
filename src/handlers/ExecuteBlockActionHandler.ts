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
import { getEmailSettings } from '../config/SettingsManager';
import { EmailServiceFactory } from '../services/auth/EmailServiceFactory';
import { getUserPreferredLanguage } from '../helper/userPreference';
import { t } from '../lib/Translation/translation';
import { EmailProviders } from '../enums/EmailProviders';
import { UserPreferenceModal } from '../modal/UserPreferenceModal';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';
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
            if (user && triggerId) {
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

            // Get email settings to determine provider
            const emailSettings = await getEmailSettings(this.read.getEnvironmentReader().getSettings());

            // Check if provider is supported
            if (!EmailServiceFactory.isProviderSupported(emailSettings.provider)) {
                const providerName = getProviderDisplayName(emailSettings.provider);
                let message: string;
                
                if (emailSettings.provider === EmailProviders.OUTLOOK) {
                    message = t('Outlook_Coming_Soon', language);
                } else {
                    message = t('Provider_Not_Supported_Logout', language, { provider: providerName });
                }
                
                messageBuilder.setText(message);
                await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
                return;
            }

            // Attempt to logout using the service factory
            const success = await EmailServiceFactory.logoutUser(
                emailSettings.provider,
                user.id,
                this.http,
                this.persistence,
                this.read,
                this.app.getLogger()
            );

            if (success) {
                const providerName = getProviderDisplayName(emailSettings.provider);
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