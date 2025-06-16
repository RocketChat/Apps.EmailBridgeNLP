import { en } from './locales/en';
import { es } from './locales/es';
import { de } from './locales/de';
import { pl } from './locales/pl';
import { pt } from './locales/pt';
import { ru } from './locales/ru';

export enum Language {
    en = 'en',
    es = 'es',
    de = 'de',
    pl = 'pl',
    pt = 'pt',
    ru = 'ru',
}

export const supportedLanguageList: Language[] = [Language.en, Language.es, Language.de, Language.pl, Language.pt, Language.ru];

export const locales = {
    en,
    es,
    de,
    pl,
    pt,
    ru,
};

export function t(key: keyof typeof en, language: Language = Language.en, params?: Record<string, string>): string {
    const locale = locales[language] || locales.en;
    let translation = locale[key] || key;

    // Replace placeholders if params are provided
    if (params) {
        Object.keys(params).forEach(paramKey => {
            const placeholder = `__${paramKey}__`;
            translation = translation.replace(new RegExp(placeholder, 'g'), params[paramKey]);
        });
    }

    return translation;
} 