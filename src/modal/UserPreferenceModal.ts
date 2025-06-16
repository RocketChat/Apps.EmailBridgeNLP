import {
    IModify,
    IUIKitSurfaceViewParam,
} from '@rocket.chat/apps-engine/definition/accessors';
import { TextObjectType, InputBlock, DividerBlock, SectionBlock } from '@rocket.chat/ui-kit';

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
    const blocks: (InputBlock | DividerBlock | SectionBlock)[] = [];

    // Language Selection
    const languageOptions = supportedLanguageList.map((lang) => ({
        text: getLanguageDisplayTextFromCode(lang, existingPreference.language),
        value: lang,
    }));

    const languageDropDownOption = elementBuilder.createDropDownOptions(languageOptions);

    const languageDropDown = elementBuilder.addDropDown(
        {
            placeholder: t('Language', existingPreference.language),
            options: languageDropDownOption,
            initialOption: languageDropDownOption.find(
                (option) => option.value === existingPreference.language,
            ),
            dispatchActionConfig: [Modals.dispatchActionConfigOnSelect],
        },
        {
            blockId: UserPreferenceModalEnum.LANGUAGE_INPUT_DROPDOWN_BLOCK_ID,
            actionId: UserPreferenceModalEnum.LANGUAGE_INPUT_DROPDOWN_ACTION_ID,
        },
    );

    blocks.push(
        blockBuilder.createInputBlock({
            text: t('Language', existingPreference.language),
            element: languageDropDown,
            optional: false,
        }),
    );

    blocks.push(blockBuilder.createDividerBlock());

    // Email Provider Selection
    const emailProviderOptions = [
        {
            text: t('Gmail_Label', language),
            value: EmailProviders.GMAIL,
        },
        {
            text: t('Outlook_Label', language),
            value: EmailProviders.OUTLOOK,
        },
    ];

    const emailProviderDropDownOption = elementBuilder.createDropDownOptions(emailProviderOptions);

    const emailProviderDropDown = elementBuilder.addDropDown(
        {
            placeholder: t('Email_Provider_Preference_Description', language),
            options: emailProviderDropDownOption,
            initialOption: emailProviderDropDownOption.find(
                (option) => option.value === existingPreference.emailProvider,
            ),
            dispatchActionConfig: [Modals.dispatchActionConfigOnSelect],
        },
        {
            blockId: UserPreferenceModalEnum.EMAIL_PROVIDER_DROPDOWN_BLOCK_ID,
            actionId: UserPreferenceModalEnum.EMAIL_PROVIDER_DROPDOWN_ACTION_ID,
        },
    );

    blocks.push(
        blockBuilder.createInputBlock({
            text: t('Email_Provider_Preference_Label', language),
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
                text: t('Provider_Change_Warning', language),
            },
        } as SectionBlock);
    }

    const submitButton = elementBuilder.addButton(
        {
            text: t('User_Preference_Update_Button', language),
            style: ButtonStyle.PRIMARY,
        },
        {
            actionId: UserPreferenceModalEnum.SUBMIT_ACTION_ID,
            blockId: UserPreferenceModalEnum.SUBMIT_BLOCK_ID,
        },
    );

    const closeButton = elementBuilder.addButton(
        {
            text: t('User_Preference_Close_Button', language),
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
            text: t('User_Preference_Title', language),
        },
        blocks: blocks,
        close: closeButton,
        submit: submitButton,
    };
} 