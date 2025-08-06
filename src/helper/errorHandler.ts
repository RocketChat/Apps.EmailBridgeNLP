import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';
import { t, Language } from '../lib/Translation/translation';
import { Translations } from '../constants/Translations';

export async function handleError(
    app: EmailBridgeNlpApp,
    read: IRead,
    modify: IModify,
    user: IUser,
    room: IRoom,
    language: Language,
    context: string,
    error: Error,
): Promise<void> {
    app.getLogger().error(`${context} error:`, error);

    const userMessage = categorizeError(error, language);

    const appUser = (await read.getUserReader().getAppUser()) as IUser;
    const messageBuilder = modify
        .getCreator()
        .startMessage()
        .setSender(appUser)
        .setRoom(room)
        .setGroupable(false)
        .setText(userMessage);

    return read.getNotifier().notifyUser(user, messageBuilder.getMessage());
}

export function handleErrorAndGetMessage(
    app: EmailBridgeNlpApp,
    language: Language,
    context: string,
    error: Error,
): string {
    app.getLogger().error(`${context} error:`, error);

    return categorizeError(error, language);
}

export function handleLLMErrorAndGetMessage(
    app: EmailBridgeNlpApp,
    context: string,
    error: any,
    language?: Language,
): string {
    app.getLogger().error(`${context} error:`, error);

    // Check if this is a recipient limit error (should be shown directly to user)
    const errorMessage = error.message?.toLowerCase() || '';
    if (errorMessage.includes('recipients') && (errorMessage.includes('limit') || errorMessage.includes('maximum'))) {
        return error.message; // Return the original limit error message
    }

    // Check if this is a channel/permission error (should be shown directly to user)
    if (errorMessage.includes('permission') || errorMessage.includes('channel') || errorMessage.includes('team')) {
        return error.message; // Return the original error message
    }

    // Check if this is a summary-related error (should be shown directly to user)
    if (errorMessage.includes('summarize') || errorMessage.includes('summary') || errorMessage.includes('messages found') || 
        errorMessage.includes('no messages') || errorMessage.includes('failed to generate summary')) {
        return error.message; // Return the original error message
    }

    // Check if this is a timeout or network error that shouldn't be attributed to API key
    if (errorMessage.includes('timeout') || errorMessage.includes('econnreset') || errorMessage.includes('enotfound')) {
        return 'Network connection issue. Please try again.';
    }

    // Get status code from HTTP response
    const statusCode = error.statusCode || error.response?.status || error.status;
    
    if (statusCode) {
        return `${statusCode} error`;
    }
    
    return t(Translations.LLM_API_OR_URL_ERROR, language);
}

function categorizeError(error: Error, language: Language): string {
    const errorMessage = error.message?.toLowerCase() || '';

    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        return t(Translations.ERROR_NETWORK_FAILURE, language);
    }

    if (errorMessage.includes('auth') || errorMessage.includes('token') || errorMessage.includes('unauthorized')) {
        return t(Translations.ERROR_TOKEN_EXPIRED, language, { provider: 'your email provider' });
    }

    if (errorMessage.includes('configuration') || errorMessage.includes('settings') || errorMessage.includes('config')) {
        return t(Translations.ERROR_MISSING_CONFIGURATION, language);
    }

    if (errorMessage.includes('permission') || errorMessage.includes('forbidden') || errorMessage.includes('access denied')) {
        return t(Translations.ERROR_PERMISSION_DENIED, language);
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
        return t(Translations.ERROR_RATE_LIMIT_EXCEEDED, language);
    }

    if (errorMessage.includes('service unavailable') || errorMessage.includes('server error') || errorMessage.includes('503')) {
        return t(Translations.ERROR_SERVICE_UNAVAILABLE, language);
    }

    if (errorMessage.includes('trigger')) {
        return t(Translations.ERROR_TRIGGER_ID_MISSING, language);
    }

    if (errorMessage.includes('modal')) {
        return t(Translations.ERROR_MODAL_CREATION_FAILED, language);
    }

    if (errorMessage.includes('login') || error.message?.includes('Login')) {
        return t(Translations.ERROR_PROCESSING_LOGIN, language, { error: t(Translations.ERROR_PLEASE_TRY_AGAIN, language) });
    }

    if (errorMessage.includes('logout') || error.message?.includes('Logout')) {
        return t(Translations.ERROR_PREPARING_LOGOUT, language, { error: t(Translations.ERROR_PLEASE_TRY_AGAIN, language) });
    }

    if (errorMessage.includes('stats') || error.message?.includes('Stats')) {
        return t(Translations.STATS_ERROR, language, { error: t(Translations.ERROR_PLEASE_TRY_AGAIN, language) });
    }

    if (errorMessage.includes('config') || error.message?.includes('Config')) {
        return t(Translations.CONFIG_ERROR, language, { error: t(Translations.ERROR_PLEASE_TRY_AGAIN, language) });
    }

    // Generic fallback
    return t(Translations.ERROR_FAIL_INTERNAL, language);
} 