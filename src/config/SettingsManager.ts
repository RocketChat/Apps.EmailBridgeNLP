import { ISettingsExtend, ISettingRead } from '@rocket.chat/apps-engine/definition/accessors';
import { settings, SettingsIds } from './Settings';
import { EmailProviders } from '../enums/EmailProviders';
import { IEmailSettings } from '../definition/auth/IAuth';

export async function extendSettings(settingsExtend: ISettingsExtend): Promise<void> {
    for (const setting of settings) {
        await settingsExtend.provideSetting(setting);
    }
}

export async function getEmailSettings(settingsReader: ISettingRead): Promise<IEmailSettings> {
    const providerString = await settingsReader.getValueById(SettingsIds.EmailProvider) as string;
    
    // Convert string to enum
    let provider: EmailProviders;
    switch (providerString) {
        case EmailProviders.GMAIL:
            provider = EmailProviders.GMAIL;
            break;
        case EmailProviders.OUTLOOK:
            provider = EmailProviders.OUTLOOK;
            break;
        default:
            provider = EmailProviders.GMAIL; // Default fallback
    }
    
    return {
        email: '', // Will be populated from user's authenticated account
        provider: provider,
    };
}

export async function getGoogleOAuthSettings(settingsReader: ISettingRead): Promise<{[key: string]: string}> {
    return {
        oauth_client_id: await settingsReader.getValueById(SettingsIds.OAuthClientId) as string,
        oauth_client_secret: await settingsReader.getValueById(SettingsIds.OAuthClientSecret) as string,
        oauth_redirect_uri: await settingsReader.getValueById(SettingsIds.OAuthRedirectUri) as string,
    };
}

export async function getOutlookOAuthSettings(settingsReader: ISettingRead): Promise<{[key: string]: string}> {
    return {
        outlook_client_id: await settingsReader.getValueById(SettingsIds.OutlookClientId) as string,
        outlook_client_secret: await settingsReader.getValueById(SettingsIds.OutlookClientSecret) as string,
        outlook_redirect_uri: await settingsReader.getValueById(SettingsIds.OutlookRedirectUri) as string,
    };
}

import { ILLMSettings } from '../definition/lib/ILLMSettings';

export async function getLLMSettings(settingsReader: ISettingRead): Promise<ILLMSettings> {
    return {
        provider: await settingsReader.getValueById(SettingsIds.LLMProvider) as string || 'self-hosted',
        selfHostedUrl: await settingsReader.getValueById(SettingsIds.SelfHostedLLMUrl) as string,
        openaiApiKey: await settingsReader.getValueById(SettingsIds.OpenAIApiKey) as string,
        geminiApiKey: await settingsReader.getValueById(SettingsIds.GeminiApiKey) as string,
        groqApiKey: await settingsReader.getValueById(SettingsIds.GroqApiKey) as string,
    };
}

import { IPreference, LLMUsagePreferenceEnum } from '../definition/lib/IUserPreferences';

export async function getEffectiveLLMSettings(
    settingsReader: ISettingRead, 
    userPreference?: IPreference
): Promise<ILLMSettings> {
    // Get admin settings as fallback
    const adminSettings = await getLLMSettings(settingsReader);
    
    if (!userPreference?.llmConfiguration || 
        userPreference.llmConfiguration.llmUsagePreference === LLMUsagePreferenceEnum.Workspace) {
        return adminSettings;
    }
    
    const userLLMConfig = userPreference.llmConfiguration;
    if (userLLMConfig.llmUsagePreference === LLMUsagePreferenceEnum.Personal && userLLMConfig.llmProvider) {
        return {
            provider: userLLMConfig.llmProvider,
            selfHostedUrl: userLLMConfig.selfHosted?.url || adminSettings.selfHostedUrl,
            openaiApiKey: userLLMConfig.openai?.apiKey || adminSettings.openaiApiKey,
            geminiApiKey: userLLMConfig.gemini?.apiKey || adminSettings.geminiApiKey,
            groqApiKey: userLLMConfig.groq?.apiKey || adminSettings.groqApiKey,
        };
    }
    
    return adminSettings;
} 