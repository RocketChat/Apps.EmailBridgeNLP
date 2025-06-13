import { IPreference } from '../helper/userPreference';

export interface IUserPreferenceStorage {
    storeUserPreference(preference: IPreference): Promise<void>;
    getUserPreference(): Promise<IPreference>;
} 