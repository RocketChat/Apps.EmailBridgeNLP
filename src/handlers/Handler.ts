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
import { EmailServiceFactory } from '../services/auth/EmailServiceFactory';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { EmailProviders } from '../enums/EmailProviders';
import { t, Language } from '../lib/Translation/translation';
import { UserPreferenceModal } from '../modal/UserPreferenceModal';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';
import { RoomInteractionStorage } from '../storage/RoomInteractionStorage';
import { ActionIds } from '../enums/ActionIds';
import { getProviderDisplayName } from '../enums/ProviderDisplayNames';
import { Translations } from '../constants/Translations';

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
        // Create a UI block with a user preferences button
        const appUser = (await this.read.getUserReader().getAppUser()) as IUser;
        const messageBuilder = this.modify
            .getCreator()
            .startMessage()
            .setSender(appUser)
            .setRoom(this.room)
            .setGroupable(false);

        const block = this.modify.getCreator().getBlockBuilder();

        block.addSectionBlock({
            text: block.newMarkdownTextObject(
                t(Translations.DEFAULT_GREETING, this.language, { name: this.sender.name })
            ),
        });

        block.addSectionBlock({
            text: block.newMarkdownTextObject(
                t(Translations.USE_HELP_COMMAND, this.language)
            ),
        });

        // Add user preferences button
        block.addActionsBlock({
            elements: [
                block.newButtonElement({
                    actionId: ActionIds.USER_PREFERENCE_ACTION,
                    text: block.newPlainTextObject(t(Translations.USER_PREFERENCE_BUTTON_LABEL, this.language)),
                    style: ButtonStyle.PRIMARY,
                }),
            ],
        });

        messageBuilder.setBlocks(block.getBlocks());
        return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
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
            // Get user's preferred email provider from their personal settings
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persis,
                this.read.getPersistenceReader(),
                this.sender.id,
            );
            const userPreference = await userPreferenceStorage.getUserPreference();
            const emailProvider = userPreference.emailProvider;

            // Check if provider is supported
            if (!EmailServiceFactory.isProviderSupported(emailProvider)) {
                const providerName = getProviderDisplayName(emailProvider);
                const message = t(Translations.PROVIDER_NOT_IMPLEMENTED, this.language, { provider: providerName });
                
                messageBuilder.setText(message);
                return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
            }

            // Check if user is already authenticated
            const isAuthenticated = await EmailServiceFactory.isUserAuthenticated(
                emailProvider,
                this.sender.id,
                this.http,
                this.persis,
                this.read,
                this.app.getLogger()
            );

            if (isAuthenticated) {
                try {
                    const userInfo = await EmailServiceFactory.getUserInfo(
                        emailProvider,
                        this.sender.id,
                        this.http,
                        this.persis,
                        this.read,
                        this.app.getLogger()
                    );
                    messageBuilder.setText(
                        t(Translations.ALREADY_LOGGED_IN, this.language, { 
                            provider: getProviderDisplayName(emailProvider), 
                            email: userInfo.email 
                        })
                    );
                    return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
                } catch (error) {
                    // If we can't get user info, the authentication might be stale or corrupted
                    // Clear the corrupted authentication and proceed with fresh login
                    try {
                        await EmailServiceFactory.logoutUser(
                            emailProvider,
                            this.sender.id,
                            this.http,
                            this.persis,
                            this.read,
                            this.app.getLogger()
                        );
                    } catch (logoutError) {
                        this.app.getLogger().error(t(Translations.LOG_LOGOUT_ERR, this.language), logoutError);
                    }
                    
                    // Fall through to show login button
                }
            }

            // Generate the authorization URL
            const authUrl = await EmailServiceFactory.getAuthenticationUrl(
                emailProvider,
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
                    t(Translations.CONNECT_ACCOUNT_MESSAGE, this.language, { provider: getProviderDisplayName(emailProvider) })
                ),
            });

            block.addActionsBlock({
                elements: [
                    block.newButtonElement({
                        actionId: ActionIds.EMAIL_LOGIN_ACTION,
                        text: block.newPlainTextObject(t(Translations.LOGIN_WITH_PROVIDER, this.language, { provider: getProviderDisplayName(emailProvider) })),
                        url: authUrl,
                        style: ButtonStyle.PRIMARY,
                    }),
                ],
            });

            messageBuilder.setBlocks(block.getBlocks());
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());

        } catch (error) {
            messageBuilder.setText(
                t(Translations.ERROR_PROCESSING_LOGIN, this.language, { error: error.message })
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
            // Get user's preferred email provider from their personal settings
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persis,
                this.read.getPersistenceReader(),
                this.sender.id,
            );
            const userPreference = await userPreferenceStorage.getUserPreference();
            const emailProvider = userPreference.emailProvider;

            // Check if provider is supported
            if (!EmailServiceFactory.isProviderSupported(emailProvider)) {
                const providerName = getProviderDisplayName(emailProvider);
                const message = t(Translations.PROVIDER_NOT_IMPLEMENTED, this.language, { provider: providerName });
                
                messageBuilder.setText(message);
                return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
            }

            // Check if user is authenticated first
            const isAuthenticated = await EmailServiceFactory.isUserAuthenticated(
                emailProvider,
                this.sender.id,
                this.http,
                this.persis,
                this.read,
                this.app.getLogger()
            );

            if (!isAuthenticated) {
                messageBuilder.setText(t(Translations.NOT_AUTHENTICATED, this.language, { provider: getProviderDisplayName(emailProvider) }));
                return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
            }

            // Get user info to show in confirmation message
            let userInfo;
            try {
                userInfo = await EmailServiceFactory.getUserInfo(
                    emailProvider,
                    this.sender.id,
                    this.http,
                    this.persis,
                    this.read,
                    this.app.getLogger()
                );
            } catch (error) {
                // If we can't get user info, use generic email
                userInfo = { email: t(Translations.GENERIC_ACCOUNT, this.language) };
            }

            // Create a UI block with a confirmation button
            const block = this.modify.getCreator().getBlockBuilder();

            block.addSectionBlock({
                text: block.newMarkdownTextObject(
                    t(Translations.LOGOUT_CONFIRMATION, this.language, { 
                        provider: getProviderDisplayName(emailProvider), 
                        email: userInfo.email 
                    })
                ),
            });

            block.addActionsBlock({
                elements: [
                    block.newButtonElement({
                        actionId: ActionIds.EMAIL_LOGOUT_ACTION,
                        text: block.newPlainTextObject(t(Translations.CONFIRM_LOGOUT, this.language)),
                        style: ButtonStyle.DANGER,
                    }),
                ],
            });

            // Set the blocks in the message
            messageBuilder.setBlocks(block.getBlocks());
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());

        } catch (error) {
            messageBuilder.setText(t(Translations.ERROR_PREPARING_LOGOUT, this.language, { error: error.message }));
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
        }
    }

    public async Config(): Promise<void> {
        try {
            // Store room ID for later use in ExecuteViewSubmitHandler (similar to how the button works)
            const roomInteractionStorage = new RoomInteractionStorage(
                this.persis,
                this.read.getPersistenceReader(),
                this.sender.id,
            );
            
            await roomInteractionStorage.storeInteractionRoomId(this.room.id);

            const userPreference = new UserPreferenceStorage(
                this.persis,
                this.read.getPersistenceReader(),
                this.sender.id,
            );
            const existingPreference = await userPreference.getUserPreference();

            const modal = await UserPreferenceModal({
                app: this.app,
                modify: this.modify,
                existingPreference: existingPreference,
            });

            if (!modal) {
                throw new Error(t(Translations.ERROR_MODAL_CREATION_FAILED, this.language));
            }

            if (!this.triggerId) {
                throw new Error(t(Translations.ERROR_TRIGGER_ID_MISSING, this.language));
            }

            await this.modify
                .getUiController()
                .openSurfaceView(modal, { triggerId: this.triggerId }, this.sender);

        } catch (error) {
            const appUser = (await this.read.getUserReader().getAppUser()) as IUser;
            const messageBuilder = this.modify
                .getCreator()
                .startMessage()
                .setSender(appUser)
                .setRoom(this.room)
                .setGroupable(false);

            messageBuilder.setText(t(Translations.CONFIG_ERROR, this.language, { error: error.message }));
            return this.read.getNotifier().notifyUser(this.sender, messageBuilder.getMessage());
        }
    }
} 