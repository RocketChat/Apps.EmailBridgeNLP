export const es = {
    // Settings
    Email_Provider_Label: "Proveedor de Correo Electrónico",
    Email_Provider_Description: "Selecciona tu proveedor de servicios de correo electrónico para la autenticación",
    Gmail_Label: "Gmail",
    Outlook_Label: "Outlook/Hotmail",
    Google_OAuth_Client_ID_Label: "ID de Cliente OAuth de Google",
    Google_OAuth_Client_ID_Description: "ID del cliente OAuth para autenticación de Google (solo Gmail)",
    Google_OAuth_Client_Secret_Label: "Secreto de Cliente OAuth de Google",
    Google_OAuth_Client_Secret_Description: "Secreto del cliente OAuth para autenticación de Google (solo Gmail)",
    OAuth_Redirect_URI_Label: "URI de Redirección OAuth",
    OAuth_Redirect_URI_Description: "URI de redirección OAuth - debe terminar con /api/apps/public/[app-id]/oauth-callback",
    
    // Commands
    Email_Command_Params: "conectar, estado, desconectar, ayuda",
    Email_Command_Description: "Conecta y gestiona la integración de tu cuenta de correo electrónico con asistencia de IA.",
    
    // OAuth Pages
    Authentication_Error_Title: "Error de Autenticación",
    Authentication_Success_Title: "¡Autenticación Exitosa!",
    Connected_Account_Message: "Has conectado exitosamente tu cuenta de Gmail:",
    Try_Again_Message: "Por favor, inténtalo de nuevo o contacta a tu administrador.",
    Close_Window_Label: "Cerrar Ventana",
    Features_Available_Message: "¡Ahora puedes usar las funciones del Asistente de Email en Rocket.Chat!",
    Safe_To_Close_Message: "Puedes cerrar esta ventana de forma segura y regresar a Rocket.Chat.",
    
    // Action Labels
    Connect_Email_Action_Label: "Conectar Cuenta de Correo",
    Check_Status_Action_Label: "Verificar Estado de Conexión",
    Disconnect_Email_Action_Label: "Desconectar Correo",
    Send_Email_Action_Label: "Enviar Correo",
    View_Inbox_Action_Label: "Ver Bandeja de Entrada",
    
    // Messages
    OAuth_Connection_Success: "¡Conectado exitosamente a tu cuenta de correo electrónico!",
    OAuth_Connection_Failed: "Error al conectar con tu cuenta de correo electrónico. Por favor, inténtalo de nuevo.",
    Email_Not_Connected: "No hay cuenta de correo conectada. Por favor, conecta tu cuenta primero.",
    Invalid_Email_Provider: "Proveedor de correo electrónico inválido seleccionado. Por favor, verifica tu configuración.",
    Authentication_Required: "Autenticación requerida. Por favor, conecta tu cuenta de correo electrónico.",
    Connection_Status_Connected: "La cuenta de correo electrónico está conectada y lista para usar.",
    Connection_Status_Disconnected: "No hay cuenta de correo electrónico conectada.",
    Disconnect_Success: "Cuenta de correo electrónico desconectada exitosamente.",
    Disconnect_Failed: "Error al desconectar tu cuenta de correo electrónico.",
    
    // Handler messages
    Already_Logged_In: "✅ Ya estás conectado con **__provider__** como **__email__**.\n\nSi quieres desconectarte, usa `/email logout`.",
    Outlook_Coming_Soon: "🚧 **¡La autenticación de Outlook estará disponible pronto!**\n\nPor ahora, usa **Gmail** para la autenticación de correo electrónico.\n\n",
    Provider_Not_Implemented: "❌ **La autenticación de __provider__ aún no está implementada.**\n\nActualmente solo **Gmail** es compatible para autenticación.\n\n",
    Connect_Account_Message: "🔐 **Conecta tu cuenta de __provider__ a Rocket Chat**",
    Login_With_Provider: "🔑 Iniciar sesión con __provider__",
    Error_Processing_Login: "❌ Error procesando el inicio de sesión: __error__",
    Not_Authenticated: "❌ No estás autenticado con __provider__. Usa `/email login` para iniciar sesión.",
    Logout_Confirmation: "🔓 **Confirmación de Cierre de Sesión**\n\n¿Estás seguro de que quieres cerrar sesión de la cuenta **__provider__** **__email__**?",
    Confirm_Logout: "🔒 Confirmar Cierre de Sesión",
    Error_Preparing_Logout: "❌ Error preparando el cierre de sesión: __error__",
    
    // Logout action messages
    Provider_Not_Supported_Logout: "❌ **__provider__ no es compatible para cierre de sesión.**\n\nPor favor, contacta a tu administrador para asistencia.",
    Logout_Success: "✅ **Cerrado exitosamente la sesión de tu cuenta __provider__.**",
    Logout_Failed: "❌ **Error al cerrar sesión de tu cuenta de correo electrónico.**\n\nPor favor, inténtalo de nuevo o contacta a tu administrador.",
    Logout_Error: "❌ **Ocurrió un error durante el proceso de cierre de sesión:**\n__error__\n\nPor favor, inténtalo de nuevo o contacta a tu administrador.",
    
    // Notification messages
    Helper_Greeting: "¡Hola __name__! Soy Email Bot 👋. ¡Aquí tienes algunos consejos rápidos para empezar!",
    Available_Commands: "",
    Help_Command: "usa `/email help` - Mostrar este mensaje de ayuda",
    Login_Command: "usa `/email login` - Iniciar sesión en tu cuenta de correo",
    Logout_Command: "usa `/email logout` - Cerrar sesión de tu cuenta de correo",
    Config_Command: "usa `/email config` - Abrir preferencias de usuario y configuraciones",
    Default_Greeting: "¡Hola __name__! Soy Email Bot 👋. Puedo ayudarte con todas tus necesidades de correo electrónico.",
    Use_Help_Command: "Usa `/email help` para aprender sobre todas las funciones y comandos disponibles.",
    Login_Action_Text: "Iniciar sesión en tu cuenta de correo",
    
    // User Preference Modal
    User_Preference_Title: "⚙️ Preferencias de Usuario",
    User_Preference_Button_Label: "⚙️ Preferencias de Usuario",
    User_Preference_Update_Button: "Actualizar Preferencias",
    User_Preference_Close_Button: "Cerrar",
    User_Preference_Success: "**¡Preferencias de usuario actualizadas exitosamente!**",
    Language_Changed: "Idioma cambiado a: __language__",
    Email_Provider_Changed: "Proveedor de correo cambiado a: __provider__",
    User_Preference_Error: "❌ **Error al actualizar las preferencias de usuario:**\n__error__",
    Email_Provider_Preference_Label: "Proveedor de Correo Electrónico",
    Email_Provider_Preference_Description: "Elige tu proveedor de correo electrónico preferido para autenticación",
    
    // Language names
    Language: "Idioma",
    Language_EN: "Inglés",
    Language_ES: "Español",
    Language_DE: "Alemán",
    Language_PL: "Polaco",
    Language_PT: "Portugués",
    Language_RU: "Ruso",
    
    // Config error messages
    Config_Error: "❌ Error de configuración: __error__",
    
    // Command preview - handled by hardcoded i18nTitle in EmailCommand.ts
}; 