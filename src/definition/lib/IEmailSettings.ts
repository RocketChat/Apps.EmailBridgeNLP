import { EmailProviders } from '../../enums/EmailProviders';

export interface IEmailSettings {
    email: string;
    provider: EmailProviders;
} 