import {
    ButtonElement,
    BlockElementType,
    TextObjectType,
    ButtonStyle,
    StaticSelectElement,
    PlainTextInputElement,
    Option,
    OverflowElement,
    MultiStaticSelectElement,
} from '@rocket.chat/ui-kit';
import { ButtonParam, ElementInteractionParam, MultiStaticSelectElementParam, OverflowElementParam, PlainTextInputParam, StaticSelectElementParam, StaticSelectOptionsParam } from '../definition/lib/IElementBuilder';

export class ElementBuilder {
    constructor(private readonly appId: string) {}

    public addButton(
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

    public createPlainTextInput(
        param: PlainTextInputParam,
        interaction: ElementInteractionParam,
    ): PlainTextInputElement {
        const {
            text,
            initialValue,
            multiline,
            minLength,
            maxLength,
            dispatchActionConfig,
        } = param;
        const { blockId, actionId } = interaction;
        
        const plainTextInput: PlainTextInputElement = {
            type: BlockElementType.PLAIN_TEXT_INPUT,
            placeholder: {
                type: TextObjectType.PLAIN_TEXT,
                text,
            },
            appId: this.appId,
            blockId,
            actionId,
            initialValue,
            multiline,
            minLength,
            maxLength,
            dispatchActionConfig,
        };

        return plainTextInput;
    }

    public addDropDown(
        param: StaticSelectElementParam,
        interaction: ElementInteractionParam,
    ): StaticSelectElement {
        const {
            placeholder,
            options,
            optionGroups,
            initialOption,
            initialValue,
            dispatchActionConfig,
        } = param;
        const { blockId, actionId } = interaction;
        
        const dropDown: StaticSelectElement = {
            type: BlockElementType.STATIC_SELECT,
            placeholder: {
                type: TextObjectType.PLAIN_TEXT,
                text: placeholder,
            },
            options: options || [],
            appId: this.appId,
            blockId,
            actionId,
        };

        if (optionGroups) dropDown.optionGroups = optionGroups;
        if (initialOption) dropDown.initialOption = initialOption;
        if (initialValue) dropDown.initialValue = initialValue;
        if (dispatchActionConfig) dropDown.dispatchActionConfig = dispatchActionConfig;
        
        return dropDown;
    }

    public addMultiSelectDropDown(
        param: MultiStaticSelectElementParam,
        interaction: ElementInteractionParam,
    ): MultiStaticSelectElement {
        const {
            placeholder,
            options,
            optionGroups,
            initialValue,
            dispatchActionConfig,
        } = param;
        const { blockId, actionId } = interaction;

        const dropDown: MultiStaticSelectElement = {
            type: BlockElementType.MULTI_STATIC_SELECT,
            placeholder: {
                type: TextObjectType.PLAIN_TEXT,
                text: placeholder,
            },
            options: options || [],
            appId: this.appId,
            blockId,
            actionId,
        };

        if (optionGroups) dropDown.optionGroups = optionGroups;
        if (initialValue) dropDown.initialValue = initialValue;
        if (dispatchActionConfig) dropDown.dispatchActionConfig = dispatchActionConfig;

        return dropDown;
    }

    public createDropDownOptions(
        param: StaticSelectOptionsParam,
    ): Array<Option> {
        const options: Array<Option> = param.map((option) => {
            const { text, value, description, url } = option;
            const optionObject: Option = {
                text: {
                    type: TextObjectType.PLAIN_TEXT,
                    text,
                },
                value,
                ...(description
                    ? {
                            description: {
                                type: TextObjectType.PLAIN_TEXT,
                                text: description,
                            },
                      }
                    : undefined),
                url,
            };
            return optionObject;
        });
        return options;
    }

    public createOverflow(
        param: OverflowElementParam,
        interaction: ElementInteractionParam,
    ): OverflowElement {
        const { options } = param;
        const { blockId, actionId } = interaction;
        
        const overflow: OverflowElement = {
            type: BlockElementType.OVERFLOW,
            options,
            appId: this.appId,
            blockId,
            actionId,
        };
        
        return overflow;
    }
} 