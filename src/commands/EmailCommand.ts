import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { CommandUtility } from './CommandUtility';
import { ICommandUtilityParams } from '../definition/command/ICommandUtility';

export class EmailCommand implements ISlashCommand {
    constructor(private readonly app: EmailBridgeNlpApp) {}

    public command = 'email';
    public i18nParamsExample = 'Email_Command_Params';
    public i18nDescription = 'Email_Command_Description';
    public providesPreview = false;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ): Promise<void> {
        const params = context.getArguments();
        const sender = context.getSender();
        const room = context.getRoom();
        const triggerId = context.getTriggerId();
        const threadId = context.getThreadId();

        const commandUtilityParams: ICommandUtilityParams = {
            params,
            sender,
            room,
            triggerId,
            threadId,
            read,
            modify,
            http,
            persis,
            app: this.app,
        };

        const commandUtility = new CommandUtility(commandUtilityParams);
        await commandUtility.resolveCommand();
    }
} 