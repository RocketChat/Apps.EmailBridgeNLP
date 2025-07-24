import { IRead, IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { Translations } from '../constants/Translations';
import { t, Language } from '../lib/Translation/translation';
import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { getUserPreferredLanguage } from './userPreference';
import { IPersistence } from '@rocket.chat/apps-engine/definition/accessors';

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
${t(Translations.STATS_COMMAND, language)}
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

export async function getOrCreateDirectRoom(
    read: IRead,
    modify: IModify,
    usernames: Array<string>
): Promise<IRoom> {
    let room: IRoom | undefined = await read
        .getRoomReader()
        .getDirectByUsernames(usernames);

    if (room) {
        return room;
    }

    const creator = (await read.getUserReader().getAppUser()) as IUser;

    const newRoom = modify
        .getCreator()
        .startRoom()
        .setType(RoomType.DIRECT_MESSAGE)
        .setCreator(creator)
        .setMembersToBeAddedByUsernames(usernames);

    const roomId = await modify.getCreator().finish(newRoom);
    return (await read.getRoomReader().getById(roomId)) as IRoom;
}

export async function sendWelcomeMessageOnInstall(
    appId: string,
    user: IUser,
    read: IRead,
    modify: IModify,
    persistence: IPersistence
): Promise<void> {
    const appUser = (await read.getUserReader().getAppUser()) as IUser;
    const members = [user.username, appUser.username];

    const language = await getUserPreferredLanguage(
        read.getPersistenceReader(),
        persistence,
        user.id
    );

    const room = await getOrCreateDirectRoom(read, modify, members);

    const welcomeText = `${t(Translations.WELCOME_TEXT, language)} ${t(Translations.WELCOME_MESSAGE, language)}`;

    const textMessageBuilder = modify
        .getCreator()
        .startMessage()
        .setRoom(room)
        .setSender(appUser)
        .setGroupable(false)
        .setParseUrls(true)
        .setText(welcomeText);

    await modify.getCreator().finish(textMessageBuilder);
} 