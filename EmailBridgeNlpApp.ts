import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { EmailCommand } from './src/commands/EmailCommand';
import {
    ApiSecurity,
    ApiVisibility,
} from '@rocket.chat/apps-engine/definition/api';
import { GoogleOAuthEndpoint } from './src/endpoints/GoogleOAuthEndpoint';
import {
    IUIKitResponse,
    UIKitBlockInteractionContext,
    UIKitActionButtonInteractionContext,
    UIKitViewSubmitInteractionContext,
    UIKitViewCloseInteractionContext,
    IUIKitInteractionHandler
} from '@rocket.chat/apps-engine/definition/uikit';
import { extendSettings, getEmailSettings } from './src/config/SettingsManager';
import { EmailServiceFactory } from './src/services/auth/EmailServiceFactory';

export class EmailBridgeNlpApp extends App implements IUIKitInteractionHandler {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async initialize(
        configuration: IConfigurationExtend,
        _environmentRead: IEnvironmentRead,
    ): Promise<void> {
        // Register settings using the new settings manager
        await extendSettings(configuration.settings);

        // Register API endpoints
        await configuration.api.provideApi({
            visibility: ApiVisibility.PUBLIC,
            security: ApiSecurity.UNSECURE,
            endpoints: [new GoogleOAuthEndpoint(this)],
        });

        // Register slash commands
        await configuration.slashCommands.provideSlashCommand(
            new EmailCommand(this),
        );
    }

    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse> {
        const { actionId } = context.getInteractionData();

        if (actionId === 'email_logout_action') {
            // Handle logout confirmation
            const user = context.getInteractionData().user;
            const room = context.getInteractionData().room;

            if (user && room) {
                await this.handleLogoutAction(user, room, read, modify, http, persistence);
            }
        }

        return {
            success: true,
        };
    }

    private async handleLogoutAction(
        user: any,
        room: any,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence
    ): Promise<void> {
        const appUser = await read.getUserReader().getAppUser();
        const messageBuilder = modify
            .getCreator()
            .startMessage()
            .setSender(appUser!)
            .setRoom(room)
            .setGroupable(false);

        try {
            // Get email settings to determine provider
            const emailSettings = await getEmailSettings(read.getEnvironmentReader().getSettings());

            // Check if provider is supported
            if (!EmailServiceFactory.isProviderSupported(emailSettings.provider)) {
                messageBuilder.setText(
                    `❌ **${emailSettings.provider.toUpperCase()} is not supported.** Only Gmail authentication is currently available.`
                );
                return read.getNotifier().notifyUser(user, messageBuilder.getMessage());
            }

            // Attempt to logout using the service factory
            const success = await EmailServiceFactory.logoutUser(
                emailSettings.provider,
                user.id,
                http,
                persistence,
                read,
                this.getLogger()
            );

            if (success) {
                messageBuilder.setText(`✅ Successfully logged out from your ${emailSettings.provider.toUpperCase()} account.`);
                return read.getNotifier().notifyUser(user, messageBuilder.getMessage());
            } else {
                messageBuilder.setText('❌ Error during logout process. Please try again.');
                return read.getNotifier().notifyUser(user, messageBuilder.getMessage());
            }
        } catch (error) {
            this.getLogger().error('Error in logout action:', error);
            messageBuilder.setText(`❌ Error logging out: ${error.message}`);
            return read.getNotifier().notifyUser(user, messageBuilder.getMessage());
        }
    }

    public async executeActionButtonHandler(
        context: UIKitActionButtonInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse> {
        return {
            success: true,
        };
    }

    public async executeViewSubmitHandler(
        context: UIKitViewSubmitInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse> {
        return {
            success: true,
        };
    }

    public async executeViewCloseHandler(
        context: UIKitViewCloseInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse> {
        return {
            success: true,
        };
    }
}
