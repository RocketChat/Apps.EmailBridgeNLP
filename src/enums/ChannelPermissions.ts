export enum ChannelPermissions {
    VIEW_C_ROOM = 'view-c-room',
    VIEW_JOINED_ROOM = 'view-joined-room',
    VIEW_BROADCAST_MEMBER_LIST = 'view-broadcast-member-list',
    VIEW_FULL_OTHER_USER_INFO = 'view-full-other-user-info',
    VIEW_OUTSIDE_ROOM = 'view-outside-room'
}

export enum RocketChatAPIEndpoints {
    CHANNELS_MEMBERS = '/api/v1/channels.members',
    GROUPS_MEMBERS = '/api/v1/groups.members',
    USERS_INFO = '/api/v1/users.info'
}

export enum PermissionErrorCodes {
    UNAUTHORIZED = 401,
    FORBIDDEN = 403
}