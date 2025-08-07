import { IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { SettingsIds } from '../config/Settings';

export class UserPermissionService {
    constructor(
        private readonly read: IRead,
        private readonly app: EmailBridgeNlpApp,
        private readonly currentUser: IUser,
        private readonly currentRoom: IRoom
    ) {}

    public async canUseBulkEmailTools(): Promise<{
        canUse: boolean;
        reason?: string;
        hasAdminRole?: boolean;
        isAllowedUser?: boolean;
    }> {
        try {
            // Check if user is a workspace admin
            if (this.hasGlobalAdminRole()) {
                return {
                    canUse: true,
                    hasAdminRole: true
                };
            }

            // Check if user is in the allowed users list
            if (await this.isUserInAllowedList()) {
                return {
                    canUse: true,
                    isAllowedUser: true
                };
            }

            // User is not authorized
            return {
                canUse: false
            };

        } catch (error) {
            this.app.getLogger().error('Error checking user permissions for bulk email:', error);
            return {
                canUse: false
            };
        }
    }

    private hasGlobalAdminRole(): boolean {
        return this.currentUser.roles && this.currentUser.roles.includes('admin');
    }

    private async isUserInAllowedList(): Promise<boolean> {
        try {
            const allowedUsersString = await this.read.getEnvironmentReader().getSettings().getValueById(SettingsIds.BulkEmailAllowedUsers);
            
            if (!allowedUsersString || typeof allowedUsersString !== 'string' || allowedUsersString.trim() === '') {
                return false;
            }

            // Parse the comma-separated list of usernames
            const allowedUsers = allowedUsersString
                .split(',')
                .map(username => username.trim())
                .filter(username => username.length > 0);

            // Check if current user's username is in the allowed list
            return allowedUsers.includes(this.currentUser.username);

        } catch (error) {
            this.app.getLogger().error('Error checking allowed users list:', error);
            return false;
        }
    }
}
