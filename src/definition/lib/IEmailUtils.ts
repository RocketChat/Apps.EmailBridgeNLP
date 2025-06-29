export interface ISendEmailData {
    to: string[];
    cc?: string[];
    subject: string;
    content: string;
}
