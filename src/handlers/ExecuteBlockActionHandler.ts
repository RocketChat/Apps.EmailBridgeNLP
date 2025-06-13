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
        const { actionId, user, room } = this.context.getInteractionData();

        if (actionId === 'email_logout_action') {
            if (user && room) {
                // Process logout asynchronously to avoid blocking the interaction response
                Promise.resolve().then(async () => {
                    try {
                        await this.handleLogoutAction(user, room);
                    } catch (error) {
                        this.app.getLogger().error('Error in async logout action:', error);
                    }
                });
            }

            // Return immediate success response to prevent UI timeout
            return this.context.getInteractionResponder().successResponse();
        }

        return this.context.getInteractionResponder().successResponse();
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
            // Get email settings to determine provider
            const emailSettings = await getEmailSettings(this.read.getEnvironmentReader().getSettings());

            // Check if provider is supported
            if (!EmailServiceFactory.isProviderSupported(emailSettings.provider)) {
                messageBuilder.setText(
                    `❌ **${emailSettings.provider.toUpperCase()} is not supported.** Only Gmail authentication is currently available.`
                );
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
                messageBuilder.setText(`✅ Successfully logged out from your ${emailSettings.provider.toUpperCase()} account.`);
                await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
                return;
            } else {
                messageBuilder.setText('❌ Error during logout process. Please try again.');
                await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
                return;
            }
        } catch (error) {
            this.app.getLogger().error('Error in logout action:', error);
            messageBuilder.setText(`❌ Error logging out: ${error.message}`);
            await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
        }
    }
} 