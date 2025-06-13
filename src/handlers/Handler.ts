import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { IHandlerParams, IHandler } from '../definition/handler/IHandler';
import {
    sendDefaultNotification,
    sendHelperNotification,
} from '../helper/notification';
import { EmailServiceFactory } from '../services/auth/EmailServiceFactory';
import { getEmailSettings } from '../config/SettingsManager';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { EmailProviders } from '../enums/EmailProviders';
import { t, Language } from '../lib/Translation/translation';

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
    public language: Language;

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
        this.language = params.language;
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
            this.language,
        );
    }

    public async sendDefault(): Promise<void> {
        await sendDefaultNotification(
            this.app,
            this.read,
            this.modify,
            this.sender,
            this.room,
            this.language,
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
                    message = t('Outlook_Coming_Soon', this.language);
                } else {
                    message = t('Provider_Not_Implemented', this.language, { provider: providerName });
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
                try {
                    const userInfo = await EmailServiceFactory.getUserInfo(
                        emailSettings.provider,
                        this.sender.id,
                        this.http,
                        this.persis,
                        this.read,
                        this.app.getLogger()
                    );
                    messageBuilder.setText(
                        t('Already_Logged_In', this.language, { 
                            provider: this.getProviderDisplayName(emailSettings.provider), 
                            email: userInfo.email 
                        })
                    );
                    return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
                } catch (error) {
                    // If we can't get user info, the authentication might be stale or corrupted
                    this.app.getLogger().warn(`Authentication check failed for user ${this.sender.id}: ${error.message}`);
                    
                    // Clear the corrupted authentication and proceed with fresh login
                    try {
                        await EmailServiceFactory.logoutUser(
                            emailSettings.provider,
                            this.sender.id,
                            this.http,
                            this.persis,
                            this.read,
                            this.app.getLogger()
                        );
                    } catch (logoutError) {
                        this.app.getLogger().error(`Failed to clear corrupted authentication: ${logoutError.message}`);
                    }
                    
                    // Fall through to show login button
                }
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
                    t('Connect_Account_Message', this.language, { provider: this.getProviderDisplayName(emailSettings.provider) })
                ),
            });

            block.addActionsBlock({
                elements: [
                    block.newButtonElement({
                        actionId: "email_login_action",
                        text: block.newPlainTextObject(t('Login_With_Provider', this.language, { provider: this.getProviderDisplayName(emailSettings.provider) })),
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
                t('Error_Processing_Login', this.language, { error: error.message })
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
                    message = t('Outlook_Coming_Soon', this.language);
                } else {
                    message = t('Provider_Not_Implemented', this.language, { provider: providerName });
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
                messageBuilder.setText(t('Not_Authenticated', this.language, { provider: this.getProviderDisplayName(emailSettings.provider) }));
                return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
            }

            // Get user info to show in confirmation message
            let userInfo;
            try {
                userInfo = await EmailServiceFactory.getUserInfo(
                    emailSettings.provider,
                    this.sender.id,
                    this.http,
                    this.persis,
                    this.read,
                    this.app.getLogger()
                );
            } catch (error) {
                // If we can't get user info, use generic email
                this.app.getLogger().warn(`Could not get user info for logout: ${error.message}`);
                userInfo = { email: 'your account' };
            }

            // Create a UI block with a confirmation button
            const block = this.modify.getCreator().getBlockBuilder();

            block.addSectionBlock({
                text: block.newMarkdownTextObject(
                    t('Logout_Confirmation', this.language, { 
                        provider: this.getProviderDisplayName(emailSettings.provider), 
                        email: userInfo.email 
                    })
                ),
            });

            block.addActionsBlock({
                elements: [
                    block.newButtonElement({
                        actionId: "email_logout_action",
                        text: block.newPlainTextObject(t('Confirm_Logout', this.language)),
                        style: ButtonStyle.DANGER,
                    }),
                ],
            });

            // Set the blocks in the message
            messageBuilder.setBlocks(block.getBlocks());
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());

        } catch (error) {
            this.app.getLogger().error("Error in logout:", error);
            messageBuilder.setText(t('Error_Preparing_Logout', this.language, { error: error.message }));
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
        }
    }
} 