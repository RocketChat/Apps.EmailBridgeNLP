import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    IUIKitResponse,
    UIKitActionButtonInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';

import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { ActionIds } from '../enums/ActionIds';
import { ToolExecutorService } from '../services/ToolExecutorService';
import { getUserPreferredLanguage } from '../helper/userPreference';
import { t, Language } from '../lib/Translation/translation';
import { Translations } from '../constants/Translations';
import { RoomInteractionStorage } from '../storage/RoomInteractionStorage';
import { SendEmailModal } from '../modal/SendEmailModal';
import { ISendEmailData } from '../definition/lib/IEmailUtils';
import { MessageFormatter } from '../lib/MessageFormatter';

export class ExecuteActionButtonHandler {
    private context: UIKitActionButtonInteractionContext;
    
    constructor(
        protected readonly app: EmailBridgeNlpApp,
        protected readonly read: IRead,
        protected readonly http: IHttp,
        protected readonly persistence: IPersistence,
        protected readonly modify: IModify,
        context: UIKitActionButtonInteractionContext,
    ) {
        this.context = context;
    }

    public async handleActions(): Promise<IUIKitResponse> {
        const { actionId, user, room, triggerId } = this.context.getInteractionData();

        try {
            switch (actionId) {
                case ActionIds.SEND_EMAIL_DIRECT_ACTION:
                    await this.handleDirectSendEmail(user, room);
                    break;
                    
                case ActionIds.SEND_EMAIL_EDIT_ACTION:
                    await this.handleEditAndSendEmail(user, room, triggerId);
                    break;
                    
                default:
                    break;
            }
        } catch (error) {
            // Log error but don't throw to avoid breaking the interaction
            this.app.getLogger().error('Error handling action button:', error);
        }

        return this.context.getInteractionResponder().successResponse();
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
                await this.showMessage(
                    user,
                    room,
                    MessageFormatter.formatDataNotAvailableMessage(language),
                    language
                );
                return;
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
                result.success ? `${result.message}` : `${result.message}`,
                language
            );

        } catch (error) {
            // Show generic error message for any unexpected errors
            await this.showMessage(
                user,
                room,
                MessageFormatter.formatRetryErrorMessage(language),
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
                await this.showMessage(
                    user,
                    room,
                    MessageFormatter.formatDataNotAvailableMessage(language),
                    language
                );
                return;
            }

            if (!triggerId) {
                await this.showMessage(
                    user,
                    room,
                    t(Translations.ERROR_TRIGGER_ID_MISSING, language),
                    language
                );
                return;
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
                await this.showMessage(
                    user,
                    room,
                    t(Translations.ERROR_MODAL_CREATION_FAILED, language),
                    language
                );
                return;
            }

            await this.modify
                .getUiController()
                .openSurfaceView(modal, { triggerId }, user);

        } catch (error) {
            // Show generic error message for any unexpected errors
            await this.showMessage(
                user,
                room,
                MessageFormatter.formatRetryErrorMessage(language),
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
            this.app.getLogger().error('Error retrieving stored email data:', error);
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
            this.app.getLogger().error('Error showing message:', error);
        }
    }
} 