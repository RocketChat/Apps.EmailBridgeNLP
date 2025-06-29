// Google OAuth URLs
export const GoogleOauthUrls = {
    AUTHORIZATION: 'https://accounts.google.com/o/oauth2/v2/auth',
    TOKEN: 'https://oauth2.googleapis.com/token',
    USER_INFO: 'https://www.googleapis.com/oauth2/v2/userinfo',
    REVOKE: 'https://oauth2.googleapis.com/revoke',
} as const;

// Microsoft OAuth URLs
export const MicrosoftOauthUrls = {
    AUTHORIZATION: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    TOKEN: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    USER_INFO: 'https://graph.microsoft.com/v1.0/me',
} as const;

// Google OAuth Scopes
export const GoogleOauthScopes = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'email',
    'profile'
] as const;

// Microsoft OAuth Scopes
export const MicrosoftOauthScopes = [
    'https://graph.microsoft.com/Mail.ReadWrite',
    'https://graph.microsoft.com/Mail.Send',
    'https://graph.microsoft.com/User.Read',
    'offline_access'
] as const;

// OAuth Configuration
export const OauthConfig = {
    TOKEN_BUFFER_TIME: 5 * 60 * 1000, // 5 minutes in milliseconds
    RESPONSE_TYPE: 'code',
    ACCESS_TYPE: 'offline',
    PROMPT_CONSENT: 'consent',
    PROMPT_SELECT_ACCOUNT: 'select_account',
    GRANT_TYPE_AUTHORIZATION_CODE: 'authorization_code',
    GRANT_TYPE_REFRESH_TOKEN: 'refresh_token',
    CONTENT_TYPE_FORM_URLENCODED: 'application/x-www-form-urlencoded',
    RESPONSE_MODE: 'query',
    TOKEN_TYPE_BEARER: 'Bearer',
    AUTHORIZATION_HEADER_PREFIX: 'Bearer',
} as const;

// Protocol constants
export const ProtocolConstants = {
    HTTPS: 'https://',
    HTTP: 'http://',
    LOCALHOST: 'localhost',
} as const;


// OAuth Endpoint Paths
export const OauthEndpointPaths = {
    GOOGLE_CALLBACK: 'oauth-callback',
    OUTLOOK_CALLBACK: 'outlook-oauth-callback',
} as const; 