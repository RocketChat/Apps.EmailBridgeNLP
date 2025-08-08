import { PlaceholderStatus } from '../../enums/EmailPlaceholders';

export interface IRecipientInfo {
    email: string;
    name?: string;
    username?: string;
    realName?: string;
}

export interface IPlaceholderDetection {
    status: PlaceholderStatus;
    hasDatePlaceholder: boolean;
    hasNamePlaceholder: boolean;
    hasUsernamePlaceholder: boolean;
    hasUserPlaceholders: boolean;
}

export interface IPlaceholderEmailResult {
    success: boolean;
    message: string;
    individualEmailsSent?: number;
    failedEmails?: string[];
}
