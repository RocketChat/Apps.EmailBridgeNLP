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
    
    // Outlook OAuth Settings
    Outlook_OAuth_Client_ID_Label: "Outlook OAuth Client ID",
    Outlook_OAuth_Client_ID_Description: "OAuth client ID dla uwierzytelniania Outlook/Microsoft",
    Outlook_OAuth_Client_Secret_Label: "Outlook OAuth Client Secret",
    Outlook_OAuth_Client_Secret_Description: "OAuth client secret dla uwierzytelniania Outlook/Microsoft",
    Outlook_OAuth_Redirect_URI_Label: "Outlook OAuth Redirect URI",
    Outlook_OAuth_Redirect_URI_Description: "OAuth redirect URI dla Outlook - powinno kończyć się na /api/apps/public/[app-id]/oauth-callback",
    
    // Commands
    Email_Command_Params: "połącz, status, rozłącz, pomoc, raport",
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
    Invalid_Email_Provider: "Wybrano nieprawidłowego dostawcę e-mail. Sprawdź swoją konfigurację.",
    Authentication_Required: "Wymagane uwierzytelnienie. Połącz swoje konto e-mail.",
    Connection_Status_Connected: "Konto e-mail jest połączone i gotowe do użycia.",
    Connection_Status_Disconnected: "Brak połączonego konta e-mail.",
    Disconnect_Success: "Konto e-mail zostało pomyślnie rozłączone.",
    Disconnect_Failed: "Nie udało się rozłączyć twojego konta e-mail.",
    
    // Handler messages
    Already_Logged_In: "Jesteś już zalogowany jako **__provider__** (**__email__**).\n\nJeśli chcesz się wylogować, użyj `/email logout`.",
    Outlook_Coming_Soon: "**Uwierzytelnianie Outlook będzie wkrótce dostępne!**\n\nNa razie użyj **Gmail** do uwierzytelniania e-mail.\n\n",
    Provider_Not_Implemented: "**Uwierzytelnianie __provider__ nie jest jeszcze zaimplementowane.**\n\nObecnie tylko **Gmail** jest obsługiwane do uwierzytelniania.\n\n",
    Connect_Account_Message: "**Połącz swoje konto __provider__ z Rocket Chat**",
    Login_With_Provider: "Zaloguj się z __provider__",
    Error_Processing_Login: "Błąd podczas logowania: __error__",
    Not_Authenticated: "Nie jesteś uwierzytelniony z __provider__. Użyj `/email login` do zalogowania.",
    Logout_Confirmation: "**Potwierdzenie wylogowania**\n\nCzy na pewno chcesz się wylogować z konta **__provider__** **__email__**?",
    Confirm_Logout: "Potwierdź wylogowanie",
    Error_Preparing_Logout: "❌ Błąd podczas przygotowywania wylogowania: __error__",
    Provider_Not_Supported_Logout: "❌ **__provider__ nie jest obsługiwany do wylogowania.**\n\nSkontaktuj się z administratorem po pomoc.",
    Logout_Success: "**Pomyślnie wylogowano z konta __provider__.**\n\nMożesz teraz zalogować się na inne konto, jeśli to konieczne.",
    Logout_Failed: "❌ **Nie udało się wylogować z konta e-mail.**\n\nSpróbuj ponownie lub skontaktuj się z administratorem.",
    Logout_Error: "❌ **Wystąpił błąd podczas procesu wylogowania:**\n__error__\n\nSpróbuj ponownie lub skontaktuj się z administratorem.",
    Helper_Greeting: "Cześć __name__! Jestem Email Bot 👋. Oto kilka szybkich wskazówek na początek!",
    Available_Commands: "",
    Help_Command: "użyj `/email help` - Pokaż tę wiadomość pomocy",
    Login_Command: "użyj `/email login` - Zaloguj się na swoje konto e-mail",
    Logout_Command: "użyj `/email logout` - Wyloguj się z konta e-mail",
    Config_Command: "użyj `/email config` - Otwórz preferencje użytkownika i ustawienia",
    Report_Command: "użyj `/email report` - Pobierz dzienny raport statystyk e-mail",
    Default_Greeting: "Cześć __name__! Jestem Email Bot 👋. Mogę pomóc Ci ze wszystkimi potrzebami e-mail.",
    Use_Help_Command: "Użyj `/email help` aby dowiedzieć się o wszystkich dostępnych funkcjach i poleceniach.",
    Login_Action_Text: "Zaloguj się do swojego konta e-mail",
    
    // User Preference Modal
    User_Preference_Title: "Preferencje użytkownika",
    User_Preference_Button_Label: "⚙️ Preferencje użytkownika",
    User_Preference_Update_Button: "Aktualizuj preferencje",
    User_Preference_Close_Button: "Zamknij",
    User_Preference_Success: "**Preferencje użytkownika zostały pomyślnie zaktualizowane!**",
    Language_Changed: "Język zmieniony na: __language__",
    Email_Provider_Changed: "Dostawca poczty e-mail zmieniony na: __provider__",
    User_Preference_Error: "**Błąd podczas aktualizacji preferencji użytkownika:**\n__error__",
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
    Config_Error: "Błąd konfiguracji: __error__",
    
    // Provider change messages
    Provider_Changed_Auto_Logout: "Zostałeś automatycznie wylogowany z **__oldProvider__**",
    Provider_Change_Warning: "⚠️ Ostrzeżenie: Zmiana dostawcy poczty e-mail automatycznie wyloguje Cię z bieżącego konta.",
    
    // Granular Error Messages (inspired by QuickReplies)
    Error_Fill_Required_Fields: "Błąd podczas przetwarzania żądania. Proszę wypełnić wszystkie wymagane pola ❌",
    Error_Fail_Internal: "Błąd wewnętrzny. Spróbuj ponownie później.",
    Error_Network_Failure: "Błąd połączenia sieciowego. Sprawdź połączenie internetowe i spróbuj ponownie.",
    Error_Invalid_Credentials: "Podano nieprawidłowe dane uwierzytelniające. Sprawdź ustawienia OAuth.",
    Error_Token_Expired: "Twój token uwierzytelniający wygasł. Zaloguj się ponownie.",
    Error_Token_Invalid: "Token uwierzytelniający jest nieprawidłowy. Zaloguj się ponownie.",
    Error_Missing_Configuration: "Brakuje wymaganej konfiguracji. Skontaktuj się z administratorem.",
    Error_Service_Unavailable: "Usługa poczty e-mail jest obecnie niedostępna. Spróbuj ponownie później.",
    Error_Rate_Limit_Exceeded: "Zbyt wiele żądań. Poczekaj chwilę i spróbuj ponownie.",
    Error_Permission_Denied: "Odmowa dostępu. Sprawdź uprawnienia swojego konta.",
    Error_User_Info_Missing: "Błąd podczas pobierania informacji o użytkowniku. Spróbuj zalogować się ponownie.",
    Error_Connection_Lost: "Utracono połączenie z usługą poczty e-mail. Sprawdź sieć i spróbuj ponownie.",
    Error_OAuth_Callback_Failed: "Callback OAuth nie powiódł się. Spróbuj ponownie proces uwierzytelniania.",
    Error_Settings_Not_Found: "Ustawienia poczty e-mail nie są skonfigurowane. Skontaktuj się z administratorem.",
    Error_Provider_Mismatch: "Niezgodność konfiguracji dostawcy poczty e-mail. Skontaktuj się z administratorem.",
    
    // Success Messages
    Success_Connection_Established: "Połączenie z pocztą e-mail nawiązane pomyślnie ✅",
    Success_User_Info_Retrieved: "Informacje o użytkowniku pobrane pomyślnie ✅",
    Success_Token_Refreshed: "Token uwierzytelniający odświeżony pomyślnie ✅",
    Success_Logout_Complete: "Pomyślnie wylogowano z konta poczty e-mail ✅",
    Success_Configuration_Updated: "Konfiguracja poczty e-mail zaktualizowana pomyślnie ✅",
    
    // OAuth Specific Errors
    OAuth_Error_Authorization_Denied: "Autoryzacja została odrzucona. Spróbuj ponownie i udziel niezbędnych uprawnień.",
    OAuth_Error_Invalid_State: "Nieprawidłowy parametr stanu OAuth. To może być problem bezpieczeństwa. Spróbuj ponownie.",
    OAuth_Error_Code_Exchange_Failed: "Błąd podczas wymiany kodu autoryzacji na tokeny. Spróbuj ponownie.",
    OAuth_Error_Invalid_Grant: "Nieprawidłowy grant OAuth. Twój kod autoryzacji mógł wygasnąć. Spróbuj ponownie.",
    OAuth_Error_Scope_Insufficient: "Niewystarczające uprawnienia zakresu OAuth. Skontaktuj się z administratorem.",
    
    // User-Friendly Error Messages
    User_Friendly_Auth_Error: "**Błąd uwierzytelniania**\n\nNie mogliśmy połączyć się z Twoim kontem poczty e-mail. To może być spowodowane tym, że:\n• Twoje dane uwierzytelniające wygasły\n• Usługa jest tymczasowo niedostępna\n• Wystąpił problem z konfiguracją\n\nSpróbuj ponownie lub skontaktuj się z administratorem, jeśli problem będzie się powtarzał.",
    User_Friendly_Network_Error: "**Problem z połączeniem**\n\nMamy problemy z połączeniem do usługi poczty e-mail. Proszę:\n• Sprawdź połączenie internetowe\n• Spróbuj ponownie za chwilę\n• Skontaktuj się z pomocą techniczną, jeśli problem będzie się powtarzał",
    User_Friendly_Config_Error: "**Problem z konfiguracją**\n\nWystąpił problem z konfiguracją usługi poczty e-mail. Skontaktuj się z administratorem, aby rozwiązać ten problem.",
    
    // Modal Error Messages
    Modal_Error_Failed_To_Open: "Błąd podczas otwierania modalu preferencji. Spróbuj ponownie.",
    Modal_Error_Save_Failed: "Błąd podczas zapisywania preferencji. Sprawdź dane wejściowe i spróbuj ponownie.",
    Modal_Error_Invalid_Input: "Podano nieprawidłowe dane wejściowe. Sprawdź wpisy i spróbuj ponownie.",
    
    // Form Validation Messages
    Validation_Email_Required: "Adres e-mail jest wymagany.",
    Validation_Email_Invalid: "Wprowadź prawidłowy adres e-mail.",
    Validation_Field_Required: "To pole jest wymagane.",
    Validation_Field_Too_Long: "Dane wejściowe są za długie. Maksymalna długość to __max__ znaków.",
    Validation_Field_Too_Short: "Dane wejściowe są za krótkie. Minimalna długość to __min__ znaków.",
    
    // OAuth Endpoint Error Messages
    OAuth_Endpoint_Error_Obtaining_Token: "Błąd podczas uzyskiwania tokenu dostępu: __error__",
    OAuth_Endpoint_General_Error: "Wystąpił błąd: __error__",
    OAuth_Endpoint_Missing_Parameters: "Brakuje wymaganych parametrów (kod lub stan)",
    OAuth_Endpoint_Invalid_State: "Nieprawidłowe lub wygasłe żądanie autoryzacji",
    OAuth_Endpoint_Authentication_Failed: "Uwierzytelnianie nie powiodło się",
    OAuth_Endpoint_OAuth_Error: "Błąd OAuth: __error__ - __description__",
    OAuth_Endpoint_Enhanced_Error: "__prefix__: __message__",
    
    // Modal and UI Error Messages
    Error_Modal_Creation_Failed: "Nie udało się utworzyć modalu preferencji użytkownika",
    Error_Trigger_ID_Missing: "Identyfikator wyzwalacza niedostępny do otwarcia modalu",
    
    // Storage Error Messages
    Storage_Failed_Save_Credentials: "Nie udało się zapisać danych uwierzytelniających OAuth",
    Storage_Failed_Delete_Credentials: "Nie udało się usunąć danych uwierzytelniających OAuth", 
    Storage_Failed_Save_State: "Nie udało się zapisać stanu OAuth",
    
    // Generic Account Reference
    Generic_Account: "Twoje konto",
    
    // OAuth Endpoint Short Keys (shorter names as requested)
    OAuth_Redir_Err: "Błąd dopasowania URI przekierowania. Upewnij się, że rejestracja aplikacji Azure zawiera dokładny URI: __uri__",
    OAuth_SSL_Err: "Błąd protokołu SSL/TLS. Dla rozwoju localhost upewnij się, że rejestracja aplikacji Azure zawiera HTTP (nie HTTPS) URI przekierowania",
    Provider_Label: "__provider__",
    
    // Logger Messages (ultra-short keys)
    Log_Logout_Err: "Błąd podczas próby czyszczenia wylogowania",
    Log_Async_Logout: "Błąd w asynchronicznej akcji wylogowania", 
    Log_Async_Pref: "Błąd w asynchronicznej akcji preferencji użytkownika",
    Log_Pref_Handle: "Błąd w handleUserPreferenceAction",
    Log_Auto_Logout: "Błąd podczas automatycznego wylogowania przy zmianie dostawcy",
    Log_Pref_Submit: "Błąd w handleUserPreferenceSubmit",
    Log_Notif_Err: "Nie udało się wysłać powiadomienia o błędzie",
    Log_Success_Err: "Nie udało się wysłać powiadomienia o sukcesie", 
    Log_Btn_Fallback: "Nie udało się utworzyć powiadomienia z przyciskiem logowania, przełączenie na powiadomienie tekstowe",
    Log_Fallback_Err: "Nie udało się wysłać zapasowego powiadomienia tekstowego",
    
    // Report feature messages
    Report_Provider_Not_Supported: "❌ **__provider__ nie jest obsługiwany dla raportów.**\n\nSkontaktuj się z administratorem w celu uzyskania pomocy.",
    Report_Not_Authenticated: "❌ **Nie jesteś uwierzytelniony z __provider__.**\n\nUżyj `/email login`, aby się najpierw zalogować, a następnie spróbuj ponownie wygenerować raport.",
    Report_Error: "❌ **Błąd podczas generowania raportu e-mail:**\n__error__\n\nSpróbuj ponownie lub skontaktuj się z administratorem.",
    Report_Header: "\n📊 **Raport Statystyk E-mail(ostatnie 24 godziny)**",
    Report_Statistics: "**Odebrane**: __receivedToday__ e-maile\n**Wysłane**: __sentToday__ e-maile\n**Nieprzeczytane**: __totalUnread__ e-maile",
    Report_Token_Expired: "❌ **Twoja autentykacja wygasła.**\n\nUżyj `/email login`, aby ponownie połączyć swoje konto __provider__ i spróbować ponownie.",
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