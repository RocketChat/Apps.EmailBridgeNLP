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
import { getUserPreferredLanguage } from '../helper/userPreference';
import { t, Language } from '../lib/Translation/translation';
import { EmailProviders } from '../enums/EmailProviders';
import { IPreference } from '../definition/lib/IUserPreferences';

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
            // Get the room from interaction context if available
            const { room } = this.context.getInteractionData();
            
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

            // Save the preference
            const userPreference = new UserPreferenceStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                user.id,
            );
            
            await userPreference.storeUserPreference(preference);

            // Send success notification to user as a direct message
            const appUser = await this.read.getUserReader().getAppUser();
            if (appUser) {
                const messageBuilder = this.modify
                    .getCreator()
                    .startMessage()
                    .setSender(appUser)
                    .setGroupable(false)
                    .setText(t('User_Preference_Success', selectedLanguage));

                try {
                    // Try direct user notification first
                    await this.read.getNotifier().notifyUser(user, messageBuilder.getMessage());
                } catch (error) {
                    // Try alternative approach - send to a room if available from context
                    if (room) {
                        try {
                            const roomMessageBuilder = this.modify
                                .getCreator()
                                .startMessage()
                                .setSender(appUser)
                                .setRoom(room)
                                .setGroupable(false)
                                .setText(`@${user.username} ${t('User_Preference_Success', selectedLanguage)}`);
                            
                            await this.modify.getCreator().finish(roomMessageBuilder);
                        } catch (roomError) {
                            // Silent error handling
                        }
                    }
                }
            }

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
} 