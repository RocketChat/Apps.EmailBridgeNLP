import { IHttp, IHttpRequest } from '@rocket.chat/apps-engine/definition/accessors';
import { LlmConfig, LlmErrors } from '../constants/AuthConstants';
import { LlmPrompts } from '../constants/prompts';
import { IToolCall, ILLMResponse } from '../definition/services/ILLMService';

export class LLMService {
    private readonly llmEndpoint: string;

    constructor(private readonly http: IHttp) {
        this.llmEndpoint = LlmConfig.ENDPOINT;
    }

    private generateDateReplacements(): Record<string, string> {
        const today = new Date();
        
        // Helper function to format date as YYYY-MM-DD
        const formatDate = (date: Date): string => {
            return date.toISOString().split('T')[0];
        };
        
        // Helper function to get date X days ago
        const getDateDaysAgo = (days: number): string => {
            const date = new Date(today);
            date.setDate(date.getDate() - days);
            return formatDate(date);
        };
        
        return {
            'CURRENT_DATE': formatDate(today),
            'CURRENT_DATE_MINUS_3': getDateDaysAgo(3),
            'CURRENT_DATE_MINUS_5': getDateDaysAgo(5),
            'CURRENT_DATE_MINUS_7': getDateDaysAgo(7)
        };
    }

    public async processNaturalLanguageQuery(query: string): Promise<{ toolCalls: IToolCall[], rawResponse: ILLMResponse }> {
        // Generate date placeholders
        const dateReplacements = this.generateDateReplacements();
        
        // Inject current dates into the system prompt
        let systemPromptWithDates = LlmPrompts.SYSTEM_PROMPT;
        for (const [placeholder, date] of Object.entries(dateReplacements)) {
            systemPromptWithDates = systemPromptWithDates.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), date);
        }
        
        const payload = {
            model: LlmConfig.MODEL_PATH,
            messages: [
                {
                    role: 'system',
                    content: systemPromptWithDates,
                },
                {
                    role: 'user',
                    content: query,
                },
            ],
            stream: false,
        };

        const request: IHttpRequest = {
            headers: {
                'Content-Type': 'application/json',
            },
            data: payload,
        };

        try {
            const response = await this.http.post(this.llmEndpoint, request);

            if (!response || !response.data) {
                throw new Error(LlmErrors.NO_RESPONSE);
            }

            const llmResponse = response.data as ILLMResponse;

            if (!llmResponse.choices || llmResponse.choices.length === 0) {
                throw new Error(LlmErrors.NO_CHOICES);
            }

            const choice = llmResponse.choices[0];
            let toolCalls = choice.message.tool_calls || [];

            // Simple parsing - only try to parse JSON from content if no tool_calls
            if (toolCalls.length === 0 && choice.message.content) {
                toolCalls = this.parseContentForTools(choice.message.content);
            }

            return { toolCalls, rawResponse: llmResponse };
        } catch (error) {
            throw new Error(`${LlmErrors.REQUEST_FAILED}: ${error.message}`);
        }
    }

    private parseContentForTools(content: string): IToolCall[] {
        const trimmed = content.trim();
        
        // Simple JSON parsing - parse function_call format only
        try {
            const parsed = JSON.parse(trimmed);
            if (parsed.function_call?.name) {
                const toolName = parsed.function_call.name;
                
                // Validate tool name
                if (!LlmPrompts.AVAILABLE_TOOLS.includes(toolName)) {
                    return [];
                }

                const toolCall: IToolCall = {
                    id: 'call_' + Date.now(),
                    type: 'function',
                    function: {
                        name: toolName,
                        arguments: JSON.stringify(parsed.function_call.arguments || {}),
                    },
                };
                
                return [toolCall];
            }
        } catch (e) {
            // Ignore parsing errors
        }

        return [];
    }
} 