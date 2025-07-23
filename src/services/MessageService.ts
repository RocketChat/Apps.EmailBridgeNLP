import { IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IMessage, ISummarizeParams } from '../definition/lib/IEmailUtils';
import { MessageConfig } from '../constants/AuthConstants';

export class MessageService {
    public async getMessages(
        room: IRoom,
        read: IRead,
        user: IUser,
        params: ISummarizeParams,
        threadId?: string,
    ): Promise<IMessage[]> {
        try {
            let targetMessages: any[] = [];

            if (threadId) {
                // For threads, get maximum messages to ensure we find the thread
                const allMessages = await read.getRoomReader().getMessages(room.id, {
                    limit: MessageConfig.MAX_MESSAGES_RETRIEVAL,
                    sort: { createdAt: "desc" },
                });

                targetMessages = allMessages.filter((msg) => {
                    return msg.id === threadId || msg.threadId === threadId;
                });
            } else {
                // For channel summaries, use the configured limit
                const recentMessages = await read.getRoomReader().getMessages(room.id, {
                    limit: Math.min(MessageConfig.MAX_MESSAGES_RETRIEVAL, 200), 
                    sort: { createdAt: "desc" },
                });
                targetMessages = recentMessages;
            }

            // If still no messages found, return empty array early
            if (targetMessages.length === 0) {
                return [];
            }

            // Reverse to get chronological order (oldest to newest)
            const chronologicalMessages = [...targetMessages].reverse();

            // Filter messages based on parameters (date, participants)
            let filteredMessages = chronologicalMessages;
            const { startDate, endDate } = this.calculateTimeframeParams(params);

            // Filter by date range if provided
            if (startDate || endDate) {
                filteredMessages = filteredMessages.filter((message) => {
                    if (!message.createdAt) return false;
                    const createdAt = new Date(message.createdAt);

                    if (startDate && createdAt < startDate) return false;
                    if (endDate && createdAt > endDate) return false;

                    return true;
                });
            }

            // Filter by participants/people if provided (reverted to simpler logic)
            if (params.people && params.people.length > 0) {
                const cleanPeople = params.people.map(person => person.replace(/^@/, ''));
                filteredMessages = filteredMessages.filter((message) => {
                    return message.sender && cleanPeople.includes(message.sender.username);
                });
            }

            // Apply default limit for channel summaries without specific filters
            if (!params.start_date && !params.end_date && !params.people && !threadId && !params.days) {
                filteredMessages = filteredMessages.slice(-25);
            }

            filteredMessages = filteredMessages.filter((message) => {
                if (!message.text || message.text.trim().length < 3) return false;
                if (message.sender?.username === 'rocket.cat') return false;
                return true;
            });

            // Convert to IMessage format
            return filteredMessages.map(message => ({
                id: message.id || 'no-id',
                sender: {
                    username: message.sender?.username || 'unknown',
                    name: message.sender?.name || message.sender?.username || 'unknown'
                },
                createdAt: message.createdAt || new Date(),
                text: message.text || ''
            }));

        } catch (error) {
            throw new Error(`Failed to retrieve messages: ${error.message}`);
        }
    }

    public formatMessagesForSummary(messages: IMessage[]): string {
        if (messages.length === 0) {
            return 'No messages found.';
        }

        return messages.map(message => {
            // Format the date for readability
            const timestamp = typeof message.createdAt === 'string'
                ? new Date(message.createdAt).toLocaleString()
                : (message.createdAt as Date).toLocaleString();

            return `[${timestamp}] ${message.sender.name}: ${message.text}`;
        }).join('\n\n');
    }

    private calculateTimeframeParams(params: ISummarizeParams): { startDate?: Date, endDate?: Date, limit?: number } {
        const result: { startDate?: Date, endDate?: Date, limit?: number } = {};
        const now = new Date();

        // Handle days parameter first
        if (params.days && params.days > 0) {
            const daysAgo = new Date(now);
            daysAgo.setDate(now.getDate() - params.days);
            result.startDate = daysAgo;
            result.endDate = now;
            return result;
        }

        // Handle explicit date range
        if (params.start_date) {
            result.startDate = new Date(params.start_date);
        }
        
        if (params.end_date) {
            result.endDate = new Date(params.end_date);
        }

        // If no date parameters provided, default to last 25 messages without date filtering
        if (!params.start_date && !params.end_date && !params.days) {
            result.limit = 25;
        }

        return result;
    }
} 