import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { CommandParam } from '../enums/CommandParam';
import { Handler } from '../handlers/Handler';
import {
    ICommandUtility,
    ICommandUtilityParams,
} from '../definition/command/ICommandUtility';
import { getUserPreferredLanguage } from '../helper/userPreference';

export class CommandUtility implements ICommandUtility {
    public app: EmailBridgeNlpApp;
    public params: Array<string>;
    public sender: IUser;
    public room: IRoom;
    public read: IRead;
    public modify: IModify;
    public http: IHttp;
    public persis: IPersistence;
    public triggerId?: string;
    public threadId?: string;

    constructor(props: ICommandUtilityParams) {
        this.app = props.app;
        this.params = props.params;
        this.sender = props.sender;
        this.room = props.room;
        this.read = props.read;
        this.modify = props.modify;
        this.http = props.http;
        this.persis = props.persis;
        this.triggerId = props.triggerId;
        this.threadId = props.threadId;
    }

    public async resolveCommand(): Promise<void> {
        const language = await getUserPreferredLanguage(
            this.read.getPersistenceReader(),
            this.persis,
            this.sender.id,
        );
        
        const handler = new Handler({
            app: this.app,
            sender: this.sender,
            room: this.room,
            read: this.read,
            modify: this.modify,
            http: this.http,
            persis: this.persis,
            triggerId: this.triggerId,
            threadId: this.threadId,
            language,
        });

        switch (this.params.length) {
            case 0: {
                await handler.sendDefault();
                break;
            }
            case 1: {
                await this.handleSingleParam(handler);
                break;
            }
            default: {
                await this.handleMultipleParams(handler);
                break;
            }
        }
    }

    private async handleSingleParam(handler: Handler): Promise<void> {
        const command = this.params[0].toLowerCase();
        
        switch (command) {
            case CommandParam.LLM_CONFIG:
                await handler.LLMConfig();
                break;
            case CommandParam.HELP:
                await handler.Help();
                break;
            case CommandParam.LOGIN:
                await handler.Login();
                break;
            case CommandParam.LOGOUT:
                await handler.Logout();
                break;
            case CommandParam.CONFIG:
                await handler.Config();
                break;
            case CommandParam.REPORT:
                await handler.Report();
                break;
            default: {
                const query = this.params.join(' ');
                await handler.ProcessNaturalLanguageQuery(query);
                break;
            }
        }
    }

    private async handleMultipleParams(handler: Handler): Promise<void> {
        const query = this.params.join(' ');
        await handler.ProcessNaturalLanguageQuery(query);
    }
} 