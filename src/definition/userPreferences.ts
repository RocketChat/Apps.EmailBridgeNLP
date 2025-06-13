import { Language } from '../lib/Translation/translation';
import { EmailProviders } from '../enums/EmailProviders';

/**
 * User preference interface for storing individual user settings
 */
export interface IPreference {
    userId: string;
    language: Language;
    emailProvider: EmailProviders;
}

/**
 * User preference storage interface for persistence operations
 */
export interface IUserPreferenceStorage {
    storeUserPreference(preference: IPreference): Promise<void>;
    getUserPreference(): Promise<IPreference>;
} 