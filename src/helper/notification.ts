import { IRead, IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { Translations } from '../constants/Translations';
import { t, Language } from '../lib/Translation/translation';

export async function sendHelperNotification(
    read: IRead,
    modify: IModify,
    user: IUser,
    room: IRoom,
    language: Language = Language.en,
): Promise<void> {
    const appUser = (await read.getUserReader().getAppUser()) as IUser;
    const message = `${t(Translations.HELPER_GREETING, language, { name: user.name })}

${t(Translations.HELP_COMMAND, language)}
${t(Translations.LOGIN_COMMAND, language)}
${t(Translations.LOGOUT_COMMAND, language)}
${t(Translations.CONFIG_COMMAND, language)}
${t(Translations.LLM_CONFIG_COMMAND, language)}
${t(Translations.LLM_HELP_COMMAND, language)}
${t(Translations.REPORT_COMMAND, language)}
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

    const message = `${t(Translations.DEFAULT_GREETING, language, { name: user.name })}

${t(Translations.USE_HELP_COMMAND, language)}

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