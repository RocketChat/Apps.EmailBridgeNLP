import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { IHandlerParams, IHandler } from '../definition/handlers/IHandler';
import {
    sendDefaultNotification,
    sendHelperNotification,
} from '../helper/notification';
import { EmailServiceFactory } from '../services/EmailServiceFactory';
import { getEmailSettings } from '../config/SettingsManager';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { EmailProviders } from '../enums/EmailProviders';

export class Handler implements IHandler {
    public app: EmailBridgeNlpApp;
    public sender: IUser;
    public room: IRoom;
    public read: IRead;
    public modify: IModify;
    public http: IHttp;
    public persis: IPersistence;
    public triggerId?: string;
    public threadId?: string;
    public language?: string;

    constructor(params: IHandlerParams) {
        this.app = params.app;
        this.sender = params.sender;
        this.room = params.room;
        this.read = params.read;
        this.modify = params.modify;
        this.http = params.http;
        this.persis = params.persis;
        this.triggerId = params.triggerId;
        this.threadId = params.threadId;
        this.language = params.language || 'en';
    }

    /**
     * Helper function to properly capitalize provider names
     */
    private getProviderDisplayName(provider: EmailProviders): string {
        switch (provider) {
            case EmailProviders.GMAIL:
                return 'Gmail';
            case EmailProviders.OUTLOOK:
                return 'Outlook';
            default:
                return provider;
        }
    }

    public async Help(): Promise<void> {
        await sendHelperNotification(
            this.read,
            this.modify,
            this.sender,
            this.room,
        );
    }

    public async sendDefault(): Promise<void> {
        await sendDefaultNotification(
            this.app,
            this.read,
            this.modify,
            this.sender,
            this.room,
        );
    }

    public async Login(): Promise<void> {
        const appUser = (await this.read.getUserReader().getAppUser()) as IUser;

        const messageBuilder = this.modify
            .getCreator()
            .startMessage()
            .setSender(appUser)
            .setRoom(this.room)
            .setGroupable(false);

        try {
            // Get email settings to determine provider
            const emailSettings = await getEmailSettings(this.read.getEnvironmentReader().getSettings());

            // Check if provider is supported
            if (!EmailServiceFactory.isProviderSupported(emailSettings.provider)) {
                const providerName = this.getProviderDisplayName(emailSettings.provider);
                let message: string;
                
                if (emailSettings.provider === EmailProviders.OUTLOOK) {
                    message = `🚧 **Outlook authentication is coming soon!**\n\n` +
                             `For now, please use **Gmail** for email authentication.\n\n`;
                } else {
                    message = `❌ **${providerName} authentication is not yet implemented.**\n\n` +
                             `Currently only **Gmail** is supported for authentication.\n\n`;
                }
                
                messageBuilder.setText(message);
                return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
            }

            // Check if user is already authenticated
            const isAuthenticated = await EmailServiceFactory.isUserAuthenticated(
                emailSettings.provider,
                this.sender.id,
                this.http,
                this.persis,
                this.read,
                this.app.getLogger()
            );

            if (isAuthenticated) {
                const userInfo = await EmailServiceFactory.getUserInfo(
                    emailSettings.provider,
                    this.sender.id,
                    this.http,
                    this.persis,
                    this.read,
                    this.app.getLogger()
                );
                messageBuilder.setText(
                    `✅ You are already logged in with **${this.getProviderDisplayName(emailSettings.provider)}** as **${userInfo.email}**.\n\nIf you want to logout, use \`/email logout\`.`
                );
                return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
            }

            // Generate the authorization URL
            const authUrl = await EmailServiceFactory.getAuthenticationUrl(
                emailSettings.provider,
                this.sender.id,
                this.http,
                this.persis,
                this.read,
                this.app.getLogger()
            );

            // Create a UI block with a button
            const block = this.modify.getCreator().getBlockBuilder();

            block.addSectionBlock({
                text: block.newMarkdownTextObject(
                    `🔐 **Connect your ${this.getProviderDisplayName(emailSettings.provider)} account to Rocket Chat**`
                ),
            });

            block.addActionsBlock({
                elements: [
                    block.newButtonElement({
                        actionId: "email_login_action",
                        text: block.newPlainTextObject(`🔑 Login with ${this.getProviderDisplayName(emailSettings.provider)}`),
                        url: authUrl,
                        style: ButtonStyle.PRIMARY,
                    }),
                ],
            });

            messageBuilder.setBlocks(block.getBlocks());
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());

        } catch (error) {
            this.app.getLogger().error("Error in login:", error);
            messageBuilder.setText(
                `❌ Error processing login: ${error.message}`
            );
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
        }
    }

    public async Logout(): Promise<void> {
        const appUser = (await this.read.getUserReader().getAppUser()) as IUser;

        const messageBuilder = this.modify
            .getCreator()
            .startMessage()
            .setSender(appUser)
            .setRoom(this.room)
            .setGroupable(false);

        try {
            // Get email settings to determine provider
            const emailSettings = await getEmailSettings(this.read.getEnvironmentReader().getSettings());

            // Check if provider is supported
            if (!EmailServiceFactory.isProviderSupported(emailSettings.provider)) {
                const providerName = this.getProviderDisplayName(emailSettings.provider);
                let message: string;
                
                if (emailSettings.provider === EmailProviders.OUTLOOK) {
                    message = `🚧 **Outlook authentication is coming soon!** Only Gmail is currently supported for logout.`;
                } else {
                    message = `❌ **${providerName} is not supported.** Only Gmail authentication is currently available.`;
                }
                
                messageBuilder.setText(message);
                return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
            }

            // Check if user is authenticated first
            const isAuthenticated = await EmailServiceFactory.isUserAuthenticated(
                emailSettings.provider,
                this.sender.id,
                this.http,
                this.persis,
                this.read,
                this.app.getLogger()
            );

            if (!isAuthenticated) {
                messageBuilder.setText(`❌ You are not currently authenticated with ${this.getProviderDisplayName(emailSettings.provider)}. Use \`/email login\` to login.`);
                return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
            }

            // Get user info to show in confirmation message
            const userInfo = await EmailServiceFactory.getUserInfo(
                emailSettings.provider,
                this.sender.id,
                this.http,
                this.persis,
                this.read,
                this.app.getLogger()
            );

            // Create a UI block with a confirmation button
            const block = this.modify.getCreator().getBlockBuilder();

            block.addSectionBlock({
                text: block.newMarkdownTextObject(
                    `🔓 **Logout Confirmation**\n\nAre you sure you want to logout from **${this.getProviderDisplayName(emailSettings.provider)}** account **${userInfo.email}**?`
                ),
            });

            block.addActionsBlock({
                elements: [
                    block.newButtonElement({
                        actionId: "email_logout_action",
                        text: block.newPlainTextObject("🔒 Confirm Logout"),
                        style: ButtonStyle.DANGER,
                    }),
                ],
            });

            // Set the blocks in the message
            messageBuilder.setBlocks(block.getBlocks());
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());

        } catch (error) {
            this.app.getLogger().error("Error in logout:", error);
            messageBuilder.setText(`❌ Error preparing logout: ${error.message}`);
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
        }
    }
} 