import {
    IPersistence,
    IPersistenceRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IOAuthCredentials } from '../definition/lib/IOAuthCredentials';

export class OAuthStorage {
    constructor(
        private readonly persistence: IPersistence,
        private readonly persistenceRead: IPersistenceRead,
    ) {}

    /**
     * Get association records for OAuth credentials
     */
    private getCredentialsAssociations(userId: string): RocketChatAssociationRecord[] {
        return [
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.USER,
                userId,
            ),
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                'oauth-credentials',
            ),
        ];
    }

    /**
     * Get association records for OAuth state
     */
    private getStateAssociations(state: string): RocketChatAssociationRecord[] {
        return [
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                `oauth-state-${state}`,
            ),
        ];
    }

    /**
     * Save OAuth credentials for a user
     */
    public async saveCredentials(userId: string, credentials: IOAuthCredentials): Promise<void> {
        try {
            const associations = this.getCredentialsAssociations(userId);
            await this.persistence.updateByAssociations(associations, credentials, true);
        } catch (error) {
            console.warn('Save OAuth Credentials Error:', error);
            throw new Error('Failed to save OAuth credentials');
        }
    }

    /**
     * Get OAuth credentials for a user
     */
    public async getCredentials(userId: string): Promise<IOAuthCredentials | undefined> {
        try {
            const associations = this.getCredentialsAssociations(userId);
            const result = await this.persistenceRead.readByAssociations(associations);
            return result && result.length ? (result[0] as IOAuthCredentials) : undefined;
        } catch (error) {
            console.warn('Get OAuth Credentials Error:', error);
            return undefined;
        }
    }

    /**
     * Delete OAuth credentials for a user
     */
    public async deleteCredentials(userId: string): Promise<void> {
        try {
            const associations = this.getCredentialsAssociations(userId);
            await this.persistence.removeByAssociations(associations);
        } catch (error) {
            console.warn('Delete OAuth Credentials Error:', error);
            throw new Error('Failed to delete OAuth credentials');
        }
    }

    /**
     * Check if user has stored credentials
     */
    public async hasCredentials(userId: string): Promise<boolean> {
        const credentials = await this.getCredentials(userId);
        return credentials !== undefined && credentials.access_token !== undefined;
    }

    /**
     * Save OAuth state for security validation
     */
    public async saveState(state: string, userId: string): Promise<void> {
        try {
            const associations = this.getStateAssociations(state);
            const stateData = {
                userId,
                timestamp: Date.now(),
            };
            await this.persistence.updateByAssociations(associations, stateData, true);
        } catch (error) {
            console.warn('Save OAuth State Error:', error);
            throw new Error('Failed to save OAuth state');
        }
    }

    /**
     * Validate OAuth state and return user info
     */
    public async validateState(state: string): Promise<{ userId: string } | undefined> {
        try {
            const associations = this.getStateAssociations(state);
            const result = await this.persistenceRead.readByAssociations(associations);
            
            if (!result || !result.length) {
                return undefined;
            }

            const stateData = result[0] as { userId: string; timestamp: number };
            
            // Check if state is not too old (15 minutes)
            const maxAge = 15 * 60 * 1000; // 15 minutes
            if (Date.now() - stateData.timestamp > maxAge) {
                // Clean up expired state
                await this.persistence.removeByAssociations(associations);
                return undefined;
            }

            return { userId: stateData.userId };
        } catch (error) {
            console.warn('Validate OAuth State Error:', error);
            return undefined;
        }
    }

    /**
     * Clean up expired OAuth states (optional cleanup method)
     */
    public async cleanupExpiredStates(): Promise<void> {
        // This would require a more complex query to find all states
        // For now, states are cleaned up when validated and found to be expired
    }
} 