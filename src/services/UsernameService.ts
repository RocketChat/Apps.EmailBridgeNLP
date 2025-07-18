import { IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IUserWithEmail, IUserLookupResult } from '../definition/lib/IUserService';

export interface IUserWithEmailAndAvatar {
    username: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    fallbackAvatarUrl?: string;
}

export class UsernameService {
    private read: IRead;

    constructor(read: IRead) {
        this.read = read;
    }

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

    private generateAvatarUrl(username: string): string {
        // Use the standard Rocket.Chat avatar URL pattern
        // This will work with most Rocket.Chat installations
        return `/avatar/${username}`;
    }

    private generateFallbackAvatarUrl(name: string, username: string): string {
        // Create a fallback avatar URL with first letter and background color
        // This mimics Rocket.Chat's default avatar behavior
        const displayName = name || username;
        const firstLetter = displayName.charAt(0).toUpperCase();
        
        // Generate a consistent color based on the username
        const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
        const colorIndex = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        const backgroundColor = colors[colorIndex];
        
        // Create a data URL for a simple avatar with first letter
        const canvas = this.createSimpleAvatar(firstLetter, backgroundColor);
        return canvas;
    }

    private createSimpleAvatar(letter: string, backgroundColor: string): string {
        // Create a simple SVG avatar as data URL
        const svg = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="${backgroundColor}" rx="16"/><text x="16" y="20" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="white">${letter}</text></svg>`;
        
        // Use URL encode approach which is more universally supported
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    public async getUserWithAvatarByUsername(username: string): Promise<IUserWithEmailAndAvatar | null> {
        try {
            const user = await this.read.getUserReader().getByUsername(username);
            if (!user) return null;
            const primaryEmail = user.emails && user.emails.length > 0 ? user.emails[0].address : null;
            if (!primaryEmail) return null;
            
            // Try to use Rocket.Chat avatar first, fallback to generated avatar
            const avatarUrl = this.generateAvatarUrl(user.username);
            const fallbackAvatarUrl = this.generateFallbackAvatarUrl(user.name, user.username);
            
            return { 
                username: user.username, 
                email: primaryEmail,
                name: user.name,
                avatarUrl: avatarUrl,
                fallbackAvatarUrl: fallbackAvatarUrl
            };
        } catch {
            return null;
        }
    }

    public async getEmailToUserAvatarMap(emails: string[]): Promise<Map<string, IUserWithEmailAndAvatar>> {
        const emailToUserMap = new Map<string, IUserWithEmailAndAvatar>();
        
        // For now, we'll use a simple approach that tries to match known users
        // This could be enhanced with a proper email-to-user mapping in the future
        
        for (const email of emails) {
            // Try to extract potential username from email (simple heuristic)
            const potentialUsername = email.split('@')[0];
            
            try {
                const user = await this.read.getUserReader().getByUsername(potentialUsername);
                if (user && user.emails && user.emails.some(e => e.address === email)) {
                    // Try to use Rocket.Chat avatar first, fallback to generated avatar
                    const avatarUrl = this.generateAvatarUrl(user.username);
                    const fallbackAvatarUrl = this.generateFallbackAvatarUrl(user.name, user.username);
                    
                    emailToUserMap.set(email, {
                        username: user.username,
                        email: email,
                        name: user.name,
                        avatarUrl: avatarUrl,
                        fallbackAvatarUrl: fallbackAvatarUrl
                    });
                }
            } catch (error) {
                // If user lookup fails, continue with other emails
                continue;
            }
        }
        
        return emailToUserMap;
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

    public async formatRecipientsForDisplay(emailData: any, enhancedQuery: string): Promise<string> {
        const usernamePairs = UsernameService.extractUsernameEmailPairs(enhancedQuery);
        const allEmails = [...(emailData.to || []), ...(emailData.cc || [])];
        
        const formattedRecipients: string[] = [];
        const emailsWithUsernames = new Set(usernamePairs.map(pair => pair.email));
        
        // Format username-email pairs as "RealName (email)" using actual RocketChat user data
        for (const pair of usernamePairs) {
            try {
                // Get the full user object directly from RocketChat
                const user = await this.read.getUserReader().getByUsername(pair.username);
                let displayName = pair.username; // fallback to username
                
                if (user) {
                    // Use real name if available, otherwise use username
                    displayName = user.name || user.username;
                }
                
                formattedRecipients.push(`${displayName} (${pair.email})`);
            } catch (error) {
                // If user lookup fails, fallback to username
                formattedRecipients.push(`${pair.username} (${pair.email})`);
            }
        }
        
        // Add direct emails that don't have associated usernames
        for (const email of allEmails) {
            if (!emailsWithUsernames.has(email)) {
                formattedRecipients.push(email);
            }
        }
        
        // Format the final string
        if (formattedRecipients.length === 0) {
            return '';
        } else if (formattedRecipients.length === 1) {
            return formattedRecipients[0];
        } else if (formattedRecipients.length === 2) {
            return `${formattedRecipients[0]} and ${formattedRecipients[1]}`;
        } else {
            const lastRecipient = formattedRecipients.pop();
            return `${formattedRecipients.join(', ')} and ${lastRecipient}`;
        }
    }
}
