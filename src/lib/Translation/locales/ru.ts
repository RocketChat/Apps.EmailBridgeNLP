export const ru = {
    // Settings
    Email_Provider_Label: "Провайдер электронной почты",
    Email_Provider_Description: "Выберите своего провайдера электронной почты для аутентификации",
    Gmail_Label: "Gmail",
    Outlook_Label: "Outlook/Hotmail",
    Google_OAuth_Client_ID_Label: "Google OAuth Client ID",
    Google_OAuth_Client_ID_Description: "OAuth client ID для аутентификации Google (только Gmail)",
    Google_OAuth_Client_Secret_Label: "Google OAuth Client Secret",
    Google_OAuth_Client_Secret_Description: "OAuth client secret для аутентификации Google (только Gmail)",
    OAuth_Redirect_URI_Label: "OAuth Redirect URI",
    OAuth_Redirect_URI_Description: "OAuth redirect URI - должен заканчиваться на /api/apps/public/[app-id]/oauth-callback",
    
    // Outlook OAuth Settings
    Outlook_OAuth_Client_ID_Label: "Outlook OAuth Client ID",
    Outlook_OAuth_Client_ID_Description: "OAuth client ID для аутентификации Outlook/Microsoft",
    Outlook_OAuth_Client_Secret_Label: "Outlook OAuth Client Secret",
    Outlook_OAuth_Client_Secret_Description: "OAuth client secret для аутентификации Outlook/Microsoft",
    Outlook_OAuth_Redirect_URI_Label: "Outlook OAuth Redirect URI",
    Outlook_OAuth_Redirect_URI_Description: "OAuth redirect URI для Outlook - должен заканчиваться на /api/apps/public/[app-id]/oauth-callback",
    
    // Commands
    Email_Command_Params: "подключить, статус, отключить, помощь, отчет",
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
    Send_Email_Action_Label: "Отправить письмо",
    View_Inbox_Action_Label: "Просмотреть входящие",
    
    // Messages
    OAuth_Connection_Success: "Успешно подключено к вашей учетной записи электронной почты!",
    OAuth_Connection_Failed: "Не удалось подключиться к вашей учетной записи электронной почты. Попробуйте еще раз.",
    Email_Not_Connected: "Нет подключенной учетной записи электронной почты. Сначала подключите свою учетную запись.",
    Invalid_Email_Provider: "Выбран недопустимый провайдер электронной почты. Проверьте свою конфигурацию.",
    Authentication_Required: "Требуется аутентификация. Подключите свою учетную запись электронной почты.",
    Connection_Status_Connected: "Учетная запись электронной почты подключена и готова к использованию.",
    Connection_Status_Disconnected: "Нет подключенной учетной записи электронной почты.",
    Disconnect_Success: "Учетная запись электронной почты успешно отключена.",
    Disconnect_Failed: "Не удалось отключить вашу учетную запись электронной почты.",
    
    // Handler messages
    Already_Logged_In: "Вы уже вошли в **__provider__** как **__email__**.\n\nЕсли хотите отключиться, используйте `/email logout`.",
    Outlook_Coming_Soon: "**Аутентификация Outlook будет доступна в ближайшее время!**\n\nПока что используйте **Gmail** для аутентификации электронной почты.\n\n",
    Provider_Not_Implemented: "**Аутентификация __provider__ еще не реализована.**\n\nВ настоящее время поддерживается только **Gmail** для аутентификации.\n\n",
    Connect_Account_Message: "**Подключите свою учетную запись __provider__ к Rocket Chat**",
    Login_With_Provider: "Войти через __provider__",
    Error_Processing_Login: "Ошибка при входе: __error__",
    Not_Authenticated: "Вы не аутентифицированы в __provider__. Используйте `/email login` для входа.",
    Logout_Confirmation: "**Подтверждение выхода**\n\nВы уверены, что хотите выйти из учетной записи **__provider__** **__email__**?",
    Confirm_Logout: "Подтвердить выход",
    Error_Preparing_Logout: "❌ Ошибка при подготовке к выходу: __error__",
    Provider_Not_Supported_Logout: "❌ **__provider__ не поддерживается для выхода.**\n\nОбратитесь к администратору за помощью.",
    Logout_Success: "✅ **Успешно вышли из учетной записи __provider__.**\n\nТеперь вы можете войти в другую учетную запись, если необходимо.",
    Logout_Failed: "❌ **Не удалось выйти из учетной записи электронной почты.**\n\nПопробуйте еще раз или обратитесь к администратору.",
    Logout_Error: "❌ **Произошла ошибка в процессе выхода:**\n__error__\n\nПопробуйте еще раз или обратитесь к администратору.",
    Helper_Greeting: "Привет __name__! Я Email Bot 👋. Вот несколько быстрых советов для начала!",
    Available_Commands: "",
    Help_Command: "используйте `/email help` - Показать это сообщение помощи",
    Login_Command: "используйте `/email login` - Войти в свою учетную запись электронной почты",
    Logout_Command: "используйте `/email logout` - Выйти из учетной записи электронной почты",
    Config_Command: "используйте `/email config` - Открыть пользовательские настройки и конфигурацию",
    Report_Command: "используйте `/email report` - Получить ежедневный отчет статистики электронной почты",
    Default_Greeting: "Привет __name__! Я Email Bot 👋. Я могу помочь вам со всеми вашими потребностями электронной почты.",
    Use_Help_Command: "Используйте `/email help`, чтобы узнать обо всех доступных функциях и командах.",
    Login_Action_Text: "Войти в свою учетную запись электронной почты",
    
    // User Preference Modal
    User_Preference_Title: "Пользовательские настройки",
    User_Preference_Button_Label: "⚙️ Пользовательские настройки",
    User_Preference_Update_Button: "Обновить настройки",
    User_Preference_Close_Button: "Закрыть",
    User_Preference_Success: "**Пользовательские настройки успешно обновлены!**",
    Language_Changed: "Язык изменен на: __language__",
    Email_Provider_Changed: "Провайдер электронной почты изменен на: __provider__",
    User_Preference_Error: "**Не удалось обновить пользовательские настройки:**\n__error__",
    Email_Provider_Preference_Label: "Провайдер электронной почты",
    Email_Provider_Preference_Description: "Выберите предпочтительного провайдера электронной почты для аутентификации",
    
    // Language names
    Language: "Язык",
    Language_EN: "Английский",
    Language_ES: "Испанский",
    Language_DE: "Немецкий",
    Language_PL: "Польский",
    Language_PT: "Португальский",
    Language_RU: "Русский",
    
    // Config error messages
    Config_Error: "Ошибка конфигурации: __error__",
    
    // Provider change messages
    Provider_Changed_Auto_Logout: "Вы автоматически выйдете из системы **__oldProvider__**",
    Provider_Change_Warning: "⚠️ Предупреждение: Изменение поставщика электронной почты автоматически выйдет из вашей текущей учетной записи.",
    
    // Granular Error Messages (inspired by QuickReplies)
    Error_Fill_Required_Fields: "Ошибка обработки запроса. Пожалуйста, заполните все обязательные поля ❌",
    Error_Fail_Internal: "Внутренняя ошибка. Попробуйте еще раз позже.",
    Error_Network_Failure: "Сбой сетевого подключения. Проверьте подключение к интернету и попробуйте еще раз.",
    Error_Invalid_Credentials: "Предоставлены недействительные учетные данные. Проверьте настройки OAuth.",
    Error_Token_Expired: "Ваш токен аутентификации истек. Войдите в систему еще раз.",
    Error_Token_Invalid: "Токен аутентификации недействителен. Войдите в систему еще раз.",
    Error_Missing_Configuration: "Отсутствует необходимая конфигурация. Обратитесь к администратору.",
    Error_Service_Unavailable: "Служба электронной почты в настоящее время недоступна. Попробуйте позже.",
    Error_Rate_Limit_Exceeded: "Слишком много запросов. Подождите момент и попробуйте еще раз.",
    Error_Permission_Denied: "Доступ запрещен. Проверьте разрешения вашей учетной записи.",
    Error_User_Info_Missing: "Ошибка получения информации о пользователе. Попробуйте войти в систему еще раз.",
    Error_Connection_Lost: "Потеряно соединение со службой электронной почты. Проверьте сеть и попробуйте еще раз.",
    Error_OAuth_Callback_Failed: "Обратный вызов OAuth не удался. Попробуйте процесс аутентификации еще раз.",
    Error_Settings_Not_Found: "Настройки электронной почты не настроены. Обратитесь к администратору.",
    Error_Provider_Mismatch: "Несоответствие конфигурации поставщика электронной почты. Обратитесь к администратору.",
    
    // Success Messages
    Success_Connection_Established: "Соединение с электронной почтой успешно установлено ✅",
    Success_User_Info_Retrieved: "Информация о пользователе успешно получена ✅",
    Success_Token_Refreshed: "Токен аутентификации успешно обновлен ✅",
    Success_Logout_Complete: "Успешно вышли из учетной записи электронной почты ✅",
    Success_Configuration_Updated: "Конфигурация электронной почты успешно обновлена ✅",
    
    // OAuth Specific Errors
    OAuth_Error_Authorization_Denied: "Авторизация была отклонена. Попробуйте еще раз и предоставьте необходимые разрешения.",
    OAuth_Error_Invalid_State: "Недействительный параметр состояния OAuth. Это может быть проблемой безопасности. Попробуйте еще раз.",
    OAuth_Error_Code_Exchange_Failed: "Ошибка обмена кода авторизации на токены. Попробуйте еще раз.",
    OAuth_Error_Invalid_Grant: "Недействительный грант OAuth. Ваш код авторизации мог истечь. Попробуйте еще раз.",
    OAuth_Error_Scope_Insufficient: "Недостаточные разрешения области OAuth. Обратитесь к администратору.",
    
    // User-Friendly Error Messages
    User_Friendly_Auth_Error: "**Ошибка аутентификации**\n\nМы не смогли подключиться к вашей учетной записи электронной почты. Это может быть потому что:\n• Ваши учетные данные истекли\n• Служба временно недоступна\n• Есть проблема с конфигурацией\n\nПопробуйте еще раз или обратитесь к администратору, если проблема не исчезнет.",
    User_Friendly_Network_Error: "**Проблема с подключением**\n\nУ нас проблемы с подключением к службе электронной почты. Пожалуйста:\n• Проверьте подключение к интернету\n• Попробуйте еще раз через несколько мгновений\n• Обратитесь в службу поддержки, если проблема продолжается",
    User_Friendly_Config_Error: "**Проблема с конфигурацией**\n\nЕсть проблема с конфигурацией службы электронной почты. Обратитесь к администратору для решения этой проблемы.",
    
    // Modal Error Messages
    Modal_Error_Failed_To_Open: "Ошибка открытия модального окна настроек. Попробуйте еще раз.",
    Modal_Error_Save_Failed: "Ошибка сохранения настроек. Проверьте ваш ввод и попробуйте еще раз.",
    Modal_Error_Invalid_Input: "Предоставлен недействительный ввод. Проверьте ваши записи и попробуйте еще раз.",
    
    // Form Validation Messages
    Validation_Email_Required: "Адрес электронной почты обязателен.",
    Validation_Email_Invalid: "Введите действительный адрес электронной почты.",
    Validation_Field_Required: "Это поле обязательно.",
    Validation_Field_Too_Long: "Ввод слишком длинный. Максимальная длина __max__ символов.",
    Validation_Field_Too_Short: "Ввод слишком короткий. Минимальная длина __min__ символов.",
    
    // OAuth Endpoint Error Messages
    OAuth_Endpoint_Error_Obtaining_Token: "Ошибка получения токена доступа: __error__",
    OAuth_Endpoint_General_Error: "Произошла ошибка: __error__",
    OAuth_Endpoint_Missing_Parameters: "Отсутствуют обязательные параметры (код или состояние)",
    OAuth_Endpoint_Invalid_State: "Недействительный или истекший запрос авторизации",
    OAuth_Endpoint_Authentication_Failed: "Аутентификация не удалась",
    OAuth_Endpoint_OAuth_Error: "Ошибка OAuth: __error__ - __description__",
    OAuth_Endpoint_Enhanced_Error: "__prefix__: __message__",
    
    // Modal and UI Error Messages
    Error_Modal_Creation_Failed: "Не удалось создать модальное окно настроек пользователя",
    Error_Trigger_ID_Missing: "Идентификатор триггера недоступен для открытия модального окна",
    
    // Storage Error Messages
    Storage_Failed_Save_Credentials: "Не удалось сохранить учетные данные OAuth",
    Storage_Failed_Delete_Credentials: "Не удалось удалить учетные данные OAuth", 
    Storage_Failed_Save_State: "Не удалось сохранить состояние OAuth",
    
    // Generic Account Reference
    Generic_Account: "ваш аккаунт",
    
    // OAuth Endpoint Short Keys (shorter names as requested)
    OAuth_Redir_Err: "Несоответствие URI перенаправления. Убедитесь, что регистрация приложения Azure включает точный URI: __uri__",
    OAuth_SSL_Err: "Ошибка протокола SSL/TLS. Для разработки localhost убедитесь, что регистрация приложения Azure включает HTTP (не HTTPS) URI перенаправления",
    Provider_Label: "__provider__",
    
    // Logger Messages (ultra-short keys)
    Log_Logout_Err: "Ошибка во время попытки очистки выхода",
    Log_Async_Logout: "Ошибка в асинхронном действии выхода", 
    Log_Async_Pref: "Ошибка в асинхронном действии пользовательских настроек",
    Log_Pref_Handle: "Ошибка в handleUserPreferenceAction",
    Log_Auto_Logout: "Ошибка во время автоматического выхода при смене провайдера",
    Log_Pref_Submit: "Ошибка в handleUserPreferenceSubmit",
    Log_Notif_Err: "Не удалось отправить уведомление об ошибке",
    Log_Success_Err: "Не удалось отправить уведомление об успехе", 
    Log_Btn_Fallback: "Не удалось создать уведомление с кнопкой входа, переход к текстовому уведомлению",
    Log_Fallback_Err: "Не удалось отправить резервное текстовое уведомление",
    
    // Report feature messages
    Report_Provider_Not_Supported: "❌ **__provider__ не поддерживается для отчетов.**\n\nПожалуйста, обратитесь к администратору за помощью.",
    Report_Not_Authenticated: "❌ **Вы не аутентифицированы с __provider__.**\n\nИспользуйте `/email login` для входа в систему сначала, затем попробуйте создать отчет снова.",
    Report_Error: "❌ **Ошибка при создании отчета электронной почты:**\n__error__\n\nПожалуйста, попробуйте снова или обратитесь к администратору.",
    Report_Header: "\n📊 **Отчет Статистики Электронной Почты(последние 24 часа)**",
    Report_Statistics: "**Получено**: __receivedToday__ писем\n**Отправлено**: __sentToday__ писем\n**Непрочитанные**: __totalUnread__ писем",
}; 