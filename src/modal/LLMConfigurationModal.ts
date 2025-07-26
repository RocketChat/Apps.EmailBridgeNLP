import {
    IModify,
    IUIKitSurfaceViewParam,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    TextObjectType,
    InputBlock,
    DividerBlock,
    SectionBlock,
    ActionsBlock,
} from "@rocket.chat/ui-kit";
import {
    ButtonStyle,
    UIKitSurfaceType,
} from "@rocket.chat/apps-engine/definition/uikit";
import { EmailBridgeNlpApp } from "../../EmailBridgeNlpApp";
import { Modals } from "../enums/modals/common/Modal";
import { Language, t } from "../lib/Translation/translation";
import { LLMConfigurationModalEnum } from '../enums/modals/LLMConfigurationModal';
import {
    IPreference,
    LLMUsagePreference,
    LLMProviderType,
    LLMUsagePreferenceEnum,
    LLMProviderEnum,
} from "../definition/lib/IUserPreferences";
import { Translations } from "../constants/Translations";
import { inputElementComponent } from "./common/inputElementComponent";

export async function LLMConfigurationModal({
    app,
    modify,
    existingPreference,
}: {
    app: EmailBridgeNlpApp;
    modify: IModify;
    existingPreference: IPreference;
}): Promise<IUIKitSurfaceViewParam> {
    const viewId = LLMConfigurationModalEnum.VIEW_ID;
    const { elementBuilder, blockBuilder } = app.getUtils();
    const language = existingPreference.language as Language;
    const blocks: (InputBlock | DividerBlock | SectionBlock | ActionsBlock)[] =
        [];

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

    const llmUsagePreferenceDropDownOption =
        elementBuilder.createDropDownOptions(llmUsagePreferenceOptions);
    const llmUsagePreferenceDropDown = elementBuilder.addDropDown(
        {
            placeholder: t(
                Translations.LLM_USAGE_PREFERENCE_PLACEHOLDER,
                language
            ),
            options: llmUsagePreferenceDropDownOption,
            initialOption: llmUsagePreferenceDropDownOption.find(
                (option) =>
                    option.value ===
                    (existingPreference.llmConfiguration?.llmUsagePreference ||
                        LLMUsagePreferenceEnum.Workspace)
            ),
            dispatchActionConfig: [Modals.DISPATCH_ACTION_CONFIG_ON_SELECT],
        },
        {
            blockId:
                LLMConfigurationModalEnum.LLM_USAGE_PREFERENCE_DROPDOWN_BLOCK_ID,
            actionId:
                LLMConfigurationModalEnum.LLM_USAGE_PREFERENCE_DROPDOWN_ACTION_ID,
        }
    );

    blocks.push(
        blockBuilder.createInputBlock({
            blockId:
                LLMConfigurationModalEnum.LLM_USAGE_PREFERENCE_DROPDOWN_BLOCK_ID,
            text: t(Translations.LLM_USAGE_PREFERENCE_LABEL, language),
            element: llmUsagePreferenceDropDown,
            optional: false,
        })
    );

    const isPersonalMode =
        existingPreference.llmConfiguration?.llmUsagePreference ===
        LLMUsagePreferenceEnum.Personal;

    blocks.push(blockBuilder.createDividerBlock());

    const llmProviderOptions = [
        {
            text: t(Translations.LLM_PROVIDER_GROQ, language),
            value: LLMProviderEnum.Groq,
        },
        {
            text: t(Translations.LLM_PROVIDER_GEMINI, language),
            value: LLMProviderEnum.Gemini,
        },
        {
            text: t(Translations.LLM_PROVIDER_OPENAI, language),
            value: LLMProviderEnum.OpenAI,
        },
        {
            text: t(Translations.LLM_PROVIDER_SELFHOSTED, language),
            value: LLMProviderEnum.SelfHosted,
        },
    ];

    const llmProviderDropDownOption =
        elementBuilder.createDropDownOptions(llmProviderOptions);
    const llmProviderDropDown = elementBuilder.addDropDown(
        {
            placeholder: t(
                Translations.LLM_PROVIDER_USER_PLACEHOLDER,
                language
            ),
            options: llmProviderDropDownOption,
            initialOption: llmProviderDropDownOption.find(
                (option) =>
                    option.value ===
                    (existingPreference.llmConfiguration?.llmProvider ||
                        LLMProviderEnum.Groq)
            ),
            dispatchActionConfig: [Modals.DISPATCH_ACTION_CONFIG_ON_SELECT],
        },
        {
            blockId: LLMConfigurationModalEnum.LLM_PROVIDER_DROPDOWN_BLOCK_ID,
            actionId: LLMConfigurationModalEnum.LLM_PROVIDER_DROPDOWN_ACTION_ID,
        }
    );

    // Always show provider and API key fields
    blocks.push(
        blockBuilder.createInputBlock({
            blockId: LLMConfigurationModalEnum.LLM_PROVIDER_DROPDOWN_BLOCK_ID,
            text: t(Translations.LLM_PROVIDER_USER_LABEL, language),
            element: llmProviderDropDown,
            optional: false,
        })
    );

    // Groq API Key
    const groqApiKeyInput = inputElementComponent(
        {
            app,
            placeholder: t(
                Translations.GROQ_API_KEY_USER_PLACEHOLDER,
                language
            ),
            label: t(Translations.GROQ_API_KEY_USER_LABEL, language),
            optional: true,
            initialValue: existingPreference.llmConfiguration?.groq?.apiKey,
        },
        {
            blockId: LLMConfigurationModalEnum.GROQ_API_KEY_BLOCK_ID,
            actionId: LLMConfigurationModalEnum.GROQ_API_KEY_ACTION_ID,
        }
    );
    blocks.push(groqApiKeyInput);

    // Google Gemini API Key
    const geminiApiKeyInput = inputElementComponent(
        {
            app,
            placeholder: t(
                Translations.GEMINI_API_KEY_USER_PLACEHOLDER,
                language
            ),
            label: t(Translations.GEMINI_API_KEY_USER_LABEL, language),
            optional: true,
            initialValue: existingPreference.llmConfiguration?.gemini?.apiKey,
        },
        {
            blockId: LLMConfigurationModalEnum.GEMINI_API_KEY_BLOCK_ID,
            actionId: LLMConfigurationModalEnum.GEMINI_API_KEY_ACTION_ID,
        }
    );
    blocks.push(geminiApiKeyInput);

    // OpenAI API Key
    const openaiApiKeyInput = inputElementComponent(
        {
            app,
            placeholder: t(
                Translations.OPENAI_API_KEY_USER_PLACEHOLDER,
                language
            ),
            label: t(Translations.OPENAI_API_KEY_USER_LABEL, language),
            optional: true,
            initialValue: existingPreference.llmConfiguration?.openai?.apiKey,
        },
        {
            blockId: LLMConfigurationModalEnum.OPENAI_API_KEY_BLOCK_ID,
            actionId: LLMConfigurationModalEnum.OPENAI_API_KEY_ACTION_ID,
        }
    );
    blocks.push(openaiApiKeyInput);

    // Self-hosted LLM URL
    const selfHostedUrlInput = inputElementComponent(
        {
            app,
            placeholder: t(Translations.SELFHOSTED_URL_PLACEHOLDER, language),
            label: t(Translations.SELFHOSTED_URL_LABEL, language),
            optional: true,
            initialValue: existingPreference.llmConfiguration?.selfHosted?.url,
        },
        {
            blockId: LLMConfigurationModalEnum.SELF_HOSTED_URL_BLOCK_ID,
            actionId: LLMConfigurationModalEnum.SELF_HOSTED_URL_ACTION_ID,
        }
    );
    blocks.push(selfHostedUrlInput);

    const submitButton = elementBuilder.addButton(
        {
            text: t(Translations.LLM_CONFIGURATION_UPDATE_BUTTON, language),
            style: ButtonStyle.PRIMARY,
        },
        {
            actionId: LLMConfigurationModalEnum.SUBMIT_ACTION_ID,
            blockId: LLMConfigurationModalEnum.SUBMIT_BLOCK_ID,
        }
    );

    const closeButton = elementBuilder.addButton(
        {
            text: t(Translations.LLM_CONFIGURATION_CLOSE_BUTTON, language),
            style: ButtonStyle.DANGER,
        },
        {
            actionId: LLMConfigurationModalEnum.CLOSE_ACTION_ID,
            blockId: LLMConfigurationModalEnum.CLOSE_BLOCK_ID,
        }
    );

    return {
        id: viewId,
        type: UIKitSurfaceType.MODAL,
        title: {
            type: TextObjectType.PLAIN_TEXT,
            text: t(Translations.LLM_CONFIGURATION_TITLE, language),
        },
        blocks: blocks,
        close: closeButton,
        submit: submitButton,
    };
}
