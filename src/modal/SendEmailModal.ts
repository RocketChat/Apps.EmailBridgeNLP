import {
    IModify,
    IUIKitSurfaceViewParam,
} from '@rocket.chat/apps-engine/definition/accessors';
import { TextObjectType, InputBlock, DividerBlock } from '@rocket.chat/ui-kit';
import {
    ButtonStyle,
    UIKitSurfaceType,
} from '@rocket.chat/apps-engine/definition/uikit';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { SendEmailModalEnum } from '../enums/modals/SendEmailModal';
import { t, Language } from '../lib/Translation/translation';
import { Translations } from '../constants/Translations';

export interface ISendEmailData {
    to: string[];
    cc?: string[];
    subject: string;
    content: string;
}

export async function SendEmailModal({
    app,
    modify,
    language,
    emailData,
    context = 'default',
}: {
    app: EmailBridgeNlpApp;
    modify: IModify;
    language: Language;
    emailData?: ISendEmailData;
    context?: string;
}): Promise<IUIKitSurfaceViewParam> {
    const viewId = `${SendEmailModalEnum.VIEW_ID}-${context}`;
    const { elementBuilder, blockBuilder } = app.getUtils();
    const blocks: InputBlock[] = [];

    // To field (required) - using the same pattern as UserPreferenceModal
    const toElement = elementBuilder.createPlainTextInput(
        {
            text: t(Translations.SEND_EMAIL_TO_PLACEHOLDER, language),
            multiline: false,
            initialValue: emailData?.to ? emailData.to.join(', ') : '',
        },
        {
            blockId: SendEmailModalEnum.TO_BLOCK_ID,
            actionId: SendEmailModalEnum.TO_ACTION_ID,
        },
    );

    blocks.push(
        blockBuilder.createInputBlock({
            text: t(Translations.SEND_EMAIL_TO_LABEL, language),
            element: toElement,
            optional: false,
        }),
    );

    // CC field (optional)
    const ccElement = elementBuilder.createPlainTextInput(
        {
            text: t(Translations.SEND_EMAIL_CC_PLACEHOLDER, language),
            multiline: false,
            initialValue: emailData?.cc ? emailData.cc.join(', ') : '',
        },
        {
            blockId: SendEmailModalEnum.CC_BLOCK_ID,
            actionId: SendEmailModalEnum.CC_ACTION_ID,
        },
    );

    blocks.push(
        blockBuilder.createInputBlock({
            text: t(Translations.SEND_EMAIL_CC_LABEL, language),
            element: ccElement,
            optional: true,
        }),
    );

    // Subject field (required)
    const subjectElement = elementBuilder.createPlainTextInput(
        {
            text: t(Translations.SEND_EMAIL_SUBJECT_PLACEHOLDER, language),
            multiline: false,
            initialValue: emailData?.subject || '',
        },
        {
            blockId: SendEmailModalEnum.SUBJECT_BLOCK_ID,
            actionId: SendEmailModalEnum.SUBJECT_ACTION_ID,
        },
    );

    blocks.push(
        blockBuilder.createInputBlock({
            text: t(Translations.SEND_EMAIL_SUBJECT_LABEL, language),
            element: subjectElement,
            optional: false,
        }),
    );

    // Content field (required)
    const contentElement = elementBuilder.createPlainTextInput(
        {
            text: t(Translations.SEND_EMAIL_CONTENT_PLACEHOLDER, language),
            multiline: true,
            initialValue: emailData?.content || '',
        },
        {
            blockId: SendEmailModalEnum.CONTENT_BLOCK_ID,
            actionId: SendEmailModalEnum.CONTENT_ACTION_ID,
        },
    );

    blocks.push(
        blockBuilder.createInputBlock({
            text: t(Translations.SEND_EMAIL_CONTENT_LABEL, language),
            element: contentElement,
            optional: false,
        }),
    );

    // Submit button (Send)
    const submitButton = elementBuilder.addButton(
        {
            text: t(Translations.SEND_EMAIL_SEND_BUTTON, language),
            style: ButtonStyle.PRIMARY,
        },
        {
            actionId: SendEmailModalEnum.SEND_ACTION_ID,
            blockId: SendEmailModalEnum.SEND_BLOCK_ID,
        },
    );

    // Cancel button
    const cancelButton = elementBuilder.addButton(
        {
            text: t(Translations.SEND_EMAIL_CANCEL_BUTTON, language),
            style: ButtonStyle.DANGER,
        },
        {
            actionId: SendEmailModalEnum.CANCEL_ACTION_ID,
            blockId: SendEmailModalEnum.CANCEL_BLOCK_ID,
        },
    );

    return {
        id: viewId,
        type: UIKitSurfaceType.MODAL,
        title: {
            type: TextObjectType.MRKDWN,
            text: t(Translations.SEND_EMAIL_MODAL_TITLE, language),
        },
        blocks: blocks,
        close: cancelButton,
        submit: submitButton,
    };
} 