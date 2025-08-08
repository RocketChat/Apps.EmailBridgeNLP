export interface IChannelMember {
    _id: string;
    username: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
}

export interface IChannelMemberResult {
    success: boolean;
    members: IChannelMember[];
    channelName: string;
    error?: string;
    permissionError?: string;
}

export interface IChannelService {
    getChannelMembers(channelName: string): Promise<IChannelMemberResult>;
    extractChannelNamesFromQuery(query: string): string[];
}