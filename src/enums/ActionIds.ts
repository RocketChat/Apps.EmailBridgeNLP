export enum ActionIds {
    // Email Authentication Actions
    EMAIL_LOGIN_ACTION = 'login',
    EMAIL_LOGOUT_ACTION = 'logout',
    EMAIL_LOGOUT_CONFIRM_ACTION = 'logout_confirm',
    
    // User Preference Actions
    USER_PREFERENCE_ACTION = 'prefs',
    LLM_CONFIGURATION_ACTION = 'llm_config',
    
    // Modal Actions (if needed for consistency)
    USER_PREFERENCE_SUBMIT = 'prefs_submit',
    USER_PREFERENCE_CLOSE = 'prefs_close',
    
    // Send Email Actions
    SEND_EMAIL_DIRECT_ACTION = 'send_email_direct',
    SEND_EMAIL_EDIT_ACTION = 'send_email_edit',
} 