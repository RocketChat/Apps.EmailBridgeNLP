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
        public: false, //Admin only
        i18nLabel: 'Email_Provider_Label',
        i18nDescription: 'Email_Provider_Description',
        values: [
            {
                key: 'gmail',
                i18nLabel: 'Gmail_Label',
            },
            {
                key: 'outlook',
                i18nLabel: 'Outlook_Label',
            },
        ],
    },
    {
        id: SettingsIds.OAuthClientId,
        type: SettingType.STRING,
        packageValue: '',
        required: true,
        public: false, // Admin only
        i18nLabel: 'Google_OAuth_Client_ID_Label',
        i18nDescription: 'Google_OAuth_Client_ID_Description',
    },
    {
        id: SettingsIds.OAuthClientSecret,
        type: SettingType.PASSWORD,
        packageValue: '',
        required: true,
        public: false, // Admin only
        i18nLabel: 'Google_OAuth_Client_Secret_Label',
        i18nDescription: 'Google_OAuth_Client_Secret_Description',
    },
    {
        id: SettingsIds.OAuthRedirectUri,
        type: SettingType.STRING,
        packageValue: '',
        required: true,
        public: false, // Admin only
        i18nLabel: 'OAuth_Redirect_URI_Label',
        i18nDescription: 'OAuth_Redirect_URI_Description',
    },
]; 