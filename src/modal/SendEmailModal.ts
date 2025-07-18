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
import { UsernameService, IUserWithEmailAndAvatar } from '../services/UsernameService';

// Helper function to create avatar elements for users
async function createAvatarElements(
    emails: string[], 
    emailToUserMap: Map<string, IUserWithEmailAndAvatar>, 
    elementBuilder: any
): Promise<any[]> {
    const avatarElements: any[] = [];
    
    for (const email of emails) {
        const userWithAvatar = emailToUserMap.get(email);
        if (userWithAvatar) {
            // Use the fallback avatar which is guaranteed to work (first letter + color)
            // In the future, we can enhance this to detect if user has an uploaded avatar
            const imageUrl = userWithAvatar.fallbackAvatarUrl;
            const altText = userWithAvatar.name || userWithAvatar.username;
            
            // Create image element properly for context blocks
            const avatarElement = {
                type: 'image',
                imageUrl: imageUrl,
                altText: altText
            };
            
            avatarElements.push(avatarElement);
            
            // Add user name as text element
            const nameText = userWithAvatar.name || userWithAvatar.username;
            avatarElements.push(`**${nameText}**`);
            
        } else {
            // For emails without matching users, create a generic avatar
            const emailUsername = email.split('@')[0];
            const firstLetter = emailUsername.charAt(0).toUpperCase();
            const genericAvatar = createGenericAvatar(firstLetter, '#9E9E9E');
            
            const avatarElement = {
                type: 'image',
                imageUrl: genericAvatar,
                altText: email
            };
            
            avatarElements.push(avatarElement);
            avatarElements.push(emailUsername);
        }
    }
    
    return avatarElements;
}

// Helper function to create generic avatar for unknown users
function createGenericAvatar(letter: string, backgroundColor: string): string {
    const svg = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="${backgroundColor}" rx="16"/><text x="16" y="20" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="white">${letter}</text></svg>`;
    
    // Use URL encode approach which is more universally supported
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
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

    // Get avatar data if email data is available
    let emailToUserMap: Map<string, IUserWithEmailAndAvatar> = new Map();
    if (emailData && emailData.to) {
        const usernameService = new UsernameService(read);
        const allEmails = [...emailData.to, ...(emailData.cc || [])];
        emailToUserMap = await usernameService.getEmailToUserAvatarMap(allEmails);
    }

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

    // Avatar display logic - mutually exclusive scenarios
    if (emailData?.to && emailData.to.length > 0) {
        if (emailData.to.length >= 10) {
            // Scenario 3: 10+ emails - dedicated recipients section below To field
            const firstFiveEmails = emailData.to.slice(0, 5);
            const remainingCount = emailData.to.length - 5;
            const avatarElements = await createAvatarElements(firstFiveEmails, emailToUserMap, elementBuilder);
            
            if (avatarElements.length > 0) {
                // Add section title
                blocks.push(
                    blockBuilder.createSectionBlock({
                        text: `📧 **Recipients (${emailData.to.length} total):**`,
                    }),
                );
                
                // Add avatars with +X people text if needed
                if (remainingCount > 0) {
                    avatarElements.push(`*+${remainingCount} more people*`);
                }
                
                blocks.push(
                    blockBuilder.createContextBlock({
                        contextElements: avatarElements,
                    }),
                );
                
                // Add divider
                blocks.push(blockBuilder.createDividerBlock());
            }
        } else if (emailData.to.length > 5) {
            // Scenario 2: 6-9 emails - show first 5 + "+X people" in To field area
            const firstFiveEmails = emailData.to.slice(0, 5);
            const remainingCount = emailData.to.length - 5;
            const avatarElements = await createAvatarElements(firstFiveEmails, emailToUserMap, elementBuilder);
            const extraPeopleText = `*+${remainingCount} people*`;
            
            avatarElements.push(extraPeopleText);
            
            if (avatarElements.length > 0) {
                blocks.push(
                    blockBuilder.createContextBlock({
                        contextElements: avatarElements,
                    }),
                );
            }
        } else {
            // Scenario 1: 1-5 emails - show all avatars in To field area
            const avatarElements = await createAvatarElements(emailData.to, emailToUserMap, elementBuilder);
            if (avatarElements.length > 0) {
                blocks.push(
                    blockBuilder.createContextBlock({
                        contextElements: avatarElements,
                    }),
                );
            }
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