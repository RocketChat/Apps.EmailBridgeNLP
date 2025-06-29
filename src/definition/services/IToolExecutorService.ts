export interface IToolExecutionResult {
    tool_name: string;
    success: boolean;
    message: string;
    error?: string;
    modal_opened?: boolean;
} 