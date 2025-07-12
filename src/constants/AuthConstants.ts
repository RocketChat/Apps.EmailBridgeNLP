export class ApiEndpoints {
    public static readonly GOOGLE_API_BASE_URL = 'https://gmail.googleapis.com/gmail/v1/users/me';
    public static readonly OUTLOOK_API_BASE_URL = 'https://graph.microsoft.com/v1.0/me';
}

// Google OAuth URLs
export const GoogleOauthUrls = {
    AUTHORIZATION: 'https://accounts.google.com/o/oauth2/v2/auth',
    TOKEN: 'https://oauth2.googleapis.com/token',
    USER_INFO: 'https://www.googleapis.com/oauth2/v2/userinfo',
    REVOKE: 'https://oauth2.googleapis.com/revoke',
    SEND_EMAIL: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
} as const;

// Microsoft OAuth URLs
export const MicrosoftOauthUrls = {
    AUTHORIZATION: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    TOKEN: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    USER_INFO: 'https://graph.microsoft.com/v1.0/me',
    SEND_EMAIL: 'https://graph.microsoft.com/v1.0/me/sendMail',
} as const;

// Google OAuth Scopes
export const GoogleOauthScopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'email',
    'profile'
] as const;

// Microsoft OAuth Scopes
export const MicrosoftOauthScopes = [
    'https://graph.microsoft.com/User.Read',
    'https://graph.microsoft.com/Mail.Read',
    'https://graph.microsoft.com/Mail.Send',
    'https://graph.microsoft.com/Mail.ReadWrite',
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

// HTTP Headers
export const HttpHeaders = {
    AUTHORIZATION: 'Authorization',
    CONTENT_TYPE: 'Content-Type',
    CONSISTENCY_LEVEL: 'ConsistencyLevel',
} as const;

// HTTP Content Types
export const ContentTypes = {
    APPLICATION_JSON: 'application/json',
    APPLICATION_FORM_URLENCODED: 'application/x-www-form-urlencoded',
    TEXT_HTML: 'text/html',
} as const;

// Common Header Values
export const HeaderValues = {
    CONSISTENCY_LEVEL_EVENTUAL: 'eventual',
} as const;

// Header Builder Utilities
export const HeaderBuilders = {
    createBearerAuthHeader: (accessToken: string) => ({
        [HttpHeaders.AUTHORIZATION]: `Bearer ${accessToken}`,
    }),
    
    createJsonAuthHeaders: (accessToken: string) => ({
        [HttpHeaders.AUTHORIZATION]: `Bearer ${accessToken}`,
        [HttpHeaders.CONTENT_TYPE]: ContentTypes.APPLICATION_JSON,
    }),
    
    createOutlookHeaders: (accessToken: string) => ({
        [HttpHeaders.AUTHORIZATION]: `Bearer ${accessToken}`,
        [HttpHeaders.CONSISTENCY_LEVEL]: HeaderValues.CONSISTENCY_LEVEL_EVENTUAL,
    }),
    
    createOutlookJsonHeaders: (accessToken: string) => ({
        [HttpHeaders.AUTHORIZATION]: `Bearer ${accessToken}`,
        [HttpHeaders.CONTENT_TYPE]: ContentTypes.APPLICATION_JSON,
        [HttpHeaders.CONSISTENCY_LEVEL]: HeaderValues.CONSISTENCY_LEVEL_EVENTUAL,
    }),
} as const;

// LLM Configuration
export const LlmConfig = {
    ENDPOINT: 'http://llama3-8b.local:12345/v1/chat/completions',
    MODEL_PATH: './dist/Llama-3-8B-Instruct-q4f16_1-MLC/',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
    TIMEOUT: 30000, // 30 seconds
} as const;

// Message Retrieval Configuration
export const MessageConfig = {
    MAX_MESSAGES_RETRIEVAL: 100, // Maximum number of messages that can be retrieved for summarization
} as const;

 
