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
    Email_Command_Params: "login, logout, config, llm-config, help, stats",
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
    Disconnect_Email_Action_Label: "Abmelden von E-Mail-Konto",
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
    Disconnect_Success: "E-Mail-Konto erfolgreich abgemeldet.",
    Disconnect_Failed: "Fehler beim Abmelden von Ihrem E-Mail-Konto.",

    // Login success notifications (webhook)
    Login_Success_Notification: "\n**Anmeldung erfolgreich!**\n\nSie sind jetzt mit **__provider__** als **__email__** verbunden.\n\nSie können jetzt EmailBridge NLP-Funktionen verwenden!",

    // Welcome message content (onInstall)
    Welcome_Title: "**Email Assistant**",
    Welcome_Description: "**Installiert und Bereit, Ihre E-Mail mit KI zu Verbinden!**",
    Welcome_Text: "Willkommen bei **Email Assistant** in RocketChat!",
    Welcome_Message: `
        🚀 **Starten Sie in 3 Einfachen Schritten:**
        
        1️⃣ **E-Mail Verbinden**: Verwenden Sie \`/email login\` um Gmail oder Outlook zu verbinden
        2️⃣ **Einstellungen Konfigurieren**: Verwenden Sie \`/email config\` um Ihre Einstellungen festzulegen
        3️⃣ **KI Verwenden**: Senden Sie natürlichsprachliche Befehle wie "E-Mails von gestern zusammenfassen"
        
        📧 **Was Sie Tun Können:**
        • **Intelligentes E-Mail-Management**: "E-Mail an john@company.com über das Meeting senden"
        • **Kanal-Zusammenfassungen**: "diese Unterhaltung zusammenfassen und an manager@company.com mailen"
        • **Schnelle Statistiken**: Tägliche E-Mail-Statistiken und Einblicke erhalten. Verwenden Sie \`/email stats\`.
        
        📊 **E-Mail-Statistik-Funktion:**
        Erhalten Sie personalisierte tägliche Berichte mit:
        • Gesamte empfangene und gesendete E-Mails
        • Top-Absender und -Empfänger
        • E-Mail-Kategorien (Arbeit, Privat, Benachrichtigungen)
        
        ⚙️ **Unterstützte Anbieter:**
        • **Gmail**
        • **Outlook**
        
        🌍 **Mehrsprachige Unterstützung:**
        Verfügbar in Englisch, Spanisch, Russisch, Deutsch, Polnisch und Portugiesisch
        
        Brauchen Sie Hilfe? Geben Sie jederzeit \`/email help\` ein!
        
        Danke für die Wahl von **Email Assistant** - Ihr KI E-Mail-Assistent! 🤖
        `,

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
    PROVIDER_NOT_SUPPORTED_LOGOUT: "Abmelden fehlgeschlagen. Der E-Mail-Anbieter '__provider__' wird nicht unterstützt.",
    LOGOUT_SUCCESS: "Sie wurden erfolgreich von __provider__ abgemeldet.",
    LOGOUT_FAILED: "Abmelden fehlgeschlagen. Bitte versuchen Sie es erneut.",
    LOGOUT_ERROR: "Beim Abmelden ist ein Fehler aufgetreten: __error__",
    EMAIL_SENT_CONFIRMATION: "E-Mail gesendet.",

    // Notification messages
    Helper_Greeting: "Hallo __name__! Ich bin Email Bot 👋. Hier sind einige schnelle Tipps für den Einstieg!",
    Available_Commands: "",
    Help_Command: "verwenden Sie `/email help` - Diese Hilfsmeldung anzeigen",
    Login_Command: "verwenden Sie `/email login` - Bei Ihrem E-Mail-Konto anmelden",
    Logout_Command: "verwenden Sie `/email logout` - Von Ihrem E-Mail-Konto abmelden",
    Config_Command: "verwenden Sie `/email config` - Benutzereinstellungen und Konfiguration öffnen",
    Stats_Command: "verwenden Sie `/email stats` - Tägliche E-Mail-Statistiken abrufen",
    Default_Greeting: "Hallo __name__! Ich bin Email Bot 👋. Ich kann Ihnen bei allen Ihren E-Mail-Bedürfnissen helfen.",
    Use_Help_Command: "Verwenden Sie `/email help`, um mehr über alle verfügbaren Funktionen und Befehle zu erfahren.",
    Login_Action_Text: "Bei __provider__ anmelden",
    SUCCESS_CONFIGURATION_UPDATED: "Ihre Einstellungen wurden erfolgreich aktualisiert.",

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

    // LLM Configuration Modal
    LLM_Configuration_Title: "LLM-Konfiguration",
    LLM_Configuration_Button_Label: "LLM-Konfiguration",
    LLM_Configuration_Update_Button: "Konfiguration aktualisieren",
    LLM_Configuration_Close_Button: "Schließen",
    LLM_Configuration_Success: "LLM-Konfiguration erfolgreich aktualisiert!",
    LLM_Configuration_Error: "Fehler beim Aktualisieren der LLM-Konfiguration:",
    LLM_Config_Command: "verwende `/email llm-config` - LLM-Konfiguration öffnen",

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
    Provider_Changed_Login_Message: "Sie können sich bei Ihrem __provider__ Konto anmelden",

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

    // Admin Configuration Error Messages
    Admin_Config_Missing_OAuth_Settings: "⚙️ **Administrator-Setup Erforderlich**\n\n**__provider__ Authentifizierung ist nicht konfiguriert.**\n\nDer Administrator muss OAuth-Einstellungen in den App-Einstellungen konfigurieren:\n\n**Erforderliche Einstellungen:**\n• Client ID\n• Client Secret\n• Redirect URI\n\nBitte kontaktieren Sie Ihren Systemadministrator, um die Einrichtung abzuschließen.",
    Admin_Config_Missing_Gmail_Settings: "⚙️ **Gmail OAuth Nicht Konfiguriert**\n\nIhr Administrator muss Gmail-Authentifizierung in den App-Einstellungen einrichten.\n\n**Fehlende Konfiguration:**\n• Google OAuth Client ID\n• Google OAuth Client Secret\n• OAuth Redirect URI\n\nBitte kontaktieren Sie Ihren Administrator, um diese Einstellungen zu konfigurieren.",
    Admin_Config_Missing_Outlook_Settings: "⚙️ **Outlook OAuth Nicht Konfiguriert**\n\nIhr Administrator muss Outlook-Authentifizierung in den App-Einstellungen einrichten.\n\n**Fehlende Konfiguration:**\n• Outlook OAuth Client ID\n• Outlook OAuth Client Secret\n• Outlook Redirect URI\n\nBitte kontaktieren Sie Ihren Administrator, um diese Einstellungen zu konfigurieren.",

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

    // Stats feature messages
    Stats_Provider_Not_Supported: "❌ **__provider__ wird für Statistiken nicht unterstützt.**\n\nBitte wenden Sie sich für Hilfe an Ihren Administrator.",
    Stats_Not_Authenticated: "❌ **Sie sind nicht bei __provider__ authentifiziert.**\n\nVerwenden Sie `/email login`, um sich zuerst anzumelden, und versuchen Sie dann erneut, die Statistiken zu erstellen.",
    Stats_Error: "❌ **Fehler beim Erstellen der E-Mail-Statistiken:**\n__error__\n\nBitte versuchen Sie es erneut oder wenden Sie sich an Ihren Administrator.",
    Stats_Header: "\n📊 **E-Mail-Statistikbericht(__timeRange__)**",
    Stats_Statistics: "**Empfangen**: __receivedToday__ E-Mails\n**Gesendet**: __sentToday__ E-Mails\n**Ungelesen**: __totalUnread__ E-Mails",
    Stats_Token_Expired: "❌ **Ihre Authentifizierung ist abgelaufen.**\n\nVerwenden Sie `/email login`, um Ihr __provider__-Konto erneut zu verbinden und es erneut zu versuchen.",
    Stats_Categories_Label: "Statistik-Kategorien",
    Stats_Days_Invalid: "❌ **Ungültiger Tage-Parameter.**\n\nBitte geben Sie eine gültige Anzahl von Tagen an (1-15).",
    Stats_Days_Range_Error: "❌ **Tage-Parameter außerhalb des Bereichs.**\n\nStatistiken können nur für maximal 15 Tage erstellt werden.",
    Stats_Time_Range_24_Hours: "letzte 24 Stunden",
    Stats_Time_Range_Days: "letzte __days__ Tage",

    // Statistics Service Errors
    Statistics_Provider_Not_Supported: "Statistics for provider __provider__ are not supported.",
    Statistics_Not_Implemented: "Statistics are not implemented for provider: __provider__",
    Gmail_Stats_Failed: "Failed to get Gmail statistics: __error__",
    Outlook_Stats_Failed: "Failed to get Outlook statistics: __error__",

    // User Preference Modal
    New_Category_Label: "New Category",
    New_Categories_Placeholder: "Add new categories, comma-separated...",

    // System Prompt Configuration  
    System_Prompt_Label: "System-Prompt",
    System_Prompt_Placeholder: "Passen Sie Ihren E-Mail-Ton an (z.B. [Sie sind John, ein Softwareentwickler bei Rocket Chat. Sie sind sehr beschäftigt und so ist auch jeder, mit dem Sie korrespondieren, daher geben Sie Ihr Bestes, um Ihre E-Mails so kurz wie möglich und auf den Punkt zu halten. Geben Sie Ihr Bestes, um freundlich zu sein, und seien Sie nicht so unformell, dass es hörbar ist...]",

    // Tool Calling Messages
    LLM_Processing_Query: "Verarbeitung: \"__query__\"...",
    LLM_User_Query_Display: "**Ihre Anfrage ist:** __query__",
    LLM_AI_Thinking: "_denken_...",
    LLM_Email_Ready_User: "Hallo __name__, Ihre E-Mail mit dem Titel **__subject__** ist versandbereit.",
    LLM_Tool_Detected: "**Tool Erkannt** für Anfrage: \"__query__\"\n\n**Tool:** __tool__",
    LLM_No_Tool_Detected: "Kein geeignetes Tool für Anfrage gefunden: \"__query__\"",
    LLM_Error_Processing: "**Fehler bei der Verarbeitung der Anfrage:** \"__query__\"\n\n**Fehler:** __error__",
    Tool_Call_Result: "Tool-Aufruf Ergebnis",
    Tool_Name_Label: "Tool",
    Tool_Args_Label: "Argumente",
    Query_Processed_Success: "Anfrage erfolgreich verarbeitet",
    Invalid_Tool_Name: "Ungültiger Tool-Name erkannt",
    LLM_Parsing_Failed: "Fehler beim Parsen der LLM-Antwort",

    // Tool Names (for user display)
    Tool_Send_Email: "E-Mail Senden",
    Tool_Extract_Attachment: "Anhänge Extrahieren",
    Tool_Summarize_And_Send: "Zusammenfassen & E-Mail Senden",
    Tool_Stats: "Statistiken Erstellen",

    // Send Email Modal
    Send_Email_Modal_Title: "E-Mail senden",
    Send_Email_To_Label: "An",
    Send_Email_To_Placeholder: "E-Mail-Adressen der Empfänger eingeben (durch Kommas getrennt)",
    Send_Email_CC_Label: "CC (Optional)",
    Send_Email_CC_Placeholder: "CC E-Mail-Adressen eingeben (durch Kommas getrennt)",
    Send_Email_Subject_Label: "Betreff",
    Send_Email_Subject_Placeholder: "E-Mail-Betreff eingeben",
    Send_Email_Content_Label: "Nachricht",
    Send_Email_Content_Placeholder: "Geben Sie Ihren Nachrichteninhalt ein",
    Send_Email_Send_Button: "E-Mail senden",
    Send_Email_Cancel_Button: "Abbrechen",
    Send_Email_Test_Button: "Test-E-Mail an mich senden",
    Send_Email_Modal_Opened: "E-Mail senden Modal geöffnet",
    Send_Email_Success: "E-Mail erfolgreich gesendet ✅",
    Send_Email_Failed: "Fehler beim Senden der E-Mail: __error__",
    Send_Email_Error_No_From_Email: "E-Mail-Adresse des Absenders kann nicht ermittelt werden",
    Send_Email_Validation_To_Required: "Empfänger-E-Mail-Adresse ist erforderlich",
    Send_Email_Validation_Subject_Required: "E-Mail-Betreff ist erforderlich",
    Send_Email_Validation_Content_Required: "E-Mail-Inhalt ist erforderlich",

    // Send Email Button Translations
    Email_Ready_To_Send: "E-Mail ist versandbereit",
    Email_Send_Button: "Senden",
    Email_Edit_And_Send_Button: "Bearbeiten & Senden",

    // Send Email with Status
    Send_Email_Success_With_Emoji: "E-Mail erfolgreich gesendet",
    Send_Email_Failed_With_Emoji: "Fehler beim Senden der E-Mail: __error__",

    // Send/Edit Action Buttons
    SEND_ACTION_TEXT: "Senden",
    EDIT_SEND_ACTION_TEXT: "Bearbeiten & Senden",

    // LLM Error Messages
    LLM_No_Response: "Keine Antwort vom KI-Dienst erhalten. Bitte versuchen Sie es erneut.",
    LLM_No_Choices: "Fehler beim Verbinden mit dem KI-Dienst. Bitte überprüfen Sie Ihren API-Schlüssel oder URL.",
    LLM_Request_Failed: "Kommunikation mit KI-Dienst fehlgeschlagen",

    // Summarization Messages
    No_Messages_To_Summarize: "Keine Nachrichten gefunden, die basierend auf Ihren Kriterien zusammengefasst werden können.",
    Summary_Generation_Failed: "Eine Zusammenfassung der Nachrichten konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
    LLM_Summary_Email_Ready_User: "Hallo __name__, Ihre E-Mail mit Zusammenfassung aus Kanal: **__channelName__** mit dem Titel \"**__subject__**\" ist versandbereit.",
    LLM_Parsing_Error: "Ich konnte Ihre Anfrage nicht verstehen. Bitte versuchen Sie es mit einfacheren E-Mail-Adressen oder Inhalten umzuformulieren.",

    // Email Ready Messages with Recipients
    LLM_Email_Ready_User_With_Recipients: "**KI-Antwort:** Hallo __name__, Ihre E-Mail mit dem Titel **__subject__** ist bereit zum Senden an __recipients__",
    LLM_Summary_Email_Ready_User_With_Recipients: "**KI-Antwort:** Hallo __name__, Ihre E-Mail mit Zusammenfassung aus Kanal: **__channelName__** mit dem Titel \"**__subject__**\" ist bereit zum Senden an __recipients__",

    // New format constants for specific display format
    LLM_Email_To_Label: "**An:**",
    LLM_Email_CC_Label: "**Kopie:**",
    LLM_Email_Subject_Label: "**Betreff:**",
    LLM_Email_Ready_Formatted: "Hallo __name__, Ihre E-Mail ist bereit zum Senden",
    LLM_Summary_Email_Ready_Formatted: "Hallo __name__, Ihre E-Mail mit Zusammenfassung aus Kanal: **__channelName__** ist bereit zum Senden",

    // Error message details for MessageFormatter
    Error_Email_Data_Unavailable: "E-Mail-Daten sind nicht mehr verfügbar. Bitte versuchen Sie Ihre Anfrage erneut.",
    Error_Please_Try_Again: "Bitte versuchen Sie es erneut.",
    Error_Processing_Summary_Request: "Es gab ein Problem bei der Verarbeitung Ihrer Zusammenfassungsanfrage. Bitte versuchen Sie es erneut.",

    // LLM Configuration Settings
    LLM_Provider_Label: "LLM-Anbieter",
    LLM_Provider_Description: "Wählen Sie den KI-Sprachmodell-Anbieter für die Verarbeitung von E-Mail-Befehlen",
    LLM_Provider_Default_Label: "Standard (Selbst gehostet)",
    LLM_Provider_OpenAI_Label: "OpenAI",
    LLM_Provider_Gemini_Label: "Google Gemini",
    LLM_Provider_Groq_Label: "Groq",
    OpenAI_API_Key_Label: "OpenAI API-Schlüssel",
    OpenAI_API_Key_Description: "Ihr OpenAI API-Schlüssel für den Zugriff auf GPT-Modelle (nur bei Verwendung des OpenAI-Anbieters erforderlich)",
    Gemini_API_Key_Label: "Google Gemini API-Schlüssel",
    Gemini_API_Key_Description: "Ihr Google AI Studio API-Schlüssel für den Zugriff auf Gemini-Modelle (nur bei Verwendung des Gemini-Anbieters erforderlich)",
    Groq_API_Key_Label: "Groq API-Schlüssel",
    Groq_API_Key_Description: "Ihr Groq API-Schlüssel für den Zugriff auf Llama-Modelle (nur bei Verwendung des Groq-Anbieters erforderlich)",

    // User LLM Preferences
    LLM_Usage_Preference_Label: "LLM-Nutzungspräferenz",
    LLM_Usage_Preference_Placeholder: "LLM-Nutzungspräferenz wählen",
    LLM_Usage_Preference_Personal: "Persönlich",
    LLM_Usage_Preference_Workspace: "Arbeitsbereich",
    LLM_Provider_User_Label: "LLM-Anbieter",
    LLM_Provider_User_Placeholder: "LLM-Anbieter wählen",
    LLM_Provider_SelfHosted: "Selbst gehostet",
    LLM_Provider_OpenAI: "OpenAI",
    LLM_Provider_Gemini: "Gemini",
    LLM_Provider_Groq: "Groq",
    SelfHosted_URL_Label: "Selbst gehostete LLM-URL",
    SelfHosted_URL_Placeholder: "Geben Sie Ihre selbst gehostete LLM-URL ein",
    OpenAI_API_Key_User_Label: "OpenAI API-Schlüssel",
    OpenAI_API_Key_User_Placeholder: "Geben Sie Ihren OpenAI API-Schlüssel ein",
    Gemini_API_Key_User_Label: "Gemini API-Schlüssel",
    Gemini_API_Key_User_Placeholder: "Geben Sie Ihren Gemini API-Schlüssel ein",
    Groq_API_Key_User_Label: "Groq API-Schlüssel",
    Groq_API_Key_User_Placeholder: "Geben Sie Ihren Groq API-Schlüssel ein",

    // LLM Configuration Validation Messages
    LLM_Config_Provider_Required: "Bitte wählen Sie einen LLM-Anbieter aus",
    LLM_Config_SelfHosted_URL_Required: "Self-hosted URL ist für den ausgewählten Anbieter erforderlich",
    LLM_Config_Invalid_URL: "Bitte geben Sie eine gültige URL ein",
    LLM_Config_OpenAI_Key_Required: "OpenAI API-Schlüssel ist für den ausgewählten Anbieter erforderlich",
    LLM_Config_Invalid_OpenAI_Key: "OpenAI API-Schlüssel sollte mit 'sk-' beginnen",
    LLM_Config_Gemini_Key_Required: "Gemini API-Schlüssel ist für den ausgewählten Anbieter erforderlich",
    LLM_Config_Groq_Key_Required: "Groq API-Schlüssel ist für den ausgewählten Anbieter erforderlich",
    LLM_Config_Invalid_Provider: "Ungültiger LLM-Anbieter ausgewählt",
    LLM_API_Or_URL_Error: "Bitte überprüfen Sie Ihren LLM API-Schlüssel oder URL",

    // Send Type dropdown
    Send_Type_Label: "Sendetyp",
    Send_Type_Recipients: "An Empfänger senden",
    Send_Type_Test_Self: "Test-E-Mail an mich senden",
    
    // Test Email notifications
    Test_Email_Success: "Test-E-Mail an Ihre Adresse gesendet ✅",
    Test_Email_Success_With_Email: "Test-E-Mail gesendet an: __userEmail__ ✅",
    Test_Email_Failed: "Test-E-Mail konnte nicht gesendet werden ❌",
    Test_Email_No_User_Email: "E-Mail-Adresse konnte nicht abgerufen werden ❌",
};
