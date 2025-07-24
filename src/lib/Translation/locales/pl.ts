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
    Email_Command_Params: "login, logout, config, llm-config, help, stats",
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
    Disconnect_Success: "Konto e-mail zostało pomyślnie wylogowane.",
    Disconnect_Failed: "Nie udało się wylogować twojego konta e-mail.",

    // Login success notifications (webhook)
    Login_Success_Notification: "✅ **Logowanie pomyślne!**\n\nJesteś teraz połączony z **__provider__** jako **__email__**.\n\nMożesz teraz używać funkcji EmailBridge NLP!",

    // Welcome message content (onInstall)
    Welcome_Title: "**Aplikacja Email Assistant**",
    Welcome_Description: "**Zainstalowana i Gotowa do Połączenia Twojego Email z AI!**",
    Welcome_Text: "Witamy w **Email Assistant** w RocketChat!",
    Welcome_Message: `
        🚀 **Zacznij w 3 Prostych Krokach:**
        
        1️⃣ **Połącz Email**: Użyj \`/email login\` aby połączyć Gmail lub Outlook
        2️⃣ **Skonfiguruj Ustawienia**: Użyj \`/email config\` aby ustawić preferencje
        3️⃣ **Używaj AI**: Wysyłaj komendy w języku naturalnym jak \`/email send an email to @john.doe about the meeting...\`.
        
        📧 **Co Możesz Robić:**
        • **Inteligentne Zarządzanie Email**: "wyślij email do john@company.com o spotkaniu"
        • **Podsumowania Kanału**: "podsumuj tę rozmowę i wyślij emailem do manager@company.com"
        • **Szybkie Statystyki**: Otrzymuj codzienne statystyki email i insights. Użyj \`/email stats\`.
        
        📊 **Funkcja Statystyk Email:**
        Otrzymuj spersonalizowane dzienne raporty pokazujące:
        • Łączną liczbę otrzymanych i wysłanych emaili
        • Głównych nadawców i odbiorców
        • Kategorie emaili (praca, osobiste, powiadomienia)
        
        ⚙️ **Obsługiwani Dostawcy:**
        • **Gmail**
        • **Outlook**
        
        🌍 **Wsparcie Wielojęzyczne:**
        Dostępne w języku angielskim, hiszpańskim, rosyjskim, niemieckim, polskim i portugalskim
        
        Potrzebujesz pomocy? Wpisz \`/email help\` w dowolnym momencie!
        
        Dziękujemy za wybór **Email Assistant** - Twojego AI Asystenta Email! 🤖
        `,

    // Handler messages
    Already_Logged_In: "Jesteś już zalogowany z **__provider__** jako **__email__**.\n\nJeśli chcesz się wylogować, użyj `/email logout`.",
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
    Stats_Command: "użyj `/email stats` - Pobierz dzienny raport statystyk e-mail",
    Default_Greeting: "Cześć __name__! Jestem Email Bot 👋. Mogę pomóc Ci ze wszystkimi potrzebami e-mail.",
    Use_Help_Command: "Użyj `/email help` aby dowiedzieć się o wszystkich dostępnych funkcjach i poleceniach.",
    Login_Action_Text: "Zaloguj się do __provider__",

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

    // LLM Configuration Modal
    LLM_Configuration_Title: "Konfiguracja LLM",
    LLM_Configuration_Button_Label: "Konfiguracja LLM",
    LLM_Configuration_Update_Button: "Aktualizuj konfiguracji",
    LLM_Configuration_Close_Button: "Zamknij",
    LLM_Configuration_Success: "Konfiguracja LLM została pomyślnie zaktualizowana!",
    LLM_Configuration_Error: "Błąd podczas aktualizacji konfiguracji LLM:",
    LLM_Config_Command: "użyj `/email llm-config` - Otwórz ustawienia konfiguracji LLM",

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
    Provider_Changed_Login_Message: "Możesz zalogować się na swoje konto __provider__",

    // Granular Error Messages
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

    // Stats feature messages
    Stats_Provider_Not_Supported: "❌ **__provider__ nie jest obsługiwany dla statystyk.**\n\nSkontaktuj się z administratorem w celu uzyskania pomocy.",
    Stats_Not_Authenticated: "❌ **Nie jesteś uwierzytelniony z __provider__.**\n\nUżyj `/email login`, aby się najpierw zalogować, a następnie spróbuj ponownie wygenerować statystyki.",
    Stats_Error: "❌ **Błąd podczas generowania statystyk e-mail:**\n__error__\n\nSpróbuj ponownie lub skontaktuj się z administratorem.",
    Stats_Header: "\n📊 **Raport Statystyk E-mail(ostatnie 24 godziny)**",
    Stats_Statistics: "**Odebrane**: __receivedToday__ e-maile\n**Wysłane**: __sentToday__ e-maile\n**Nieprzeczytane**: __totalUnread__ e-maile",
    Stats_Token_Expired: "❌ **Twoja autentykacja wygasła.**\n\nUżyj `/email login`, aby ponownie połączyć swoje konto __provider__ i spróbować ponownie.",
    Stats_Categories_Label: "Kategorie Statystyk",

    // Statistics Service Errors
    Statistics_Provider_Not_Supported: "Statistics for provider __provider__ are not supported.",
    Statistics_Not_Implemented: "Statistics are not implemented for provider: __provider__",
    Gmail_Stats_Failed: "Failed to get Gmail statistics: __error__",
    Outlook_Stats_Failed: "Failed to get Outlook statistics: __error__",

    // User Preference Modal
    New_Category_Label: "New Category",
    New_Categories_Placeholder: "Add new categories, comma-separated...",
    // Tool Calling Messages
    LLM_Processing_Query: "Przetwarzanie: \"__query__\"...",
    LLM_User_Query_Display: "**Twoje zapytanie to:** __query__",
    LLM_AI_Thinking: "_myślenie_...",
    LLM_Email_Ready_User: "Cześć __name__, Twój e-mail zatytułowany **__subject__** jest gotowy do wysłania.",
    LLM_Tool_Detected: "**Narzędzie Wykryte** dla zapytania: \"__query__\"\n\n**Narzędzie:** __tool__",
    LLM_No_Tool_Detected: "Nie znaleziono odpowiedniego narzędzia dla zapytania: \"__query__\"",
    LLM_Error_Processing: "**Błąd przetwarzania zapytania:** \"__query__\"\n\n**Błąd:** __error__",
    Tool_Call_Result: "Wynik Wywołania Narzędzia",
    Tool_Name_Label: "Narzędzie",
    Tool_Args_Label: "Argumenty",
    Query_Processed_Success: "Zapytanie przetworzone pomyślnie",
    Invalid_Tool_Name: "Wykryto nieprawidłową nazwę narzędzia",
    LLM_Parsing_Failed: "Nie udało się przeanalizować odpowiedzi LLM",

    // Tool Names (for user display)
    Tool_Send_Email: "Wyślij Email",
    Tool_Extract_Attachment: "Wyodrębnij Załączniki",
    Tool_Summarize_And_Send: "Podsumuj i Wyślij Email",
    Tool_Stats: "Generuj Statystyki",

    // Send Email Modal
    Send_Email_Modal_Title: "Wyślij e-mail",
    Send_Email_To_Label: "Do",
    Send_Email_To_Placeholder: "Wprowadź adresy e-mail odbiorców (oddzielone przecinkami)",
    Send_Email_CC_Label: "DW (Opcjonalnie)",
    Send_Email_CC_Placeholder: "Wprowadź adresy e-mail DW (oddzielone przecinkami)",
    Send_Email_Subject_Label: "Temat",
    Send_Email_Subject_Placeholder: "Wprowadź temat e-maila",
    Send_Email_Content_Label: "Wiadomość",
    Send_Email_Content_Placeholder: "Wprowadź treść wiadomości",
    Send_Email_Send_Button: "Wyślij e-mail",
    Send_Email_Cancel_Button: "Anuluj",
    Send_Email_Modal_Opened: "Modal kompozycji e-maila pomyślnie otwarty",
    Send_Email_Success: "E-mail wysłany pomyślnie ✅",
    Send_Email_Failed: "Nie udało się wysłać e-maila: __error__",
    Send_Email_Error_No_From_Email: "Nie można określić adresu e-mail nadawcy",
    Send_Email_Validation_To_Required: "Adres e-mail odbiorcy jest wymagany",
    Send_Email_Validation_Subject_Required: "Temat wiadomości e-mail jest wymagany",
    Send_Email_Validation_Content_Required: "Treść wiadomości e-mail jest wymagana",

    // Send Email Button Translations
    Email_Ready_To_Send: "E-mail gotowy do wysłania",
    Email_Send_Button: "Wyślij",
    Email_Edit_And_Send_Button: "Edytuj i Wyślij",

    // Send Email with Status
    Send_Email_Success_With_Emoji: "✅ E-mail wysłany pomyślnie",
    Send_Email_Failed_With_Emoji: "❌ Nie udało się wysłać e-maila: __error__",

    // Send/Edit Action Buttons
    SEND_ACTION_TEXT: "Wyślij",
    EDIT_SEND_ACTION_TEXT: "Edytuj i wyślij",

    // LLM Error Messages
    LLM_No_Response: "Nie otrzymano odpowiedzi z usługi AI. Spróbuj ponownie.",
    LLM_No_Choices: "Błąd podczas łączenia z usługą AI. Sprawdź swój klucz API lub URL.",
    LLM_Request_Failed: "Komunikacja z usługą AI nie powiodła się",

    // Summarization Messages
    No_Messages_To_Summarize: "Nie znaleziono wiadomości do podsumowania według Twoich kryteriów.",
    Summary_Generation_Failed: "Nie udało się wygenerować podsumowania wiadomości. Spróbuj ponownie.",
    LLM_Summary_Email_Ready_User: "Cześć __name__, Twój e-mail z podsumowaniem z kanału: **__channelName__** zatytułowany \"**__subject__**\" jest gotowy do wysłania.",
    LLM_Parsing_Error: "Nie mogłem zrozumieć Twojego żądania. Spróbuj przeformułować je z prostszymi adresami e-mail lub treścią.",

    // Email Ready Messages with Recipients
    LLM_Email_Ready_User_With_Recipients: "**Odpowiedź AI:** Cześć __name__, Twój e-mail zatytułowany **__subject__** jest gotowy do wysłania do __recipients__",
    LLM_Summary_Email_Ready_User_With_Recipients: "**Odpowiedź AI:** Cześć __name__, Twój e-mail z podsumowaniem z kanału: **__channelName__** zatytułowany \"**__subject__**\" jest gotowy do wysłania do __recipients__",

    // New format constants for specific display format
    LLM_Email_To_Label: "**Do:**",
    LLM_Email_CC_Label: "**Kopia:**",
    LLM_Email_Subject_Label: "**Temat:**",
    LLM_Email_Ready_Formatted: "Cześć __name__, Twój e-mail jest gotowy do wysłania",
    LLM_Summary_Email_Ready_Formatted: "Cześć __name__, Twój e-mail z podsumowaniem z kanału: **__channelName__** jest gotowy do wysłania",

    // Error message details for MessageFormatter
    Error_Email_Data_Unavailable: "Dane e-mail nie są już dostępne. Spróbuj ponownie przesłać żądanie.",
    Error_Please_Try_Again: "Spróbuj ponownie.",
    Error_Processing_Summary_Request: "Wystąpił problem z przetwarzaniem Twojego żądania podsumowania. Spróbuj ponownie.",

    // LLM Configuration Settings
    LLM_Provider_Label: "Dostawca LLM",
    LLM_Provider_Description: "Wybierz dostawcę modelu językowego AI do przetwarzania poleceń e-mail",
    LLM_Provider_Default_Label: "Domyślny (Własny hosting)",
    LLM_Provider_OpenAI_Label: "OpenAI",
    LLM_Provider_Gemini_Label: "Google Gemini",
    LLM_Provider_Groq_Label: "Groq",
    OpenAI_API_Key_Label: "Klucz API OpenAI",
    OpenAI_API_Key_Description: "Twój klucz API OpenAI do dostępu do modeli GPT (wymagany tylko przy używaniu dostawcy OpenAI)",
    Gemini_API_Key_Label: "Klucz API Google Gemini",
    Gemini_API_Key_Description: "Twój klucz API Google AI Studio do dostępu do modeli Gemini (wymagany tylko przy używaniu dostawcy Gemini)",
    Groq_API_Key_Label: "Klucz API Groq",
    Groq_API_Key_Description: "Twój klucz API Groq do dostępu do modeli Llama (wymagany tylko przy używaniu dostawcy Groq)",

    // User LLM Preferences
    LLM_Usage_Preference_Label: "Preferencja Użycia LLM",
    LLM_Usage_Preference_Placeholder: "Wybierz preferencję użycia LLM",
    LLM_Usage_Preference_Personal: "Osobista",
    LLM_Usage_Preference_Workspace: "Obszar roboczy",
    LLM_Provider_User_Label: "Dostawca LLM",
    LLM_Provider_User_Placeholder: "Wybierz dostawcę LLM",
    LLM_Provider_SelfHosted: "Własny hosting",
    LLM_Provider_OpenAI: "OpenAI",
    LLM_Provider_Gemini: "Gemini",
    LLM_Provider_Groq: "Groq",
    SelfHosted_URL_Label: "URL LLM własnego hostingu",
    SelfHosted_URL_Placeholder: "Wprowadź swój URL LLM własnego hostingu",
    OpenAI_API_Key_User_Label: "Klucz API OpenAI",
    OpenAI_API_Key_User_Placeholder: "Wprowadź swój klucz API OpenAI",
    Gemini_API_Key_User_Label: "Klucz API Gemini",
    Gemini_API_Key_User_Placeholder: "Wprowadź swój klucz API Gemini",
    Groq_API_Key_User_Label: "Klucz API Groq",
    Groq_API_Key_User_Placeholder: "Wprowadź swój klucz API Groq",

    // LLM Configuration Validation Messages
    LLM_Config_Provider_Required: "Proszę wybrać dostawcę LLM",
    LLM_Config_SelfHosted_URL_Required: "URL samohosting jest wymagany dla wybranego dostawcy",
    LLM_Config_Invalid_URL: "Proszę wprowadzić prawidłowy URL",
    LLM_Config_OpenAI_Key_Required: "Klucz API OpenAI jest wymagany dla wybranego dostawcy",
    LLM_Config_Invalid_OpenAI_Key: "Klucz API OpenAI powinien zaczynać się od 'sk-'",
    LLM_Config_Gemini_Key_Required: "Klucz API Gemini jest wymagany dla wybranego dostawcy",
    LLM_Config_Groq_Key_Required: "Klucz API Groq jest wymagany dla wybranego dostawcy",
    LLM_Config_Invalid_Provider: "Wybrano nieprawidłowego dostawcę LLM",
    LLM_API_Or_URL_Error: "Proszę sprawdzić swój LLM API lub URL",
};
