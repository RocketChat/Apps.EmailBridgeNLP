export const oauthErrorHtml = (errorMessage: string): string => `<!DOCTYPE html>
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
            color: #e74c3c;
            margin-bottom: 20px;
            font-size: 28px;
        }
        p {
            color: #444;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        .error-icon {
            font-size: 72px;
            margin-bottom: 20px;
            color: #e74c3c;
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
        <p>Please try again or contact your administrator.</p>
        <button class="close-button" onclick="window.close()">Close Window</button>
    </div>
</body>
</html>`;

export const oauthSuccessHtml = (email: string): string => `<!DOCTYPE html>
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
        <p>You have successfully connected your Gmail account:</p>
        <div class="email">${email}</div>
        <p>You can now use EmailBridge NLP features in Rocket.Chat!</p>
        <p>You can safely close this window and return to Rocket.Chat.</p>
        <button class="close-button" onclick="window.close()">Close Window</button>
    </div>
</body>
</html>`; 