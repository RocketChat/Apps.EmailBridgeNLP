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
    
    // Commands
    Email_Command_Params: "connect, status, disconnect, help",
    Email_Command_Description: "Connect and manage your email account integration with AI assistance.",
    
    // OAuth Pages
    Authentication_Error_Title: "Authentication Error",
    Authentication_Success_Title: "Authentication Successful!",
    Connected_Account_Message: "You have successfully connected your Gmail account:",
    Try_Again_Message: "Please try again or contact your administrator.",
    Close_Window_Label: "Close Window",
    Features_Available_Message: "You can now use EmailBridge NLP features in Rocket.Chat!",
    Safe_To_Close_Message: "You can safely close this window and return to Rocket.Chat.",
    
    // Action Labels
    Connect_Email_Action_Label: "🔗 Connect Email Account",
    Check_Status_Action_Label: "📊 Check Connection Status",
    Disconnect_Email_Action_Label: "🔌 Disconnect Email",
    Send_Email_Action_Label: "📧 Send Email",
    View_Inbox_Action_Label: "📥 View Inbox",
    
    // Messages
    OAuth_Connection_Success: "Successfully connected to your email account!",
    OAuth_Connection_Failed: "Failed to connect to your email account. Please try again.",
    Email_Not_Connected: "No email account connected. Please connect your account first.",
    Invalid_Email_Provider: "Invalid email provider selected. Please check your settings.",
    Authentication_Required: "Authentication required. Please connect your email account.",
    Connection_Status_Connected: "✅ Email account is connected and ready to use.",
    Connection_Status_Disconnected: "❌ No email account connected.",
    Disconnect_Success: "Successfully disconnected your email account.",
    Disconnect_Failed: "Failed to disconnect your email account.",
    
    // Handler messages
    Already_Logged_In: "✅ You are already logged in with **__provider__** as **__email__**.\n\nIf you want to logout, use `/email logout`.",
    Outlook_Coming_Soon: "🚧 **Outlook authentication is coming soon!**\n\nFor now, please use **Gmail** for email authentication.\n\n",
    Provider_Not_Implemented: "❌ **__provider__ authentication is not yet implemented.**\n\nCurrently only **Gmail** is supported for authentication.\n\n",
    Connect_Account_Message: "🔐 **Connect your __provider__ account to Rocket Chat**\nIf want to use Outlook account, please change the Email Provider from settings.",
    Login_With_Provider: "🔑 Login with __provider__",
    Error_Processing_Login: "❌ Error processing login: __error__",
    Not_Authenticated: "❌ You are not currently authenticated with __provider__. Use `/email login` to login.",
    Logout_Confirmation: "🔓 **Logout Confirmation**\n\nAre you sure you want to logout from **__provider__** account **__email__**?",
    Confirm_Logout: "🔒 Confirm Logout",
    Error_Preparing_Logout: "❌ Error preparing logout: __error__",
    
    // Logout action messages
    Provider_Not_Supported_Logout: "❌ **__provider__ is not supported for logout.**\n\nPlease contact your administrator for assistance.",
    Logout_Success: "✅ **Successfully logged out from your __provider__ account.**\n\nYou can now login with a different account if needed.",
    Logout_Failed: "❌ **Failed to logout from your email account.**\n\nPlease try again or contact your administrator.",
    Logout_Error: "❌ **Error occurred during logout process:**\n__error__\n\nPlease try again or contact your administrator.",
    
    // Notification messages
    Helper_Greeting: "Hey __name__! I'm Email Bot 👋. Here are some quick tips to get you started!",
    Available_Commands: "",
    Help_Command: "use `/email help` - Show this help message",
    Login_Command: "use `/email login` - Login to your email account",
    Logout_Command: "use `/email logout` - Logout from your email account",
    Default_Greeting: "Hey __name__! I'm Email Bot 👋. I can help you all your email needs.",
    Use_Help_Command: "Use `/email help` to learn about all available features and commands.",
    Login_Action_Text: "Login to your email account",
    
    // User Preference Modal
    User_Preference_Title: "⚙️ User Preferences",
    User_Preference_Button_Label: "⚙️ User Preferences",
    User_Preference_Update_Button: "Update Preferences",
    User_Preference_Close_Button: "Close",
    User_Preference_Success: "✅ **User preferences updated successfully!**",
    User_Preference_Error: "❌ **Failed to update user preferences:**\n__error__",
    Email_Provider_Preference_Label: "Email Provider",
    Email_Provider_Preference_Description: "Choose your preferred email provider for authentication",
    
    // Language names
    Language: "Language",
    Language_EN: "English",
    Language_ES: "Spanish",
    Language_DE: "German",
    Language_PL: "Polish",
    Language_PT: "Portuguese",
    Language_RU: "Russian",
}; 