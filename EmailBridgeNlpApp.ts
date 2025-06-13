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
import { extendSettings } from './src/config/SettingsManager';
import { ExecuteBlockActionHandler } from './src/handlers/ExecuteBlockActionHandler';
import { ExecuteActionButtonHandler } from './src/handlers/ExecuteActionButtonHandler';
import { ExecuteViewSubmitHandler } from './src/handlers/ExecuteViewSubmitHandler';
import { ExecuteViewClosedHandler } from './src/handlers/ExecuteViewClosedHandler';
import { ElementBuilder } from './src/lib/ElementBuilder';
import { BlockBuilder } from './src/lib/BlockBuilder';
import { IAppUtils } from './src/definition/lib/IAppUtils';

export class EmailBridgeNlpApp extends App implements IUIKitInteractionHandler {
    private elementBuilder: ElementBuilder;
    private blockBuilder: BlockBuilder;

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async initialize(
        configuration: IConfigurationExtend,
        _environmentRead: IEnvironmentRead,
    ): Promise<void> {
        // Initialize UI builders
        this.elementBuilder = new ElementBuilder(this.getID());
        this.blockBuilder = new BlockBuilder(this.getID());

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

    public getUtils(): IAppUtils {
        return {
            elementBuilder: this.elementBuilder,
            blockBuilder: this.blockBuilder,
        };
    }

    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse> {
        const handler = new ExecuteBlockActionHandler(
            this,
            read,
            http,
            persistence,
            modify,
            context,
        );

        return await handler.handleActions();
    }

    public async executeActionButtonHandler(
        context: UIKitActionButtonInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse> {
        const handler = new ExecuteActionButtonHandler(
            this,
            read,
            http,
            persistence,
            modify,
            context,
        );

        return await handler.handleActions();
    }

    public async executeViewSubmitHandler(
        context: UIKitViewSubmitInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse> {
        const handler = new ExecuteViewSubmitHandler(
            this,
            read,
            http,
            persistence,
            modify,
            context,
        );

        return await handler.handleActions();
    }

    public async executeViewCloseHandler(
        context: UIKitViewCloseInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse> {
        const handler = new ExecuteViewClosedHandler(
            this,
            read,
            http,
            persistence,
            modify,
            context,
        );

        return await handler.handleActions();
    }
}
