import { EmailProviders } from './EmailProviders';

export enum ProviderDisplayNames {
    GMAIL = 'Gmail',
    OUTLOOK = 'Outlook',
}

/**
 * Helper function to get display name for a provider
 * @param provider EmailProviders enum value
 * @returns Proper display name for the provider
 */
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