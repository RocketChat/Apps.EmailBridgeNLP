import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { EmailBridgeNlpApp } from '../../../EmailBridgeNlpApp';

export interface IHandlerParams {
    app: EmailBridgeNlpApp;
    sender: IUser;
    room: IRoom;
    read: IRead;
    modify: IModify;
    http: IHttp;
    persis: IPersistence;
    triggerId?: string;
    threadId?: string;
}

export interface IHandler {
    app: EmailBridgeNlpApp;
    sender: IUser;
    room: IRoom;
    read: IRead;
    modify: IModify;
    http: IHttp;
    persis: IPersistence;
    triggerId?: string;
    threadId?: string;
    Help(): Promise<void>;
    sendDefault(): Promise<void>;
    Login(): Promise<void>;
    Logout(): Promise<void>;
} 