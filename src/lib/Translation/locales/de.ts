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
    
    // Outlook OAuth Settings
    Outlook_OAuth_Client_ID_Label: "Outlook OAuth Client ID",
    Outlook_OAuth_Client_ID_Description: "OAuth Client ID für Outlook/Microsoft-Authentifizierung",
    Outlook_OAuth_Client_Secret_Label: "Outlook OAuth Client Secret",
    Outlook_OAuth_Client_Secret_Description: "OAuth Client Secret für Outlook/Microsoft-Authentifizierung",
    Outlook_OAuth_Redirect_URI_Label: "Outlook OAuth Redirect URI",
    Outlook_OAuth_Redirect_URI_Description: "OAuth Redirect URI für Outlook - sollte enden mit /api/apps/public/[app-id]/oauth-callback",
    
    // Commands
    Email_Command_Params: "verbinden, status, trennen, hilfe, bericht",
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
    Report_Command: "verwenden Sie `/email report` - Tägliche E-Mail-Statistiken abrufen",
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
    Provider_Changed_Auto_Logout: "Sie wurden automatisch von **__oldProvider__** abgemeldet",
    Provider_Change_Warning: "⚠️ Warnung: Das Ändern Ihres E-Mail-Anbieters wird Sie automatisch von Ihrem aktuellen Konto abmelden.",
    
    // Granular Error Messages
    Error_Fill_Required_Fields: "Fehler beim Verarbeiten der Anfrage. Bitte füllen Sie alle erforderlichen Felder aus ❌",
    Error_Fail_Internal: "Interner Fehler. Bitte versuchen Sie es später erneut.",
    Error_Network_Failure: "Netzwerkverbindung fehlgeschlagen. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.",
    Error_Invalid_Credentials: "Ungültige Anmeldedaten bereitgestellt. Bitte überprüfen Sie Ihre OAuth-Einstellungen.",
    Error_Token_Expired: "Ihr Authentifizierungs-Token ist abgelaufen. Bitte melden Sie sich erneut an.",
    Error_Token_Invalid: "Authentifizierungs-Token ist ungültig. Bitte melden Sie sich erneut an.",
    Error_Missing_Configuration: "Erforderliche Konfiguration fehlt. Bitte kontaktieren Sie Ihren Administrator.",
    Error_Service_Unavailable: "E-Mail-Service ist derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.",
    Error_Rate_Limit_Exceeded: "Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.",
    Error_Permission_Denied: "Berechtigung verweigert. Bitte überprüfen Sie Ihre Kontoberechtigung.",
    Error_User_Info_Missing: "Fehler beim Abrufen der Benutzerinformationen. Bitte versuchen Sie sich erneut anzumelden.",
    Error_Connection_Lost: "Verbindung zum E-Mail-Service verloren. Bitte überprüfen Sie Ihr Netzwerk und versuchen Sie es erneut.",
    Error_OAuth_Callback_Failed: "OAuth-Callback fehlgeschlagen. Bitte versuchen Sie den Authentifizierungsprozess erneut.",
    Error_Settings_Not_Found: "E-Mail-Einstellungen nicht konfiguriert. Bitte kontaktieren Sie Ihren Administrator.",
    Error_Provider_Mismatch: "E-Mail-Anbieter-Konfigurationsfehler. Bitte kontaktieren Sie Ihren Administrator.",
    
    // Success Messages
    Success_Connection_Established: "E-Mail-Verbindung erfolgreich hergestellt ✅",
    Success_User_Info_Retrieved: "Benutzerinformationen erfolgreich abgerufen ✅",
    Success_Token_Refreshed: "Authentifizierungs-Token erfolgreich aktualisiert ✅",
    Success_Logout_Complete: "Erfolgreich von Ihrem E-Mail-Konto abgemeldet ✅",
    Success_Configuration_Updated: "E-Mail-Konfiguration erfolgreich aktualisiert ✅",
    
    // OAuth Specific Errors
    OAuth_Error_Authorization_Denied: "Autorisierung wurde verweigert. Bitte versuchen Sie es erneut und gewähren Sie die erforderlichen Berechtigungen.",
    OAuth_Error_Invalid_State: "Ungültiger OAuth-Status-Parameter. Dies könnte ein Sicherheitsproblem sein. Bitte versuchen Sie es erneut.",
    OAuth_Error_Code_Exchange_Failed: "Fehler beim Austausch des Autorisierungscodes gegen Tokens. Bitte versuchen Sie es erneut.",
    OAuth_Error_Invalid_Grant: "Ungültiger OAuth-Grant. Ihr Autorisierungscode könnte abgelaufen sein. Bitte versuchen Sie es erneut.",
    OAuth_Error_Scope_Insufficient: "Unzureichende OAuth-Scope-Berechtigungen. Bitte kontaktieren Sie Ihren Administrator.",
    
    // User-Friendly Error Messages
    User_Friendly_Auth_Error: "**Authentifizierungsfehler**\n\nWir konnten keine Verbindung zu Ihrem E-Mail-Konto herstellen. Dies könnte daran liegen, dass:\n• Ihre Anmeldedaten abgelaufen sind\n• Der Service vorübergehend nicht verfügbar ist\n• Es ein Konfigurationsproblem gibt\n\nBitte versuchen Sie es erneut oder kontaktieren Sie Ihren Administrator, wenn das Problem weiterhin besteht.",
    User_Friendly_Network_Error: "**Verbindungsproblem**\n\nWir haben Probleme bei der Verbindung zum E-Mail-Service. Bitte:\n• Überprüfen Sie Ihre Internetverbindung\n• Versuchen Sie es in wenigen Augenblicken erneut\n• Kontaktieren Sie den Support, wenn das Problem weiterhin besteht",
    User_Friendly_Config_Error: "**Konfigurationsproblem**\n\nEs gibt ein Problem mit der E-Mail-Service-Konfiguration. Bitte kontaktieren Sie Ihren Administrator, um dieses Problem zu lösen.",
    
    // Modal Error Messages
    Modal_Error_Failed_To_Open: "Fehler beim Öffnen des Einstellungsmodals. Bitte versuchen Sie es erneut.",
    Modal_Error_Save_Failed: "Fehler beim Speichern der Einstellungen. Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.",
    Modal_Error_Invalid_Input: "Ungültige Eingabe bereitgestellt. Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
    
    // Form Validation Messages
    Validation_Email_Required: "E-Mail-Adresse ist erforderlich.",
    Validation_Email_Invalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    Validation_Field_Required: "Dieses Feld ist erforderlich.",
    Validation_Field_Too_Long: "Eingabe ist zu lang. Maximale Länge ist __max__ Zeichen.",
    Validation_Field_Too_Short: "Eingabe ist zu kurz. Minimale Länge ist __min__ Zeichen.",
    
    // OAuth Endpoint Error Messages
    OAuth_Endpoint_Error_Obtaining_Token: "Fehler beim Abrufen des Zugangs-Tokens: __error__",
    OAuth_Endpoint_General_Error: "Ein Fehler ist aufgetreten: __error__",
    OAuth_Endpoint_Missing_Parameters: "Erforderliche Parameter fehlen (Code oder Status)",
    OAuth_Endpoint_Invalid_State: "Ungültige oder abgelaufene Autorisierungsanfrage",
    OAuth_Endpoint_Authentication_Failed: "Authentifizierung fehlgeschlagen",
    OAuth_Endpoint_OAuth_Error: "OAuth-Fehler: __error__ - __description__",
    OAuth_Endpoint_Enhanced_Error: "__prefix__: __message__",
    
    // Modal and UI Error Messages
    Error_Modal_Creation_Failed: "Fehler beim Erstellen des Benutzereinstellungs-Modals",
    Error_Trigger_ID_Missing: "Trigger-ID nicht verfügbar zum Öffnen des Modals",
    
    // Storage Error Messages
    Storage_Failed_Save_Credentials: "Fehler beim Speichern der OAuth-Anmeldedaten",
    Storage_Failed_Delete_Credentials: "Fehler beim Löschen der OAuth-Anmeldedaten", 
    Storage_Failed_Save_State: "Fehler beim Speichern des OAuth-Status",
    
    // Generic Account Reference
    Generic_Account: "Ihr Konto",
    
    // OAuth Endpoint Short Keys (shorter names as requested)
    OAuth_Redir_Err: "Redirect-URI-Konflikt. Stellen Sie sicher, dass Ihre Azure-App-Registrierung die exakte URI enthält: __uri__",
    OAuth_SSL_Err: "SSL/TLS-Protokoll-Fehler. Für localhost-Entwicklung stellen Sie sicher, dass die Azure-App-Registrierung HTTP (nicht HTTPS) Redirect-URI enthält",
    Provider_Label: "__provider__",
    
    // Logger Messages (ultra-short keys)
    Log_Logout_Err: "Fehler während Logout-Cleanup-Versuch",
    Log_Async_Logout: "Fehler bei asynchroner Logout-Aktion", 
    Log_Async_Pref: "Fehler bei asynchroner Benutzereinstellungsaktion",
    Log_Pref_Handle: "Fehler in handleUserPreferenceAction",
    Log_Auto_Logout: "Fehler während automatischem Logout bei Anbieterwechsel",
    Log_Pref_Submit: "Fehler in handleUserPreferenceSubmit",
    Log_Notif_Err: "Fehler beim Senden der Fehlerbenachrichtigung",
    Log_Success_Err: "Fehler beim Senden der Erfolgsbenachrichtigung", 
    Log_Btn_Fallback: "Fehler beim Erstellen der Benachrichtigung mit Login-Button, Rückgriff auf Textbenachrichtigung",
    Log_Fallback_Err: "Fehler beim Senden der Fallback-Textbenachrichtigung",
    
    // Report feature messages
    Report_Provider_Not_Supported: "❌ **__provider__ wird für Berichte nicht unterstützt.**\n\nBitte wenden Sie sich für Hilfe an Ihren Administrator.",
    Report_Not_Authenticated: "❌ **Sie sind nicht bei __provider__ authentifiziert.**\n\nVerwenden Sie `/email login`, um sich zuerst anzumelden, und versuchen Sie dann erneut, den Bericht zu erstellen.",
    Report_Error: "❌ **Fehler beim Erstellen des E-Mail-Berichts:**\n__error__\n\nBitte versuchen Sie es erneut oder wenden Sie sich an Ihren Administrator.",
    Report_Header: "\n📊 **E-Mail-Statistikbericht(letzte 24 Stunden)**",
    Report_Statistics: "**Empfangen**: __receivedToday__ E-Mails\n**Gesendet**: __sentToday__ E-Mails\n**Ungelesen**: __totalUnread__ E-Mails",
    Report_Token_Expired: "❌ **Ihre Authentifizierung ist abgelaufen.**\n\nVerwenden Sie `/email login`, um Ihr __provider__-Konto erneut zu verbinden und es erneut zu versuchen.",
    Report_Categories_Label: "Report Categories",

    // Statistics Service Errors
    Statistics_Provider_Not_Supported: "Statistics for provider __provider__ are not supported.",
    Statistics_Not_Implemented: "Statistics are not implemented for provider: __provider__",
    Gmail_Stats_Failed: "Failed to get Gmail statistics: __error__",
    Outlook_Stats_Failed: "Failed to get Outlook statistics: __error__",

    // User Preference Modal
    New_Category_Label: "New Category",
    New_Categories_Placeholder: "Add new categories, comma-separated...",
}; 