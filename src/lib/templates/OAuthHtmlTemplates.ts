export class OAuthHtmlTemplates {
    /**
     * Creates HTML for OAuth error page
     */
    public static createErrorPage(
        errorMessage?: string,
        isLocalhostSSLIssue = false
    ): string {

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EmailBridge NLP - Authentication Error</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #333;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }
        .error-icon {
            font-size: 72px;
            color: #e74c3c;
            margin-bottom: 20px;
        }
        h1 {
            color: #e74c3c;
            font-size: 28px;
            margin-bottom: 20px;
            font-weight: 600;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #666;
        }
        .error-details {
            background: #f8f9fa;
            border-left: 4px solid #e74c3c;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
            color: #333;
        }
        .troubleshooting {
            background: #e8f4fd;
            border-left: 4px solid #3498db;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
            border-radius: 4px;
        }
        .troubleshooting h3 {
            color: #3498db;
            margin-top: 0;
            font-size: 18px;
        }
        .troubleshooting ul {
            margin: 15px 0;
            padding-left: 20px;
        }
        .troubleshooting li {
            margin: 8px 0;
            line-height: 1.5;
        }
        code {
            background: #f1f1f1;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 12px;
        }
        .close-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .close-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">❌</div>
        <h1>Authentication Error</h1>
        ${errorMessage ? `<div class="error-details">${errorMessage}</div>` : ''}
        <p>Please try again or contact your administrator.</p>
        
        ${isLocalhostSSLIssue ? `
        <div class="troubleshooting">
            <h3>🔧 Localhost Development Issue</h3>
            <p><strong>For localhost testing:</strong></p>
            <ul>
                <li>In Azure Portal, add redirect URI with <strong>http://</strong> (not https) for localhost</li>
                <li>Example: <code>http://localhost:3000/api/apps/public/[app-id]/outlook-oauth-callback</code></li>
                <li>Make sure both HTTP and HTTPS versions are registered if needed</li>
                <li>Verify your Outlook OAuth settings in Rocket.Chat match exactly</li>
            </ul>
        </div>
        ` : ''}
        
        <button class="close-button" onclick="window.opener=null; window.open('', '_self'); window.close();">Close Window</button>
    </div>
</body>
</html>`;
    }

    /**
     * Creates HTML for OAuth success page
     */
    public static createSuccessPage(
        userEmail: string,
        provider: string
    ): string {

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EmailBridge NLP - Authentication Success</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: #333;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
            width: 100%;
        }
        .success-icon {
            font-size: 72px;
            color: #27ae60;
            margin-bottom: 20px;
            animation: bounce 1s infinite alternate;
        }
        @keyframes bounce {
            from { transform: translateY(0px); }
            to { transform: translateY(-10px); }
        }
        h1 {
            color: #27ae60;
            font-size: 28px;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .user-info {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            border: 2px solid #e9ecef;
        }
        .email {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin: 10px 0;
        }
        .provider {
            color: #7f8c8d;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #666;
        }
        .close-button {
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .close-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✅</div>
        <h1>Authentication Successful!</h1>
        
        <div class="user-info">
            <div class="provider">${provider}</div>
            <div class="email">${userEmail}</div>
        </div>
        
        <p>You have successfully connected your ${provider} account!</p>
        <p>You can now use EmailBridge NLP features in Rocket.Chat!</p>
        <p>You can safely close this window and return to Rocket.Chat.</p>
        
        <button class="close-button" onclick="window.opener=null; window.open('', '_self'); window.close();">Close Window</button>
    </div>
</body>
</html>`;
    }
}

// Legacy compatibility functions (deprecated but kept for backward compatibility)
export const oauthErrorHtml = (errorMessage: string): string => {
    const isSSLError = errorMessage.toLowerCase().includes('ssl') || errorMessage.toLowerCase().includes('protocol');
    const localhostTroubleshooting = isSSLError ? `
        <div class="troubleshooting">
            <h3>🔧 Localhost Development Issue</h3>
            <p><strong>For localhost testing:</strong></p>
            <ol style="text-align: left; max-width: 400px; margin: 0 auto;">
                <li>In Azure Portal, add redirect URI with <strong>http://</strong> (not https) for localhost</li>
                <li>Example: <code>http://localhost:3000/api/apps/public/[app-id]/outlook-oauth-callback</code></li>
                <li>Make sure both HTTP and HTTPS versions are registered if needed</li>
                <li>Verify your Outlook OAuth settings in Rocket.Chat match exactly</li>
            </ol>
        </div>
    ` : '';

    return `<!DOCTYPE html>
<html>
<head>
    <title>EmailBridge NLP - Authentication Error</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 600px;
            text-align: center;
        }
        h1 {
            color: #e74c3c;
            margin-bottom: 20px;
            font-size: 28px;
        }
        h3 {
            color: #3498db;
            margin: 20px 0 10px 0;
            font-size: 20px;
        }
        p {
            color: #444;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        ol {
            color: #444;
            font-size: 14px;
            line-height: 1.6;
        }
        code {
            background-color: #f8f9fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 12px;
        }
        .error-icon {
            font-size: 72px;
            margin-bottom: 20px;
            color: #e74c3c;
        }
        .troubleshooting {
            background-color: #f8f9fa;
            border-left: 4px solid #3498db;
            padding: 20px;
            margin: 20px 0;
            border-radius: 6px;
        }
        .close-button {
            margin-top: 30px;
            background-color: #e74c3c;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
        }
        .close-button:hover {
            background-color: #c0392b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">❌</div>
        <h1>Authentication Error</h1>
        <p><strong>${errorMessage}</strong></p>
        ${localhostTroubleshooting}
        <p>Please try again or contact your administrator.</p>
        <button class="close-button" onclick="window.opener=null; window.open('', '_self'); window.close();">Close Window</button>
    </div>
</body>
</html>`
};

export const oauthSuccessHtml = (email: string, provider: string = 'Gmail'): string => `<!DOCTYPE html>
<html>
<head>
    <title>EmailBridge NLP - Authentication Success</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 500px;
            text-align: center;
        }
        h1 {
            color: #27ae60;
            margin-bottom: 20px;
            font-size: 28px;
        }
        p {
            color: #444;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        .success-icon {
            font-size: 72px;
            margin-bottom: 20px;
            color: #27ae60;
        }
        .email {
            background-color: #f8f9fa;
            padding: 10px 15px;
            border-radius: 6px;
            font-weight: 600;
            color: #2c3e50;
            margin: 20px 0;
        }
        .close-button {
            margin-top: 30px;
            background-color: #27ae60;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
        }
        .close-button:hover {
            background-color: #229954;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✅</div>
        <h1>Authentication Successful!</h1>
        <p>You have successfully connected your ${provider} account:</p>
        <div class="email">${email}</div>
        <p>You can now use EmailBridge NLP features in Rocket.Chat!</p>
        <p>You can safely close this window and return to Rocket.Chat.</p>
        <button class="close-button" onclick="window.opener=null; window.open('', '_self'); window.close();">Close Window</button>
    </div>
</body>
</html>`; 