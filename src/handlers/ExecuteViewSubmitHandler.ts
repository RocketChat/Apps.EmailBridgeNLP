import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    IUIKitResponse,
    UIKitViewSubmitInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';

import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { UserPreferenceModalEnum } from '../enums/modals/UserPreferenceModal';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';
import { RoomInteractionStorage } from '../storage/RoomInteractionStorage';
import { getUserPreferredLanguage } from '../helper/userPreference';
import { t, Language } from '../lib/Translation/translation';
import { EmailProviders } from '../enums/EmailProviders';
import { IPreference } from '../definition/lib/IUserPreferences';
import { sendNotification } from '../helper/notification';

export class ExecuteViewSubmitHandler {
    private context: UIKitViewSubmitInteractionContext;
    
    constructor(
        protected readonly app: EmailBridgeNlpApp,
        protected readonly read: IRead,
        protected readonly http: IHttp,
        protected readonly persistence: IPersistence,
        protected readonly modify: IModify,
        context: UIKitViewSubmitInteractionContext,
    ) {
        this.context = context;
    }

    public async handleActions(): Promise<IUIKitResponse> {
        const { user, view } = this.context.getInteractionData();

        if (view.id === UserPreferenceModalEnum.VIEW_ID) {
            return await this.handleUserPreferenceSubmit(user, view);
        }

        return this.context.getInteractionResponder().successResponse();
    }

    private async handleUserPreferenceSubmit(user: any, view: any): Promise<IUIKitResponse> {
        try {
            // Get the room from stored interaction context (QuickReplies approach)
            const roomInteractionStorage = new RoomInteractionStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            
            const roomId = await roomInteractionStorage.getInteractionRoomId();
            let room = roomId ? await this.read.getRoomReader().getById(roomId) : null;
            
            // Fallback: Try to get room from interaction context if storage failed
            if (!room) {
                const { room: contextRoom } = this.context.getInteractionData();
                room = contextRoom;
            }
            
            // Get user's current language for messages
            const currentLanguage = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );

            // Extract values from the form
            const state = view.state || {};
            
            // Get language from dropdown
            const languageBlockState = state[UserPreferenceModalEnum.LANGUAGE_INPUT_DROPDOWN_BLOCK_ID];
            const selectedLanguage = languageBlockState?.[UserPreferenceModalEnum.LANGUAGE_INPUT_DROPDOWN_ACTION_ID] as Language || currentLanguage;
            
            // Get email provider from dropdown
            const emailProviderBlockState = state[UserPreferenceModalEnum.EMAIL_PROVIDER_DROPDOWN_BLOCK_ID];
            const selectedEmailProvider = emailProviderBlockState?.[UserPreferenceModalEnum.EMAIL_PROVIDER_DROPDOWN_ACTION_ID] as EmailProviders || EmailProviders.GMAIL;

            // Create preference object
            const preference: IPreference = {
                userId: user.id,
                language: selectedLanguage,
                emailProvider: selectedEmailProvider,
            };

            // Get current preferences to compare changes
            const userPreference = new UserPreferenceStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            
            const currentPreference = await userPreference.getUserPreference();
            
            // Save the new preference
            await userPreference.storeUserPreference(preference);

            // Send success notification to user
            await this.sendSuccessNotification(user, room, currentPreference, preference, selectedLanguage);

            return this.context.getInteractionResponder().successResponse();

        } catch (error) {
            // Get user's current language for error message
            const currentLanguage = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                user.id,
            );

            // Return error response - just return success as errorResponse may not accept message
            return this.context.getInteractionResponder().successResponse();
        }
    }

    private async sendSuccessNotification(
        user: any, 
        room: any, 
        oldPreference: IPreference | null, 
        newPreference: IPreference, 
        language: Language
    ): Promise<void> {
        try {
            // Build detailed success message showing what changed
            let message = t('User_Preference_Success', language);
            
            // Add details about what changed
            const changes: string[] = [];
            
            if (!oldPreference || oldPreference.language !== newPreference.language) {
                changes.push(t('Language_Changed', language, { 
                    language: this.getLanguageDisplayName(newPreference.language, language) 
                }));
            }
            
            if (!oldPreference || oldPreference.emailProvider !== newPreference.emailProvider) {
                changes.push(t('Email_Provider_Changed', language, { 
                    provider: this.getProviderDisplayName(newPreference.emailProvider, language) 
                }));
            }

            if (changes.length > 0) {
                message += '\n\n' + changes.join('\n');
            }

            // Send notification using room context (QuickReplies approach)
            if (room) {
                await sendNotification(this.read, this.modify, user, room, {
                    message: message
                });
            }
        } catch (error) {
            // Silent error handling for notification failures
        }
    }

    private getLanguageDisplayName(targetLanguage: Language, displayLanguage: Language): string {
        // Use proper translation keys for language names
        switch (targetLanguage) {
            case Language.en:
                return t('Language_EN', displayLanguage);
            case Language.es:
                return t('Language_ES', displayLanguage);
            case Language.ru:
                return t('Language_RU', displayLanguage);
            case Language.de:
                return t('Language_DE', displayLanguage);
            case Language.pl:
                return t('Language_PL', displayLanguage);
            case Language.pt:
                return t('Language_PT', displayLanguage);
            default:
                return targetLanguage;
        }
    }

    private getProviderDisplayName(provider: EmailProviders, displayLanguage: Language): string {
        // Use proper translation keys for provider names
        switch (provider) {
            case EmailProviders.GMAIL:
                return t('Gmail_Label', displayLanguage);
            case EmailProviders.OUTLOOK:
                return t('Outlook_Label', displayLanguage);
            default:
                return provider;
        }
    }
} 