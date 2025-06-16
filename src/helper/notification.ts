import { IRead, IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { t, Language } from '../lib/Translation/translation';

export async function sendHelperNotification(
    read: IRead,
    modify: IModify,
    user: IUser,
    room: IRoom,
    language: Language = Language.en,
): Promise<void> {
    const appUser = (await read.getUserReader().getAppUser()) as IUser;
    const message = `${t('Helper_Greeting', language, { name: user.name })}

${t('Help_Command', language)}
${t('Login_Command', language)}
${t('Logout_Command', language)}
${t('Config_Command', language)}
    `;

    const helperMessage = modify
        .getCreator()
        .startMessage()
        .setRoom(room)
        .setSender(appUser)
        .setText(message)
        .setGroupable(false);

    return read.getNotifier().notifyUser(user, helperMessage.getMessage());
}

export async function sendDefaultNotification(
    app: EmailBridgeNlpApp,
    read: IRead,
    modify: IModify,
    user: IUser,
    room: IRoom,
    language: Language = Language.en,
): Promise<void> {
    const appUser = (await read.getUserReader().getAppUser()) as IUser;

    const message = `${t('Default_Greeting', language, { name: user.name })}

${t('Use_Help_Command', language)}

    `;

    const helperMessage = modify
        .getCreator()
        .startMessage()
        .setRoom(room)
        .setSender(appUser)
        .setText(message)
        .setGroupable(false);

    return read.getNotifier().notifyUser(user, helperMessage.getMessage());
}

export async function sendNotification(
    read: IRead,
    modify: IModify,
    user: IUser,
    room: IRoom,
    content: { message?: string },
): Promise<void> {
    const appUser = (await read.getUserReader().getAppUser()) as IUser;
    const { message } = content;

    if (!appUser || !message) {
        return;
    }

    const messageBuilder = modify
        .getCreator()
        .startMessage()
        .setSender(appUser)
        .setRoom(room)
        .setGroupable(false)
        .setText(message);

    return read.getNotifier().notifyUser(user, messageBuilder.getMessage());
} 