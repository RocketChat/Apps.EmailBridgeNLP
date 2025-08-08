import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';
import { IPersistence, IPersistenceRead, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { 
    ICachedUserData, 
    IUserCacheData, 
    IEmailContextData, 
    ICacheCleanupSchedule,
    ICacheServiceOptions 
} from '../definition/lib/ICache';

export class CacheService {
    private readonly defaultTTLMinutes: number;
    private readonly enableAutoCleanup: boolean;
    private readonly enableEmailContextTracking: boolean;

    constructor(
        private readonly persistence: IPersistence,
        private readonly persistenceRead: IPersistenceRead,
        private readonly roomId: string,
        private readonly logger?: ILogger,
        options: ICacheServiceOptions = {}
    ) {
        this.defaultTTLMinutes = options.defaultTTLMinutes || 30;
        this.enableAutoCleanup = options.enableAutoCleanup !== false;
        this.enableEmailContextTracking = options.enableEmailContextTracking !== false;
    }

    public async cacheUserData(userData: ICachedUserData[], toolContext: string): Promise<void> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.ROOM,
            `${this.roomId}#user-cache`
        );

        const cacheData: IUserCacheData = {
            users: userData,
            timestamp: new Date(),
            roomId: this.roomId,
            toolContext
        };

        await this.persistence.updateByAssociation(association, cacheData, true);

        if (this.enableAutoCleanup) {
            await this.scheduleTimeBasedCleanup();
        }
    }

    public async getCachedUserData(): Promise<IUserCacheData | null> {
        try {
            const association = new RocketChatAssociationRecord(
                RocketChatAssociationModel.ROOM,
                `${this.roomId}#user-cache`
            );

            const result = await this.persistenceRead.readByAssociation(association);
            
            if (Array.isArray(result) && result.length > 0) {
                const data = result[0];
                if (data && typeof data === 'object' && 'users' in data && 'timestamp' in data && 'roomId' in data && 'toolContext' in data && Array.isArray(data.users)) {
                    return data as IUserCacheData;
                }
            } else if (result && !Array.isArray(result) && typeof result === 'object' && 'users' in result && 'timestamp' in result && 'roomId' in result && 'toolContext' in result && Array.isArray((result as any).users)) {
                return result as IUserCacheData;
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    public async getUserByEmail(email: string): Promise<ICachedUserData | null> {
        const cacheData = await this.getCachedUserData();
        if (!cacheData) {
            return null;
        }
        return cacheData.users.find(user => user.email === email) || null;
    }

    public async getCachedUsersMap(): Promise<Map<string, ICachedUserData> | null> {
        const cacheData = await this.getCachedUserData();
        if (!cacheData) {
            return null;
        }

        const userMap = new Map<string, ICachedUserData>();
        cacheData.users.forEach(user => {
            userMap.set(user.email, user);
        });
        return userMap;
    }

    public async isCacheFresh(maxAgeMinutes?: number): Promise<boolean> {
        const cacheData = await this.getCachedUserData();
        if (!cacheData) {
            return false;
        }

        const maxAge = maxAgeMinutes || this.defaultTTLMinutes;
        const cacheAge = Date.now() - new Date(cacheData.timestamp).getTime();
        const maxAgeMs = maxAge * 60 * 1000;
        
        return cacheAge < maxAgeMs;
    }

    public async storeEmailContext(contextData: IEmailContextData): Promise<void> {
        if (!this.enableEmailContextTracking) return;

        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.ROOM,
            `${this.roomId}#email-context`
        );

        const dataToStore: IEmailContextData = {
            ...contextData,
            timestamp: new Date()
        };

        await this.persistence.updateByAssociation(association, dataToStore, true);
    }

    public async getEmailContext(): Promise<IEmailContextData | null> {
        if (!this.enableEmailContextTracking) return null;

        try {
            const association = new RocketChatAssociationRecord(
                RocketChatAssociationModel.ROOM,
                `${this.roomId}#email-context`
            );

            const result = await this.persistenceRead.readByAssociation(association);
            
            if (Array.isArray(result) && result.length > 0) {
                const data = result[0];
                if (data && typeof data === 'object') {
                    return data as IEmailContextData;
                }
            } else if (result && !Array.isArray(result) && result && typeof result === 'object') {
                return result as IEmailContextData;
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    public async scheduleTimeBasedCleanup(ttlMinutes?: number): Promise<void> {
        if (!this.enableAutoCleanup) return;

        try {
            const association = new RocketChatAssociationRecord(
                RocketChatAssociationModel.ROOM,
                `${this.roomId}#cleanup-schedule`
            );

            const cleanupData: ICacheCleanupSchedule = {
                roomId: this.roomId,
                scheduledAt: new Date(),
                ttlMinutes: ttlMinutes || this.defaultTTLMinutes,
                cleanupType: 'time-based',
                status: 'scheduled'
            };

            await this.persistence.updateByAssociation(association, cleanupData, true);
        } catch (error) {
            // Silently handle scheduling errors
        }
    }

    public async cleanupAfterEmailCompletion(emailsSent: number, totalEmails: number): Promise<void> {
        if (!this.enableAutoCleanup) return;

        try {
            if (emailsSent >= totalEmails) {
                await this.clearAllCaches();
                
                try {
                    const association = new RocketChatAssociationRecord(
                        RocketChatAssociationModel.ROOM,
                        `${this.roomId}#cleanup-schedule`
                    );
                    await this.persistence.removeByAssociation(association);
                } catch (error) {
                    // Silently ignore cleanup errors
                }
            }
        } catch (error) {
            // Silently handle cleanup errors
        }
    }

    public async clearAllCaches(): Promise<void> {
        await Promise.all([
            this.clearUserCache(),
            this.clearEmailContext()
        ]);
    }

    public async clearUserCache(): Promise<void> {
        try {
            const association = new RocketChatAssociationRecord(
                RocketChatAssociationModel.ROOM,
                `${this.roomId}#user-cache`
            );
            await this.persistence.removeByAssociation(association);
        } catch (error) {
            // Silently ignore errors during cleanup
        }
    }

    public async clearEmailContext(): Promise<void> {
        if (!this.enableEmailContextTracking) return;

        try {
            const association = new RocketChatAssociationRecord(
                RocketChatAssociationModel.ROOM,
                `${this.roomId}#email-context`
            );
            await this.persistence.removeByAssociation(association);
        } catch (error) {
            // Silently ignore errors during cleanup
        }
    }

    public static isPlaceholderEnabledContext(toolContext?: string): boolean {
        if (!toolContext) return false;
        
        const placeholderEnabledTools = [
            'send-email-to-channel-or-team',
            'summarize-and-send-email-to-channel-or-team'
        ];
        
        return placeholderEnabledTools.includes(toolContext);
    }
}

export { ICachedUserData, IUserCacheData, IEmailContextData } from '../definition/lib/ICache';