export const es = {
    // Settings
    Email_Provider_Label: "Proveedor de Correo",
    Email_Provider_Description: "Seleccione su proveedor de servicios de correo electrónico para autenticación",
    Gmail_Label: "Gmail",
    Outlook_Label: "Outlook/Hotmail",
    Google_OAuth_Client_ID_Label: "ID de Cliente OAuth de Google",
    Google_OAuth_Client_ID_Description: "ID de cliente OAuth para autenticación de Google (solo Gmail)",
    Google_OAuth_Client_Secret_Label: "Secreto de Cliente OAuth de Google",
    Google_OAuth_Client_Secret_Description: "Secreto de cliente OAuth para autenticación de Google (solo Gmail)",
    OAuth_Redirect_URI_Label: "URI de Redirección OAuth",
    OAuth_Redirect_URI_Description: "URI de redirección OAuth - debe terminar con /api/apps/public/[app-id]/oauth-callback",
    
    // Commands
    Email_Command_Params: "conectar, estado, desconectar, ayuda",
    Email_Command_Description: "Conectar y gestionar la integración de su cuenta de correo electrónico con asistencia de IA.",
    
    // OAuth Pages
    Authentication_Error_Title: "Error de Autenticación",
    Authentication_Success_Title: "¡Autenticación Exitosa!",
    Connected_Account_Message: "Ha conectado exitosamente su cuenta de Gmail:",
    Try_Again_Message: "Por favor, inténtelo de nuevo o contacte a su administrador.",
    Close_Window_Label: "Cerrar Ventana",
    Features_Available_Message: "¡Ahora puede usar las funciones de EmailBridge NLP en Rocket.Chat!",
    Safe_To_Close_Message: "Puede cerrar esta ventana de forma segura y regresar a Rocket.Chat.",
    
    // Action Labels
    Connect_Email_Action_Label: "🔗 Conectar Cuenta de Correo",
    Check_Status_Action_Label: "📊 Verificar Estado de Conexión",
    Disconnect_Email_Action_Label: "🔌 Desconectar Correo",
    Send_Email_Action_Label: "📧 Enviar Correo",
    View_Inbox_Action_Label: "📥 Ver Bandeja de Entrada",
    
    // Messages
    OAuth_Connection_Success: "¡Conectado exitosamente a su cuenta de correo!",
    OAuth_Connection_Failed: "No se pudo conectar a su cuenta de correo. Por favor, inténtelo de nuevo.",
    Email_Not_Connected: "No hay cuenta de correo conectada. Por favor, conecte su cuenta primero.",
    Invalid_Email_Provider: "Proveedor de correo inválido seleccionado. Por favor, verifique su configuración.",
    Authentication_Required: "Autenticación requerida. Por favor, conecte su cuenta de correo.",
    Connection_Status_Connected: "✅ La cuenta de correo está conectada y lista para usar.",
    Connection_Status_Disconnected: "❌ No hay cuenta de correo conectada.",
    Disconnect_Success: "Cuenta de correo desconectada exitosamente.",
    Disconnect_Failed: "No se pudo desconectar su cuenta de correo.",
    
    // Handler messages
    Already_Logged_In: "✅ Ya está conectado con **__provider__** como **__email__**.\n\nSi desea cerrar sesión, use `/email logout`.",
    Outlook_Coming_Soon: "🚧 **¡La autenticación de Outlook estará disponible pronto!**\n\nPor ahora, use **Gmail** para la autenticación de correo electrónico.\n\n",
    Provider_Not_Implemented: "❌ **La autenticación de __provider__ aún no está implementada.**\n\nActualmente solo se admite la autenticación de **Gmail**.\n\n",
    Connect_Account_Message: "🔐 **Conecte su cuenta de __provider__ a Rocket Chat**\nSi desea usar una cuenta de Outlook, cambie el Proveedor de Correo en la configuración.",
    Login_With_Provider: "🔑 Iniciar sesión con __provider__",
    Error_Processing_Login: "❌ Error al procesar el inicio de sesión: __error__",
    Not_Authenticated: "❌ Actualmente no está autenticado con __provider__. Use `/email login` para iniciar sesión.",
    Logout_Confirmation: "🔓 **Confirmación de Cierre de Sesión**\n\n¿Está seguro de que desea cerrar sesión de la cuenta **__provider__** **__email__**?",
    Confirm_Logout: "🔒 Confirmar Cierre de Sesión",
    Error_Preparing_Logout: "❌ Error al preparar el cierre de sesión: __error__",
    
    // Logout action messages
    Provider_Not_Supported_Logout: "❌ **__provider__ no es compatible para cerrar sesión.**\n\nPor favor, contacte a su administrador para obtener ayuda.",
    Logout_Success: "✅ **Cerró sesión exitosamente de su cuenta __provider__.**\n\nAhora puede iniciar sesión con una cuenta diferente si es necesario.",
    Logout_Failed: "❌ **No se pudo cerrar sesión de su cuenta de correo electrónico.**\n\nPor favor, inténtelo de nuevo o contacte a su administrador.",
    Logout_Error: "❌ **Ocurrió un error durante el proceso de cierre de sesión:**\n__error__\n\nPor favor, inténtelo de nuevo o contacte a su administrador.",
    
    // Notification messages
    Helper_Greeting: "¡Hola __name__! Soy Email Bot 👋. ¡Aquí tienes algunos consejos rápidos para empezar!",
    Available_Commands: "",
    Help_Command: "usa `/email help` - Mostrar este mensaje de ayuda",
    Login_Command: "usa `/email login` - Iniciar sesión en su cuenta de correo",
    Logout_Command: "usa `/email logout` - Cerrar sesión de su cuenta de correo",
    Default_Greeting: "¡Hola __name__! Soy Email Bot 👋. Puedo ayudarte con todas tus necesidades de correo electrónico.",
    Use_Help_Command: "Use `/email help` para conocer todas las funciones y comandos disponibles.",
    Login_Action_Text: "Iniciar sesión en su cuenta de correo",
    
    // User Preference Modal
    User_Preference_Title: "⚙️ Preferencias de Usuario",
    User_Preference_Button_Label: "⚙️ Preferencias de Usuario",
    User_Preference_Update_Button: "Actualizar Preferencias",
    User_Preference_Close_Button: "Cerrar",
    User_Preference_Success: "✅ **¡Preferencias de usuario actualizadas exitosamente!**",
    User_Preference_Error: "❌ **Error al actualizar las preferencias de usuario:**\n__error__",
    Email_Provider_Preference_Label: "Proveedor de Correo Electrónico",
    Email_Provider_Preference_Description: "Elija su proveedor de correo electrónico preferido para autenticación",
    
    // Language names
    Language: "Idioma",
    Language_EN: "Inglés",
    Language_ES: "Español",
    Language_DE: "Alemán",
    Language_PL: "Polaco",
    Language_PT: "Portugués",
    Language_RU: "Ruso",
}; 