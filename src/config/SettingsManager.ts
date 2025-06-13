import { ISettingsExtend, ISettingRead } from '@rocket.chat/apps-engine/definition/accessors';
import { settings, SettingsIds } from './Settings';
import { EmailProviders } from '../enums/EmailProviders';
import { IEmailSettings } from '../definition/lib/IEmailSettings';

/**
 * Initialize app settings
 */
export async function extendSettings(settingsExtend: ISettingsExtend): Promise<void> {
    for (const setting of settings) {
        await settingsExtend.provideSetting(setting);
    }
}

/**
 * Get email settings from the app configuration
 */
export async function getEmailSettings(settingsReader: ISettingRead): Promise<IEmailSettings> {
    const providerString = await settingsReader.getValueById(SettingsIds.EmailProvider) as string;
    
    // Convert string to enum
    let provider: EmailProviders;
    switch (providerString) {
        case 'gmail':
            provider = EmailProviders.GMAIL;
            break;
        case 'outlook':
            provider = EmailProviders.OUTLOOK;
            break;
        default:
            provider = EmailProviders.GMAIL; // Default fallback
    }
    
    return {
        email: '', // Will be populated from user's authenticated account
        provider: provider,
    };
}

/**
 * Get OAuth settings for Google
 */
export async function getGoogleOAuthSettings(settingsReader: ISettingRead): Promise<{[key: string]: string}> {
    return {
        oauth_client_id: await settingsReader.getValueById(SettingsIds.OAuthClientId) as string,
        oauth_client_secret: await settingsReader.getValueById(SettingsIds.OAuthClientSecret) as string,
        oauth_redirect_uri: await settingsReader.getValueById(SettingsIds.OAuthRedirectUri) as string,
    };
} 