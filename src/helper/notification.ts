import { IRead, IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';

export async function sendHelperNotification(
    read: IRead,
    modify: IModify,
    user: IUser,
    room: IRoom,
): Promise<void> {
    const appUser = (await read.getUserReader().getAppUser()) as IUser;
    const message = `👋 Hey ${user.name}! I'm Email Bot 👋 Here are some quick tips to get you started!

**Available Commands:**
• \`/email help\` - Show this help message
• \`/email login\` - Login to your email account
• \`/email logout\` - Logout from your email account
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
): Promise<void> {
    const appUser = (await read.getUserReader().getAppUser()) as IUser;
    
    const message = `Hello ${user.name}! I'm Email Bot 👋 I can help you all your email needs.

Use \`/email help\` to learn about all available features and commands.

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