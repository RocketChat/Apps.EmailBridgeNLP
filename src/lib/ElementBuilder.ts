import {
    ButtonElement,
    BlockElementType,
    TextObjectType,
    ButtonStyle,
} from '@rocket.chat/ui-kit';

export interface ButtonParam {
    text: string;
    url?: string;
    value?: string;
    style?: ButtonStyle;
}

export interface ElementInteractionParam {
    blockId: string;
    actionId: string;
}

export class ElementBuilder {
    constructor(private readonly appId: string) {}

    public createButton(
        param: ButtonParam,
        interaction: ElementInteractionParam,
    ): ButtonElement {
        const { text, url, value, style } = param;
        const { blockId, actionId } = interaction;
        
        const button: ButtonElement = {
            type: BlockElementType.BUTTON,
            text: {
                type: TextObjectType.PLAIN_TEXT,
                text,
            },
            appId: this.appId,
            blockId,
            actionId,
        };

        if (url) button.url = url;
        if (value) button.value = value;
        if (style) button.style = style;
        
        return button;
    }
} 