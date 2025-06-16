export const ru = {
    // Settings
    Email_Provider_Label: "Поставщик Email",
    Email_Provider_Description: "Выберите поставщика услуг электронной почты для аутентификации",
    Gmail_Label: "Gmail",
    Outlook_Label: "Outlook/Hotmail",
    Google_OAuth_Client_ID_Label: "Google OAuth Client ID",
    Google_OAuth_Client_ID_Description: "OAuth client ID для аутентификации Google (только Gmail)",
    Google_OAuth_Client_Secret_Label: "Google OAuth Client Secret",
    Google_OAuth_Client_Secret_Description: "OAuth client secret для аутентификации Google (только Gmail)",
    OAuth_Redirect_URI_Label: "OAuth Redirect URI",
    OAuth_Redirect_URI_Description: "OAuth redirect URI - должен заканчиваться на /api/apps/public/[app-id]/oauth-callback",
    
    // Commands
    Email_Command_Params: "подключить, статус, отключить, помощь",
    Email_Command_Description: "Подключите и управляйте интеграцией вашей учетной записи электронной почты с помощью ИИ.",
    
    // OAuth Pages
    Authentication_Error_Title: "Ошибка аутентификации",
    Authentication_Success_Title: "Аутентификация прошла успешно!",
    Connected_Account_Message: "Вы успешно подключили свою учетную запись Gmail:",
    Try_Again_Message: "Пожалуйста, попробуйте еще раз или обратитесь к администратору.",
    Close_Window_Label: "Закрыть окно",
    Features_Available_Message: "Теперь вы можете использовать функции Email Assistant в Rocket.Chat!",
    Safe_To_Close_Message: "Вы можете безопасно закрыть это окно и вернуться в Rocket.Chat.",
    
    // Action Labels
    Connect_Email_Action_Label: "Подключить учетную запись электронной почты",
    Check_Status_Action_Label: "Проверить статус подключения",
    Disconnect_Email_Action_Label: "Отключить электронную почту",
    Send_Email_Action_Label: "Отправить электронную почту",
    View_Inbox_Action_Label: "Просмотреть входящие",
    
    // Messages
    OAuth_Connection_Success: "Успешно подключено к вашей учетной записи электронной почты!",
    OAuth_Connection_Failed: "Не удалось подключиться к вашей учетной записи электронной почты. Пожалуйста, попробуйте еще раз.",
    Email_Not_Connected: "Учетная запись электронной почты не подключена. Пожалуйста, сначала подключите свою учетную запись.",
    Invalid_Email_Provider: "Выбран недопустимый поставщик электронной почты. Пожалуйста, проверьте свои настройки.",
    Authentication_Required: "Требуется аутентификация. Пожалуйста, подключите свою учетную запись электронной почты.",
    Connection_Status_Connected: "Учетная запись электронной почты подключена и готова к использованию.",
    Connection_Status_Disconnected: "Учетная запись электронной почты не подключена.",
    Disconnect_Success: "Учетная запись электронной почты успешно отключена.",
    Disconnect_Failed: "Не удалось отключить вашу учетную запись электронной почты.",
    
    // Handler messages
    Already_Logged_In: "✅ Вы уже вошли в систему с **__provider__** как **__email__**.\n\nЕсли хотите выйти, используйте `/email logout`.",
    Outlook_Coming_Soon: "🚧 **Аутентификация Outlook появится в ближайшее время!**\n\nПока что используйте **Gmail** для аутентификации электронной почты.\n\n",
    Provider_Not_Implemented: "❌ **Аутентификация __provider__ еще не реализована.**\n\nВ настоящее время поддерживается только **Gmail** для аутентификации.\n\n",
    Connect_Account_Message: "🔐 **Подключите свою учетную запись __provider__ к Rocket Chat**",
    Login_With_Provider: "🔑 Войти с __provider__",
    Error_Processing_Login: "❌ Ошибка обработки входа в систему: __error__",
    Not_Authenticated: "❌ Вы не аутентифицированы с __provider__. Используйте `/email login` для входа в систему.",
    Logout_Confirmation: "🔓 **Подтверждение выхода**\n\nВы уверены, что хотите выйти из учетной записи **__provider__** **__email__**?",
    Confirm_Logout: "🔒 Подтвердить выход",
    Error_Preparing_Logout: "❌ Ошибка подготовки выхода: __error__",
    
    // Logout action messages
    Provider_Not_Supported_Logout: "❌ **__provider__ не поддерживается для выхода.**\n\nПожалуйста, обратитесь к администратору за помощью.",
    Logout_Success: "✅ **Успешно вышли из вашей учетной записи __provider__.**",
    Logout_Failed: "❌ **Не удалось выйти из вашей учетной записи электронной почты.**\n\nПожалуйста, попробуйте еще раз или обратитесь к администратору.",
    Logout_Error: "❌ **Произошла ошибка в процессе выхода:**\n__error__\n\nПожалуйста, попробуйте еще раз или обратитесь к администратору.",
    
    // Notification messages
    Helper_Greeting: "Привет __name__! Я Email Bot 👋. Вот несколько быстрых советов для начала работы!",
    Available_Commands: "",
    Help_Command: "используйте `/email help` - Показать это справочное сообщение",
    Login_Command: "используйте `/email login` - Войти в вашу учетную запись электронной почты",
    Logout_Command: "используйте `/email logout` - Выйти из вашей учетной записи электронной почты",
    Config_Command: "используйте `/email config` - Открыть пользовательские настройки и конфигурацию",
    Default_Greeting: "Привет __name__! Я Email Bot 👋. Я могу помочь вам со всеми вашими потребностями в электронной почте.",
    Use_Help_Command: "Используйте `/email help`, чтобы узнать обо всех доступных функциях и командах.",
    Login_Action_Text: "Войти в вашу учетную запись электронной почты",
    
    // User Preference Modal
    User_Preference_Title: "⚙️ Пользовательские настройки",
    User_Preference_Button_Label: "⚙️ Пользовательские настройки",
    User_Preference_Update_Button: "Обновить настройки",
    User_Preference_Close_Button: "Закрыть",
    User_Preference_Success: "**Пользовательские настройки успешно обновлены!**",
    Language_Changed: "Язык изменен на: __language__",
    Email_Provider_Changed: "Поставщик электронной почты изменен на: __provider__",
    User_Preference_Error: "❌ **Не удалось обновить пользовательские настройки:**\n__error__",
    Email_Provider_Preference_Label: "Поставщик электронной почты",
    Email_Provider_Preference_Description: "Выберите предпочитаемого поставщика электронной почты для аутентификации",
    
    // Language names
    Language: "Язык",
    Language_EN: "Английский",
    Language_ES: "Испанский",
    Language_DE: "Немецкий",
    Language_PL: "Польский",
    Language_PT: "Португальский",
    Language_RU: "Русский",
    
    // Config error messages
    Config_Error: "❌ Ошибка конфигурации: __error__",
    
    // Command preview - handled by hardcoded i18nTitle in EmailCommand.ts
}; 