/**
 * Interface definitions for cache-related functionality
 */

export interface ICachedUserData {
    email: string;
    name: string;
    username: string;
    avatarUrl?: string;
}

export interface IUserCacheData {
    users: ICachedUserData[];
    timestamp: Date;
    roomId: string;
    toolContext: string;
}

export interface IEmailContextData {
    toolContext?: string;
    isPlaceholderEnabled?: boolean;
    originalQuery?: string;
    timestamp?: Date;
}

export interface ICacheCleanupSchedule {
    roomId: string;
    scheduledAt: Date;
    ttlMinutes: number;
    cleanupType: 'time-based' | 'email-completion' | 'manual';
    status: 'scheduled' | 'completed' | 'cancelled';
}

export interface ICacheServiceOptions {
    defaultTTLMinutes?: number;
    enableAutoCleanup?: boolean;
    enableEmailContextTracking?: boolean;
}
