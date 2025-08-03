import { IHttp, ILogger, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IEnhancedEmailAnalysis, IEmailStatsParams } from '../../definition/lib/IEmailStatistics';
import { ICategoryStats } from '../../definition/formats/IEmailFormats';
import { IEmailData } from '../../definition/lib/IEmailUtils';
import { t, Language } from '../../lib/Translation/translation';
import { Translations } from '../../constants/Translations';
import { getEffectiveLLMSettings } from '../../config/SettingsManager';
import { LLMService } from '../LLMService';
import { UserPreferenceStorage } from '../../storage/UserPreferenceStorage';
import { LlmPrompts } from '../../constants/prompts';
import { TemplatePlaceholders } from '../../constants/constants';

export class LLMEmailAnalysisService {
    constructor(
        private readonly http: IHttp,
        private readonly persistence: IPersistence,
        private readonly read: IRead,
        private readonly logger: ILogger
    ) {}

    public async analyzeEmails(
        emails: IEmailData[],
        params: IEmailStatsParams,
        language: string = 'en'
    ): Promise<IEnhancedEmailAnalysis> {
        try {
            // Limit to max 450 emails for LLM processing
            const limitedEmails = emails.slice(0, 450);
            this.logger.info(`Processing ${limitedEmails.length} emails for LLM analysis`);
            
            if (limitedEmails.length === 0) {
                this.logger.warn('No emails provided for LLM analysis');
                return {
                    trends: [], // Removed as requested
                    insights: [], // Removed as requested
                    topSenders: [],
                    userCategories: {},
                    additionalCategories: {},
                    totalEmailsAnalyzed: 0,
                    isLLMGenerated: true
                };
            }
            
            // Get user preferences for LLM settings
            const userPreferenceStorage = new UserPreferenceStorage(
                this.persistence,
                this.read.getPersistenceReader(),
                params.userId
            );
            const userPreference = await userPreferenceStorage.getUserPreference();

            // Get effective LLM settings
            const llmSettings = await getEffectiveLLMSettings(
                this.read.getEnvironmentReader().getSettings(),
                userPreference
            );

            const llmService = new LLMService(this.http, llmSettings, null, language as Language, userPreference);

            // Prepare email data for LLM analysis
            const emailSummary = this.prepareEmailDataForLLM(limitedEmails, params.categories || []);
            
            // Create analysis prompt
            const analysisPrompt = this.createAnalysisPrompt(emailSummary, params.categories || [], language);
            
            // Get analysis from LLM
            const analysisResult = await this.performLLMAnalysis(llmService, analysisPrompt, params.categories || []);
            
            // Ensure all user categories are present, even if LLM didn't include them
            const userCategories = analysisResult.userCategories || {};
            const userCategoriesList = params.categories || [];
            
            // Initialize all user categories with 0 counts if not present
            userCategoriesList.forEach(category => {
                if (!userCategories[category]) {
                    userCategories[category] = { total: 0, unread: 0 };
                }
            });
            
            return {
                topSenders: [], // Removed topSenders as requested
                userCategories: userCategories,
                additionalCategories: analysisResult.additionalCategories || {},
                trends: [], // Removed trends as requested
                insights: [], // Removed insights as requested
                totalEmailsAnalyzed: limitedEmails.length,
                isLLMGenerated: true
            };

        } catch (error) {
            this.logger.error('LLM email analysis failed:', error);
            
            // Even on error, ensure user categories are initialized with 0 counts
            const userCategories: { [key: string]: { total: number, unread: number } } = {};
            const userCategoriesList = params.categories || [];
            userCategoriesList.forEach(category => {
                userCategories[category] = { total: 0, unread: 0 };
            });
            
            return {
                trends: [], // Removed trends as requested
                insights: [], // Removed insights as requested
                topSenders: [],
                userCategories: userCategories,
                additionalCategories: {},
                totalEmailsAnalyzed: 0,
                isLLMGenerated: true
            };
        }
    }

    private prepareEmailDataForLLM(emails: IEmailData[], userCategories: string[]): string {
        let emailData = `TOTAL EMAILS TO ANALYZE: ${emails.length}\n\n`;
        emailData += `COMPLETE LIST OF ALL EMAILS:\n\n`;
        
        emails.forEach((email, index) => {
            // Get first and last 50 words of body
            const words = email.bodyPreview.split(' ');
            const firstWords = words.slice(0, 50).join(' ');
            const lastWords = words.length > 50 ? words.slice(-50).join(' ') : '';
            const bodyPreview = words.length > 50 ? `${firstWords}...${lastWords}` : firstWords;

            // Remove time from date, keep only date part
            const dateOnly = email.receivedDateTime.split('T')[0];
            
            emailData += `EMAIL #${index + 1}:\n`;
            emailData += `From: ${email.sender}\n`;
            emailData += `Subject: ${email.subject}\n`;
            emailData += `Body Preview: ${bodyPreview}\n`;
            emailData += `Read Status: ${email.isRead ? 'Read' : 'Unread'}\n`;
            emailData += `Date: ${dateOnly}\n\n`;
        });

        // Add unique senders list to help prevent hallucination
        const uniqueSenders = [...new Set(emails.map(email => email.sender))];
        emailData += `\nUNIQUE SENDERS IN THIS DATA (${uniqueSenders.length} total):\n`;
        uniqueSenders.forEach((sender, index) => {
            const count = emails.filter(email => email.sender === sender).length;
            emailData += `${index + 1}. ${sender} (${count} emails)\n`;
        });

        return emailData;
    }

    private createAnalysisPrompt(emailData: string, userCategories: string[], language: string): string {
        // If user has no categories, provide a default set but make it clear these are fallback defaults
        const categoriesList = userCategories.length > 0 ? 
            userCategories.join(', ') : 
            'work, personal, notifications, updates';
        
        const prompt = LlmPrompts.EMAIL_ANALYSIS_PROMPT
            .replace(TemplatePlaceholders.USER_CATEGORIES, categoriesList)
            .replace(TemplatePlaceholders.EMAIL_DATA, emailData);

        // Log comprehensive details about what's being sent to LLM
        this.logger.info('=== LLM EMAIL ANALYSIS REQUEST START ===');
        this.logger.info('User Categories:', categoriesList);
        this.logger.info('Email Data Length:', emailData.length);
        this.logger.info('Language:', language);
        this.logger.info('=== EMAIL DATA BEING ANALYZED ===');
        this.logger.info(emailData);
        this.logger.info('=== COMPLETE PROMPT BEING SENT TO LLM ===');
        this.logger.info(prompt);
        this.logger.info('=== LLM EMAIL ANALYSIS REQUEST END ===');
        
        return prompt;
    }

    private async performLLMAnalysis(llmService: LLMService, prompt: string, userCategories: string[] = []): Promise<any> {
        try {
            // Call the LLM directly with our analysis prompt
            const analysisResponse = await this.callLLMDirectly(llmService, prompt);
            
            if (!analysisResponse) {
                throw new Error('No response from LLM');
            }
            
            // Log the full response for debugging
            this.logger.info('LLM Analysis Response:', analysisResponse);
            
            // Try multiple JSON extraction patterns
            const jsonPatterns = [
                /```json\s*(\{[\s\S]*?\})\s*```/i,  // JSON in json code blocks
                /```\s*(\{[\s\S]*?\})\s*```/,  // JSON in generic code blocks
                /(\{[\s\S]*\})/,  // Basic JSON match - capture group
                /(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})/  // Nested JSON match
            ];
            
            for (const pattern of jsonPatterns) {
                const match = analysisResponse.match(pattern);
                if (match) {
                    try {
                        const jsonText = match[1] || match[0];
                        const cleaned = jsonText.trim();
                        this.logger.info('Attempting to parse JSON:', cleaned);
                        const parsed = JSON.parse(cleaned);
                        
                        // Validate the structure
                        if (parsed && typeof parsed === 'object') {
                            return parsed;
                        }
                    } catch (parseError) {
                        this.logger.error('JSON parse error for pattern:', parseError);
                        continue; // Try next pattern
                    }
                }
            }
            
            // If no valid JSON found, create a structured response from the text
            return this.parseUnstructuredResponse(analysisResponse, userCategories);
            
        } catch (error) {
            this.logger.error('LLM analysis failed:', error);
            throw error;
        }
    }

    private async callLLMDirectly(llmService: LLMService, prompt: string): Promise<string> {
        // Access the LLM service settings to call the provider directly
        const llmSettings = (llmService as any).llmSettings;
        const language = (llmService as any).language;
        const http = (llmService as any).http;

        if (!llmSettings) {
            throw new Error('LLM settings not available');
        }

        try {
            switch (llmSettings.provider) {
                case 'groq':
                    return await this.callGroqDirectly(http, llmSettings, prompt);
                case 'openai':
                    return await this.callOpenAIDirectly(http, llmSettings, prompt);
                case 'gemini':
                    return await this.callGeminiDirectly(http, llmSettings, prompt);
                default:
                    // Fallback to generateSummary method
                    return await llmService.generateSummary(prompt, 'Email Analysis');
            }
        } catch (error) {
            this.logger.error('Direct LLM call failed, falling back to generateSummary:', error);
            return await llmService.generateSummary(prompt, 'Email Analysis');
        }
    }

    private async callGroqDirectly(http: any, llmSettings: any, prompt: string): Promise<string> {
        const payload = {
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.3,
            max_tokens: 4000,
        };

        const response = await http.post('https://api.groq.com/openai/v1/chat/completions', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${llmSettings.groqApiKey}`,
            },
            data: payload,
        });

        if (response?.data?.choices?.length > 0) {
            return response.data.choices[0].message.content || '';
        }
        throw new Error('No response from Groq');
    }

    private async callOpenAIDirectly(http: any, llmSettings: any, prompt: string): Promise<string> {
        const payload = {
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.3,
            max_tokens: 4000,
        };

        const response = await http.post('https://api.openai.com/v1/chat/completions', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${llmSettings.openaiApiKey}`,
            },
            data: payload,
        });

        if (response?.data?.choices?.length > 0) {
            return response.data.choices[0].message.content || '';
        }
        throw new Error('No response from OpenAI');
    }

    private async callGeminiDirectly(http: any, llmSettings: any, prompt: string): Promise<string> {
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
                temperature: 0.3,
                maxOutputTokens: 4000,
            },
        };

        const response = await http.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${llmSettings.geminiApiKey}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: payload,
            }
        );

        if (response?.data?.candidates?.length > 0) {
            return response.data.candidates[0].content.parts[0].text || '';
        }
        throw new Error('No response from Gemini');
    }

    private parseUnstructuredResponse(response: string, userCategories: string[] = []): any {
        this.logger.info('Parsing unstructured response, LLM failed to return proper JSON');
        
        // Initialize user categories with 0 counts even when JSON parsing fails
        const userCategoriesObj: { [key: string]: { total: number, unread: number } } = {};
        userCategories.forEach(category => {
            userCategoriesObj[category] = { total: 0, unread: 0 };
        });

        return {
            trends: [], // Removed as requested
            insights: [], // Removed as requested
            topSenders: [], // Removed topSenders as requested
            userCategories: userCategoriesObj,
            additionalCategories: {},
            totalEmailsAnalyzed: 0
        };
    }
} 