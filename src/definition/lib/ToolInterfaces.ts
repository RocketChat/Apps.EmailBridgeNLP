export interface IToolCall {
    id: string;
    type: string;
    function: {
        name: string;
        arguments: string;
    };
}

export interface ILLMResponse {
    id:string;
    model: string;
    created: number;
    choices: Array<{
        message: {
            content?: string;
            tool_calls?: IToolCall[];
        };
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface IToolExecutionResult {
    tool_name: string;
    success: boolean;
    message: string;
    error?: string;
    modal_opened?: boolean;
} 