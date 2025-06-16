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
    
    // Commands
    Email_Command_Params: "conectar, status, desconectar, ajuda",
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
    OAuth_Connection_Failed: "Falha ao conectar à sua conta de email. Por favor, tente novamente.",
    Email_Not_Connected: "Nenhuma conta de email conectada. Por favor, conecte sua conta primeiro.",
    Invalid_Email_Provider: "Provedor de email inválido selecionado. Por favor, verifique suas configurações.",
    Authentication_Required: "Autenticação necessária. Por favor, conecte sua conta de email.",
    Connection_Status_Connected: "Conta de email está conectada e pronta para uso.",
    Connection_Status_Disconnected: "Nenhuma conta de email conectada.",
    Disconnect_Success: "Conta de email desconectada com sucesso.",
    Disconnect_Failed: "Falha ao desconectar sua conta de email.",
    
    // Handler messages
    Already_Logged_In: "✅ Você já está logado com **__provider__** como **__email__**.\n\nSe quiser sair, use `/email logout`.",
    Outlook_Coming_Soon: "🚧 **Autenticação Outlook em breve!**\n\nPor enquanto, use **Gmail** para autenticação de email.\n\n",
    Provider_Not_Implemented: "❌ **Autenticação __provider__ ainda não foi implementada.**\n\nAtualmente apenas **Gmail** é suportado para autenticação.\n\n",
    Connect_Account_Message: "🔐 **Conecte sua conta __provider__ ao Rocket Chat**",
    Login_With_Provider: "🔑 Entrar com __provider__",
    Error_Processing_Login: "❌ Erro ao processar login: __error__",
    Not_Authenticated: "❌ Você não está autenticado com __provider__. Use `/email login` para entrar.",
    Logout_Confirmation: "🔓 **Confirmação de Logout**\n\nTem certeza de que deseja sair da conta **__provider__** **__email__**?",
    Confirm_Logout: "🔒 Confirmar Logout",
    Error_Preparing_Logout: "❌ Erro ao preparar logout: __error__",
    
    // Logout action messages
    Provider_Not_Supported_Logout: "❌ **__provider__ não é suportado para logout.**\n\nPor favor, entre em contato com seu administrador para assistência.",
    Logout_Success: "✅ **Logout bem-sucedido da sua conta __provider__.**",
    Logout_Failed: "❌ **Falha ao fazer logout da sua conta de email.**\n\nPor favor, tente novamente ou entre em contato com seu administrador.",
    Logout_Error: "❌ **Erro ocorreu durante o processo de logout:**\n__error__\n\nPor favor, tente novamente ou entre em contato com seu administrador.",
    
    // Notification messages
    Helper_Greeting: "Olá __name__! Eu sou o Email Bot 👋. Aqui estão algumas dicas rápidas para começar!",
    Available_Commands: "",
    Help_Command: "use `/email help` - Mostrar esta mensagem de ajuda",
    Login_Command: "use `/email login` - Entrar na sua conta de email",
    Logout_Command: "use `/email logout` - Sair da sua conta de email",
    Config_Command: "use `/email config` - Abrir preferências do usuário e configurações",
    Default_Greeting: "Olá __name__! Eu sou o Email Bot 👋. Posso ajudá-lo com todas as suas necessidades de email.",
    Use_Help_Command: "Use `/email help` para aprender sobre todos os recursos e comandos disponíveis.",
    Login_Action_Text: "Entrar na sua conta de email",
    
    // User Preference Modal
    User_Preference_Title: "⚙️ Preferências do Usuário",
    User_Preference_Button_Label: "⚙️ Preferências do Usuário",
    User_Preference_Update_Button: "Atualizar Preferências",
    User_Preference_Close_Button: "Fechar",
    User_Preference_Success: "**Preferências do usuário atualizadas com sucesso!**",
    Language_Changed: "Idioma alterado para: __language__",
    Email_Provider_Changed: "Provedor de email alterado para: __provider__",
    User_Preference_Error: "❌ **Falha ao atualizar preferências do usuário:**\n__error__",
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
    Config_Error: "❌ Erro de configuração: __error__",
}; 