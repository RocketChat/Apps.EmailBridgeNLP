# Authentication & API Configuration Guide

This guide helps administrators obtain all necessary API keys and configure authentication for the EmailBridge NLP app.

## 📧 Email Provider Configuration

### Gmail / Google Workspace Setup

#### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Gmail API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API" 
   - Click "Enable"

#### 2. Configure OAuth 2.0
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure OAuth consent screen if prompted:
   - User Type: External (for general use) or Internal (for workspace)
   - Fill required fields (App name, User support email, Developer email)
   - Add scopes: `https://www.googleapis.com/auth/gmail.readonly`, `https://www.googleapis.com/auth/gmail.send`
4. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: "EmailBridge NLP - Gmail"
   - Authorized redirect URIs: `https://your-rocketchat-server.com/api/apps/public/[app-id]/google-oauth-callback`

#### 3. Get Credentials
- Copy **Client ID** and **Client Secret**
- Configure these in Rocket.Chat App Settings under "Google OAuth"

### Outlook / Microsoft 365 Setup

#### 1. Register Application in Azure Portal
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "App registrations"
3. Click "New registration"
4. Configure:
   - Name: "EmailBridge NLP - Outlook"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: Web - `https://your-rocketchat-server.com/api/apps/public/[app-id]/outlook-oauth-callback`

#### 2. Configure API Permissions
1. Go to "API permissions" in your app registration
2. Add permissions:
   - **Microsoft Graph** > **Delegated permissions**:
     - `Mail.Read` - Read user mail
     - `Mail.Send` - Send mail as a user
     - `User.Read` - Sign in and read user profile
3. Click "Grant admin consent" (if you're an admin)

#### 3. Create Client Secret
1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Add description and set expiration
4. Copy the **Value** (not the Secret ID)

#### 4. Get Application Details
- Copy **Application (client) ID** from "Overview" page
- Copy **Client Secret** from previous step
- Configure these in Rocket.Chat App Settings under "Outlook OAuth"

## 🤖 LLM Provider Configuration

### OpenAI Setup

#### 1. Create OpenAI Account
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or sign in to your account
3. Go to [API Keys page](https://platform.openai.com/api-keys)

#### 2. Generate API Key
1. Click "Create new secret key"
2. Give it a name (e.g., "EmailBridge NLP")
3. Copy the API key (starts with `sk-`)
4. **Important**: Store this key securely - you won't be able to see it again

#### 3. Configure Billing (Required)
1. Go to [Billing page](https://platform.openai.com/account/billing)
2. Add payment method
3. Set usage limits if desired

#### 4. App Configuration
- Configure the API key in Rocket.Chat App Settings under "LLM Configuration"
- Or users can configure personal API keys via `/email llm-config`

### Google Gemini Setup

#### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key"
4. Create new API key or use existing project
5. Copy the API key

#### 2. App Configuration
- Configure the API key in Rocket.Chat App Settings under "LLM Configuration"
- Or users can configure personal API keys via `/email llm-config`

### Groq Setup

#### 1. Create Groq Account
1. Go to [Groq Console](https://console.groq.com/)
2. Sign up with your account
3. Go to API Keys section

#### 2. Generate API Key
1. Click "Create API Key"
2. Give it a name
3. Copy the generated key
4. Store securely

#### 3. App Configuration
- Configure the API key in Rocket.Chat App Settings under "LLM Configuration"
- Or users can configure personal API keys via `/email llm-config`

### Self-Hosted LLM Setup

#### 1. Supported Formats
The app supports OpenAI-compatible APIs, including:
- **Ollama** (with OpenAI compatibility layer)
- **LocalAI**
- **OpenAI-compatible servers**
- **Custom LLM APIs**

#### 2. Requirements
- Your LLM server must support OpenAI-compatible chat completions endpoint
- Endpoint format: `POST /v1/chat/completions`
- JSON request/response format matching OpenAI specification

#### 3. Configuration
1. In app settings or via `/email llm-config`, set:
   - **Provider**: Self-hosted
   - **URL**: Your LLM server URL (e.g., `http://localhost:11434` for Ollama)
2. The app will automatically append `/v1/chat/completions` if needed

#### 4. Example URLs
- **Ollama**: `http://localhost:11434`
- **LocalAI**: `http://localhost:8080`
- **Custom server**: `https://your-llm-server.com:8000`

## 🔧 Rocket.Chat App Configuration

### Admin Settings
1. Go to Administration > Apps > EmailBridge NLP > Settings
2. Configure global settings:
   - **Google OAuth Client ID & Secret**
   - **Outlook OAuth Client ID & Secret** 
   - **Default LLM Provider**
   - **Default LLM API Keys**

### User Settings
Users can override admin settings with personal configurations:
- Use `/email config` for email provider preferences
- Use `/email llm-config` for personal LLM settings

## 🔒 Security Best Practices

### API Key Management
- **Never commit API keys to version control**
- Use environment variables or secure storage
- Rotate keys regularly
- Monitor API usage and costs
- Set usage limits where possible

### OAuth Configuration
- Use HTTPS for all redirect URIs
- Verify redirect URI matches exactly
- Configure appropriate scopes (minimum required)
- Review and audit OAuth permissions regularly

### App Permissions
- Grant minimum required permissions
- Review user access regularly
- Monitor API usage logs
- Configure rate limiting if available

## 🆘 Troubleshooting

### Common Issues

#### "Invalid API Key" Errors
- Verify API key is correct and not expired
- Check if billing is configured (OpenAI)
- Ensure API key has required permissions

#### OAuth Redirect Errors
- Verify redirect URI matches exactly (including http/https)
- Check app ID in the callback URL
- Ensure OAuth app is approved/published

#### "Rate Limit Exceeded"
- Check API usage limits
- Upgrade plan if needed
- Implement usage monitoring

#### Self-hosted LLM Connection Issues
- Verify server is running and accessible
- Check URL format and endpoint availability
- Test with curl/Postman first
- Review server logs for errors

### Getting Help
- Check Rocket.Chat app logs in Administration > View Logs
- Enable debug logging in app settings
- Review provider-specific documentation
- Open GitHub issue with detailed error information

## 📋 Quick Setup Checklist

### For Gmail Integration:
- [ ] Google Cloud project created
- [ ] Gmail API enabled
- [ ] OAuth 2.0 credentials configured
- [ ] Redirect URI added with correct app ID
- [ ] Client ID & Secret added to app settings

### For Outlook Integration:
- [ ] Azure app registration created
- [ ] Microsoft Graph permissions configured
- [ ] Client secret generated
- [ ] Application ID & Secret added to app settings

### For LLM Integration:
- [ ] LLM provider account created
- [ ] API key generated
- [ ] Billing configured (if required)
- [ ] API key added to app settings or user config
- [ ] Test query executed successfully

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Azure Portal](https://portal.azure.com/)
- [OpenAI Platform](https://platform.openai.com/)
- [Google AI Studio](https://aistudio.google.com/)
- [Groq Console](https://console.groq.com/)
- [Rocket.Chat Apps Documentation](https://docs.rocket.chat/extend-rocket.chat/rocket.chat-marketplace/rocket.chat-public-apps-guides) 