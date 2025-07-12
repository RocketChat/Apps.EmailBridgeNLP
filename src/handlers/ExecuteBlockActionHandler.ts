import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    IUIKitResponse,
    UIKitBlockInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { getUserPreferredLanguage } from '../helper/userPreference';
import { t, Language } from '../lib/Translation/translation';
import { RoomInteractionStorage } from '../storage/RoomInteractionStorage';
import { ActionIds } from '../enums/ActionIds';
import { Translations } from '../constants/Translations';
import { Handler } from './Handler';
import { SendEmailModal } from '../modal/SendEmailModal';
import { ToolExecutorService } from '../services/ToolExecutorService';
import { ISendEmailData } from '../definition/lib/IEmailUtils';
import { UserPreferenceModalEnum } from '../enums/modals/UserPreferenceModal';
import { UserPreferenceModal } from '../modal/UserPreferenceModal';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';
import { EmailServiceFactory } from '../services/auth/EmailServiceFactory';
import { EmailProviders } from '../enums/EmailProviders';

export class ExecuteBlockActionHandler {
    private context: UIKitBlockInteractionContext;

    constructor(
        protected readonly app: EmailBridgeNlpApp,
        protected readonly read: IRead,
        protected readonly http: IHttp,
        protected readonly persistence: IPersistence,
        protected readonly modify: IModify,
        context: UIKitBlockInteractionContext,
    ) {
        this.context = context;
    }

    public async handleActions(): Promise<IUIKitResponse> {
        const { actionId, user, room, triggerId, message, value } = this.context.getInteractionData();

        if (!room) {
            return this.context.getInteractionResponder().successResponse();
        }

        const language = await getUserPreferredLanguage(
            this.read.getPersistenceReader(),
            this.persistence,
            user.id,
        );

        const handler = new Handler({
            app: this.app,
            sender: user,
            room: room,
            read: this.read,
            modify: this.modify,
            http: this.http,
            persis: this.persistence,
            triggerId: triggerId,
            language: language,
        });

        switch (actionId) {
            case ActionIds.USER_PREFERENCE_ACTION:
                await handler.Config();
                break;
            case ActionIds.EMAIL_LOGIN_ACTION:
                await handler.Login();
                break;
            case ActionIds.EMAIL_LOGOUT_ACTION: {
                await handler.Logout();
                break;
            }
            case UserPreferenceModalEnum.EMAIL_PROVIDER_DROPDOWN_ACTION_ID:
                return await this.handleProviderChange(user);
            case ActionIds.SEND_EMAIL_DIRECT_ACTION:
                await this.handleDirectSendEmail(user, room);
                break;
            case ActionIds.SEND_EMAIL_EDIT_ACTION:
                await this.handleEditAndSendEmail(user, room, triggerId);
                break;
        }

        return this.context.getInteractionResponder().successResponse();
    }

    private async handleProviderChange(user: any): Promise<IUIKitResponse> {
        try {
            // Get user's preferred language
            const language = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );

            // Get current user preferences
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            const currentPreference = await userPreferenceStorage.getUserPreference();

            // Get the selected provider from the dropdown
            const { value } = this.context.getInteractionData();
            const selectedProvider = value as EmailProviders;

            // Check if provider changed and user is currently authenticated
            if (selectedProvider !== currentPreference.emailProvider) {
                const isAuthenticated = await EmailServiceFactory.isUserAuthenticated(
                    currentPreference.emailProvider,
                    user.id,
                    this.http,
                    this.persistence,
                    this.read,
                    this.app.getLogger()
                );

                // Create updated preference with warning flag for modal
                const tempPreference = {
                    ...currentPreference,
                    emailProvider: selectedProvider,
                    showProviderWarning: isAuthenticated // Add flag to show warning
                };

                // Update the modal to show warning
                const updatedModal = await UserPreferenceModal({
                    app: this.app,
                    modify: this.modify,
                    existingPreference: tempPreference,
                });

                return this.context.getInteractionResponder().updateModalViewResponse(updatedModal);
            }

            return this.context.getInteractionResponder().successResponse();
        } catch (error) {
            return this.context.getInteractionResponder().successResponse();
        }
    }

    private async handleDirectSendEmail(user: any, room: any): Promise<void> {
        const language = await getUserPreferredLanguage(
            this.read.getPersistenceReader(),
            this.persistence,
            user.id,
        );

        try {
            // Retrieve stored email data
            const emailData = await this.getStoredEmailData(room.id);
            if (!emailData) {
                throw new Error('Email data not found');
            }

            // Send email directly using ToolExecutorService
            const toolExecutorService = new ToolExecutorService(
                this.app,
                this.read,
                this.modify,
                this.http,
                this.persistence
            );

            const result = await toolExecutorService.sendEmail(emailData, user);

            // Show result message
            await this.showMessage(
                user,
                room,
                result.success
                    ? t(Translations.SEND_EMAIL_SUCCESS_WITH_EMOJI, language)
                    : t(Translations.SEND_EMAIL_FAILED_WITH_EMOJI, language, { error: 'Unknown error' }),
                language
            );

        } catch (error) {
            console.error('Error in handleDirectSendEmail:', error);
            await this.showMessage(
                user,
                room,
                t(Translations.SEND_EMAIL_FAILED_WITH_EMOJI, language, { error: 'Unknown error' }),
                language
            );
        }
    }

    private async handleEditAndSendEmail(user: any, room: any, triggerId?: string): Promise<void> {
        const language = await getUserPreferredLanguage(
            this.read.getPersistenceReader(),
            this.persistence,
            user.id,
        );

        try {
            // Retrieve stored email data
            const emailData = await this.getStoredEmailData(room.id);
            if (!emailData) {
                throw new Error('Email data not found');
            }

            if (!triggerId) {
                throw new Error('Trigger ID not available');
            }

            // Store room ID for later use in ExecuteViewSubmitHandler
            const roomInteractionStorage = new RoomInteractionStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            await roomInteractionStorage.storeInteractionRoomId(room.id);

            // Create and open modal
            const modal = await SendEmailModal({
                app: this.app,
                modify: this.modify,
                language: language,
                emailData,
                context: 'edit',
            });

            if (!modal) {
                throw new Error(t(Translations.ERROR_MODAL_CREATION_FAILED, language));
            }

            await this.modify
                .getUiController()
                .openSurfaceView(modal, { triggerId }, user);

        } catch (error) {
            console.error('Error in handleEditAndSendEmail:', error);
            // Show error message
            await this.showMessage(
                user,
                room,
                t(Translations.ERROR_MODAL_CREATION_FAILED, language),
                language
            );
        }
    }

    private async getStoredEmailData(roomId: string): Promise<ISendEmailData | null> {
        try {
            const association = new RocketChatAssociationRecord(
                RocketChatAssociationModel.ROOM,
                roomId,
            );

            const data = await this.read.getPersistenceReader().readByAssociation(association);

            // Handle both array and single object responses
            if (Array.isArray(data) && data.length > 0) {
                return (data[0] as any)?.emailData || null;
            } else if (data && typeof data === 'object') {
                return (data as any)?.emailData || null;
            }

            return null;
        } catch (error) {
            console.error('Error retrieving stored email data:', error);
            return null;
        }
    }

    private async showMessage(user: any, room: any, message: string, language: any): Promise<void> {
        try {
            const appUser = await this.read.getUserReader().getAppUser();
            if (!appUser) return;

            const messageBuilder = this.modify
                .getCreator()
                .startMessage()
                .setSender(appUser)
                .setRoom(room)
                .setGroupable(false)
                .setText(message);

            await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
        } catch (error) {
            console.error('Error showing message:', error);
        }
    }
}