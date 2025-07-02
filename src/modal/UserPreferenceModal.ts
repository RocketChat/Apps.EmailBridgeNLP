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
import { IPreference } from '../definition/lib/IUserPreferences';
import { EmailProviders } from '../enums/EmailProviders';
import { Translations } from '../constants/Translations';

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

    // Report Categories Selection
    const allCategories = [...new Set(existingPreference.reportCategories || [])];
    const categoryOptions = allCategories.map((category) => ({
        text: category.charAt(0).toUpperCase() + category.slice(1),
        value: category,
    }));
    const categoryDropdownOptions = elementBuilder.createDropDownOptions(categoryOptions);
    const categoryMultiSelect = elementBuilder.addMultiSelectDropDown(
        {
            placeholder: t(Translations.REPORT_CATEGORIES_LABEL, language),
            options: categoryDropdownOptions,
            initialValue: existingPreference.reportCategories || [],
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
                type: TextObjectType.PLAIN_TEXT,
                text: t(Translations.PROVIDER_CHANGE_WARNING, language),
            },
        } as SectionBlock);
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