import { ButtonStyle, Option } from '@rocket.chat/ui-kit';

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

export interface PlainTextInputParam {
    text: string;
    initialValue?: string;
    multiline?: boolean;
    minLength?: number;
    maxLength?: number;
    dispatchActionConfig?: any[];
}

export interface StaticSelectElementParam {
    placeholder: string;
    options?: Option[];
    optionGroups?: any[];
    initialOption?: Option;
    initialValue?: string;
    dispatchActionConfig?: any[];
}

export interface MultiStaticSelectElementParam {
    placeholder: string;
    options: Option[];
    optionGroups?: any[];
    initialValue?: string[];
    dispatchActionConfig?: any[];
}

export interface StaticSelectOptionsParam extends Array<{
    text: string;
    value: string;
    description?: string;
    url?: string;
}> {}

export interface OverflowElementParam {
    options: Option[];
} 