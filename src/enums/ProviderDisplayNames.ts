import { EmailProviders } from './EmailProviders';

export enum ProviderDisplayNames {
    GMAIL = 'Gmail',
    OUTLOOK = 'Outlook',
}

export function getProviderDisplayName(provider: EmailProviders): string {
    switch (provider) {
        case EmailProviders.GMAIL:
            return ProviderDisplayNames.GMAIL;
        case EmailProviders.OUTLOOK:
            return ProviderDisplayNames.OUTLOOK;
        default:
            return provider;
    }
} 