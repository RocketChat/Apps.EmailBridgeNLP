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
    Email_Command_Params: "login, logout, config, llm-config, help, stats",
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
    Disconnect_Failed: "Не удалось выйти из учетной записи электронной почты.",

    // Login success notifications (webhook)
    Login_Success_Notification: "✅ **Вход выполнен успешно!**\n\nВы подключены к **__provider__** как **__email__**.\n\nТеперь вы можете использовать функции EmailBridge NLP!",

    // Welcome message content (onInstall)
    Welcome_Title: "**Email Assistant**",
    Welcome_Description: "**Установлено и Готово Соединить Вашу Почту с ИИ!**",
    Welcome_Text: "Добро пожаловать в **Email Assistant** в RocketChat!",
    Welcome_Message: `
        🚀 **Начните в 3 Простых Шага:**
        
        1️⃣ **Подключите Почту**: Используйте \`/email login\` для подключения Gmail или Outlook
        2️⃣ **Настройте Параметры**: Используйте \`/email config\` для установки предпочтений
        3️⃣ **Используйте ИИ**: Отправляйте команды на естественном языке как \`/email send an email to @john.doe about the meeting...\`.
        
        📧 **Что Вы Можете Делать:**
        • **Умное Управление Почтой**: "отправить письмо john@company.com о встрече"
        • **Обзоры Каналов**: "обобщить этот разговор и отправить по почте manager@company.com"
        • **Быстрая Статистика**: Получать ежедневную статистику почты и аналитику. Используйте \`/email stats\`.
        
        📊 **Функция Статистики Почты:**
        Получайте персонализированные ежедневные отчеты показывающие:
        • Общее количество полученных и отправленных писем
        • Основные отправители и получатели
        • Категории писем (работа, личное, уведомления)
        
        ⚙️ **Поддерживаемые Провайдеры:**
        • **Gmail**
        • **Outlook**
        
        🌍 **Мультиязыковая Поддержка:**
        Доступно на английском, испанском, русском, немецком, польском и португальском
        
        Нужна помощь? Напишите \`/email help\` в любое время!
        
        Спасибо за выбор **Email Assistant** - Вашего ИИ Помощника Почты! 🤖
        `,

    // Handler messages
    Already_Logged_In: "Вы уже вошли в **__provider__** как **__email__**.\n\nЕсли хотите выйти, используйте `/email logout`.",
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
    Logout_Success: "**Успешно вышли из учетной записи __provider__.**\n\nТеперь вы можете войти в другую учетную запись, если необходимо.",
    Logout_Failed: "❌ **Не удалось выйти из учетной записи электронной почты.**\n\nПопробуйте еще раз или обратитесь к администратору.",
    Logout_Error: "❌ **Произошла ошибка в процессе выхода:**\n__error__\n\nПопробуйте еще раз или обратитесь к администратору.",
    Helper_Greeting: "Привет __name__! Я Email Bot 👋. Вот несколько быстрых советов для начала!",
    Available_Commands: "",
    Help_Command: "используйте `/email help` - Показать это сообщение помощи",
    Login_Command: "используйте `/email login` - Войти в свою учетную запись электронной почты",
    Logout_Command: "используйте `/email logout` - Выйти из учетной записи электронной почты",
    Config_Command: "используйте `/email config` - Открыть пользовательские настройки и конфигурацию",
    Stats_Command: "используйте `/email stats` - Получить ежедневный отчет статистики электронной почты",
    Default_Greeting: "Привет __name__! Я Email Bot 👋. Я могу помочь вам со всеми вашими потребностями электронной почты.",
    Use_Help_Command: "Используйте `/email help`, чтобы узнать обо всех доступных функциях и командах.",
    Login_Action_Text: "Войти в __provider__",

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

    // LLM Configuration Modal
    LLM_Configuration_Title: "Конфигурация LLM",
    LLM_Configuration_Button_Label: "Конфигурация LLM",
    LLM_Configuration_Update_Button: "Обновить конфигурацию",
    LLM_Configuration_Close_Button: "Закрыть",
    LLM_Configuration_Success: "Конфигурация LLM успешно обновлена!",
    LLM_Configuration_Error: "Не удалось обновить конфигурацию LLM:",
    LLM_Config_Command: "используйте `/email llm-config` - Открыть настройки LLM",

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
    Provider_Changed_Login_Message: "Вы можете войти в свою учетную запись __provider__",

    // Granular Error Messages
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

    // Stats feature messages
    Stats_Provider_Not_Supported: "❌ **__provider__ не поддерживается для статистики.**\n\nПожалуйста, обратитесь к администратору за помощью.",
    Stats_Not_Authenticated: "❌ **Вы не аутентифицированы с __provider__.**\n\nИспользуйте `/email login` для входа в систему сначала, затем попробуйте создать статистику снова.",
    Stats_Error: "❌ **Ошибка при создании статистики электронной почты:**\n__error__\n\nПожалуйста, попробуйте снова или обратитесь к администратору.",
    Stats_Header: "\n📊 **Отчет Статистики Электронной Почты(__timeRange__)**",
    Stats_Statistics: "**Получено**: __receivedToday__ писем\n**Отправлено**: __sentToday__ писем\n**Непрочитанные**: __totalUnread__ писем",
    Stats_Token_Expired: "❌ **Срок действия вашей аутентификации истек.**\n\nИспользуйте `/email login`, чтобы повторно подключить свою учетную запись __provider__ и повторить попытку.",
    Stats_Categories_Label: "Категории Статистики",
    Stats_Days_Invalid: "❌ **Неверный параметр дней.**\n\nПожалуйста, укажите действительное количество дней (1-15).",
    Stats_Days_Range_Error: "❌ **Параметр дней вне диапазона.**\n\nСтатистика может быть создана только на максимум 15 дней.",
    Stats_Time_Range_24_Hours: "последние 24 часа",
    Stats_Time_Range_Days: "последние __days__ дней",

    // Statistics Service Errors
    Statistics_Provider_Not_Supported: "Statistics for provider __provider__ are not supported.",
    Statistics_Not_Implemented: "Statistics are not implemented for provider: __provider__",
    Gmail_Stats_Failed: "Failed to get Gmail statistics: __error__",
    Outlook_Stats_Failed: "Failed to get Outlook statistics: __error__",

    // User Preference Modal
    New_Category_Label: "New Category",
    New_Categories_Placeholder: "Add new categories, comma-separated...",

    // System Prompt Configuration  
    System_Prompt_Label: "Системный Промпт",
    System_Prompt_Placeholder: "Настройте тон ваших писем (напр. [Вы Джон, разработчик в Rocket Chat. Вы очень заняты и так же заняты все с кем вы общаетесь, поэтому вы делаете свою лучшую работу, чтобы сохранить свои письма такими короткими, как это возможно и конкретными. Предпочитайте письма одной строкой. Сделайте свое лучшее, чтобы быть вежливым, и не быть слишком неформальным, чтобы не звучать грубо....])",

    // Tool Calling Messages
    LLM_Processing_Query: "Обработка: \"__query__\"...",
    LLM_User_Query_Display: "**Ваш запрос:** __query__",
    LLM_AI_Thinking: "_думает_...",
    LLM_Email_Ready_User: "Привет __name__, ваше письмо с темой **__subject__** готово к отправке.",
    LLM_Tool_Detected: "**Инструмент Обнаружен** для запроса: \"__query__\"\n\n**Инструмент:** __tool__",
    LLM_No_Tool_Detected: "Подходящий инструмент для запроса не найден: \"__query__\"",
    LLM_Error_Processing: "**Ошибка обработки запроса:** \"__query__\"\n\n**Ошибка:** __error__",
    Tool_Call_Result: "Результат Вызова Инструмента",
    Tool_Name_Label: "Инструмент",
    Tool_Args_Label: "Аргументы",
    Query_Processed_Success: "Запрос успешно обработан",
    Invalid_Tool_Name: "Обнаружено недопустимое имя инструмента",
    LLM_Parsing_Failed: "Не удалось разобрать ответ LLM",

    // Tool Names (for user display)
    Tool_Send_Email: "Отправить Email",
    Tool_Extract_Attachment: "Извлечь Вложения",
    Tool_Summarize_And_Send: "Резюмировать и Отправить Email",
    Tool_Stats: "Создать Статистику",

    // Send Email Modal
    Send_Email_Modal_Title: "Отправить письмо",
    Send_Email_To_Label: "Кому",
    Send_Email_To_Placeholder: "Введите адреса электронной почты получателей (через запятую)",
    Send_Email_CC_Label: "Копия (Необязательно)",
    Send_Email_CC_Placeholder: "Введите адреса электронной почты для копии (через запятую)",
    Send_Email_Subject_Label: "Тема",
    Send_Email_Subject_Placeholder: "Введите тему письма",
    Send_Email_Content_Label: "Сообщение",
    Send_Email_Content_Placeholder: "Введите содержимое вашего сообщения",
    Send_Email_Send_Button: "Отправить письмо",
    Send_Email_Cancel_Button: "Отмена",
    Send_Email_Test_Button: "Отправить тестовое письмо себе",
    Send_Email_Modal_Opened: "Окно отправки письма открыто",
    Send_Email_Success: "Письмо успешно отправлено ✅",
    Send_Email_Failed: "Ошибка при отправке письма: __error__",
    Send_Email_Error_No_From_Email: "Невозможно определить адрес электронной почты отправителя",

    // Send Type dropdown
    Send_Type_Label: "Тип отправки",
    Send_Type_Recipients: "Отправить получателю(ям)",
    Send_Type_Test_Self: "Отправить тестовое письмо себе",
    
    // Test Email notifications
    Test_Email_Success: "Тестовое письмо отправлено на ваш адрес ✅",
    Test_Email_Success_With_Email: "Тестовое письмо отправлено на: __userEmail__ ✅",
    Test_Email_Failed: "Ошибка отправки тестового письма ❌",
    Test_Email_No_User_Email: "Не удалось получить ваш адрес электронной почты ❌",
    Send_Email_Validation_To_Required: "Адрес электронной почты получателя обязателен",
    Send_Email_Validation_Subject_Required: "Тема письма обязательна",
    Send_Email_Validation_Content_Required: "Содержание письма обязательно",

    // Send Email Button Translations
    Email_Ready_To_Send: "Письмо готово к отправке",
    Email_Send_Button: "Отправить",
    Email_Edit_And_Send_Button: "Редактировать и отправить",

    // Send Email with Status
    Send_Email_Success_With_Emoji: "✅ Письмо успешно отправлено",
    Send_Email_Failed_With_Emoji: "❌ Ошибка при отправке письма: __error__",

    PROVIDER_NOT_SUPPORTED_LOGOUT: "Не удалось выйти. Почтовый провайдер '__provider__' не поддерживается.",
    LOGOUT_SUCCESS: "Вы успешно вышли из __provider__.",
    LOGOUT_FAILED: "Не удалось выйти. Пожалуйста, попробуйте еще раз.",
    LOGOUT_ERROR: "Произошла ошибка во время выхода: __error__",
    EMAIL_SENT_CONFIRMATION: "Электронное письмо отправлено.",

    // Send/Edit Action Buttons
    SEND_ACTION_TEXT: "Отправить",
    EDIT_SEND_ACTION_TEXT: "Редактировать и отправить",

    // LLM Error Messages
    LLM_No_Response: "Не получен ответ от службы ИИ. Попробуйте еще раз.",
    LLM_No_Choices: "Ошибка при подключении к службе ИИ. Проверьте ваш API-ключ или URL.",
    LLM_Request_Failed: "Ошибка связи со службой ИИ",

    // Summarization Messages
    No_Messages_To_Summarize: "Сообщения для суммирования по вашим критериям не найдены.",
    Summary_Generation_Failed: "Невозможно создать сводку сообщений. Попробуйте еще раз.",
    LLM_Summary_Email_Ready_User: "Привет __name__, ваше письмо с резюме из канала: **__channelName__** с темой \"**__subject__**\" готово к отправке.",
    LLM_Parsing_Error: "Я не смог понять ваш запрос. Попробуйте переформулировать с более простыми адресами электронной почты или содержимым.",

    // Email Ready Messages with Recipients
    LLM_Email_Ready_User_With_Recipients: "**Ответ ИИ:** Привет __name__, ваше письмо с темой **__subject__** готово к отправке для __recipients__",
    LLM_Summary_Email_Ready_User_With_Recipients: "**Ответ ИИ:** Привет __name__, ваше письмо с резюме из канала: **__channelName__** с темой \"**__subject__**\" готово к отправке для __recipients__",

    // New format constants for specific display format
    LLM_Email_To_Label: "**Кому:**",
    LLM_Email_CC_Label: "**Копия:**",
    LLM_Email_Subject_Label: "**Тема:**",
    LLM_Email_Ready_Formatted: "Привет __name__, ваше письмо готово к отправке",
    LLM_Summary_Email_Ready_Formatted: "Привет __name__, ваше письмо с резюме из канала: **__channelName__** готово к отправке",

    // Error message details for MessageFormatter
    Error_Email_Data_Unavailable: "Данные электронной почты больше недоступны. Пожалуйста, попробуйте снова.",
    Error_Please_Try_Again: "Пожалуйста, попробуйте снова.",
    Error_Processing_Summary_Request: "Возникла проблема при обработке вашего запроса на резюме. Пожалуйста, попробуйте снова.",

    // LLM Configuration Settings
    LLM_Provider_Label: "Провайдер LLM",
    LLM_Provider_Description: "Выберите провайдера языковой модели ИИ для обработки команд электронной почты",
    LLM_Provider_Default_Label: "По умолчанию (Самостоятельно размещенный)",
    LLM_Provider_OpenAI_Label: "OpenAI",
    LLM_Provider_Gemini_Label: "Google Gemini",
    LLM_Provider_Groq_Label: "Groq",
    OpenAI_API_Key_Label: "API-ключ OpenAI",
    OpenAI_API_Key_Description: "Ваш API-ключ OpenAI для доступа к моделям GPT (требуется только при использовании провайдера OpenAI)",
    Gemini_API_Key_Label: "API-ключ Google Gemini",
    Gemini_API_Key_Description: "Ваш API-ключ Google AI Studio для доступа к моделям Gemini (требуется только при использовании провайдера Gemini)",
    Groq_API_Key_Label: "API-ключ Groq",
    Groq_API_Key_Description: "Ваш API-ключ Groq для доступа к моделям Llama (требуется только при использовании провайдера Groq)",

    // User LLM Preferences
    LLM_Usage_Preference_Label: "Предпочтение использования LLM",
    LLM_Usage_Preference_Placeholder: "Выберите предпочтение использования LLM",
    LLM_Usage_Preference_Personal: "Личный",
    LLM_Usage_Preference_Workspace: "Рабочее пространство",
    LLM_Provider_User_Label: "Провайдер LLM",
    LLM_Provider_User_Placeholder: "Выберите провайдера LLM",
    LLM_Provider_SelfHosted: "Самостоятельно размещенный",
    LLM_Provider_OpenAI: "OpenAI",
    LLM_Provider_Gemini: "Gemini",
    LLM_Provider_Groq: "Groq",
    SelfHosted_URL_Label: "URL самостоятельно размещенного LLM",
    SelfHosted_URL_Placeholder: "Введите ваш URL самостоятельно размещенного LLM",
    OpenAI_API_Key_User_Label: "API-ключ OpenAI",
    OpenAI_API_Key_User_Placeholder: "Введите ваш API-ключ OpenAI",
    Gemini_API_Key_User_Label: "API-ключ Gemini",
    Gemini_API_Key_User_Placeholder: "Введите ваш API-ключ Gemini",
    Groq_API_Key_User_Label: "API-ключ Groq",
    Groq_API_Key_User_Placeholder: "Введите ваш API-ключ Groq",

    // LLM Configuration Validation Messages
    LLM_Config_Provider_Required: "Пожалуйста, выберите провайдера LLM",
    LLM_Config_SelfHosted_URL_Required: "URL самостоятельного размещения требуется для выбранного провайдера",
    LLM_Config_Invalid_URL: "Пожалуйста, введите действительный URL",
    LLM_Config_OpenAI_Key_Required: "API-ключ OpenAI требуется для выбранного провайдера",
    LLM_Config_Invalid_OpenAI_Key: "API-ключ OpenAI должен начинаться с 'sk-'",
    LLM_Config_Gemini_Key_Required: "API-ключ Gemini требуется для выбранного провайдера",
    LLM_Config_Groq_Key_Required: "API-ключ Groq требуется для выбранного провайдера",
    LLM_Config_Invalid_Provider: "Выбран недействительный провайдер LLM",
    LLM_API_Or_URL_Error: "Пожалуйста, проверьте ваш API LLM или URL",
};
