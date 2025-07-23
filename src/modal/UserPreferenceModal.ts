import {
    IModify,
    IUIKitSurfaceViewParam,
} from '@rocket.chat/apps-engine/definition/accessors';
import { TextObjectType, InputBlock, DividerBlock, SectionBlock, ActionsBlock } from '@rocket.chat/ui-kit';

import {
    ButtonStyle,
    UIKitSurfaceType,
} from '@rocket.chat/apps-engine/definition/uikit';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { Modals } from '../enums/modals/common/Modal';
import {
    Language,
    supportedLanguageList,
    t,
} from '../lib/Translation/translation';
import { UserPreferenceModalEnum } from '../enums/modals/UserPreferenceModal';
import { getLanguageDisplayTextFromCode } from '../helper/userPreference';
import { IPreference, LLMUsagePreference, LLMProviderType, LLMUsagePreferenceEnum, LLMProviderEnum } from '../definition/lib/IUserPreferences';
import { EmailProviders } from '../enums/EmailProviders';
import { Translations } from '../constants/Translations';
import { EmailServiceFactory } from '../services/auth/EmailServiceFactory';
import { inputElementComponent } from './common/inputElementComponent';



export async function UserPreferenceModal({
    app,
    modify,
    existingPreference,
}: {
    app: EmailBridgeNlpApp;
    modify: IModify;
    existingPreference: IPreference;
}): Promise<IUIKitSurfaceViewParam> {
    const viewId = UserPreferenceModalEnum.VIEW_ID;
    const { elementBuilder, blockBuilder } = app.getUtils();
    const language = existingPreference.language as Language;
    const blocks: (InputBlock | DividerBlock | SectionBlock | ActionsBlock)[] = [];

    // Report Categories Selection - show default categories in dropdown but don't force selection
    const userCategories = existingPreference.reportCategories || [];
    const defaultCategories = ['github', 'calendar', 'social'];
    const allCategories = [...new Set([...defaultCategories, ...userCategories.map(c => c.toLowerCase())])];
    const categoryOptions = allCategories.map((category) => ({
        text: category.charAt(0).toUpperCase() + category.slice(1),
        value: category,
    }));
    const categoryDropdownOptions = elementBuilder.createDropDownOptions(categoryOptions);
    const categoryMultiSelect = elementBuilder.addMultiSelectDropDown(
        {
            placeholder: t(Translations.REPORT_CATEGORIES_LABEL, language),
            options: categoryDropdownOptions,
            initialValue: userCategories,
        },
        {
            blockId: UserPreferenceModalEnum.REPORT_CATEGORIES_INPUT_BLOCK_ID,
            actionId: UserPreferenceModalEnum.REPORT_CATEGORIES_INPUT_ACTION_ID,
        },
    );
    blocks.push(
        blockBuilder.createInputBlock({
            blockId: UserPreferenceModalEnum.REPORT_CATEGORIES_INPUT_BLOCK_ID,
            text: t(Translations.REPORT_CATEGORIES_LABEL, language),
            element: categoryMultiSelect,
            optional: true,
        }),
    );
    // New Category Input
    const newCategoryInput = elementBuilder.createPlainTextInput(
        {
            text: t(Translations.NEW_CATEGORIES_PLACEHOLDER, language),
        },
        {
            blockId: UserPreferenceModalEnum.NEW_CATEGORY_INPUT_BLOCK_ID,
            actionId: UserPreferenceModalEnum.NEW_CATEGORY_INPUT_ACTION_ID,
        },
    );
    blocks.push(
        blockBuilder.createInputBlock({
            blockId: UserPreferenceModalEnum.NEW_CATEGORY_INPUT_BLOCK_ID,
            text: t(Translations.NEW_CATEGORY_LABEL, language),
            element: newCategoryInput,
            optional: true,
        })
    );
    // Divider
    blocks.push(blockBuilder.createDividerBlock());
    // Language Selection
    const languageOptions = supportedLanguageList.map((lang) => ({
        text: getLanguageDisplayTextFromCode(lang, existingPreference.language),
        value: lang,
    }));
    const languageDropDownOption = elementBuilder.createDropDownOptions(languageOptions);
    const languageDropDown = elementBuilder.addDropDown(
        {
            placeholder: t(Translations.LANGUAGE, existingPreference.language),
            options: languageDropDownOption,
            initialOption: languageDropDownOption.find(
                (option) => option.value === existingPreference.language,
            ),
            dispatchActionConfig: [Modals.DISPATCH_ACTION_CONFIG_ON_SELECT],
        },
        {
            blockId: UserPreferenceModalEnum.LANGUAGE_INPUT_DROPDOWN_BLOCK_ID,
            actionId: UserPreferenceModalEnum.LANGUAGE_INPUT_DROPDOWN_ACTION_ID,
        },
    );
    blocks.push(
        blockBuilder.createInputBlock({
            blockId: UserPreferenceModalEnum.LANGUAGE_INPUT_DROPDOWN_BLOCK_ID,
            text: t(Translations.LANGUAGE, existingPreference.language),
            element: languageDropDown,
            optional: false,
        }),
    );
    // Email Provider Selection
    const emailProviderOptions = [
        {
            text: t(Translations.GMAIL_LABEL, language),
            value: EmailProviders.GMAIL,
        },
        {
            text: t(Translations.OUTLOOK_LABEL, language),
            value: EmailProviders.OUTLOOK,
        },
    ];
    const emailProviderDropDownOption = elementBuilder.createDropDownOptions(emailProviderOptions);
    const emailProviderDropDown = elementBuilder.addDropDown(
        {
            placeholder: t(Translations.EMAIL_PROVIDER_PREFERENCE_DESCRIPTION, language),
            options: emailProviderDropDownOption,
            initialOption: emailProviderDropDownOption.find(
                (option) => option.value === existingPreference.emailProvider,
            ),
            dispatchActionConfig: [Modals.DISPATCH_ACTION_CONFIG_ON_SELECT],
        },
        {
            blockId: UserPreferenceModalEnum.EMAIL_PROVIDER_DROPDOWN_BLOCK_ID,
            actionId: UserPreferenceModalEnum.EMAIL_PROVIDER_DROPDOWN_ACTION_ID,
        },
    );
    blocks.push(
        blockBuilder.createInputBlock({
            blockId: UserPreferenceModalEnum.EMAIL_PROVIDER_DROPDOWN_BLOCK_ID,
            text: t(Translations.EMAIL_PROVIDER_PREFERENCE_LABEL, language),
            element: emailProviderDropDown,
            optional: false,
        }),
    );

    // Show warning if provider change will cause logout
    if (existingPreference.showProviderWarning) {
        blocks.push({
            type: 'section',
            text: {
                type: TextObjectType.MRKDWN,
                text: `⚠️ *${t(Translations.PROVIDER_CHANGE_WARNING, language).replace('⚠️ ', '')}*`,
            },
        } as SectionBlock);
    }

    // Divider before LLM Configuration
    blocks.push(blockBuilder.createDividerBlock());

    // LLM Usage Preference
    const llmUsagePreferenceOptions = [
        {
            text: t(Translations.LLM_USAGE_PREFERENCE_WORKSPACE, language),
            value: LLMUsagePreferenceEnum.Workspace,
        },
        {
            text: t(Translations.LLM_USAGE_PREFERENCE_PERSONAL, language),
            value: LLMUsagePreferenceEnum.Personal,
        },
    ];

    const llmUsagePreferenceDropDownOption = elementBuilder.createDropDownOptions(llmUsagePreferenceOptions);
    const llmUsagePreferenceDropDown = elementBuilder.addDropDown(
        {
            placeholder: t(Translations.LLM_USAGE_PREFERENCE_PLACEHOLDER, language),
            options: llmUsagePreferenceDropDownOption,
            initialOption: llmUsagePreferenceDropDownOption.find(
                (option) => option.value === existingPreference.llmConfiguration?.llmUsagePreference,
            ),
            dispatchActionConfig: [Modals.DISPATCH_ACTION_CONFIG_ON_SELECT],
        },
        {
            blockId: UserPreferenceModalEnum.LLM_USAGE_PREFERENCE_DROPDOWN_BLOCK_ID,
            actionId: UserPreferenceModalEnum.LLM_USAGE_PREFERENCE_DROPDOWN_ACTION_ID,
        },
    );

    blocks.push(
        blockBuilder.createInputBlock({
            blockId: UserPreferenceModalEnum.LLM_USAGE_PREFERENCE_DROPDOWN_BLOCK_ID,
            text: t(Translations.LLM_USAGE_PREFERENCE_LABEL, language),
            element: llmUsagePreferenceDropDown,
            optional: false,
        }),
    );

    // Personal LLM Configuration (only show when "Personal" is selected)
    if (existingPreference.llmConfiguration?.llmUsagePreference === LLMUsagePreferenceEnum.Personal) {
        const llmProviderOptions = [
            {
                text: t(Translations.LLM_PROVIDER_SELFHOSTED, language),
                value: LLMProviderEnum.SelfHosted,
            },
            {
                text: t(Translations.LLM_PROVIDER_OPENAI, language),
                value: LLMProviderEnum.OpenAI,
            },
            {
                text: t(Translations.LLM_PROVIDER_GEMINI, language),
                value: LLMProviderEnum.Gemini,
            },
            {
                text: t(Translations.LLM_PROVIDER_GROQ, language),
                value: LLMProviderEnum.Groq,
            },
        ];

        const llmProviderDropDownOption = elementBuilder.createDropDownOptions(llmProviderOptions);
        const llmProviderDropDown = elementBuilder.addDropDown(
            {
                placeholder: t(Translations.LLM_PROVIDER_USER_PLACEHOLDER, language),
                options: llmProviderDropDownOption,
                initialOption: llmProviderDropDownOption.find(
                    (option) => option.value === existingPreference.llmConfiguration?.llmProvider,
                ),
                dispatchActionConfig: [Modals.DISPATCH_ACTION_CONFIG_ON_SELECT],
            },
            {
                blockId: UserPreferenceModalEnum.LLM_PROVIDER_DROPDOWN_BLOCK_ID,
                actionId: UserPreferenceModalEnum.LLM_PROVIDER_DROPDOWN_ACTION_ID,
            },
        );

        blocks.push(
            blockBuilder.createInputBlock({
                blockId: UserPreferenceModalEnum.LLM_PROVIDER_DROPDOWN_BLOCK_ID,
                text: t(Translations.LLM_PROVIDER_USER_LABEL, language),
                element: llmProviderDropDown,
                optional: false,
            }),
        );

        // Provider-specific configuration fields
        if (existingPreference.llmConfiguration?.llmProvider) {
            switch (existingPreference.llmConfiguration.llmProvider) {
                case LLMProviderEnum.SelfHosted:
                    const selfHostedUrlInput = inputElementComponent(
                        {
                            app,
                            placeholder: t(Translations.SELFHOSTED_URL_PLACEHOLDER, language),
                            label: t(Translations.SELFHOSTED_URL_LABEL, language),
                            optional: false,
                            initialValue: existingPreference.llmConfiguration?.selfHosted?.url,
                        },
                        {
                            blockId: UserPreferenceModalEnum.SELF_HOSTED_URL_BLOCK_ID,
                            actionId: UserPreferenceModalEnum.SELF_HOSTED_URL_ACTION_ID,
                        },
                    );
                    blocks.push(selfHostedUrlInput);
                    break;

                case LLMProviderEnum.OpenAI:
                    const openaiApiKeyInput = inputElementComponent(
                        {
                            app,
                            placeholder: t(Translations.OPENAI_API_KEY_USER_PLACEHOLDER, language),
                            label: t(Translations.OPENAI_API_KEY_USER_LABEL, language),
                            optional: false,
                            initialValue: existingPreference.llmConfiguration?.openai?.apiKey,
                        },
                        {
                            blockId: UserPreferenceModalEnum.OPENAI_API_KEY_BLOCK_ID,
                            actionId: UserPreferenceModalEnum.OPENAI_API_KEY_ACTION_ID,
                        },
                    );
                    blocks.push(openaiApiKeyInput);
                    break;

                case LLMProviderEnum.Gemini:
                    const geminiApiKeyInput = inputElementComponent(
                        {
                            app,
                            placeholder: t(Translations.GEMINI_API_KEY_USER_PLACEHOLDER, language),
                            label: t(Translations.GEMINI_API_KEY_USER_LABEL, language),
                            optional: false,
                            initialValue: existingPreference.llmConfiguration?.gemini?.apiKey,
                        },
                        {
                            blockId: UserPreferenceModalEnum.GEMINI_API_KEY_BLOCK_ID,
                            actionId: UserPreferenceModalEnum.GEMINI_API_KEY_ACTION_ID,
                        },
                    );
                    blocks.push(geminiApiKeyInput);
                    break;

                case LLMProviderEnum.Groq:
                    const groqApiKeyInput = inputElementComponent(
                        {
                            app,
                            placeholder: t(Translations.GROQ_API_KEY_USER_PLACEHOLDER, language),
                            label: t(Translations.GROQ_API_KEY_USER_LABEL, language),
                            optional: false,
                            initialValue: existingPreference.llmConfiguration?.groq?.apiKey,
                        },
                        {
                            blockId: UserPreferenceModalEnum.GROQ_API_KEY_BLOCK_ID,
                            actionId: UserPreferenceModalEnum.GROQ_API_KEY_ACTION_ID,
                        },
                    );
                    blocks.push(groqApiKeyInput);
                    break;

                default:
                    break;
            }
        }
    }

    const submitButton = elementBuilder.addButton(
        {
            text: t(Translations.USER_PREFERENCE_UPDATE_BUTTON, language),
            style: ButtonStyle.PRIMARY,
        },
        {
            actionId: UserPreferenceModalEnum.SUBMIT_ACTION_ID,
            blockId: UserPreferenceModalEnum.SUBMIT_BLOCK_ID,
        },
    );

    const closeButton = elementBuilder.addButton(
        {
            text: t(Translations.USER_PREFERENCE_CLOSE_BUTTON, language),
            style: ButtonStyle.DANGER,
        },
        {
            actionId: UserPreferenceModalEnum.CLOSE_ACTION_ID,
            blockId: UserPreferenceModalEnum.CLOSE_BLOCK_ID,
        },
    );

    return {
        id: viewId,
        type: UIKitSurfaceType.MODAL,
        title: {
            type: TextObjectType.PLAIN_TEXT,
            text: t(Translations.USER_PREFERENCE_TITLE, language),
        },
        blocks: blocks,
        close: closeButton,
        submit: submitButton,
    };
} 