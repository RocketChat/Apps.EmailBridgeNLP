import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';
import {
    IPersistence,
    IPersistenceRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IUserPreferenceStorage } from '../definition/lib/IUserPreferences';
import { IPreference } from '../definition/lib/IUserPreferences';
import { Language } from '../lib/Translation/translation';
import { EmailProviders } from '../enums/EmailProviders';



export class UserPreferenceStorage implements IUserPreferenceStorage {
    private userId: string;

    constructor(
        private readonly persistence: IPersistence,
        private readonly persistenceRead: IPersistenceRead,
        userId: string,
    ) {
        this.userId = userId;
    }

    public async storeUserPreference(preference: IPreference): Promise<void> {
        const currentPreference = await this.getUserPreference();

        // Store categories as selected by user (no forced defaults)
                const userSelectedCategories = preference.statsCategories
            ? preference.statsCategories.map(c => c.toLowerCase())
            : currentPreference.statsCategories;

        const updatedPreference: IPreference = {
            userId: this.userId,
            language: preference.language || currentPreference.language,
            emailProvider: preference.emailProvider || currentPreference.emailProvider,
            statsCategories: userSelectedCategories,
            showProviderWarning: preference.showProviderWarning || currentPreference.showProviderWarning,
            llmConfiguration: preference.llmConfiguration || currentPreference.llmConfiguration,
            systemPrompt: preference.systemPrompt !== undefined ? preference.systemPrompt : currentPreference.systemPrompt,
        };

        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            `${this.userId}#preference`,
        );
        await this.persistence.updateByAssociation(
            association,
            { preference: updatedPreference },
            true,
        );
    }

    public async getUserPreference(): Promise<IPreference> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            `${this.userId}#preference`,
        );
        const result = (await this.persistenceRead.readByAssociation(
            association,
        )) as Array<{ preference: IPreference }>;
        
        if (result.length > 0) {
            return result[0].preference;
        } else {
            const preference: IPreference = {
                userId: this.userId,
                language: Language.en,
                emailProvider: EmailProviders.GMAIL,
                statsCategories: ['github', 'calendar', 'social'],
            };
            return preference;
        }
    }
} 