export enum LLMConfigurationModalEnum {
    VIEW_ID = 'llm-configuration-modal',

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
    SUBMIT_ACTION_ID = 'llm-config-submit',
    SUBMIT_BLOCK_ID = 'llm-config-submit-block',
    CLOSE_ACTION_ID = 'llm-config-close',
    CLOSE_BLOCK_ID = 'llm-config-close-block',
}
