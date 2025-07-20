import { IHttp, IHttpRequest } from '@rocket.chat/apps-engine/definition/accessors';
import { LlmConfig, LlmApiUrls, LlmModels, ContentTypes, HttpHeaders } from '../constants/AuthConstants';
import { Translations } from '../constants/Translations';
import { LlmPrompts } from '../constants/prompts';
import { IToolCall, ILLMResponse } from '../definition/lib/ToolInterfaces';
import { LlmTools } from '../enums/LlmTools';
import { ILLMSettings } from '../definition/lib/ILLMSettings';
import { handleErrorAndGetMessage } from '../helper/errorHandler';
import { t, Language } from '../lib/Translation/translation';

export class LLMService {
    private readonly llmEndpoint: string;
    private readonly llmSettings: ILLMSettings;

    constructor(
        private readonly http: IHttp, 
        llmSettings: ILLMSettings,
        private readonly app: any,
        private readonly language: Language
    ) {
        this.llmEndpoint = LlmConfig.ENDPOINT;
        this.llmSettings = llmSettings;
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
        
        // Route to appropriate provider based on settings
        switch (this.llmSettings.provider) {
            case 'openai':
                return await this.processWithOpenAI(systemPromptWithDates, query);
            case 'gemini':
                return await this.processWithGemini(systemPromptWithDates, query);
            case 'groq':
                return await this.processWithGroq(systemPromptWithDates, query);
            case 'default':
            default:
                return await this.processWithDefault(systemPromptWithDates, query);
        }
    }

    private async processWithDefault(systemPrompt: string, query: string): Promise<{ toolCalls: IToolCall[], rawResponse: ILLMResponse, error?: string }> {
        const payload = {
            model: LlmConfig.MODEL_PATH,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
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
                [HttpHeaders.CONTENT_TYPE]: ContentTypes.APPLICATION_JSON,
            },
            data: payload,
        };

        try {
            const response = await this.http.post(this.llmEndpoint, request);

            if (!response?.data) {
                throw new Error(t(Translations.LLM_NO_RESPONSE, this.language));
            }

            const llmResponse = response.data as ILLMResponse;

            if (!llmResponse.choices?.length) {
                throw new Error(t(Translations.LLM_NO_CHOICES, this.language));
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
            const errorMessage = handleErrorAndGetMessage(this.app, this.language, 'LLM Default Provider', error);
            throw new Error(errorMessage);
        }
    }

    private async processWithOpenAI(systemPrompt: string, query: string): Promise<{ toolCalls: IToolCall[], rawResponse: ILLMResponse, error?: string }> {
        if (!this.llmSettings.openaiApiKey) {
            throw new Error(t(Translations.ERROR_MISSING_CONFIGURATION, this.language));
        }

        const payload = {
            model: LlmModels.OPENAI,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: query,
                },
            ],
        };

        const request: IHttpRequest = {
            headers: {
                [HttpHeaders.CONTENT_TYPE]: ContentTypes.APPLICATION_JSON,
                [HttpHeaders.AUTHORIZATION]: `Bearer ${this.llmSettings.openaiApiKey}`,
            },
            data: payload,
        };

        try {
            const response = await this.http.post(LlmApiUrls.OPENAI, request);

            if (!response?.data) {
                throw new Error(t(Translations.LLM_NO_RESPONSE, this.language));
            }

            const llmResponse = response.data as ILLMResponse;

            if (!llmResponse.choices?.length) {
                throw new Error(t(Translations.LLM_NO_CHOICES, this.language));
            }

            const choice = llmResponse.choices[0];
            let toolCalls = choice.message.tool_calls || [];
            let error: string | undefined;

            // Parse content for tool calls if no direct tool_calls
            if (toolCalls.length === 0 && choice.message.content) {
                const parsed = this.parseContentForTools(choice.message.content);
                toolCalls = parsed.tools;
                error = parsed.error;
            }

            return { toolCalls, rawResponse: llmResponse, error };
        } catch (error) {
            const errorMessage = handleErrorAndGetMessage(this.app, this.language, 'OpenAI Provider', error);
            throw new Error(errorMessage);
        }
    }

    private async processWithGemini(systemPrompt: string, query: string): Promise<{ toolCalls: IToolCall[], rawResponse: ILLMResponse, error?: string }> {
        if (!this.llmSettings.geminiApiKey) {
            throw new Error(t(Translations.ERROR_MISSING_CONFIGURATION, this.language));
        }

        const payload = {
            contents: [
                {
                    parts: [
                        {
                            text: `${systemPrompt}\n\nUser Query: ${query}`,
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 3000,
            },
        };

        const request: IHttpRequest = {
            headers: {
                [HttpHeaders.CONTENT_TYPE]: ContentTypes.APPLICATION_JSON,
            },
            data: payload,
        };

        try {
            const response = await this.http.post(
                `${LlmApiUrls.GEMINI}?key=${this.llmSettings.geminiApiKey}`,
                request
            );

            if (!response?.data) {
                throw new Error(t(Translations.LLM_NO_RESPONSE, this.language));
            }

            const geminiResponse = response.data;

            if (!geminiResponse.candidates?.length) {
                throw new Error(t(Translations.LLM_NO_CHOICES, this.language));
            }

            const content = geminiResponse.candidates[0].content.parts[0].text;

            // Convert Gemini response to LLM format
            const llmResponse: ILLMResponse = {
                id: 'gemini-' + Date.now(),
                model: LlmModels.GEMINI,
                created: Date.now(),
                choices: [
                    {
                        message: {
                            content: content,
                        },
                        finish_reason: 'stop'
                    }
                ],
                usage: {
                    prompt_tokens: 0,
                    completion_tokens: 0,
                    total_tokens: 0,
                }
            };

            const parsed = this.parseContentForTools(content);
            return { toolCalls: parsed.tools, rawResponse: llmResponse, error: parsed.error };
        } catch (error) {
            const errorMessage = handleErrorAndGetMessage(this.app, this.language, 'Gemini Provider', error);
            throw new Error(errorMessage);
        }
    }

    private async processWithGroq(systemPrompt: string, query: string): Promise<{ toolCalls: IToolCall[], rawResponse: ILLMResponse, error?: string }> {
        if (!this.llmSettings.groqApiKey) {
            throw new Error(t(Translations.ERROR_MISSING_CONFIGURATION, this.language));
        }

        const payload = {
            model: LlmModels.GROQ,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: query,
                },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        };

        const request: IHttpRequest = {
            headers: {
                [HttpHeaders.CONTENT_TYPE]: ContentTypes.APPLICATION_JSON,
                [HttpHeaders.AUTHORIZATION]: `Bearer ${this.llmSettings.groqApiKey}`,
            },
            data: payload,
        };

        try {
            const response = await this.http.post(LlmApiUrls.GROQ, request);

            if (!response?.data) {
                throw new Error(t(Translations.LLM_NO_RESPONSE, this.language));
            }

            const llmResponse = response.data as ILLMResponse;

            if (!llmResponse.choices?.length) {
                throw new Error(t(Translations.LLM_NO_CHOICES, this.language));
            }

            const choice = llmResponse.choices[0];
            let toolCalls = choice.message.tool_calls || [];
            let error: string | undefined;

            // Parse content for tool calls if no direct tool_calls
            if (toolCalls.length === 0 && choice.message.content) {
                const parsed = this.parseContentForTools(choice.message.content);
                toolCalls = parsed.tools;
                error = parsed.error;
            }

            return { toolCalls, rawResponse: llmResponse, error };
        } catch (error) {
            const errorMessage = handleErrorAndGetMessage(this.app, this.language, 'Groq Provider', error);
            throw new Error(errorMessage);
        }
    }

    public async generateSummary(messages: string, channelName: string): Promise<string> {
        const prompt = LlmPrompts.SUMMARIZE_PROMPT
            .replace('__channelName__', channelName)
            .replace('__messages__', messages);

        try {
            let response;
            
            switch (this.llmSettings.provider) {
                case 'openai':
                    response = await this.generateSummaryWithOpenAI(prompt);
                    break;
                case 'gemini':
                    response = await this.generateSummaryWithGemini(prompt);
                    break;
                case 'groq':
                    response = await this.generateSummaryWithGroq(prompt);
                    break;
                case 'default':
                default:
                    response = await this.generateSummaryWithDefault(prompt);
                    break;
            }

            return response;
        } catch (error) {
            return t(Translations.SUMMARY_GENERATION_FAILED, this.language);
        }
    }

    private async generateSummaryWithDefault(prompt: string): Promise<string> {
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
                [HttpHeaders.CONTENT_TYPE]: ContentTypes.APPLICATION_JSON,
            },
            data: payload,
        };

            const response = await this.http.post(this.llmEndpoint, request);

            if (!response?.data) {
            throw new Error(t(Translations.LLM_NO_RESPONSE, this.language));
        }

        const llmResponse = response.data as ILLMResponse;

        if (!llmResponse.choices?.length) {
            throw new Error(t(Translations.LLM_NO_CHOICES, this.language));
        }

        const choice = llmResponse.choices[0];
        const content = choice.message.content || '';
        return content.replace(/^Summary:|\bSummary\b:/i, "").trim() || t(Translations.SUMMARY_GENERATION_FAILED, this.language);
    }

    private async generateSummaryWithOpenAI(prompt: string): Promise<string> {
        if (!this.llmSettings.openaiApiKey) {
            throw new Error(t(Translations.ERROR_MISSING_CONFIGURATION, this.language));
        }

        const payload = {
            model: LlmModels.OPENAI,
            messages: [
                {
                    role: 'system',
                    content: prompt,
                },
            ],
        };

        const request: IHttpRequest = {
            headers: {
                [HttpHeaders.CONTENT_TYPE]: ContentTypes.APPLICATION_JSON,
                [HttpHeaders.AUTHORIZATION]: `Bearer ${this.llmSettings.openaiApiKey}`,
            },
            data: payload,
        };

        const response = await this.http.post(LlmApiUrls.OPENAI, request);

        if (!response?.data) {
            throw new Error(t(Translations.LLM_NO_RESPONSE, this.language));
            }

            const llmResponse = response.data as ILLMResponse;

            if (!llmResponse.choices?.length) {
            throw new Error(t(Translations.LLM_NO_CHOICES, this.language));
            }

            const choice = llmResponse.choices[0];
            const content = choice.message.content || '';
        return content.replace(/^Summary:|\bSummary\b:/i, "").trim() || t(Translations.SUMMARY_GENERATION_FAILED, this.language);
    }

    private async generateSummaryWithGemini(prompt: string): Promise<string> {
        if (!this.llmSettings.geminiApiKey) {
            throw new Error(t(Translations.ERROR_MISSING_CONFIGURATION, this.language));
        }

        const payload = {
            contents: [
                {
                    parts: [
                        {
                            text: prompt,
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2000,
            },
        };

        const request: IHttpRequest = {
            headers: {
                [HttpHeaders.CONTENT_TYPE]: ContentTypes.APPLICATION_JSON,
            },
            data: payload,
        };

        const response = await this.http.post(
            `${LlmApiUrls.GEMINI}?key=${this.llmSettings.geminiApiKey}`,
            request
        );

        if (!response?.data) {
            throw new Error(t(Translations.LLM_NO_RESPONSE, this.language));
        }

        const geminiResponse = response.data;

        if (!geminiResponse.candidates?.length) {
            throw new Error(t(Translations.LLM_NO_CHOICES, this.language));
        }

        const content = geminiResponse.candidates[0].content.parts[0].text;
        return content.replace(/^Summary:|\bSummary\b:/i, "").trim() || t(Translations.SUMMARY_GENERATION_FAILED, this.language);
    }

    private async generateSummaryWithGroq(prompt: string): Promise<string> {
        if (!this.llmSettings.groqApiKey) {
            throw new Error(t(Translations.ERROR_MISSING_CONFIGURATION, this.language));
        }

        const payload = {
            model: LlmModels.GROQ,
            messages: [
                {
                    role: 'system',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        };

        const request: IHttpRequest = {
            headers: {
                [HttpHeaders.CONTENT_TYPE]: ContentTypes.APPLICATION_JSON,
                [HttpHeaders.AUTHORIZATION]: `Bearer ${this.llmSettings.groqApiKey}`,
            },
            data: payload,
        };

        const response = await this.http.post(LlmApiUrls.GROQ, request);

        if (!response?.data) {
            throw new Error(t(Translations.LLM_NO_RESPONSE, this.language));
        }

        const llmResponse = response.data as ILLMResponse;

        if (!llmResponse.choices?.length) {
            throw new Error(t(Translations.LLM_NO_CHOICES, this.language));
        }

        const choice = llmResponse.choices[0];
        const content = choice.message.content || '';
        return content.replace(/^Summary:|\bSummary\b:/i, "").trim() || t(Translations.SUMMARY_GENERATION_FAILED, this.language);
    }

    private parseContentForTools(content: string): { tools: IToolCall[], error?: string } {
        const trimmed = content.trim();
        
        let cleanContent = trimmed;
        if (cleanContent.startsWith('```json')) {
            cleanContent = cleanContent.replace(/```json\s*/, '').replace(/```\s*$/, '');
        }
        if (cleanContent.startsWith('```')) {
            cleanContent = cleanContent.replace(/```[a-zA-Z]*\s*/, '').replace(/```\s*$/, '');
        }
        
        cleanContent = cleanContent.trim();
        
        let contentToParseAttempts = [cleanContent];
        
        if (cleanContent.includes('"content"') && cleanContent.match(/:\s*"[^"]*\n/)) {
            let fixedContent = cleanContent;
            
            const contentRegex = /("content"\s*:\s*")([^"]*(?:"[^"]*)*?)(")/g;
            fixedContent = fixedContent.replace(contentRegex, (match, start, content, end) => {
                // Escape actual newlines and carriage returns in the content
                const escapedContent = content
                    .replace(/\\/g, '\\\\')  // Escape backslashes first
                    .replace(/\n/g, '\\n')   // Escape newlines
                    .replace(/\r/g, '\\r')   // Escape carriage returns  
                    .replace(/\t/g, '\\t');  // Escape tabs
                return start + escapedContent + end;
            });
            
            contentToParseAttempts.unshift(fixedContent); // Try fixed version first
        }
        
        for (const contentToParse of contentToParseAttempts) {
        try {
                const parsed = JSON.parse(contentToParse);

            if(parsed.error) {
                return { tools: [], error: parsed.error };
            }

            // Handle function_call format
            if (parsed.function_call?.name) {
                const toolName = parsed.function_call.name;
                
                // Validate tool name
                if (!Object.values(LlmTools).includes(toolName as LlmTools)) {
                        return { tools: [], error: t(Translations.LLM_PARSING_ERROR, this.language) };
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
                return { tools: [], error: t(Translations.LLM_NO_TOOL_DETECTED, this.language) };

        } catch (e) {
                // Continue to next parsing attempt
                continue;
            }
        }
        
        return { tools: [], error: t(Translations.LLM_PARSING_FAILED, this.language) };
    }
} 