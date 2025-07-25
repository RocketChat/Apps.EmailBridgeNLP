export enum UserPreferenceModalEnum {
    VIEW_ID = 'prefs-modal',
    
    // Language dropdown
    LANGUAGE_INPUT_DROPDOWN_BLOCK_ID = 'lang-block',
    LANGUAGE_INPUT_DROPDOWN_ACTION_ID = 'lang-action',
    
    // Email Provider dropdown
    EMAIL_PROVIDER_DROPDOWN_BLOCK_ID = 'provider-block',
    EMAIL_PROVIDER_DROPDOWN_ACTION_ID = 'provider-action',
    
    // Stats Categories input
    STATS_CATEGORIES_INPUT_BLOCK_ID = 'stats-categories-block',
    STATS_CATEGORIES_INPUT_ACTION_ID = 'stats-categories-action',
    
    NEW_CATEGORY_INPUT_BLOCK_ID = 'new-category-block',
    NEW_CATEGORY_INPUT_ACTION_ID = 'new-category-action',
    ADD_CATEGORY_ACTION_ID = 'add-category-action',
    
    // System Prompt input
    SYSTEM_PROMPT_INPUT_BLOCK_ID = 'system-prompt-block',
    SYSTEM_PROMPT_INPUT_ACTION_ID = 'system-prompt-action',
    
    // LLM Configuration
    LLM_USAGE_PREFERENCE_DROPDOWN_BLOCK_ID = 'llm-usage-preference-block',
    LLM_USAGE_PREFERENCE_DROPDOWN_ACTION_ID = 'llm-usage-preference-action',
    LLM_PROVIDER_DROPDOWN_BLOCK_ID = 'llm-provider-block',
    LLM_PROVIDER_DROPDOWN_ACTION_ID = 'llm-provider-action',
    
    // LLM Provider specific fields
    SELF_HOSTED_URL_BLOCK_ID = 'self-hosted-url-block',
    SELF_HOSTED_URL_ACTION_ID = 'self-hosted-url-action',
    OPENAI_API_KEY_BLOCK_ID = 'openai-api-key-block',
    OPENAI_API_KEY_ACTION_ID = 'openai-api-key-action',
    GEMINI_API_KEY_BLOCK_ID = 'gemini-api-key-block',
    GEMINI_API_KEY_ACTION_ID = 'gemini-api-key-action',
    GROQ_API_KEY_BLOCK_ID = 'groq-api-key-block',
    GROQ_API_KEY_ACTION_ID = 'groq-api-key-action',
    
    // Actions
    SUBMIT_ACTION_ID = 'submit',
    SUBMIT_BLOCK_ID = 'submit-block',
    CLOSE_ACTION_ID = 'close',
    CLOSE_BLOCK_ID = 'close-block',
    
    // Button labels
    UPDATE = 'Update Preferences',
    CLOSE = 'Close',
} 