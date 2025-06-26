import {
    SectionBlock,
    LayoutBlockType,
    TextObjectType,
    TextObject,
    ContextBlock,
    InputBlock,
    DividerBlock,
    ActionsBlock,
    StaticSelectElement,
    ButtonElement,
    DatePickerElement,
    ImageElement,
    MultiStaticSelectElement,
    OverflowElement,
} from '@rocket.chat/ui-kit';

type SectionAccessoryElement = ButtonElement | DatePickerElement | ImageElement | MultiStaticSelectElement | OverflowElement | StaticSelectElement;
type ActionElement = ButtonElement | StaticSelectElement | OverflowElement | DatePickerElement;
type ContextElement = string | TextObject | ImageElement;

export interface SectionBlockParam {
    text?: string;
    blockId?: string;
    fields?: string[];
    accessory?: SectionAccessoryElement;
}

export interface ContextBlockParam {
    contextElements: ContextElement[];
    blockId?: string;
}

export interface ActionBlockParam {
    elements: ActionElement[];
    blockId?: string;
}

export interface InputBlockParam {
    text: string;
    element: any;
    blockId?: string;
    hint?: any;
    optional?: boolean;
}

export class BlockBuilder {
    constructor(private readonly appId: string) {}

    public createSectionBlock(param: SectionBlockParam): SectionBlock {
        const { text, blockId, fields, accessory } = param;
        
        const sectionBlock: SectionBlock = {
            appId: this.appId,
            type: LayoutBlockType.SECTION,
            text: text ? {
                type: TextObjectType.MRKDWN,
                text,
            } : undefined,
            fields: fields ? this.createTextObjects(fields) : undefined,
        };

        if (blockId) sectionBlock.blockId = blockId;
        if (accessory) sectionBlock.accessory = accessory;

        return sectionBlock;
    }

    public createContextBlock(param: ContextBlockParam): ContextBlock {
        const { contextElements, blockId } = param;

        const elements = contextElements.map((element) => {
            if (typeof element === 'string') {
                return {
                    type: TextObjectType.MRKDWN,
                    text: element,
                } as TextObject;
            } else {
                return element;
            }
        });

        const contextBlock: ContextBlock = {
            type: LayoutBlockType.CONTEXT,
            elements,
        };

        if (blockId) contextBlock.blockId = blockId;

        return contextBlock;
    }

    public createInputBlock(param: InputBlockParam): InputBlock {
        const { text, element, blockId, hint, optional } = param;

        const inputBlock: InputBlock = {
            type: LayoutBlockType.INPUT,
            label: {
                type: TextObjectType.PLAIN_TEXT,
                text,
            },
            appId: this.appId,
            element,
            optional,
        };

        if (blockId) inputBlock.blockId = blockId;
        if (hint) inputBlock.hint = hint;

        return inputBlock;
    }

    public createActionsBlock(param: ActionBlockParam): ActionsBlock {
        const { elements, blockId } = param;
        
        const actionBlock: ActionsBlock = {
            type: LayoutBlockType.ACTIONS,
            elements,
        };

        if (blockId) actionBlock.blockId = blockId;

        return actionBlock;
    }

    public createDividerBlock(blockId?: string): DividerBlock {
        const dividerBlock: DividerBlock = {
            type: LayoutBlockType.DIVIDER,
            appId: this.appId,
        };

        if (blockId) dividerBlock.blockId = blockId;

        return dividerBlock;
    }

    private createTextObjects(fields: string[]): TextObject[] {
        return fields.map((field) => ({
            type: TextObjectType.MRKDWN,
            text: field,
        }));
    }
} 