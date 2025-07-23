import {
    IModify,
    IRead,
    IUIKitSurfaceViewParam,
} from '@rocket.chat/apps-engine/definition/accessors';
import { TextObjectType, InputBlock, DividerBlock, ContextBlock, SectionBlock } from '@rocket.chat/ui-kit';
import {
    ButtonStyle,
    UIKitSurfaceType,
} from '@rocket.chat/apps-engine/definition/uikit';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { SendEmailModalEnum } from '../enums/modals/SendEmailModal';
import { t, Language } from '../lib/Translation/translation';
import { Translations } from '../constants/Translations';
import { ISendEmailData } from '../definition/lib/IEmailUtils';
import { AvatarUtils } from '../constants/AuthConstants';

// Helper function to create avatar elements using usernames
async function createAvatarElementsFromUsernames(
    usernames: string[],
    read: IRead
): Promise<any[]> {
    const avatarElements: any[] = [];
    const totalCount = usernames.length;
    
    if (totalCount <= 3) {
        // ≤3 recipients: Show <avatar> <name> for all
        for (const username of usernames) {
            try {
                const user = await read.getUserReader().getByUsername(username);
                if (user) {
                    const avatarUrl = AvatarUtils.buildAvatarUrl(username);
                    const displayName = user.name || user.username;
                    
                    const avatarElement = {
                        type: 'image',
                        imageUrl: avatarUrl,
                        altText: displayName
                    };
                    
                    avatarElements.push(avatarElement);
                    avatarElements.push(`**${displayName}**`);
                } else {
                    avatarElements.push(`**${username}**`);
                }
            } catch (error) {
                avatarElements.push(`**${username}**`);
            }
        }
    } else if (totalCount <= 10) {
        // >3 and ≤10 recipients: Show only <avatar> (no names)
        for (const username of usernames) {
            try {
                const user = await read.getUserReader().getByUsername(username);
                if (user) {
                    const avatarUrl = AvatarUtils.buildAvatarUrl(username);
                    const displayName = user.name || user.username;
                    
                    const avatarElement = {
                        type: 'image',
                        imageUrl: avatarUrl,
                        altText: displayName
                    };
                    
                    avatarElements.push(avatarElement);
                } else {
                    // For users not found, we can't show avatar, so skip
                    continue;
                }
            } catch (error) {
                // Skip if user lookup fails
                continue;
            }
        }
    } else {
        // >10 recipients: Show first 10 <avatar> + "x more" text
        const displayUsernames = usernames.slice(0, 10);
        
        for (const username of displayUsernames) {
            try {
                const user = await read.getUserReader().getByUsername(username);
                if (user) {
                    const avatarUrl = AvatarUtils.buildAvatarUrl(username);
                    const displayName = user.name || user.username;
                    
                    const avatarElement = {
                        type: 'image',
                        imageUrl: avatarUrl,
                        altText: displayName
                    };
                    
                    avatarElements.push(avatarElement);
                } else {
                    // Skip if user not found
                    continue;
                }
            } catch (error) {
                // Skip if user lookup fails
                continue;
            }
        }
        
        // Add "+ x more" text
        const remainingCount = totalCount - 10;
        avatarElements.push(`*+ ${remainingCount} more*`);
    }
    
    return avatarElements;
}



export async function SendEmailModal({
    app,
    modify,
    read,
    language,
    emailData,
    context = 'default',
}: {
    app: EmailBridgeNlpApp;
    modify: IModify;
    read: IRead;
    language: Language;
    emailData?: ISendEmailData;
    context?: string;
}): Promise<IUIKitSurfaceViewParam> {
    const viewId = `${SendEmailModalEnum.VIEW_ID}-${context}`;
    const { elementBuilder, blockBuilder } = app.getUtils();
    const blocks: (InputBlock | ContextBlock | SectionBlock | DividerBlock)[] = [];

    const toFieldValue = emailData?.to ? emailData.to.join(', ') : '';

    // To field (required)
    const toElement = elementBuilder.createPlainTextInput(
        {
            text: t(Translations.SEND_EMAIL_TO_PLACEHOLDER, language),
            multiline: false,
            initialValue: toFieldValue,
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

    // Show avatars below To field if there are To usernames
    if (emailData?.toUsernames && emailData.toUsernames.length > 0) {
        const toAvatarElements = await createAvatarElementsFromUsernames(emailData.toUsernames, read);
        if (toAvatarElements.length > 0) {
            blocks.push(
                blockBuilder.createContextBlock({
                    contextElements: toAvatarElements,
                }),
            );
        }
    }

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

    // Show avatars below CC field if there are CC usernames
    if (emailData?.ccUsernames && emailData.ccUsernames.length > 0) {
        const ccAvatarElements = await createAvatarElementsFromUsernames(emailData.ccUsernames, read);
        if (ccAvatarElements.length > 0) {
            blocks.push(
                blockBuilder.createContextBlock({
                    contextElements: ccAvatarElements,
                }),
            );
        }
    }

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