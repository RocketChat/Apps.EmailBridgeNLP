import { IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IMessage, ISummarizeParams } from '../definition/lib/IEmailUtils';

export class MessageService {
    public async getMessages(
        room: IRoom,
        read: IRead,
        user: IUser,
        params: ISummarizeParams,
        threadId?: string,
    ): Promise<IMessage[]> {
        try {
            // Re-implementing with a more robust logic inspired by Apps.Chat.Summarize
            // Get all recent messages from the room first
            const recentMessages = await read.getRoomReader().getMessages(room.id, {
                limit: 100, // Fetch a good number of recent messages to filter from
                sort: { createdAt: "desc" },
            });

            // If a threadId is provided, filter for that thread. Otherwise, use all messages.
            const targetMessages = threadId
                ? recentMessages.filter((msg) => msg.threadId === threadId || msg.id === threadId)
                : recentMessages;

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

            // Filter by participants/people if provided
            if (params.people && params.people.length > 0) {
                const cleanPeople = params.people.map(person => person.replace(/^@/, ''));
                filteredMessages = filteredMessages.filter((message) => {
                    return message.sender && cleanPeople.includes(message.sender.username);
                });
            }

            // If no specific date/user filters are applied, respect the default limit
            if (!params.start_date && !params.end_date && !params.people) {
                const defaultLimit = params.days ? filteredMessages.length : 25;
                filteredMessages = filteredMessages.slice(-defaultLimit);
            }

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