export const en = {
    // Settings
    Email_Provider_Label: "Email Provider",
    Email_Provider_Description: "Select your email service provider for authentication",
    Gmail_Label: "Gmail",
    Outlook_Label: "Outlook/Hotmail",
    Google_OAuth_Client_ID_Label: "Google OAuth Client ID",
    Google_OAuth_Client_ID_Description: "OAuth client ID for Google authentication (Gmail only)",
    Google_OAuth_Client_Secret_Label: "Google OAuth Client Secret",
    Google_OAuth_Client_Secret_Description: "OAuth client secret for Google authentication (Gmail only)",
    OAuth_Redirect_URI_Label: "OAuth Redirect URI",
    OAuth_Redirect_URI_Description: "OAuth redirect URI - should end with /api/apps/public/[app-id]/oauth-callback",

    // Outlook OAuth Settings
    Outlook_OAuth_Client_ID_Label: "Outlook OAuth Client ID",
    Outlook_OAuth_Client_ID_Description: "OAuth client ID for Outlook/Microsoft authentication",
    Outlook_OAuth_Client_Secret_Label: "Outlook OAuth Client Secret",
    Outlook_OAuth_Client_Secret_Description: "OAuth client secret for Outlook/Microsoft authentication",
    Outlook_OAuth_Redirect_URI_Label: "Outlook OAuth Redirect URI",
    Outlook_OAuth_Redirect_URI_Description: "OAuth redirect URI for Outlook - should end with /api/apps/public/[app-id]/oauth-callback",

    // Commands
    Email_Command_Params: "connect, status, disconnect, help, report",
    Email_Command_Description: "Connect and manage your email account integration with AI assistance.",

    // OAuth Pages
    Authentication_Error_Title: "Authentication Error",
    Authentication_Success_Title: "Authentication Successful!",
    Connected_Account_Message: "You have successfully connected your Gmail account:",
    Try_Again_Message: "Please try again or contact your administrator.",
    Close_Window_Label: "Close Window",
    Features_Available_Message: "You can now use Email Assistant features in Rocket.Chat!",
    Safe_To_Close_Message: "You can safely close this window and return to Rocket.Chat.",

    // Action Labels
    Connect_Email_Action_Label: "Connect Email Account",
    Check_Status_Action_Label: "Check Connection Status",
    Disconnect_Email_Action_Label: "Disconnect Email",
    Send_Email_Action_Label: "Send Email",
    View_Inbox_Action_Label: "View Inbox",

    // Messages
    OAuth_Connection_Success: "Successfully connected to your email account!",
    OAuth_Connection_Failed: "Failed to connect to your email account. Please try again.",
    Email_Not_Connected: "No email account connected. Please connect your account first.",
    Invalid_Email_Provider: "Invalid email provider selected. Please check your configuration.",
    Authentication_Required: "Authentication required. Please connect your email account.",
    Connection_Status_Connected: "Email account is connected and ready to use.",
    Connection_Status_Disconnected: "No email account is connected.",
    Disconnect_Success: "Email account disconnected successfully.",
    Disconnect_Failed: "Failed to disconnect your email account.",

    // Handler messages
    Already_Logged_In: "You are already logged in with **__provider__** as **__email__**.\n\nIf you want to disconnect, use `/email logout`.",
    Outlook_Coming_Soon: "**Outlook authentication will be available soon!**\n\nFor now, please use **Gmail** for email authentication.\n\n",
    Provider_Not_Implemented: "**__provider__ authentication is not yet implemented.**\n\nCurrently only **Gmail** is supported for authentication.\n\n",
    Connect_Account_Message: "**Connect your __provider__ account to Rocket Chat**",
    Login_With_Provider: "Login with __provider__",
    Error_Processing_Login: "Error processing login: __error__",
    Not_Authenticated: "You are not authenticated with __provider__. Use `/email login` to sign in.",
    Logout_Confirmation: "**Logout Confirmation**\n\nAre you sure you want to logout from the **__provider__** account **__email__**?",
    Confirm_Logout: "Confirm Logout",
    Error_Preparing_Logout: "❌ Error preparing logout: __error__",
    Provider_Not_Supported_Logout: "❌ **__provider__ is not supported for logout.**\n\nPlease contact your administrator for assistance.",
    Logout_Success: "**Successfully logged out from your __provider__ account.**\n\nYou can now login with a different account if needed.",
    Logout_Failed: "❌ **Failed to logout from your email account.**\n\nPlease try again or contact your administrator.",
    Logout_Error: "❌ **Error occurred during logout process:**\n__error__\n\nPlease try again or contact your administrator.",
    Helper_Greeting: "Hey __name__! I'm Email Bot 👋. Here are some quick tips to get you started!",
    Available_Commands: "",
    Help_Command: "use `/email help` - Show this help message",
    Login_Command: "use `/email login` - Login to your email account",
    Logout_Command: "use `/email logout` - Logout from your email account",
    Config_Command: "use `/email config` - Open user preferences and settings",
    Report_Command: "use `/email report` - Get daily email statistics report",
    Default_Greeting: "Hey __name__! I'm Email Bot 👋. I can help you all your email needs.",
    Use_Help_Command: "Use `/email help` to learn about all available features and commands.",
    Login_Action_Text: "Login to __provider__",

    // User Preference Modal
    User_Preference_Title: "User Preferences",
    User_Preference_Button_Label: "⚙️ User Preferences",
    User_Preference_Update_Button: "Update Preferences",
    User_Preference_Close_Button: "Close",
    User_Preference_Success: "**User preferences updated successfully!**",
    Language_Changed: "Language changed to: __language__",
    Email_Provider_Changed: "Email provider changed to: __provider__",
    User_Preference_Error: "**Failed to update user preferences:**\n__error__",
    Email_Provider_Preference_Label: "Email Provider",
    Email_Provider_Preference_Description: "Choose your preferred email provider for authentication",

    // LLM Configuration Modal
    LLM_Configuration_Title: "LLM Configuration",
    LLM_Configuration_Button_Label: "🤖 LLM Configuration",
    LLM_Configuration_Update_Button: "Update Configuration",
    LLM_Configuration_Close_Button: "Close",
    LLM_Configuration_Success: "LLM configuration updated successfully!",
    LLM_Configuration_Error: "Failed to update LLM configuration:",
    LLM_Config_Command: "use `/email llm config` - Open LLM configuration settings",

    // Language names
    Language: "Language",
    Language_EN: "English",
    Language_ES: "Spanish",
    Language_DE: "German",
    Language_PL: "Polish",
    Language_PT: "Portuguese",
    Language_RU: "Russian",

    // Config error messages
    Config_Error: "Configuration error: __error__",

    // Provider change messages
    Provider_Changed_Auto_Logout: "You have been automatically logged out from **__oldProvider__**",
    Provider_Change_Warning: "⚠️ Warning: Changing your email provider will automatically log you out from your current account.",
    Provider_Changed_Login_Message: "You can login to your __provider__ account",

    // Granular Error Messages
    Error_Fill_Required_Fields: "Failed to process request. Please fill all the required fields ❌",
    Error_Fail_Internal: "Internal error. Please try again later.",
    Error_Network_Failure: "Network connection failed. Please check your internet connection and try again.",
    Error_Invalid_Credentials: "Invalid credentials provided. Please check your OAuth settings.",
    Error_Token_Expired: "Your authentication token has expired. Please login again.",
    Error_Token_Invalid: "Authentication token is invalid. Please login again.",
    Error_Missing_Configuration: "Missing required configuration. Please contact your administrator.",
    Error_Service_Unavailable: "Email service is currently unavailable. Please try again later.",
    Error_Rate_Limit_Exceeded: "Too many requests. Please wait a moment and try again.",
    Error_Permission_Denied: "Permission denied. Please check your account permissions.",
    Error_User_Info_Missing: "Failed to retrieve user information. Please try logging in again.",
    Error_Connection_Lost: "Connection to email service lost. Please check your network and try again.",
    Error_OAuth_Callback_Failed: "OAuth callback failed. Please try the authentication process again.",
    Error_Settings_Not_Found: "Email settings not configured. Please contact your administrator.",
    Error_Provider_Mismatch: "Email provider configuration mismatch. Please contact your administrator.",

    // Success Messages
    Success_Connection_Established: "Email connection established successfully ✅",
    Success_User_Info_Retrieved: "User information retrieved successfully ✅",
    Success_Token_Refreshed: "Authentication token refreshed successfully ✅",
    Success_Logout_Complete: "Successfully logged out from your email account ✅",
    Success_Configuration_Updated: "Email configuration updated successfully ✅",

    // OAuth Specific Errors
    OAuth_Error_Authorization_Denied: "Authorization was denied. Please try again and grant the necessary permissions.",
    OAuth_Error_Invalid_State: "Invalid OAuth state parameter. This might be a security issue. Please try again.",
    OAuth_Error_Code_Exchange_Failed: "Failed to exchange authorization code for tokens. Please try again.",
    OAuth_Error_Invalid_Grant: "Invalid OAuth grant. Your authorization code may have expired. Please try again.",
    OAuth_Error_Scope_Insufficient: "Insufficient OAuth scope permissions. Please contact your administrator.",

    // User-Friendly Error Messages
    User_Friendly_Auth_Error: "**Authentication Failed**\n\nWe couldn't connect to your email account. This might be because:\n• Your credentials have expired\n• The service is temporarily unavailable\n• There's a configuration issue\n\nPlease try again or contact your administrator if the problem persists.",
    User_Friendly_Network_Error: "**Connection Problem**\n\nWe're having trouble connecting to the email service. Please:\n• Check your internet connection\n• Try again in a few moments\n• Contact support if the problem continues",
    User_Friendly_Config_Error: "**Configuration Issue**\n\nThere's a problem with the email service configuration. Please contact your administrator to resolve this issue.",

    // Modal Error Messages
    Modal_Error_Failed_To_Open: "Failed to open preferences modal. Please try again.",
    Modal_Error_Save_Failed: "Failed to save preferences. Please check your input and try again.",
    Modal_Error_Invalid_Input: "Invalid input provided. Please check your entries and try again.",

    // Form Validation Messages
    Validation_Email_Required: "Email address is required.",
    Validation_Email_Invalid: "Please enter a valid email address.",
    Validation_Field_Required: "This field is required.",
    Validation_Field_Too_Long: "Input is too long. Maximum length is __max__ characters.",
    Validation_Field_Too_Short: "Input is too short. Minimum length is __min__ characters.",

    // OAuth Endpoint Error Messages
    OAuth_Endpoint_Error_Obtaining_Token: "Error obtaining access token: __error__",
    OAuth_Endpoint_General_Error: "An error occurred: __error__",
    OAuth_Endpoint_Missing_Parameters: "Missing required parameters (code or state)",
    OAuth_Endpoint_Invalid_State: "Invalid or expired authorization request",
    OAuth_Endpoint_Authentication_Failed: "Authentication failed",
    OAuth_Endpoint_OAuth_Error: "OAuth Error: __error__ - __description__",
    OAuth_Endpoint_Enhanced_Error: "__prefix__: __message__",

    // Modal and UI Error Messages
    Error_Modal_Creation_Failed: "Failed to create user preference modal",
    Error_Trigger_ID_Missing: "Trigger ID not available for modal opening",

    // Storage Error Messages
    Storage_Failed_Save_Credentials: "Failed to save OAuth credentials",
    Storage_Failed_Delete_Credentials: "Failed to delete OAuth credentials",
    Storage_Failed_Save_State: "Failed to save OAuth state",

    // Generic Account Reference
    Generic_Account: "your account",

    // OAuth Endpoint Short Keys (shorter names as requested)
    OAuth_Redir_Err: "Redirect URI mismatch. Please ensure your Azure app registration includes the exact URI: __uri__",
    OAuth_SSL_Err: "SSL/TLS Protocol Error. For localhost development, ensure Azure app registration includes HTTP (not HTTPS) redirect URI",
    Provider_Label: "__provider__",

    // Logger Messages (ultra-short keys)
    Log_Logout_Err: "Error during logout cleanup attempt",
    Log_Async_Logout: "Error in async logout action",
    Log_Async_Pref: "Error in async user preference action",
    Log_Pref_Handle: "Error in handleUserPreferenceAction",
    Log_Auto_Logout: "Error during automatic logout on provider change",
    Log_Pref_Submit: "Error in handleUserPreferenceSubmit",
    Log_Notif_Err: "Failed to send error notification",
    Log_Success_Err: "Failed to send success notification",
    Log_Btn_Fallback: "Failed to create notification with login button, falling back to text notification",
    Log_Fallback_Err: "Failed to send fallback text notification",


    // Report feature messages
    Report_Provider_Not_Supported: "❌ **__provider__ is not supported for reports.**\n\nPlease contact your administrator for assistance.",
    Report_Not_Authenticated: "❌ **You are not authenticated with __provider__.**\n\nUse `/email login` to sign in first, then try generating the report again.",
    Report_Error: "❌ **Error generating email report:**\n__error__\n\nPlease try again or contact your administrator.",
    Report_Header: "\n📊 **Email Statistics Report(last 24 hours)**",
    Report_Statistics: "**Received**: __receivedToday__ emails (__receivedUnreadToday__ unread)\n**Sent**: __sentToday__ emails",
    Report_Token_Expired: "❌ **Your authentication has expired.**\n\nUse `/email login` to reconnect your __provider__ account and try again.",
    Report_Categories_Label: "Report Categories",

    // Statistics Service Errors
    Statistics_Provider_Not_Supported: "Statistics for provider __provider__ are not supported.",
    Statistics_Not_Implemented: "Statistics are not implemented for provider: __provider__",
    Gmail_Stats_Failed: "Failed to get Gmail statistics: __error__",
    Outlook_Stats_Failed: "Failed to get Outlook statistics: __error__",

    // User Preference Modal
    New_Category_Label: "New Category",
    New_Categories_Placeholder: "Add new categories, comma-separated...",
    // Tool Calling Messages
    LLM_Processing_Query: "Processing: \"__query__\"...",
    LLM_User_Query_Display: "**Your query is:** __query__",
    LLM_AI_Thinking: "_thinking_...",
    LLM_Email_Ready_User: "Hey __name__, your email titled **__subject__** is ready to send.",
    LLM_Tool_Detected: "**Tool Detected** for query: \"__query__\"\n\n**Tool:** __tool__",
    LLM_No_Tool_Detected: "No suitable tool found for query: \"__query__\"",
    LLM_Error_Processing: "**Error processing query:** \"__query__\"\n\n**Error:** __error__",
    Tool_Call_Result: "Tool Call Result",
    Tool_Name_Label: "Tool",
    Tool_Args_Label: "Arguments",
    Query_Processed_Success: "Query processed successfully",
    Invalid_Tool_Name: "Invalid tool name detected",
    LLM_Parsing_Failed: "Failed to parse LLM response",

    // Tool Names (for user display)
    Tool_Send_Email: "Send Email",
    Tool_Extract_Attachment: "Extract Attachments",
    Tool_Summarize_And_Send: "Summarize & Send Email",
    Tool_Report: "Generate Report",

    // Send Email Modal
    Send_Email_Modal_Title: "Send Email",
    Send_Email_To_Label: "To",
    Send_Email_To_Placeholder: "Enter recipient email addresses (comma separated)",
    Send_Email_CC_Label: "CC",
    Send_Email_CC_Placeholder: "Enter CC email addresses (comma separated)",
    Send_Email_Subject_Label: "Subject",
    Send_Email_Subject_Placeholder: "Enter email subject",
    Send_Email_Content_Label: "Content",
    Send_Email_Content_Placeholder: "Enter email content",
    Send_Email_Send_Button: "Send",
    Send_Email_Cancel_Button: "Cancel",
    Send_Email_Modal_Opened: "Email composition modal opened",
    Send_Email_Success: "Email sent successfully ✅",
    Send_Email_Failed: "Failed to send email: __error__",
    Send_Email_Error_No_From_Email: "Unable to determine sender email address",

    // Send Email Validation
    Send_Email_Validation_To_Required: "Recipient email address is required",
    Send_Email_Validation_Subject_Required: "Email subject is required",
    Send_Email_Validation_Content_Required: "Email content is required",

    // Send Email Button Translations
    Email_Ready_To_Send: "Email Ready to Send",
    Email_Send_Button: "Send",
    Email_Edit_And_Send_Button: "Edit & Send",

    // Send Email with Status
    Send_Email_Success_With_Emoji: "Email sent successfully",
    Send_Email_Failed_With_Emoji: "Failed to send email: __error__",

    // New translations
    PROVIDER_NOT_SUPPORTED_LOGOUT: "Logout failed. The email provider '__provider__' is not supported.",
    LOGOUT_SUCCESS: "You have been successfully logged out from __provider__.",
    LOGOUT_FAILED: "Logout failed. Please try again.",
    LOGOUT_ERROR: "An error occurred during logout: __error__",
    EMAIL_SENT_CONFIRMATION: "Email sent.",

    // Common Error Messages
    Common_Unknown_Error: "Unknown error",
    Common_Failed_Exchange_Code: "Failed to exchange code for tokens",

    // Send/Edit Action Buttons
    SEND_ACTION_TEXT: "Send",
    EDIT_SEND_ACTION_TEXT: "Edit & Send",

    // LLM Error Messages
    LLM_No_Response: "No response received from the AI service. Please try again.",
    LLM_No_Choices: "AI service returned an empty response. Please try rephrasing your request.",
    LLM_Request_Failed: "Failed to communicate with AI service",

    // Summarization Messages
    No_Messages_To_Summarize: "No messages found to summarize based on your criteria.",
    Summary_Generation_Failed: "Unable to generate a summary of the messages. Please try again.",
    LLM_Summary_Email_Ready_User: "Hey __name__, your email with summary from channel: **__channelName__** titled \"**__subject__**\" is ready to send.",
    LLM_Parsing_Error: "I couldn't understand your request. Please try rephrasing with simpler email addresses or content.",

    // Email Ready Messages with Recipients
    LLM_Email_Ready_User_With_Recipients: "**AI response:** Hey __name__, your email titled **__subject__** is ready to send to __recipients__",
    LLM_Summary_Email_Ready_User_With_Recipients: "**AI response:** Hey __name__, your email with summary from channel: **__channelName__** titled \"**__subject__**\" is ready to send to __recipients__",

    // New format constants for specific display format
    LLM_Email_To_Label: "**To:**",
    LLM_Email_CC_Label: "**Cc:**",
    LLM_Email_Subject_Label: "**Subject:**",
    LLM_Email_Ready_Formatted: "Hey __name__, your email is ready to send",
    LLM_Summary_Email_Ready_Formatted: "Hey __name__, your email with summary from channel: **__channelName__** is ready to send",

    // Error message details for MessageFormatter
    Error_Email_Data_Unavailable: "The URL/API key is not filled. Please contact your admin.",
    Error_Please_Try_Again: "Please try again.",
    Error_Processing_Summary_Request: "There was an issue processing your summary request. Please try again.",

    // LLM Configuration Settings
    LLM_Provider_Label: "LLM Provider",
    LLM_Provider_Description: "Select the AI language model provider to use for processing email commands",
    LLM_Provider_Default_Label: "Default (Self-hosted)",
    LLM_Provider_OpenAI_Label: "OpenAI",
    LLM_Provider_Gemini_Label: "Google Gemini",
    LLM_Provider_Groq_Label: "Groq",
    OpenAI_API_Key_Label: "OpenAI API Key",
    OpenAI_API_Key_Description: "Your OpenAI API key for accessing GPT models (required only when using OpenAI provider)",
    Gemini_API_Key_Label: "Google Gemini API Key",
    Gemini_API_Key_Description: "Your Google AI Studio API key for accessing Gemini models (required only when using Gemini provider)",
    Groq_API_Key_Label: "Groq API Key",
    Groq_API_Key_Description: "Your Groq API key for accessing Llama models (required only when using Groq provider)",

    // User LLM Preferences
    LLM_Usage_Preference_Label: "LLM Usage Preference",
    LLM_Usage_Preference_Placeholder: "Choose LLM usage preference",
    LLM_Usage_Preference_Personal: "Personal",
    LLM_Usage_Preference_Workspace: "Workspace",
    LLM_Provider_User_Label: "LLM Provider",
    LLM_Provider_User_Placeholder: "Choose LLM provider",
    LLM_Provider_SelfHosted: "Self-hosted",
    LLM_Provider_OpenAI: "OpenAI",
    LLM_Provider_Gemini: "Gemini",
    LLM_Provider_Groq: "Groq",
    SelfHosted_URL_Label: "Self-hosted LLM URL",
    SelfHosted_URL_Placeholder: "Enter your self-hosted LLM URL",
    OpenAI_API_Key_User_Label: "OpenAI API Key",
    OpenAI_API_Key_User_Placeholder: "Enter your OpenAI API key",
    Gemini_API_Key_User_Label: "Gemini API Key",
    Gemini_API_Key_User_Placeholder: "Enter your Gemini API key",
    Groq_API_Key_User_Label: "Groq API Key",
    Groq_API_Key_User_Placeholder: "Enter your Groq API key",

    // LLM Configuration Validation Messages
    LLM_Config_Provider_Required: "Please select an LLM provider",
    LLM_Config_SelfHosted_URL_Required: "Self-hosted URL is required for the selected provider",
    LLM_Config_Invalid_URL: "Please enter a valid URL",
    LLM_Config_OpenAI_Key_Required: "Please fill your OpenAI API key in the modal",
    LLM_Config_Invalid_OpenAI_Key: "OpenAI API key should start with 'sk-'",
    LLM_Config_Gemini_Key_Required: "Please fill your Gemini API key in the modal",
    LLM_Config_Groq_Key_Required: "Please fill your Groq API key in the modal",
    LLM_Config_Invalid_Provider: "Invalid LLM provider selected",
    LLM_API_Or_URL_Error: "Please check your LLM API key or URL",
};
