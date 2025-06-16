/**
 * Authentication constants for email providers
 */

// Google OAuth URLs
export const GOOGLE_OAUTH_URLS = {
    AUTHORIZATION: 'https://accounts.google.com/o/oauth2/v2/auth',
    TOKEN: 'https://oauth2.googleapis.com/token',
    USER_INFO: 'https://www.googleapis.com/oauth2/v2/userinfo',
    REVOKE: 'https://oauth2.googleapis.com/revoke',
} as const;

// Microsoft OAuth URLs
export const MICROSOFT_OAUTH_URLS = {
    AUTHORIZATION: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    TOKEN: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    USER_INFO: 'https://graph.microsoft.com/v1.0/me',
} as const;

// Google OAuth Scopes
export const GOOGLE_OAUTH_SCOPES = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'email',
    'profile'
] as const;

// Microsoft OAuth Scopes
export const MICROSOFT_OAUTH_SCOPES = [
    'https://graph.microsoft.com/Mail.ReadWrite',
    'https://graph.microsoft.com/Mail.Send',
    'https://graph.microsoft.com/User.Read',
    'offline_access'
] as const;

// OAuth Error Messages
export enum AUTH_ERRORS {
    INITIALIZATION_FAILED = 'Failed to initialize OAuth Service',
    OUTLOOK_INITIALIZATION_FAILED = 'Failed to initialize Outlook OAuth Service',
    MISSING_OAUTH_SETTINGS = 'Missing required OAuth settings. Please configure the OAuth settings in the app configuration.',
    EXCHANGE_CODE_FAILED = 'Failed to exchange code for tokens',
    GET_USER_INFO_FAILED = 'Failed to get user info',
    REFRESH_TOKEN_FAILED = 'Failed to refresh access token',
    NO_ACCESS_TOKEN = 'No access token received from OAuth provider',
    NO_USER_EMAIL_GOOGLE = 'Failed to get user email from Google',
    NO_USER_EMAIL_MICROSOFT = 'Failed to get user email from Microsoft',
    USER_NOT_AUTHENTICATED = 'User not authenticated, please use /email login to connect your email account',
    TOKEN_EXPIRED = 'Your authentication has expired. Please use /email login to reconnect your account',
    PROVIDER_NOT_SUPPORTED = 'Authentication for {provider} is not yet implemented. Please use Gmail or Outlook.',
}

// OAuth Configuration
export const OAUTH_CONFIG = {
    TOKEN_BUFFER_TIME: 5 * 60 * 1000, // 5 minutes in milliseconds
    RESPONSE_TYPE: 'code',
    ACCESS_TYPE: 'offline',
    PROMPT_CONSENT: 'consent',
    PROMPT_SELECT_ACCOUNT: 'select_account',
    GRANT_TYPE_AUTHORIZATION_CODE: 'authorization_code',
    GRANT_TYPE_REFRESH_TOKEN: 'refresh_token',
    CONTENT_TYPE_FORM_URLENCODED: 'application/x-www-form-urlencoded',
} as const;

// Protocol constants
export const PROTOCOL_CONSTANTS = {
    HTTPS: 'https://',
    HTTP: 'http://',
    LOCALHOST: 'localhost',
} as const; 