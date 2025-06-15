export const pt = {
    // Settings
    Email_Provider_Label: "Provedor de E-mail",
    Email_Provider_Description: "Selecione seu provedor de serviços de e-mail para autenticação",
    Gmail_Label: "Gmail",
    Outlook_Label: "Outlook/Hotmail",
    Google_OAuth_Client_ID_Label: "ID do Cliente OAuth do Google",
    Google_OAuth_Client_ID_Description: "ID do cliente OAuth para autenticação do Google (apenas Gmail)",
    Google_OAuth_Client_Secret_Label: "Segredo do Cliente OAuth do Google",
    Google_OAuth_Client_Secret_Description: "Segredo do cliente OAuth para autenticação do Google (apenas Gmail)",
    OAuth_Redirect_URI_Label: "URI de Redirecionamento OAuth",
    OAuth_Redirect_URI_Description: "URI de redirecionamento OAuth - deve terminar com /api/apps/public/[app-id]/oauth-callback",
    
    // Commands
    Email_Command_Params: "conectar, status, desconectar, ajuda",
    Email_Command_Description: "Conecte e gerencie a integração da sua conta de e-mail com assistência de IA.",
    
    // OAuth Pages
    Authentication_Error_Title: "Erro de Autenticação",
    Authentication_Success_Title: "Autenticação Bem-sucedida!",
    Connected_Account_Message: "Você conectou com sucesso sua conta do Gmail:",
    Try_Again_Message: "Tente novamente ou entre em contato com seu administrador.",
    Close_Window_Label: "Fechar Janela",
    Features_Available_Message: "Agora você pode usar os recursos do EmailBridge NLP no Rocket.Chat!",
    Safe_To_Close_Message: "Você pode fechar esta janela com segurança e retornar ao Rocket.Chat.",
    
    // Action Labels
    Connect_Email_Action_Label: "🔗 Conectar Conta de E-mail",
    Check_Status_Action_Label: "📊 Verificar Status da Conexão",
    Disconnect_Email_Action_Label: "🔌 Desconectar E-mail",
    Send_Email_Action_Label: "📧 Enviar E-mail",
    View_Inbox_Action_Label: "📥 Ver Caixa de Entrada",
    
    // Messages
    OAuth_Connection_Success: "Conectado com sucesso à sua conta de e-mail!",
    OAuth_Connection_Failed: "Falha ao conectar à sua conta de e-mail. Tente novamente.",
    Email_Not_Connected: "Nenhuma conta de e-mail conectada. Conecte sua conta primeiro.",
    Invalid_Email_Provider: "Provedor de e-mail inválido selecionado. Verifique suas configurações.",
    Authentication_Required: "Autenticação necessária. Conecte sua conta de e-mail.",
    Connection_Status_Connected: "✅ Conta de e-mail está conectada e pronta para uso.",
    Connection_Status_Disconnected: "❌ Nenhuma conta de e-mail conectada.",
    Disconnect_Success: "Conta de e-mail desconectada com sucesso.",
    Disconnect_Failed: "Falha ao desconectar a conta de e-mail.",
    
    // Handler messages
    Already_Logged_In: "✅ Você já está logado com **__provider__** como **__email__**.\n\nSe quiser fazer logout, use `/email logout`.",
    Outlook_Coming_Soon: "🚧 **Autenticação do Outlook em breve!**\n\nPor enquanto, use **Gmail** para autenticação de e-mail.\n\n",
    Provider_Not_Implemented: "❌ **Autenticação __provider__ ainda não foi implementada.**\n\nAtualmente apenas **Gmail** é suportado para autenticação.\n\n",
    Connect_Account_Message: "🔐 **Conecte sua conta __provider__ ao Rocket Chat**",
    Login_With_Provider: "🔑 Fazer login com __provider__",
    Error_Processing_Login: "❌ Erro ao processar login: __error__",
    Not_Authenticated: "❌ Você não está autenticado com __provider__. Use `/email login` para fazer login.",
    Logout_Confirmation: "🔓 **Confirmação de Logout**\n\nTem certeza de que deseja fazer logout da conta **__provider__** **__email__**?",
    Confirm_Logout: "🔒 Confirmar Logout",
    Error_Preparing_Logout: "❌ Erro ao preparar logout: __error__",
    
    // Logout action messages
    Provider_Not_Supported_Logout: "❌ **__provider__ não é suportado para logout.**\n\nEntre em contato com seu administrador para obter ajuda.",
    Logout_Success: "✅ **Logout realizado com sucesso da sua conta __provider__.**\n\nAgora você pode fazer login com uma conta diferente, se necessário.",
    Logout_Failed: "❌ **Falha ao fazer logout da sua conta de e-mail.**\n\nTente novamente ou entre em contato com seu administrador.",
    Logout_Error: "❌ **Ocorreu um erro durante o processo de logout:**\n__error__\n\nTente novamente ou entre em contato com seu administrador.",
    
    // Notification messages
    Helper_Greeting: "Olá __name__! Eu sou o Email Bot 👋. Aqui estão algumas dicas rápidas para começar!",
    Available_Commands: "",
    Help_Command: "use `/email help` - Mostrar esta mensagem de ajuda",
    Login_Command: "use `/email login` - Fazer login na sua conta de e-mail",
    Logout_Command: "use `/email logout` - Fazer logout da conta de e-mail",
    Default_Greeting: "Olá __name__! Eu sou o Email Bot 👋. Posso ajudá-lo com todas as suas necessidades de e-mail.",
    Use_Help_Command: "Use `/email help` para aprender sobre todos os recursos e comandos disponíveis.",
    Login_Action_Text: "Fazer login na sua conta de e-mail",
    
    // User Preference Modal
    User_Preference_Title: "⚙️ Preferências do Usuário",
    User_Preference_Button_Label: "⚙️ Preferências do Usuário",
    User_Preference_Update_Button: "Atualizar Preferências",
    User_Preference_Close_Button: "Fechar",
    User_Preference_Success: "**Preferências do usuário atualizadas com sucesso!**",
    Language_Changed: "Idioma alterado para: __language__",
    Email_Provider_Changed: "Provedor de e-mail alterado para: __provider__",
    User_Preference_Error: "❌ **Erro ao atualizar as preferências do usuário:**\n__error__",
    Email_Provider_Preference_Label: "Provedor de E-mail",
    Email_Provider_Preference_Description: "Escolha seu provedor de e-mail preferido para autenticação",
    
    // Language names
    Language: "Idioma",
    Language_EN: "Inglês",
    Language_ES: "Espanhol",
    Language_DE: "Alemão",
    Language_PL: "Polonês",
    Language_PT: "Português",
    Language_RU: "Russo",
}; 