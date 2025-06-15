import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';

export enum SettingsIds {
    EmailProvider = 'provider',
    OAuthClientId = 'client_id',
    OAuthClientSecret = 'client_secret',
    OAuthRedirectUri = 'redirect_uri',
    OutlookClientId = 'outlook_client_id',
    OutlookClientSecret = 'outlook_client_secret',
    OutlookRedirectUri = 'outlook_redirect_uri',
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
    {
        id: SettingsIds.OutlookClientId,
        type: SettingType.STRING,
        packageValue: '',
        required: true,
        public: false, // Admin only
        i18nLabel: 'Outlook_OAuth_Client_ID_Label',
        i18nDescription: 'Outlook_OAuth_Client_ID_Description',
    },
    {
        id: SettingsIds.OutlookClientSecret,
        type: SettingType.PASSWORD,
        packageValue: '',
        required: true,
        public: false, // Admin only
        i18nLabel: 'Outlook_OAuth_Client_Secret_Label',
        i18nDescription: 'Outlook_OAuth_Client_Secret_Description',
    },
    {
        id: SettingsIds.OutlookRedirectUri,
        type: SettingType.STRING,
        packageValue: '',
        required: true,
        public: false, // Admin only
        i18nLabel: 'Outlook_OAuth_Redirect_URI_Label',
        i18nDescription: 'Outlook_OAuth_Redirect_URI_Description',
    },
]; 