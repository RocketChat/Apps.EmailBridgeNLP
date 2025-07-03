import { IHttp, IHttpRequest } from '@rocket.chat/apps-engine/definition/accessors';
import { LlmConfig, LlmErrors } from '../constants/AuthConstants';
import { LlmPrompts } from '../constants/prompts';
import { IToolCall, ILLMResponse } from '../definition/lib/ToolInterfaces';
import { LlmTools } from '../enums/LlmTools';

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

    public async processNaturalLanguageQuery(query: string): Promise<{ toolCalls: IToolCall[], rawResponse: ILLMResponse, error?: string }> {
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
            let error: string | undefined;

            // Simple parsing - only try to parse JSON from content if no tool_calls
            if (toolCalls.length === 0 && choice.message.content) {
                const parsed = this.parseContentForTools(choice.message.content);
                toolCalls = parsed.tools;
                error = parsed.error;
            }

            return { toolCalls, rawResponse: llmResponse, error };
        } catch (error) {
            throw new Error(`${LlmErrors.REQUEST_FAILED}: ${error.message}`);
        }
    }

    public async generateSummary(messages: string, channelName: string): Promise<string> {
        const prompt = LlmPrompts.SUMMARIZE_PROMPT
            .replace('__channelName__', channelName)
            .replace('__messages__', messages);

        const payload = {
            model: LlmConfig.MODEL_PATH,
            messages: [
                {
                    role: 'system',
                    content: prompt,
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
                throw new Error('Failed to get response from LLM API');
            }

            const llmResponse = response.data as ILLMResponse;

            if (!llmResponse.choices || llmResponse.choices.length === 0) {
                throw new Error('No choices in LLM response');
            }

            const choice = llmResponse.choices[0];
            const content = choice.message.content || '';
            
            return content.replace(/^Summary:|\bSummary\b:/i, "").trim() || "Failed to generate summary.";
        } catch (error) {
            return "Failed to generate summary due to an error.";
        }
    }

    private parseContentForTools(content: string): { tools: IToolCall[], error?: string } {
        const trimmed = content.trim();
        
        // Remove any markdown formatting or extra text that might interfere
        let cleanContent = trimmed;
        if (cleanContent.startsWith('```json')) {
            cleanContent = cleanContent.replace(/```json\s*/, '').replace(/```\s*$/, '');
        }
        if (cleanContent.startsWith('```')) {
            cleanContent = cleanContent.replace(/```[a-zA-Z]*\s*/, '').replace(/```\s*$/, '');
        }
        
        cleanContent = cleanContent.trim();
        
        // Simple JSON parsing - parse function_call format only
        try {
            const parsed = JSON.parse(cleanContent);

            // Handle error responses
            if(parsed.error) {
                return { tools: [], error: parsed.error };
            }

            // Handle function_call format
            if (parsed.function_call?.name) {
                const toolName = parsed.function_call.name;
                
                // Validate tool name
                if (!Object.values(LlmTools).includes(toolName as LlmTools)) {
                    return { tools: [], error: `Unknown tool: ${toolName}. Please use a valid tool name.` };
                }

                const toolCall: IToolCall = {
                    id: 'call_' + Date.now(),
                    type: 'function',
                    function: {
                        name: toolName,
                        arguments: JSON.stringify(parsed.function_call.arguments || {}),
                    },
                };
                
                return { tools: [toolCall] };
            }

            // If no function_call found but it's valid JSON
            return { tools: [], error: "No suitable tool found for query. Please specify what you'd like to do with email." };

        } catch (e) {
            return { tools: [], error: "Failed to parse LLM response. Please try rephrasing your request." };
        }
    }
} 