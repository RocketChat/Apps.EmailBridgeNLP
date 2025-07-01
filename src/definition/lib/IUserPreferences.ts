import { Language } from '../../lib/Translation/translation';
import { EmailProviders } from '../../enums/EmailProviders';

/**
 * User preference interface for storing individual user settings
 */
export interface IPreference {
    userId: string;
    language: Language;
    emailProvider: EmailProviders;
    showProviderWarning?: boolean; // Optional flag to show provider change warning in modal
    reportCategories?: string[];
}

/**
 * User preference storage interface for persistence operations
 */
export interface IUserPreferenceStorage {
    storeUserPreference(preference: IPreference): Promise<void>;
    getUserPreference(): Promise<IPreference>;
} 