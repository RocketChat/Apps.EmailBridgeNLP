import { Language } from '../../lib/Translation/translation';
import { EmailProviders } from '../../enums/EmailProviders';

export type LLMUsagePreference = 
    | LLMUsagePreferenceEnum.Personal
    | LLMUsagePreferenceEnum.Workspace;

export enum LLMUsagePreferenceEnum {
    Personal = 'Personal',
    Workspace = 'Workspace',
}

export type LLMProviderType =
    | LLMProviderEnum.SelfHosted
    | LLMProviderEnum.OpenAI
    | LLMProviderEnum.Gemini
    | LLMProviderEnum.Groq;

export enum LLMProviderEnum {
    SelfHosted = 'self-hosted',
    OpenAI = 'openai',
    Gemini = 'gemini',
    Groq = 'groq',
}

export interface ILLMConfiguration {
    llmUsagePreference: LLMUsagePreference;
    llmProvider?: LLMProviderType;
    selfHosted?: {
        url: string;
    };
    openai?: {
        apiKey: string;
    };
    gemini?: {
        apiKey: string;
    };
    groq?: {
        apiKey: string;
    };
}

export interface IPreference {
    userId: string;
    language: Language;
    emailProvider: EmailProviders;
    showProviderWarning?: boolean; // Optional flag to show provider change warning in modal
    statsCategories?: string[];
    llmConfiguration?: ILLMConfiguration;
    systemPrompt?: string; // Custom system prompt for email tone customization
}

export interface IUserPreferenceStorage {
    storeUserPreference(preference: IPreference): Promise<void>;
    getUserPreference(): Promise<IPreference>;
} 