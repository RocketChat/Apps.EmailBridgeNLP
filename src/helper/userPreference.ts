import {
    IPersistence,
    IPersistenceRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    Language,
    supportedLanguageList,
    t,
} from '../lib/Translation/translation';
import { Translations } from '../constants/Translations';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';

export const getUserPreferredLanguage = async (
    read: IPersistenceRead,
    persistence: IPersistence,
    userId: string,
): Promise<Language> => {
    if (!userId) {
        return Language.en;
    }
    const userPreference = new UserPreferenceStorage(persistence, read, userId);

    const preference = await userPreference.getUserPreference();

    if (preference != null) {
        return isSupportedLanguage(preference.language)
            ? preference.language
            : Language.en;
    }

    return Language.en;
};

export const isSupportedLanguage = (language: Language): boolean => {
    return supportedLanguageList.includes(language);
};

export const getLanguageDisplayTextFromCode = (
    code: Language,
    language: Language,
): string => {
    switch (code) {
        case Language.en:
            return t(Translations.LANGUAGE_EN, language);
        case Language.es:
            return t(Translations.LANGUAGE_ES, language);
        case Language.de:
            return t(Translations.LANGUAGE_DE, language);
        case Language.pl:
            return t(Translations.LANGUAGE_PL, language);
        case Language.pt:
            return t(Translations.LANGUAGE_PT, language);
        case Language.ru:
            return t(Translations.LANGUAGE_RU, language);
        default:
            return code;
    }
}; 