export const de = {
    // Settings
    Email_Provider_Label: "E-Mail-Anbieter",
    Email_Provider_Description: "Wählen Sie Ihren E-Mail-Dienstanbieter für die Authentifizierung",
    Gmail_Label: "Gmail",
    Outlook_Label: "Outlook/Hotmail",
    Google_OAuth_Client_ID_Label: "Google OAuth Client ID",
    Google_OAuth_Client_ID_Description: "OAuth Client ID für Google-Authentifizierung (nur Gmail)",
    Google_OAuth_Client_Secret_Label: "Google OAuth Client Secret",
    Google_OAuth_Client_Secret_Description: "OAuth Client Secret für Google-Authentifizierung (nur Gmail)",
    OAuth_Redirect_URI_Label: "OAuth Redirect URI",
    OAuth_Redirect_URI_Description: "OAuth Redirect URI - sollte enden mit /api/apps/public/[app-id]/oauth-callback",
    
    // Commands
    Email_Command_Params: "verbinden, status, trennen, hilfe",
    Email_Command_Description: "Verbinden und verwalten Sie Ihre E-Mail-Konto-Integration mit KI-Unterstützung.",
    
    // OAuth Pages
    Authentication_Error_Title: "Authentifizierungsfehler",
    Authentication_Success_Title: "Authentifizierung erfolgreich!",
    Connected_Account_Message: "Sie haben Ihr Gmail-Konto erfolgreich verbunden:",
    Try_Again_Message: "Bitte versuchen Sie es erneut oder wenden Sie sich an Ihren Administrator.",
    Close_Window_Label: "Fenster schließen",
    Features_Available_Message: "Sie können jetzt die E-Mail-Assistent-Funktionen in Rocket.Chat verwenden!",
    Safe_To_Close_Message: "Sie können dieses Fenster sicher schließen und zu Rocket.Chat zurückkehren.",
    
    // Action Labels
    Connect_Email_Action_Label: "E-Mail-Konto verbinden",
    Check_Status_Action_Label: "Verbindungsstatus prüfen",
    Disconnect_Email_Action_Label: "E-Mail trennen",
    Send_Email_Action_Label: "E-Mail senden",
    View_Inbox_Action_Label: "Posteingang anzeigen",
    
    // Messages
    OAuth_Connection_Success: "Erfolgreich mit Ihrem E-Mail-Konto verbunden!",
    OAuth_Connection_Failed: "Verbindung zu Ihrem E-Mail-Konto fehlgeschlagen. Bitte versuchen Sie es erneut.",
    Email_Not_Connected: "Kein E-Mail-Konto verbunden. Bitte verbinden Sie zuerst Ihr Konto.",
    Invalid_Email_Provider: "Ungültiger E-Mail-Anbieter ausgewählt. Bitte überprüfen Sie Ihre Einstellungen.",
    Authentication_Required: "Authentifizierung erforderlich. Bitte verbinden Sie Ihr E-Mail-Konto.",
    Connection_Status_Connected: "E-Mail-Konto ist verbunden und einsatzbereit.",
    Connection_Status_Disconnected: "Kein E-Mail-Konto verbunden.",
    Disconnect_Success: "E-Mail-Konto erfolgreich getrennt.",
    Disconnect_Failed: "Trennen Ihres E-Mail-Kontos fehlgeschlagen.",
    
    // Handler messages
    Already_Logged_In: "Sie sind bereits mit **__provider__** als **__email__** angemeldet.\n\nWenn Sie sich abmelden möchten, verwenden Sie `/email logout`.",
    Outlook_Coming_Soon: "**Outlook-Authentifizierung kommt bald!**\n\nVerwenden Sie vorerst **Gmail** für die E-Mail-Authentifizierung.\n\n",
    Provider_Not_Implemented: "**__provider__-Authentifizierung ist noch nicht implementiert.**\n\nDerzeit wird nur **Gmail** für die Authentifizierung unterstützt.\n\n",
    Connect_Account_Message: "**Verbinden Sie Ihr __provider__-Konto mit Rocket Chat**",
    Login_With_Provider: "Mit __provider__ anmelden",
    Error_Processing_Login: "Fehler beim Verarbeiten der Anmeldung: __error__",
    Not_Authenticated: "Sie sind nicht mit __provider__ authentifiziert. Verwenden Sie `/email login` zum Anmelden.",
    Logout_Confirmation: " **Abmeldebestätigung**\n\nSind Sie sicher, dass Sie sich vom **__provider__**-Konto **__email__** abmelden möchten?",
    Confirm_Logout: "Abmeldung bestätigen",
    Error_Preparing_Logout: "Fehler beim Vorbereiten der Abmeldung: __error__",
    
    // Logout action messages
    Provider_Not_Supported_Logout: "**__provider__ wird für die Abmeldung nicht unterstützt.**\n\nBitte wenden Sie sich an Ihren Administrator für Unterstützung.",
    Logout_Success: "**Erfolgreich von Ihrem __provider__-Konto abgemeldet.**",
    Logout_Failed: "**Abmeldung von Ihrem E-Mail-Konto fehlgeschlagen.**\n\nBitte versuchen Sie es erneut oder wenden Sie sich an Ihren Administrator.",
    Logout_Error: "**Fehler beim Abmeldeprozess aufgetreten:**\n__error__\n\nBitte versuchen Sie es erneut oder wenden Sie sich an Ihren Administrator.",
    
    // Notification messages
    Helper_Greeting: "Hallo __name__! Ich bin Email Bot 👋. Hier sind einige schnelle Tipps für den Einstieg!",
    Available_Commands: "",
    Help_Command: "verwenden Sie `/email help` - Diese Hilfsmeldung anzeigen",
    Login_Command: "verwenden Sie `/email login` - Bei Ihrem E-Mail-Konto anmelden",
    Logout_Command: "verwenden Sie `/email logout` - Von Ihrem E-Mail-Konto abmelden",
    Config_Command: "verwenden Sie `/email config` - Benutzereinstellungen und Konfiguration öffnen",
    Default_Greeting: "Hallo __name__! Ich bin Email Bot 👋. Ich kann Ihnen bei allen Ihren E-Mail-Bedürfnissen helfen.",
    Use_Help_Command: "Verwenden Sie `/email help`, um mehr über alle verfügbaren Funktionen und Befehle zu erfahren.",
    Login_Action_Text: "Bei Ihrem E-Mail-Konto anmelden",
    
    // User Preference Modal
    User_Preference_Title: "Benutzereinstellungen",
    User_Preference_Button_Label: "⚙️ Benutzereinstellungen",
    User_Preference_Update_Button: "Einstellungen aktualisieren",
    User_Preference_Close_Button: "Schließen",
    User_Preference_Success: "**Benutzereinstellungen erfolgreich aktualisiert!**",
    Language_Changed: "Sprache geändert zu: __language__",
    Email_Provider_Changed: "E-Mail-Anbieter geändert zu: __provider__",
    User_Preference_Error: "**Fehler beim Aktualisieren der Benutzereinstellungen:**\n__error__",
    Email_Provider_Preference_Label: "E-Mail-Anbieter",
    Email_Provider_Preference_Description: "Wählen Sie Ihren bevorzugten E-Mail-Anbieter für die Authentifizierung",
    
    // Language names
    Language: "Sprache",
    Language_EN: "Englisch",
    Language_ES: "Spanisch",
    Language_DE: "Deutsch",
    Language_PL: "Polnisch",
    Language_PT: "Portugiesisch",
    Language_RU: "Russisch",
    
    // Config error messages
    Config_Error: "Konfigurationsfehler: __error__",
    
    // Provider change messages
    Provider_Changed_Auto_Logout: "Sie wurden automatisch von **__oldProvider__**",
    Provider_Change_Warning: "⚠️ Warnung: Das Ändern Ihres E-Mail-Anbieters wird Sie automatisch von Ihrem aktuellen Konto abmelden.",
    
    
}; 