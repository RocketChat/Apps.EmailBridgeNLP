export interface ISendEmailData {
    to: string[];
    cc?: string[];
    subject: string;
    content: string;
}

export interface IMessage {
    id: string;
    sender: {
        username: string;
        name: string;
    };
    createdAt: Date | string;
    text: string;
}

export interface ISummarizeParams {
    start_date?: string;
    end_date?: string;
    people?: string[];
    days?: number;
    format?: 'bullet' | 'paragraph' | 'detailed' | 'brief';
}

export interface ISummarizeAndSendEmailData {
    to: string[];
    cc?: string[];
    start_date?: string;
    end_date?: string;
    people?: string[];
    subject?: string;
    format?: 'bullet' | 'paragraph' | 'detailed' | 'brief';
}
