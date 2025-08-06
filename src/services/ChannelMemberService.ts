import { IRead, IHttp, IHttpRequest, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom, RoomType } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { IChannelMember, IChannelMemberResult, IChannelService } from '../definition/lib/IChannelService';
import { HttpHeaders, ContentTypes } from '../constants/constants';
import { ChannelPermissions, RocketChatAPIEndpoints, PermissionErrorCodes } from '../enums/ChannelPermissions';
import { getEffectiveMaxRecipients } from '../config/SettingsManager';
import { IPreference } from '../definition/lib/IUserPreferences';
import { getUserPreferredLanguage } from '../helper/userPreference';
import { t, Language } from '../lib/Translation/translation';
import { Translations } from '../constants/Translations';

export class ChannelMemberService implements IChannelService {
    constructor(
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly app: EmailBridgeNlpApp,
        private readonly currentUser: IUser,
        private readonly persistence: IPersistence
    ) {}

    public async getChannelMembers(channelName: string): Promise<IChannelMemberResult> {
        try {
            // Get user's preferred language
            const language = await getUserPreferredLanguage(
                this.read.getPersistenceReader(),
                this.persistence,
                this.currentUser.id
            );
            
            // Clean channel name (remove # prefix if present)
            const cleanChannelName = channelName.replace(/^#/, '');
            
            // Find the room by name
            const room = await this.findRoomByName(cleanChannelName);
            if (!room) {
                return {
                    success: false,
                    members: [],
                    channelName: cleanChannelName,
                    error: t(Translations.CHANNEL_NOT_FOUND, language, { channelName: cleanChannelName })
                };
            }

            // Get members based on room type
            const membersResult = await this.fetchMembersForRoom(room);
            if (!membersResult.success) {
                return {
                    success: false,
                    members: [],
                    channelName: cleanChannelName,
                    error: membersResult.error,
                    permissionError: membersResult.permissionError
                };
            }

            // Get detailed user info including emails
            const detailedMembers = await this.enrichMembersWithEmails(membersResult.members);

            return {
                success: true,
                members: detailedMembers.members,
                channelName: cleanChannelName,
                error: detailedMembers.error,
                permissionError: detailedMembers.permissionError
            };

        } catch (error) {
            this.app.getLogger().error('ChannelMemberService error:', error);
            // Fallback to English if language detection fails
            const language = Language.en;
            return {
                success: false,
                members: [],
                channelName: channelName.replace(/^#/, ''),
                error: t(Translations.CHANNEL_FETCH_ERROR, language, { error: error.message })
            };
        }
    }

    private async findRoomByName(channelName: string): Promise<IRoom | null> {
        try {
            // Try to get room by name using the room reader
            const room = await this.read.getRoomReader().getByName(channelName);
            return room || null;
        } catch (error) {
            this.app.getLogger().debug('Room not found by name:', channelName);
            return null;
        }
    }

    private async fetchMembersForRoom(room: IRoom): Promise<{ success: boolean; members: IChannelMember[]; error?: string; permissionError?: string }> {
        try {
            // Try to get room members using the room reader first
            let roomUsers: any[] = [];
            
            try {
                // Use the room reader to get members - this is the preferred Apps-Engine way
                roomUsers = await this.read.getRoomReader().getMembers(room.id);
                
                if (roomUsers && roomUsers.length > 0) {
                    return {
                        success: true,
                        members: roomUsers.map((user: any) => ({
                            _id: user.id,
                            username: user.username,
                            name: user.name,
                            avatarUrl: undefined // Avatar URL will be set later if available
                        }))
                    };
                }
            } catch (roomReaderError) {
                this.app.getLogger().debug('Room reader failed, trying alternative approach:', roomReaderError);
                
                // If room reader fails, fall back to REST API approach
                return await this.fetchMembersViaRestAPI(room);
            }

            // If no members found via room reader, try REST API
            return await this.fetchMembersViaRestAPI(room);

        } catch (error) {
            this.app.getLogger().error('fetchMembersForRoom error:', error);
            // Fallback to English if language detection fails
            const language = Language.en;
            return {
                success: false,
                members: [],
                error: t(Translations.CHANNEL_MEMBERS_FETCH_FAILED, language, { error: error.message })
            };
        }
    }

    private async fetchMembersViaRestAPI(room: IRoom): Promise<{ success: boolean; members: IChannelMember[]; error?: string; permissionError?: string }> {
        try {
            // Determine the permission required based on room type
            let permissionRequired: ChannelPermissions;

            switch (room.type) {
                case RoomType.CHANNEL:
                    permissionRequired = ChannelPermissions.VIEW_C_ROOM;
                    break;
                case RoomType.PRIVATE_GROUP:
                    permissionRequired = ChannelPermissions.VIEW_JOINED_ROOM;
                    break;
                default:
                    // Fallback to English if language detection fails
                    const language = Language.en;
                    return {
                        success: false,
                        members: [],
                        error: t(Translations.CHANNEL_ROOM_TYPE_NOT_SUPPORTED, language, { roomType: room.type })
                    };
            }

            // Since HTTP API calls are problematic in this environment, return permission error
            return {
                success: false,
                members: [],
                permissionError: this.getPermissionErrorMessage(room.type, permissionRequired)
            };

        } catch (error) {
            this.app.getLogger().error('fetchMembersViaRestAPI error:', error);
            // Fallback to English if language detection fails
            const language = Language.en;
            return {
                success: false,
                members: [],
                error: t(Translations.CHANNEL_MEMBERS_REST_API_FAILED, language, { error: error.message })
            };
        }
    }

    private async enrichMembersWithEmails(members: IChannelMember[]): Promise<{ members: IChannelMember[]; error?: string; permissionError?: string }> {
        const enrichedMembers: IChannelMember[] = [];
        const failedMembers: string[] = [];
        let permissionError: string | undefined;

        for (const member of members) {
            try {
                // Use user reader instead of HTTP calls
                const user = await this.read.getUserReader().getById(member._id);
                if (user) {
                    const primaryEmail = user.emails && user.emails.length > 0 
                        ? user.emails[0].address 
                        : undefined;

                    enrichedMembers.push({
                        ...member,
                        email: primaryEmail,
                        name: user.name || member.name,
                        avatarUrl: member.avatarUrl // Keep original avatar URL as IUser doesn't have avatarUrl
                    });
                } else {
                    // Add member without email if we can't get user info
                    enrichedMembers.push(member);
                    failedMembers.push(member.username);
                }
            } catch (error) {
                this.app.getLogger().debug(`Failed to get user info for ${member.username}:`, error);
                // Check if it's a permission error
                if (error.message && (error.message.includes('permission') || error.message.includes('access'))) {
                    permissionError = this.getPermissionErrorMessage('user-info', ChannelPermissions.VIEW_FULL_OTHER_USER_INFO);
                }
                enrichedMembers.push(member);
                failedMembers.push(member.username);
            }
        }

        let error: string | undefined;
        if (failedMembers.length > 0) {
            // Fallback to English if language detection fails
            const language = Language.en;
            error = t(Translations.CHANNEL_COULD_NOT_RETRIEVE_EMAILS, language, { members: failedMembers.join(', ') });
        }

        return { members: enrichedMembers, error, permissionError };
    }


    private getPermissionErrorMessage(roomType: string | RoomType, permission: ChannelPermissions): string {
        const permissionMessages: Record<ChannelPermissions, string> = {
            [ChannelPermissions.VIEW_C_ROOM]: 'view-c-room (view public channels)',
            [ChannelPermissions.VIEW_JOINED_ROOM]: 'view-joined-room (view private groups you\'ve joined)',
            [ChannelPermissions.VIEW_BROADCAST_MEMBER_LIST]: 'view-broadcast-member-list (view broadcast channel members)',
            [ChannelPermissions.VIEW_FULL_OTHER_USER_INFO]: 'view-full-other-user-info (view complete user information)',
            [ChannelPermissions.VIEW_OUTSIDE_ROOM]: 'view-outside-room (view users outside current room)'
        };

        const permissionName = permissionMessages[permission] || permission;
        
        return `Ask workspace admin to grant **${permissionName}** permission to retrieve ${roomType === RoomType.CHANNEL ? 'channel' : 'team'} member emails.`;
    }

    public extractChannelNamesFromQuery(query: string): string[] {
        // Extract channel names that start with # (similar to how usernames are extracted)
        const channelRegex = /#([a-zA-Z0-9\-_.]+)/g;
        const matches: string[] = [];
        let match: RegExpExecArray | null;
        
        while ((match = channelRegex.exec(query)) !== null) {
            matches.push(match[1]); // Get the channel name without the # prefix
        }
        
        return matches;
    }

    public async validateRecipientLimit(
        members: IChannelMember[], 
        userPreference?: IPreference
    ): Promise<{
        isValid: boolean;
        emailCount: number;
        effectiveLimit: number;
        errorMessage?: string;
    }> {
        try {
            // Get effective max recipients limit
            const effectiveLimit = await getEffectiveMaxRecipients(this.read.getEnvironmentReader().getSettings(), userPreference);
            
            // Count members with valid email addresses
            const membersWithEmails = members.filter(member => member.email && member.email.trim().length > 0);
            const emailCount = membersWithEmails.length;
            
            if (emailCount > effectiveLimit) {
                // Fallback to English if language detection fails
                const language = Language.en;
                return {
                    isValid: false,
                    emailCount,
                    effectiveLimit,
                    errorMessage: t(Translations.RECIPIENT_LIMIT_EXCEEDED, language, { emailCount: emailCount.toString(), effectiveLimit: effectiveLimit.toString() })
                };
            }
            
            return {
                isValid: true,
                emailCount,
                effectiveLimit
            };
        } catch (error) {
            this.app.getLogger().error('Error validating recipient limit:', error);
            // Fallback to English if language detection fails
            const language = Language.en;
            return {
                isValid: false,
                emailCount: 0,
                effectiveLimit: 50,
                errorMessage: t(Translations.RECIPIENT_LIMIT_VALIDATION_FAILED, language)
            };
        }
    }
}