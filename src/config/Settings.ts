import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export enum SettingsIds {
    EmailProvider = 'emailbridge_provider',
    OAuthClientId = 'oauth_client_id',
    OAuthClientSecret = 'oauth_client_secret',
    OAuthRedirectUri = 'oauth_redirect_uri',
}

export const settings: Array<ISetting> = [
    {
        id: SettingsIds.EmailProvider,
        type: SettingType.SELECT,
        packageValue: 'gmail',
        required: true,
        public: true, // Visible to both admin and users
        i18nLabel: 'Email Provider',
        i18nDescription: 'Select your email service provider for authentication',
        values: [
            {
                key: 'gmail',
                i18nLabel: 'Gmail',
            },
            {
                key: 'outlook',
                i18nLabel: 'Outlook/Hotmail',
            },
        ],
    },
    {
        id: SettingsIds.OAuthClientId,
        type: SettingType.STRING,
        packageValue: '',
        required: true,
        public: false, // Admin only
        i18nLabel: 'Google OAuth Client ID',
        i18nDescription: 'OAuth client ID for Google authentication (Gmail only)',
    },
    {
        id: SettingsIds.OAuthClientSecret,
        type: SettingType.PASSWORD,
        packageValue: '',
        required: true,
        public: false, // Admin only
        i18nLabel: 'Google OAuth Client Secret',
        i18nDescription: 'OAuth client secret for Google authentication (Gmail only)',
    },
    {
        id: SettingsIds.OAuthRedirectUri,
        type: SettingType.STRING,
        packageValue: '',
        required: true,
        public: false, // Admin only
        i18nLabel: 'OAuth Redirect URI',
        i18nDescription: 'OAuth redirect URI - should end with /api/apps/public/[app-id]/oauth-callback',
    },
]; 