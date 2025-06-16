import {
    ISlashCommand,
    ISlashCommandPreview,
    ISlashCommandPreviewItem,
    SlashCommandContext,
    SlashCommandPreviewItemType,
} from '@rocket.chat/apps-engine/definition/slashcommands';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { CommandUtility } from './CommandUtility';
import { ICommandUtilityParams } from '../definition/command/ICommandUtility';
import { EmailServiceFactory } from '../services/auth/EmailServiceFactory';
import { UserPreferenceStorage } from '../storage/UserPreferenceStorage';
import { getUserPreferredLanguage } from '../helper/userPreference';
import { t } from '../lib/Translation/translation';
import { getProviderDisplayName } from '../enums/ProviderDisplayNames';

export class EmailCommand implements ISlashCommand {
    constructor(private readonly app: EmailBridgeNlpApp) {}

    public command = 'email';
    public i18nParamsExample = 'Email_Command_Params';
    public i18nDescription = 'Email_Command_Description';
    public providesPreview = true;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ): Promise<void> {
        const params = context.getArguments();
        const sender = context.getSender();
        const room = context.getRoom();
        const triggerId = context.getTriggerId();
        const threadId = context.getThreadId();

        const commandUtilityParams: ICommandUtilityParams = {
            params,
            sender,
            room,
            triggerId,
            threadId,
            read,
            modify,
            http,
            persis,
            app: this.app,
        };

        const commandUtility = new CommandUtility(commandUtilityParams);
        await commandUtility.resolveCommand();
    }

    public async previewer(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ): Promise<ISlashCommandPreview> {
        const sender = context.getSender();
        const language = await getUserPreferredLanguage(
            read.getPersistenceReader(),
            persis,
            sender.id,
        );

        // Get user input to filter commands
        const userInput = context.getArguments().join(' ').toLowerCase();

        try {
            // Check authentication status
            const userPreferenceStorage = new UserPreferenceStorage(
                persis,
                read.getPersistenceReader(),
                sender.id,
            );
            const userPreference = await userPreferenceStorage.getUserPreference();
            const emailProvider = userPreference.emailProvider;

            let isAuthenticated = false;
            let userEmail = '';

            if (EmailServiceFactory.isProviderSupported(emailProvider)) {
                try {
                    isAuthenticated = await EmailServiceFactory.isUserAuthenticated(
                        emailProvider,
                        sender.id,
                        http,
                        persis,
                        read,
                        this.app.getLogger()
                    );

                    if (isAuthenticated) {
                        const userInfo = await EmailServiceFactory.getUserInfo(
                            emailProvider,
                            sender.id,
                            http,
                            persis,
                            read,
                            this.app.getLogger()
                        );
                        userEmail = userInfo.email;
                    }
                } catch (error) {
                    // Silent error handling, assume not authenticated
                    isAuthenticated = false;
                }
            }

            // Create all available commands
            const allCommands: Array<{
                id: string;
                command: string;
                type: SlashCommandPreviewItemType;
                value: string;
            }> = [];

            if (isAuthenticated) {
                // Authenticated user commands
                allCommands.push({
                    id: 'logout',
                    command: 'logout',
                    type: SlashCommandPreviewItemType.TEXT,
                    value: `${t('Logout_Command', language)} (${getProviderDisplayName(emailProvider)}: ${userEmail})`,
                });
            } else {
                // Unauthenticated user commands
                allCommands.push({
                    id: 'login',
                    command: 'login',
                    type: SlashCommandPreviewItemType.TEXT,
                    value: `${t('Login_Command', language)} (${getProviderDisplayName(emailProvider)})`,
                });
            }

            // Always available commands
            allCommands.push(
                {
                    id: 'config',
                    command: 'config',
                    type: SlashCommandPreviewItemType.TEXT,
                    value: `${t('Config_Command', language)}`,
                },
                {
                    id: 'help',
                    command: 'help',
                    type: SlashCommandPreviewItemType.TEXT,
                    value: `${t('Help_Command', language)}`,
                }
            );

            // Smart filtering based on user input and authentication status
            let filteredCommands = allCommands;
            
            if (userInput.trim() !== '') {
                // Check if user is trying to use an unavailable command
                const userIntentLogin = userInput.toLowerCase().includes('login') || userInput.toLowerCase().includes('log');
                const userIntentLogout = userInput.toLowerCase().includes('logout');
                
                // Filter commands that match user input and are available for current auth state
                filteredCommands = allCommands.filter(cmd => {
                    const matchesInput = cmd.command.toLowerCase().startsWith(userInput) ||
                                       cmd.command.toLowerCase().includes(userInput);
                    
                    return matchesInput;
                });

                // Special handling for authentication-specific commands
                if (isAuthenticated && userIntentLogin && filteredCommands.length === 0) {
                    // User wants to login but is already authenticated - show logout option
                    filteredCommands = allCommands.filter(cmd => cmd.command === 'logout');
                } else if (!isAuthenticated && userIntentLogout && filteredCommands.length === 0) {
                    // User wants to logout but is not authenticated - show login option
                    filteredCommands = allCommands.filter(cmd => cmd.command === 'login');
                } else if (filteredCommands.length === 0) {
                    // No matches, show contextual help
                    filteredCommands = allCommands.filter(cmd => 
                        cmd.command === 'help' || cmd.command === 'config'
                    );
                }
            } else {
                // When no input, show contextual commands based on auth status
                if (!isAuthenticated) {
                    // For unauthenticated users, show login first, then others
                    const loginCmd = allCommands.find(cmd => cmd.command === 'login');
                    const otherCmds = allCommands.filter(cmd => cmd.command !== 'login').sort((a, b) => {
                        // Sort: config, help
                        const order = ['config', 'help'];
                        return order.indexOf(a.command) - order.indexOf(b.command);
                    });
                    filteredCommands = loginCmd ? [loginCmd, ...otherCmds] : allCommands;
                } else {
                    // For authenticated users, show config first, help, then logout last
                    const logoutCmd = allCommands.find(cmd => cmd.command === 'logout');
                    const otherCmds = allCommands.filter(cmd => cmd.command !== 'logout' && cmd.command !== 'login').sort((a, b) => {
                        // Sort: config, help
                        const order = ['config', 'help'];
                        return order.indexOf(a.command) - order.indexOf(b.command);
                    });
                    filteredCommands = logoutCmd ? [...otherCmds, logoutCmd] : otherCmds;
                }
            }

            // Map commands to items, preserving command info in the id
            const items: ISlashCommandPreviewItem[] = filteredCommands.map(cmd => ({
                id: cmd.command, // Use command name as id so executePreviewItem can use it
                type: cmd.type,
                value: cmd.value,
            }));

            return {
                i18nTitle: 'Email Commands',
                items,
            };
        } catch (error) {
            // Fallback to basic commands if error occurs
            return {
                i18nTitle: 'Email Commands',
                items: [
                    {
                        id: 'help',
                        type: SlashCommandPreviewItemType.TEXT,
                        value: `${t('Help_Command', language)}`,
                    },
                    {
                        id: 'config',
                        type: SlashCommandPreviewItemType.TEXT,
                        value: `${t('Config_Command', language)}`,
                    },
                ],
            };
        }
    }

    public async executePreviewItem(
        item: ISlashCommandPreviewItem,
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence,
    ): Promise<void> {
        // Execute the selected command
        const params = [item.id];
        const sender = context.getSender();
        const room = context.getRoom();
        const triggerId = context.getTriggerId();
        const threadId = context.getThreadId();

        const commandUtilityParams: ICommandUtilityParams = {
            params,
            sender,
            room,
            triggerId,
            threadId,
            read,
            modify,
            http,
            persis,
            app: this.app,
        };

        const commandUtility = new CommandUtility(commandUtilityParams);
        await commandUtility.resolveCommand();
    }
} 