import { IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUserWithEmail, IUserLookupResult } from '../definition/lib/IUserService';

export class UsernameService {
    constructor(private readonly read: IRead) {}

    public extractUsernamesFromQuery(query: string): string[] {
        const usernamePattern = /\s@([^\s]+)/g;
        const matches: string[] = [];
        let match;
        while ((match = usernamePattern.exec(query)) !== null) {
            matches.push(match[1]);
        }
        return [...new Set(matches)];
    }

    public async getUserByUsername(username: string): Promise<IUserWithEmail | null> {
        try {
            const user = await this.read.getUserReader().getByUsername(username);
            if (!user) return null;
            const primaryEmail = user.emails && user.emails.length > 0 ? user.emails[0].address : null;
            if (!primaryEmail) return null;
            return { username: user.username, email: primaryEmail };
        } catch {
            return null;
        }
    }

    public async getUsersByUsernames(usernames: string[]): Promise<IUserLookupResult> {
        const foundUsers: IUserWithEmail[] = [];
        const notFoundUsers: string[] = [];
        const usersWithoutEmail: string[] = [];
        for (const username of usernames) {
            try {
                const user = await this.read.getUserReader().getByUsername(username);
                if (!user) { notFoundUsers.push(username); continue; }
                const primaryEmail = user.emails && user.emails.length > 0 ? user.emails[0].address : null;
                if (!primaryEmail) { usersWithoutEmail.push(username); continue; }
                foundUsers.push({ username: user.username, email: primaryEmail });
            } catch {
                notFoundUsers.push(username);
            }
        }
        return { foundUsers, notFoundUsers, usersWithoutEmail };
    }

    public async enhanceQueryWithEmails(query: string): Promise<string> {
        const usernames = this.extractUsernamesFromQuery(query);
        if (usernames.length === 0) return query;
        const lookupResult = await this.getUsersByUsernames(usernames);
        let enhancedQuery = query;
        for (const user of lookupResult.foundUsers) {
            enhancedQuery = enhancedQuery.replace(
                new RegExp(`@${user.username}\\b`, 'g'),
                `@${user.username} [${user.email}]`
            );
        }
        for (const username of lookupResult.notFoundUsers.concat(lookupResult.usersWithoutEmail)) {
            enhancedQuery = enhancedQuery.replace(
                new RegExp(`@${username}\\b`, 'g'),
                `@${username} [ ]`
            );
        }
        return enhancedQuery;
    }

    public async getEmailsFromMentionedUsers(query: string): Promise<string[]> {
        const usernames = this.extractUsernamesFromQuery(query);
        const lookupResult = await this.getUsersByUsernames(usernames);
        return lookupResult.foundUsers.map(user => user.email);
    }

    public static extractEmailsFromEnhancedQuery(query: string): string[] {
        const emailPattern = /@[a-zA-Z0-9._-]+\s*\[([^\]]+@[^\]]+)\]/g;
        const emails: string[] = [];
        let match;
        while ((match = emailPattern.exec(query)) !== null) {
            const email = match[1].trim();
            if (email && !emails.includes(email)) {
                emails.push(email);
            }
        }
        return emails;
    }

    public static extractUsernameEmailPairs(query: string): Array<{ username: string; email: string }> {
        const pairPattern = /@([a-zA-Z0-9._-]+)\s*\[([^\]]+@[^\]]+)\]/g;
        const pairs: Array<{ username: string; email: string }> = [];
        let match;
        while ((match = pairPattern.exec(query)) !== null) {
            const username = match[1];
            const email = match[2].trim();
            if (username && email) {
                pairs.push({ username, email });
            }
        }
        return pairs;
    }

    public static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    public static filterValidEmails(emails: string[]): string[] {
        return emails.filter(email => this.isValidEmail(email));
    }

    public static removeDuplicateEmails(emails: string[]): string[] {
        return [...new Set(emails.map(email => email.toLowerCase()))];
    }
}
