import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { EmailBridgeNlpApp } from '../../../EmailBridgeNlpApp';
import { Language } from '../../lib/Translation/translation';
import { ISendEmailData } from '../lib/IEmailUtils';

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
    language: Language;
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
    language: Language;
    Help(): Promise<void>;
    sendDefault(): Promise<void>;
    Login(): Promise<void>;
    Logout(): Promise<void>;
    Report(): Promise<void>;
    Config(): Promise<void>;
    ProcessNaturalLanguageQuery(query: string): Promise<void>;
    OpenSendEmailModal(emailData: ISendEmailData): Promise<void>;
} 