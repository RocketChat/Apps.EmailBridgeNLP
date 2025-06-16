export const pl = {
    // Settings
    Email_Provider_Label: "Dostawca poczty e-mail",
    Email_Provider_Description: "Wybierz swojego dostawcę usług e-mail do uwierzytelniania",
    Gmail_Label: "Gmail",
    Outlook_Label: "Outlook/Hotmail",
    Google_OAuth_Client_ID_Label: "Google OAuth Client ID",
    Google_OAuth_Client_ID_Description: "OAuth client ID do uwierzytelniania Google (tylko Gmail)",
    Google_OAuth_Client_Secret_Label: "Google OAuth Client Secret",
    Google_OAuth_Client_Secret_Description: "OAuth client secret do uwierzytelniania Google (tylko Gmail)",
    OAuth_Redirect_URI_Label: "OAuth Redirect URI",
    OAuth_Redirect_URI_Description: "OAuth redirect URI - powinno kończyć się na /api/apps/public/[app-id]/oauth-callback",
    
    // Commands
    Email_Command_Params: "połącz, status, rozłącz, pomoc",
    Email_Command_Description: "Połącz i zarządzaj integracją swojego konta e-mail z pomocą AI.",
    
    // OAuth Pages
    Authentication_Error_Title: "Błąd uwierzytelniania",
    Authentication_Success_Title: "Uwierzytelnianie zakończone sukcesem!",
    Connected_Account_Message: "Pomyślnie połączyłeś swoje konto Gmail:",
    Try_Again_Message: "Spróbuj ponownie lub skontaktuj się z administratorem.",
    Close_Window_Label: "Zamknij okno",
    Features_Available_Message: "Możesz teraz używać funkcji Email Assistant w Rocket.Chat!",
    Safe_To_Close_Message: "Możesz bezpiecznie zamknąć to okno i wrócić do Rocket.Chat.",
    
    // Action Labels
    Connect_Email_Action_Label: "Połącz konto e-mail",
    Check_Status_Action_Label: "Sprawdź status połączenia",
    Disconnect_Email_Action_Label: "Rozłącz e-mail",
    Send_Email_Action_Label: "Wyślij e-mail",
    View_Inbox_Action_Label: "Zobacz skrzynkę odbiorczą",
    
    // Messages
    OAuth_Connection_Success: "Pomyślnie połączono z twoim kontem e-mail!",
    OAuth_Connection_Failed: "Nie udało się połączyć z twoim kontem e-mail. Spróbuj ponownie.",
    Email_Not_Connected: "Brak połączonego konta e-mail. Najpierw połącz swoje konto.",
    Invalid_Email_Provider: "Wybrano nieprawidłowego dostawcę e-mail. Sprawdź swoje ustawienia.",
    Authentication_Required: "Wymagane uwierzytelnianie. Połącz swoje konto e-mail.",
    Connection_Status_Connected: "Konto e-mail jest połączone i gotowe do użycia.",
    Connection_Status_Disconnected: "Brak połączonego konta e-mail.",
    Disconnect_Success: "Pomyślnie rozłączono konto e-mail.",
    Disconnect_Failed: "Nie udało się rozłączyć konta e-mail.",
    
    // Handler messages
    Already_Logged_In: "✅ Jesteś już zalogowany z **__provider__** jako **__email__**.\n\nJeśli chcesz się wylogować, użyj `/email logout`.",
    Outlook_Coming_Soon: "🚧 **Uwierzytelnianie Outlook już wkrótce!**\n\nNa razie użyj **Gmail** do uwierzytelniania e-mail.\n\n",
    Provider_Not_Implemented: "❌ **Uwierzytelnianie __provider__ nie jest jeszcze zaimplementowane.**\n\nObecnie tylko **Gmail** jest obsługiwany do uwierzytelniania.\n\n",
    Connect_Account_Message: "🔐 **Połącz swoje konto __provider__ z Rocket Chat**",
    Login_With_Provider: "🔑 Zaloguj się z __provider__",
    Error_Processing_Login: "❌ Błąd przetwarzania logowania: __error__",
    Not_Authenticated: "❌ Nie jesteś obecnie uwierzytelniony z __provider__. Użyj `/email login` aby się zalogować.",
    Logout_Confirmation: "🔓 **Potwierdzenie wylogowania**\n\nCzy na pewno chcesz się wylogować z konta **__provider__** **__email__**?",
    Confirm_Logout: "🔒 Potwierdź wylogowanie",
    Error_Preparing_Logout: "❌ Błąd przygotowywania wylogowania: __error__",
    
    // Logout action messages
    Provider_Not_Supported_Logout: "❌ **__provider__ nie jest obsługiwany do wylogowania.**\n\nSkontaktuj się z administratorem po pomoc.",
    Logout_Success: "✅ **Pomyślnie wylogowano z konta __provider__.**",
    Logout_Failed: "❌ **Nie udało się wylogować z konta e-mail.**\n\nSpróbuj ponownie lub skontaktuj się z administratorem.",
    Logout_Error: "❌ **Wystąpił błąd podczas procesu wylogowania:**\n__error__\n\nSpróbuj ponownie lub skontaktuj się z administratorem.",
    
    // Notification messages
    Helper_Greeting: "Cześć __name__! Jestem Email Bot 👋. Oto kilka szybkich wskazówek na początek!",
    Available_Commands: "",
    Help_Command: "użyj `/email help` - Pokaż tę wiadomość pomocy",
    Login_Command: "użyj `/email login` - Zaloguj się do swojego konta e-mail",
    Logout_Command: "użyj `/email logout` - Wyloguj się z konta e-mail",
    Config_Command: "użyj `/email config` - Otwórz preferencje użytkownika i ustawienia",
    Default_Greeting: "Cześć __name__! Jestem Email Bot 👋. Mogę pomóc Ci ze wszystkimi potrzebami e-mail.",
    Use_Help_Command: "Użyj `/email help` aby dowiedzieć się o wszystkich dostępnych funkcjach i poleceniach.",
    Login_Action_Text: "Zaloguj się do swojego konta e-mail",
    
    // User Preference Modal
    User_Preference_Title: "⚙️ Preferencje użytkownika",
    User_Preference_Button_Label: "⚙️ Preferencje użytkownika",
    User_Preference_Update_Button: "Aktualizuj preferencje",
    User_Preference_Close_Button: "Zamknij",
    User_Preference_Success: "**Preferencje użytkownika zostały pomyślnie zaktualizowane!**",
    Language_Changed: "Język zmieniony na: __language__",
    Email_Provider_Changed: "Dostawca poczty e-mail zmieniony na: __provider__",
    User_Preference_Error: "❌ **Błąd podczas aktualizacji preferencji użytkownika:**\n__error__",
    Email_Provider_Preference_Label: "Dostawca poczty e-mail",
    Email_Provider_Preference_Description: "Wybierz preferowanego dostawcę e-mail do uwierzytelniania",
    
    // Language names
    Language: "Język",
    Language_EN: "Angielski",
    Language_ES: "Hiszpański",
    Language_DE: "Niemiecki",
    Language_PL: "Polski",
    Language_PT: "Portugalski",
    Language_RU: "Rosyjski",
    
    // Config error messages
    Config_Error: "❌ Błąd konfiguracji: __error__",
}; 