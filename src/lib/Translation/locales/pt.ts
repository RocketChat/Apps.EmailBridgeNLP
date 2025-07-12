export const pt = {
    // Settings
    Email_Provider_Label: "Provedor de Email",
    Email_Provider_Description: "Selecione seu provedor de serviços de email para autenticação",
    Gmail_Label: "Gmail",
    Outlook_Label: "Outlook/Hotmail",
    Google_OAuth_Client_ID_Label: "Google OAuth Client ID",
    Google_OAuth_Client_ID_Description: "OAuth client ID para autenticação Google (apenas Gmail)",
    Google_OAuth_Client_Secret_Label: "Google OAuth Client Secret",
    Google_OAuth_Client_Secret_Description: "OAuth client secret para autenticação Google (apenas Gmail)",
    OAuth_Redirect_URI_Label: "OAuth Redirect URI",
    OAuth_Redirect_URI_Description: "OAuth redirect URI - deve terminar com /api/apps/public/[app-id]/oauth-callback",
    
    // Outlook OAuth Settings
    Outlook_OAuth_Client_ID_Label: "Outlook OAuth Client ID",
    Outlook_OAuth_Client_ID_Description: "OAuth client ID para autenticação Outlook/Microsoft",
    Outlook_OAuth_Client_Secret_Label: "Outlook OAuth Client Secret",
    Outlook_OAuth_Client_Secret_Description: "OAuth client secret para autenticação Outlook/Microsoft",
    Outlook_OAuth_Redirect_URI_Label: "Outlook OAuth Redirect URI",
    Outlook_OAuth_Redirect_URI_Description: "OAuth redirect URI para Outlook - deve terminar com /api/apps/public/[app-id]/oauth-callback",
    
    // Commands
    Email_Command_Params: "conectar, status, desconectar, ajuda, relatório",
    Email_Command_Description: "Conecte e gerencie a integração da sua conta de email com assistência de IA.",
    
    // OAuth Pages
    Authentication_Error_Title: "Erro de Autenticação",
    Authentication_Success_Title: "Autenticação Bem-sucedida!",
    Connected_Account_Message: "Você conectou com sucesso sua conta Gmail:",
    Try_Again_Message: "Por favor, tente novamente ou entre em contato com seu administrador.",
    Close_Window_Label: "Fechar Janela",
    Features_Available_Message: "Agora você pode usar os recursos do Assistente de Email no Rocket.Chat!",
    Safe_To_Close_Message: "Você pode fechar esta janela com segurança e retornar ao Rocket.Chat.",
    
    // Action Labels
    Connect_Email_Action_Label: "Conectar Conta de Email",
    Check_Status_Action_Label: "Verificar Status de Conexão",
    Disconnect_Email_Action_Label: "Desconectar Email",
    Send_Email_Action_Label: "Enviar Email",
    View_Inbox_Action_Label: "Ver Caixa de Entrada",
    
    // Messages
    OAuth_Connection_Success: "Conectado com sucesso à sua conta de email!",
    OAuth_Connection_Failed: "Falha ao conectar à sua conta de email. Tente novamente.",
    Email_Not_Connected: "Nenhuma conta de email conectada. Conecte sua conta primeiro.",
    Invalid_Email_Provider: "Provedor de email inválido selecionado. Verifique sua configuração.",
    Authentication_Required: "Autenticação necessária. Conecte sua conta de email.",
    Connection_Status_Connected: "Conta de email está conectada e pronta para uso.",
    Connection_Status_Disconnected: "Nenhuma conta de email está conectada.",
    Disconnect_Success: "Conta de email desconectada com sucesso.",
    Disconnect_Failed: "Falha ao desconectar sua conta de email.",
    
    // Handler messages
    Already_Logged_In: "Você já está logado com **__provider__** como **__email__**.\n\nSe quiser desconectar, use `/email logout`.",
    Outlook_Coming_Soon: "**Autenticação do Outlook estará disponível em breve!**\n\nPor enquanto, use **Gmail** para autenticação de email.\n\n",
    Provider_Not_Implemented: "**Autenticação __provider__ ainda não está implementada.**\n\nAtualmente apenas **Gmail** é suportado para autenticação.\n\n",
    Connect_Account_Message: "**Conecte sua conta __provider__ ao Rocket Chat**",
    Login_With_Provider: "Entrar com __provider__",
    Error_Processing_Login: "Erro ao processar login: __error__",
    Not_Authenticated: "Você não está autenticado com __provider__. Use `/email login` para entrar.",
    Logout_Confirmation: "**Confirmação de Logout**\n\nTem certeza de que deseja sair da conta **__provider__** **__email__**?",
    Confirm_Logout: "Confirmar Logout",
    Error_Preparing_Logout: "❌ Erro ao preparar logout: __error__",
    Provider_Not_Supported_Logout: "❌ **__provider__ não é suportado para logout.**\n\nEntre em contato com seu administrador para assistência.",
    Logout_Success: "**Logout realizado com sucesso da sua conta __provider__.**\n\nVocê pode agora fazer login com uma conta diferente se necessário.",
    Logout_Failed: "❌ **Falha ao fazer logout da sua conta de email.**\n\nTente novamente ou entre em contato com seu administrador.",
    Logout_Error: "❌ **Erro ocorreu durante o processo de logout:**\n__error__\n\nTente novamente ou entre em contato com seu administrador.",
    Helper_Greeting: "Olá __name__! Eu sou o Email Bot 👋. Aqui estão algumas dicas rápidas para começar!",
    Available_Commands: "",
    Help_Command: "use `/email help` - Mostrar esta mensagem de ajuda",
    Login_Command: "use `/email login` - Fazer login na sua conta de email",
    Logout_Command: "use `/email logout` - Fazer logout da conta de email",
    Config_Command: "use `/email config` - Abrir preferências do usuário e configurações",
    Report_Command: "use `/email report` - Obter relatório diário de estatísticas de email",
    Default_Greeting: "Olá __name__! Eu sou o Email Bot 👋. Posso ajudá-lo com todas as suas necessidades de email.",
    Use_Help_Command: "Use `/email help` para aprender sobre todos os recursos e comandos disponíveis.",
    Login_Action_Text: "Fazer login no __provider__",
    
    // User Preference Modal
    User_Preference_Title: "Preferências do Usuário",
    User_Preference_Button_Label: "⚙️ Preferências do Usuário",
    User_Preference_Update_Button: "Atualizar Preferências",
    User_Preference_Close_Button: "Fechar",
    User_Preference_Success: "**Preferências do usuário atualizadas com sucesso!**",
    Language_Changed: "Idioma alterado para: __language__",
    Email_Provider_Changed: "Provedor de email alterado para: __provider__",
    User_Preference_Error: "**Falha ao atualizar preferências do usuário:**\n__error__",
    Email_Provider_Preference_Label: "Provedor de Email",
    Email_Provider_Preference_Description: "Escolha seu provedor de email preferido para autenticação",
    
    // Language names
    Language: "Idioma",
    Language_EN: "Inglês",
    Language_ES: "Espanhol",
    Language_DE: "Alemão",
    Language_PL: "Polonês",
    Language_PT: "Português",
    Language_RU: "Russo",
    
    // Config error messages
    Config_Error: "Erro de configuração: __error__",
    
    // Provider change messages
    Provider_Changed_Auto_Logout: "Você foi automaticamente desconectado de **__oldProvider__**",
    Provider_Change_Warning: "⚠️ Aviso: Alterar seu provedor de email irá desconectá-lo automaticamente de sua conta atual.",
    Provider_Changed_Login_Message: "Você pode fazer login na sua conta __provider__",
    
    // Granular Error Messages
    Error_Fill_Required_Fields: "Erro ao processar solicitação. Por favor, preencha todos os campos obrigatórios ❌",
    Error_Fail_Internal: "Erro interno. Tente novamente mais tarde.",
    Error_Network_Failure: "Falha na conexão de rede. Verifique sua conexão com a internet e tente novamente.",
    Error_Invalid_Credentials: "Credenciais inválidas fornecidas. Verifique suas configurações OAuth.",
    Error_Token_Expired: "Seu token de autenticação expirou. Faça login novamente.",
    Error_Token_Invalid: "Token de autenticação é inválido. Faça login novamente.",
    Error_Missing_Configuration: "Configuração necessária ausente. Entre em contato com seu administrador.",
    Error_Service_Unavailable: "Serviço de email está atualmente indisponível. Tente novamente mais tarde.",
    Error_Rate_Limit_Exceeded: "Muitas solicitações. Aguarde um momento e tente novamente.",
    Error_Permission_Denied: "Permissão negada. Verifique as permissões de sua conta.",
    Error_User_Info_Missing: "Erro ao recuperar informações do usuário. Tente fazer login novamente.",
    Error_Connection_Lost: "Conexão com o serviço de email perdida. Verifique sua rede e tente novamente.",
    Error_OAuth_Callback_Failed: "Callback OAuth falhou. Tente o processo de autenticação novamente.",
    Error_Settings_Not_Found: "Configurações de email não configuradas. Entre em contato com seu administrador.",
    Error_Provider_Mismatch: "Incompatibilidade na configuração do provedor de email. Entre em contato com seu administrador.",
    
    // Success Messages
    Success_Connection_Established: "Conexão de email estabelecida com sucesso ✅",
    Success_User_Info_Retrieved: "Informações do usuário recuperadas com sucesso ✅",
    Success_Token_Refreshed: "Token de autenticação atualizado com sucesso ✅",
    Success_Logout_Complete: "Desconectado com sucesso de sua conta de email ✅",
    Success_Configuration_Updated: "Configuração de email atualizada com sucesso ✅",
    
    // OAuth Specific Errors
    OAuth_Error_Authorization_Denied: "Autorização foi negada. Tente novamente e conceda as permissões necessárias.",
    OAuth_Error_Invalid_State: "Parâmetro de estado OAuth inválido. Isso pode ser um problema de segurança. Tente novamente.",
    OAuth_Error_Code_Exchange_Failed: "Erro ao trocar código de autorização por tokens. Tente novamente.",
    OAuth_Error_Invalid_Grant: "Grant OAuth inválido. Seu código de autorização pode ter expirado. Tente novamente.",
    OAuth_Error_Scope_Insufficient: "Permissões de escopo OAuth insuficientes. Entre em contato com seu administrador.",
    
    // User-Friendly Error Messages
    User_Friendly_Auth_Error: "**Falha na Autenticação**\n\nNão conseguimos conectar à sua conta de email. Isso pode ser porque:\n• Suas credenciais expiraram\n• O serviço está temporariamente indisponível\n• Há um problema de configuração\n\nTente novamente ou entre em contato com seu administrador se o problema persistir.",
    User_Friendly_Network_Error: "**Problema de Conexão**\n\nEstamos tendo problemas para conectar ao serviço de email. Por favor:\n• Verifique sua conexão com a internet\n• Tente novamente em alguns momentos\n• Entre em contato com o suporte se o problema continuar",
    User_Friendly_Config_Error: "**Problema de Configuração**\n\nHá um problema com a configuração do serviço de email. Entre em contato com seu administrador para resolver este problema.",
    
    // Modal Error Messages
    Modal_Error_Failed_To_Open: "Erro ao abrir modal de preferências. Tente novamente.",
    Modal_Error_Save_Failed: "Erro ao salvar preferências. Verifique sua entrada e tente novamente.",
    Modal_Error_Invalid_Input: "Entrada inválida fornecida. Verifique suas entradas e tente novamente.",
    
    // Form Validation Messages
    Validation_Email_Required: "Endereço de email é obrigatório.",
    Validation_Email_Invalid: "Insira um endereço de email válido.",
    Validation_Field_Required: "Este campo é obrigatório.",
    Validation_Field_Too_Long: "Entrada é muito longa. Comprimento máximo é __max__ caracteres.",
    Validation_Field_Too_Short: "Entrada é muito curta. Comprimento mínimo é __min__ caracteres.",
    
    // OAuth Endpoint Error Messages
    OAuth_Endpoint_Error_Obtaining_Token: "Erro ao obter token de acesso: __error__",
    OAuth_Endpoint_General_Error: "Ocorreu um erro: __error__",
    OAuth_Endpoint_Missing_Parameters: "Parâmetros obrigatórios ausentes (código ou estado)",
    OAuth_Endpoint_Invalid_State: "Solicitação de autorização inválida ou expirada",
    OAuth_Endpoint_Authentication_Failed: "Autenticação falhou",
    OAuth_Endpoint_OAuth_Error: "Erro OAuth: __error__ - __description__",
    OAuth_Endpoint_Enhanced_Error: "__prefix__: __message__",
    
    // Modal and UI Error Messages
    Error_Modal_Creation_Failed: "Falha ao criar modal de preferências do usuário",
    Error_Trigger_ID_Missing: "ID do gatilho não disponível para abrir modal",
    
    // Storage Error Messages
    Storage_Failed_Save_Credentials: "Falha ao salvar credenciais OAuth",
    Storage_Failed_Delete_Credentials: "Falha ao excluir credenciais OAuth", 
    Storage_Failed_Save_State: "Falha ao salvar estado OAuth",
    
    // Generic Account Reference
    Generic_Account: "sua conta",
    
    // OAuth Endpoint Short Keys (shorter names as requested)
    OAuth_Redir_Err: "Incompatibilidade de URI de redirecionamento. Certifique-se de que seu registro de aplicativo Azure inclui o URI exato: __uri__",
    OAuth_SSL_Err: "Erro de Protocolo SSL/TLS. Para desenvolvimento localhost, certifique-se de que o registro do aplicativo Azure inclui URI de redirecionamento HTTP (não HTTPS)",
    Provider_Label: "__provider__",
    
    // Logger Messages (ultra-short keys)
    Log_Logout_Err: "Erro durante tentativa de limpeza de logout",
    Log_Async_Logout: "Erro em ação de logout assíncrona", 
    Log_Async_Pref: "Erro em ação de preferência de usuário assíncrona",
    Log_Pref_Handle: "Erro em handleUserPreferenceAction",
    Log_Auto_Logout: "Erro durante logout automático na mudança de provedor",
    Log_Pref_Submit: "Erro em handleUserPreferenceSubmit",
    Log_Notif_Err: "Falha ao enviar notificação de erro",
    Log_Success_Err: "Falha ao enviar notificação de sucesso", 
    Log_Btn_Fallback: "Falha ao criar notificação com botão de login, recorrendo à notificação de texto",
    Log_Fallback_Err: "Falha ao enviar notificação de texto de fallback",
    
    // Report feature messages
    Report_Provider_Not_Supported: "❌ **__provider__ não é suportado para relatórios.**\n\nPor favor, entre em contato com seu administrador para assistência.",
    Report_Not_Authenticated: "❌ **Você não está autenticado com __provider__.**\n\nUse `/email login` para fazer login primeiro, depois tente gerar o relatório novamente.",
    Report_Error: "❌ **Erro ao gerar relatório de e-mail:**\n__error__\n\nPor favor, tente novamente ou entre em contato com seu administrador.",
    Report_Header: "\n📊 **Relatório de Estatísticas de E-mail(últimas 24 horas)**",
    Report_Statistics: "**Recebidos**: __receivedToday__ emails\n**Enviados**: __sentToday__ emails\n**Não lidos**: __totalUnread__ emails",
    Report_Token_Expired: "❌ **Sua autenticação expirou.**\n\nUse `/email login` para reconectar sua conta __provider__ e tente novamente.",
    Report_Categories_Label: "Report Categories",

    // Statistics Service Errors
    Statistics_Provider_Not_Supported: "Statistics for provider __provider__ are not supported.",
    Statistics_Not_Implemented: "Statistics are not implemented for provider: __provider__",
    Gmail_Stats_Failed: "Failed to get Gmail statistics: __error__",
    Outlook_Stats_Failed: "Failed to get Outlook statistics: __error__",

    // User Preference Modal
    New_Category_Label: "New Category",
    New_Categories_Placeholder: "Add new categories, comma-separated...",
    // Tool Calling Messages
    LLM_Processing_Query: "Processando: \"__query__\"...",
    LLM_User_Query_Display: "**Sua consulta é:** __query__",
    LLM_AI_Thinking: "Agente de IA pensando...",
    LLM_Email_Ready_User: "Olá __name__, seu e-mail intitulado **__subject__** está pronto para enviar.",
    LLM_Tool_Detected: "**Ferramenta Detectada** para consulta: \"__query__\"\n\n**Ferramenta:** __tool__",
    LLM_No_Tool_Detected: "Nenhuma ferramenta adequada encontrada para consulta: \"__query__\"",
    LLM_Error_Processing: "**Erro processando consulta:** \"__query__\"\n\n**Erro:** __error__",
    Tool_Call_Result: "Resultado da Chamada da Ferramenta",
    Tool_Name_Label: "Ferramenta",
    Tool_Args_Label: "Argumentos",
    Query_Processed_Success: "Consulta processada com sucesso",
    Invalid_Tool_Name: "Nome de ferramenta inválido detectado",
    LLM_Parsing_Failed: "Falha ao analisar resposta do LLM",
    
    // Tool Names (for user display)
    Tool_Send_Email: "Enviar Email",
    Tool_Extract_Attachment: "Extrair Anexos",
    Tool_Summarize_And_Send: "Resumir & Enviar Email",
    Tool_Report: "Gerar Relatório",

    // Send Email Modal
    Send_Email_Modal_Title: "Enviar e-mail",
    Send_Email_To_Label: "Para",
    Send_Email_To_Placeholder: "Digite os endereços de e-mail dos destinatários (separados por vírgula)",
    Send_Email_CC_Label: "CC (Opcional)",
    Send_Email_CC_Placeholder: "Digite os endereços de e-mail CC (separados por vírgula)",
    Send_Email_Subject_Label: "Assunto",
    Send_Email_Subject_Placeholder: "Digite o assunto do e-mail",
    Send_Email_Content_Label: "Mensagem",
    Send_Email_Content_Placeholder: "Digite o conteúdo da sua mensagem",
    Send_Email_Send_Button: "Enviar e-mail",
    Send_Email_Cancel_Button: "Cancelar",
    Send_Email_Modal_Opened: "Modal de composição de e-mail aberto com sucesso",
    Send_Email_Success: "E-mail enviado com sucesso ✅",
    Send_Email_Failed: "Falha ao enviar e-mail: __error__",
    Send_Email_Error_No_From_Email: "Não é possível determinar o endereço de e-mail do remetente",
    Send_Email_Validation_To_Required: "Pelo menos um destinatário é obrigatório",
    Send_Email_Validation_Subject_Required: "Assunto é obrigatório",
    Send_Email_Validation_Content_Required: "Conteúdo da mensagem é obrigatório",
    
    // Send Email Button Translations
    Email_Ready_To_Send: "E-mail pronto para enviar",
    Email_Send_Button: "Enviar",
    Email_Edit_And_Send_Button: "Editar e Enviar",
    
    // Send Email with Status
    Send_Email_Success_With_Emoji: "✅ E-mail enviado com sucesso",
    Send_Email_Failed_With_Emoji: "❌ Falha ao enviar e-mail: __error__",

    PROVIDER_NOT_SUPPORTED_LOGOUT: "Falha ao fazer logout. O provedor de email '__provider__' não é suportado.",
    LOGOUT_SUCCESS: "Você foi desconectado com sucesso do __provider__.",
    LOGOUT_FAILED: "Falha ao fazer logout. Por favor, tente novamente.",
    LOGOUT_ERROR: "Ocorreu um erro durante o logout: __error__",
    EMAIL_SENT_CONFIRMATION: "Email enviado.",

    // Send/Edit Action Buttons
    SEND_ACTION_TEXT: "Enviar",
    EDIT_SEND_ACTION_TEXT: "Editar e Enviar",

    // LLM Error Messages
    LLM_No_Response: "Nenhuma resposta recebida do serviço de IA. Tente novamente.",
    LLM_No_Choices: "O serviço de IA retornou uma resposta vazia. Reformule sua solicitação.",
    LLM_Request_Failed: "Falha na comunicação com o serviço de IA",

    // Summarization Messages
    No_Messages_To_Summarize: "Nenhuma mensagem encontrada para resumir com base em seus critérios.",
    Summary_Generation_Failed: "Não foi possível gerar um resumo das mensagens. Tente novamente.",
    LLM_Summary_Email_Ready_User: "Olá __name__, seu e-mail com resumo do canal: **__channelName__** intitulado \"**__subject__**\" está pronto para enviar.",
    LLM_Parsing_Error: "Não consegui entender sua solicitação. Tente reformular com endereços de e-mail ou conteúdo mais simples.",
}; 