import {
    IAppAccessors,
    IConfigurationExtend,
    IEnvironmentRead,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { EmailCommand } from './src/commands/EmailCommand';

export class EmailBridgeNlpApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async initialize(
        configuration: IConfigurationExtend,
        _environmentRead: IEnvironmentRead,
    ): Promise<void> {
        await configuration.slashCommands.provideSlashCommand(
            new EmailCommand(this),
        );
    }
}
