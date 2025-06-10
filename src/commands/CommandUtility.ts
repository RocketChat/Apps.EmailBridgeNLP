import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { CommandParam } from '../enum/CommandParam';
import { Handler } from '../handlers/Handler';
import {
    ICommandUtility,
    ICommandUtilityParams,
} from '../definition/command/ICommandUtility';

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
        // For now, default to English. In the future, this could be retrieved from user preferences
        const language = 'en';

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
                await handler.sendDefault();
            }
        }
    }

    private async handleSingleParam(handler: Handler): Promise<void> {
        switch (this.params[0].toLowerCase()) {
            case CommandParam.HELP:
                await handler.Help();
                break;
            case CommandParam.LOGIN:
                await handler.Login();
                break;
            case CommandParam.LOGOUT:
                await handler.Logout();
                break;
            default: {
                await handler.sendDefault();
                break;
            }
        }
    }
} 