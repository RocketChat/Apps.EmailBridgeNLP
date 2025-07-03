export const es = {
    // Settings
    Email_Provider_Label: "Proveedor de Email",
    Email_Provider_Description: "Seleccione su proveedor de servicio de email para autenticación",
    Gmail_Label: "Gmail",
    Outlook_Label: "Outlook/Hotmail",
    Google_OAuth_Client_ID_Label: "ID de Cliente OAuth de Google",
    Google_OAuth_Client_ID_Description: "ID de cliente OAuth para autenticación de Google (solo Gmail)",
    Google_OAuth_Client_Secret_Label: "Secreto de Cliente OAuth de Google",
    Google_OAuth_Client_Secret_Description: "Secreto de cliente OAuth para autenticación de Google (solo Gmail)",
    OAuth_Redirect_URI_Label: "URI de Redirección OAuth",
    OAuth_Redirect_URI_Description: "URI de redirección OAuth - debe terminar con /api/apps/public/[app-id]/oauth-callback",
    
    // Outlook OAuth Settings
    Outlook_OAuth_Client_ID_Label: "ID de Cliente OAuth de Outlook",
    Outlook_OAuth_Client_ID_Description: "ID de cliente OAuth para autenticación de Outlook/Microsoft",
    Outlook_OAuth_Client_Secret_Label: "Secreto de Cliente OAuth de Outlook",
    Outlook_OAuth_Client_Secret_Description: "Secreto de cliente OAuth para autenticación de Outlook/Microsoft",
    Outlook_OAuth_Redirect_URI_Label: "URI de Redirección OAuth de Outlook",
    Outlook_OAuth_Redirect_URI_Description: "URI de redirección OAuth para Outlook - debe terminar con /api/apps/public/[app-id]/oauth-callback",
    
    // Commands
    Email_Command_Params: "conectar, estado, desconectar, ayuda",
    Email_Command_Description: "Conectar y gestionar la integración de su cuenta de email con asistencia de IA.",
    
    // OAuth Pages
    Authentication_Error_Title: "Error de Autenticación",
    Authentication_Success_Title: "¡Autenticación Exitosa!",
    Connected_Account_Message: "Ha conectado exitosamente su cuenta de Gmail:",
    Try_Again_Message: "Por favor intente de nuevo o contacte a su administrador.",
    Close_Window_Label: "Cerrar Ventana",
    Features_Available_Message: "¡Ahora puede usar las funciones del Asistente de Email en Rocket.Chat!",
    Safe_To_Close_Message: "Puede cerrar esta ventana de forma segura y volver a Rocket.Chat.",
    
    // Action Labels
    Connect_Email_Action_Label: "Conectar Cuenta de Email",
    Check_Status_Action_Label: "Verificar Estado de Conexión",
    Disconnect_Email_Action_Label: "Desconectar Email",
    Send_Email_Action_Label: "Enviar Email",
    View_Inbox_Action_Label: "Ver Bandeja de Entrada",
    
    // Messages
    OAuth_Connection_Success: "¡Conectado exitosamente a su cuenta de email!",
    OAuth_Connection_Failed: "No se pudo conectar a su cuenta de email. Por favor intente de nuevo.",
    Email_Not_Connected: "No hay cuenta de email conectada. Por favor conecte su cuenta primero.",
    Invalid_Email_Provider: "Proveedor de email inválido seleccionado. Por favor verifique su configuración.",
    Authentication_Required: "Autenticación requerida. Por favor conecte su cuenta de email.",
    Connection_Status_Connected: "La cuenta de email está conectada y lista para usar.",
    Connection_Status_Disconnected: "No hay cuenta de email conectada.",
    Disconnect_Success: "Cuenta de email desconectada exitosamente.",
    Disconnect_Failed: "No se pudo desconectar su cuenta de email.",
    
    // Handler messages
    Already_Logged_In: "Ya está conectado con **__provider__** como **__email__**.\n\nSi desea cerrar sesión, use `/email logout`.",
    Outlook_Coming_Soon: "**¡La autenticación de Outlook estará disponible pronto!**\n\nPor ahora, por favor use **Gmail** para autenticación de email.\n\n",
    Provider_Not_Implemented: "**La autenticación de __provider__ aún no está implementada.**\n\nActualmente solo **Gmail** está soportado para autenticación.\n\n",
    Connect_Account_Message: "**Conectar su cuenta de __provider__ a Rocket Chat**",
    Login_With_Provider: "Iniciar sesión con __provider__",
    Error_Processing_Login: "Error procesando inicio de sesión: __error__",
    Not_Authenticated: "No está autenticado con __provider__. Use `/email login` para iniciar sesión.",
    Logout_Confirmation: "**Confirmación de Cierre de Sesión**\n\n¿Está seguro de que desea cerrar sesión de la cuenta **__provider__** **__email__**?",
    Confirm_Logout: "Confirmar Cierre de Sesión",
    Error_Preparing_Logout: "Error durante cierre de sesión: __error__",
    
    // Logout action messages
    Provider_Not_Supported_Logout: "**__provider__ no está soportado para cierre de sesión.**\n\nPor favor contacte a su administrador para asistencia.",
    Logout_Success: "**Sesión cerrada exitosamente de su cuenta __provider__.**",
    Logout_Failed: "**No se pudo cerrar sesión de su cuenta de email.**\n\nPor favor intente de nuevo o contacte a su administrador.",
    Logout_Error: "**Error ocurrió durante el proceso de cierre de sesión:**\n__error__\n\nPor favor intente de nuevo o contacte a su administrador.",
    
    // Notification messages
    Helper_Greeting: "¡Hola __name__! Soy Email Bot 👋. ¡Aquí tienes algunos consejos rápidos para comenzar!",
    Available_Commands: "",
    Help_Command: "use `/email help` - Mostrar este mensaje de ayuda",
    Login_Command: "use `/email login` - Iniciar sesión en su cuenta de email",
    Logout_Command: "use `/email logout` - Cerrar sesión de su cuenta de email",
    Config_Command: "use `/email config` - Abrir preferencias y configuración de usuario",
    Default_Greeting: "¡Hola __name__! Soy Email Bot 👋. Puedo ayudarte con todas tus necesidades de email.",
    Use_Help_Command: "Use `/email help` para aprender sobre todas las funciones y comandos disponibles.",
    Login_Action_Text: "Iniciar sesión en su cuenta de email",
    
    // User Preference Modal
    User_Preference_Title: "Preferencias de Usuario",
    User_Preference_Button_Label: "⚙️ Preferencias de Usuario",
    User_Preference_Update_Button: "Actualizar Preferencias",
    User_Preference_Close_Button: "Cerrar",
    User_Preference_Success: "**¡Preferencias de usuario actualizadas exitosamente!**",
    Language_Changed: "Idioma cambiado a: __language__",
    Email_Provider_Changed: "Proveedor de email cambiado a: __provider__",
    User_Preference_Error: "**Error al actualizar preferencias de usuario:**\n__error__",
    Email_Provider_Preference_Label: "Proveedor de Email",
    Email_Provider_Preference_Description: "Elija su proveedor de email preferido para autenticación",
    
    // Language names
    Language: "Idioma",
    Language_EN: "Inglés",
    Language_ES: "Español",
    Language_DE: "Alemán",
    Language_PL: "Polaco",
    Language_PT: "Portugués",
    Language_RU: "Ruso",
    
    // Config error messages
    Config_Error: "Error de configuración: __error__",
    
    // Provider change messages
    Provider_Changed_Auto_Logout: "Ha sido automáticamente desconectado de **__oldProvider__**",
    Provider_Change_Warning: "⚠️ Advertencia: Cambiar su proveedor de email lo desconectará automáticamente de su cuenta actual.",
    
    // Granular Error Messages 
    Error_Fill_Required_Fields: "Error al procesar solicitud. Por favor complete todos los campos requeridos ❌",
    Error_Fail_Internal: "Error interno. Por favor intente de nuevo más tarde.",
    Error_Network_Failure: "Fallo de conexión de red. Por favor verifique su conexión a internet e intente de nuevo.",
    Error_Invalid_Credentials: "Credenciales inválidas proporcionadas. Por favor verifique su configuración OAuth.",
    Error_Token_Expired: "Su token de autenticación ha expirado. Por favor inicie sesión de nuevo.",
    Error_Token_Invalid: "El token de autenticación es inválido. Por favor inicie sesión de nuevo.",
    Error_Missing_Configuration: "Falta configuración requerida. Por favor contacte a su administrador.",
    Error_Service_Unavailable: "El servicio de email no está disponible actualmente. Por favor intente más tarde.",
    Error_Rate_Limit_Exceeded: "Demasiadas solicitudes. Por favor espere un momento e intente de nuevo.",
    Error_Permission_Denied: "Permiso denegado. Por favor verifique los permisos de su cuenta.",
    Error_User_Info_Missing: "Error al obtener información del usuario. Por favor intente iniciar sesión de nuevo.",
    Error_Connection_Lost: "Conexión al servicio de email perdida. Por favor verifique su red e intente de nuevo.",
    Error_OAuth_Callback_Failed: "Callback OAuth falló. Por favor intente el proceso de autenticación de nuevo.",
    Error_Settings_Not_Found: "Configuración de email no configurada. Por favor contacte a su administrador.",
    Error_Provider_Mismatch: "Discrepancia en la configuración del proveedor de email. Por favor contacte a su administrador.",
    
    // Success Messages
    Success_Connection_Established: "Conexión de email establecida exitosamente ✅",
    Success_User_Info_Retrieved: "Información del usuario obtenida exitosamente ✅",
    Success_Token_Refreshed: "Token de autenticación actualizado exitosamente ✅",
    Success_Logout_Complete: "Sesión cerrada exitosamente de su cuenta de email ✅",
    Success_Configuration_Updated: "Configuración de email actualizada exitosamente ✅",
    
    // OAuth Specific Errors
    OAuth_Error_Authorization_Denied: "La autorización fue denegada. Por favor intente de nuevo y otorgue los permisos necesarios.",
    OAuth_Error_Invalid_State: "Parámetro de estado OAuth inválido. Esto podría ser un problema de seguridad. Por favor intente de nuevo.",
    OAuth_Error_Code_Exchange_Failed: "Error al intercambiar código de autorización por tokens. Por favor intente de nuevo.",
    OAuth_Error_Invalid_Grant: "Grant OAuth inválido. Su código de autorización podría haber expirado. Por favor intente de nuevo.",
    OAuth_Error_Scope_Insufficient: "Permisos de scope OAuth insuficientes. Por favor contacte a su administrador.",
    
    // User-Friendly Error Messages
    User_Friendly_Auth_Error: "**Error de Autenticación**\n\nNo pudimos conectar a su cuenta de email. Esto podría ser porque:\n• Sus credenciales han expirado\n• El servicio está temporalmente no disponible\n• Hay un problema de configuración\n\nPor favor intente de nuevo o contacte a su administrador si el problema persiste.",
    User_Friendly_Network_Error: "**Problema de Conexión**\n\nTenemos problemas conectando al servicio de email. Por favor:\n• Verifique su conexión a internet\n• Intente de nuevo en unos momentos\n• Contacte soporte si el problema continúa",
    User_Friendly_Config_Error: "**Problema de Configuración**\n\nHay un problema con la configuración del servicio de email. Por favor contacte a su administrador para resolver este problema.",
    
    // Modal Error Messages
    Modal_Error_Failed_To_Open: "Error al abrir modal de preferencias. Por favor intente de nuevo.",
    Modal_Error_Save_Failed: "Error al guardar preferencias. Por favor verifique su entrada e intente de nuevo.",
    Modal_Error_Invalid_Input: "Entrada inválida proporcionada. Por favor verifique sus entradas e intente de nuevo.",
    
    // Form Validation Messages
    Validation_Email_Required: "La dirección de email es requerida.",
    Validation_Email_Invalid: "Por favor ingrese una dirección de email válida.",
    Validation_Field_Required: "Este campo es requerido.",
    Validation_Field_Too_Long: "La entrada es muy larga. La longitud máxima es __max__ caracteres.",
    Validation_Field_Too_Short: "La entrada es muy corta. La longitud mínima es __min__ caracteres.",
    
    // OAuth Endpoint Error Messages
    OAuth_Endpoint_Error_Obtaining_Token: "Error al obtener token de acceso: __error__",
    OAuth_Endpoint_General_Error: "Ocurrió un error: __error__",
    OAuth_Endpoint_Missing_Parameters: "Faltan parámetros requeridos (código o estado)",
    OAuth_Endpoint_Invalid_State: "Solicitud de autorización inválida o expirada",
    OAuth_Endpoint_Authentication_Failed: "Falló la autenticación",
    OAuth_Endpoint_OAuth_Error: "Error OAuth: __error__ - __description__",
    OAuth_Endpoint_Enhanced_Error: "__prefix__: __message__",
    
    // Modal and UI Error Messages
    Error_Modal_Creation_Failed: "Error al crear modal de preferencias de usuario",
    Error_Trigger_ID_Missing: "ID de disparador no disponible para abrir modal",
    
    // Storage Error Messages
    Storage_Failed_Save_Credentials: "Error al guardar credenciales OAuth",
    Storage_Failed_Delete_Credentials: "Error al eliminar credenciales OAuth", 
    Storage_Failed_Save_State: "Error al guardar estado OAuth",
    
    // Generic Account Reference
    Generic_Account: "su cuenta",
    
    // OAuth Endpoint Short Keys (shorter names as requested)
    OAuth_Redir_Err: "Error de URI de redirección. Asegúrese de que su registro de aplicación de Azure incluya la URI exacta: __uri__",
    OAuth_SSL_Err: "Error de Protocolo SSL/TLS. Para desarrollo local, asegúrese de que el registro de aplicación de Azure incluya URI de redirección HTTP (no HTTPS)",
    Provider_Label: "__provider__",
    
    // Logger Messages (ultra-short keys)
    Log_Logout_Err: "Error durante intento de limpieza de cierre de sesión",
    Log_Async_Logout: "Error en acción de cierre de sesión asíncrona", 
    Log_Async_Pref: "Error en acción de preferencia de usuario asíncrona",
    Log_Pref_Handle: "Error en handleUserPreferenceAction",
    Log_Auto_Logout: "Error durante cierre de sesión automático en cambio de proveedor",
    Log_Pref_Submit: "Error en handleUserPreferenceSubmit",
    Log_Notif_Err: "Error al enviar notificación de error",
    Log_Success_Err: "Error al enviar notificación de éxito", 
    Log_Btn_Fallback: "Error al crear notificación con botón de inicio de sesión, recurriendo a notificación de texto",
    Log_Fallback_Err: "Error al enviar notificación de texto de respaldo",
    
    // Report feature messages
    Report_Provider_Not_Supported: "❌ **__provider__ no es compatible para reportes.**\n\nPor favor, contacta a tu administrador para asistencia.",
    Report_Not_Authenticated: "❌ **No estás autenticado con __provider__.**\n\nUsa `/email login` para iniciar sesión primero, luego intenta generar el reporte nuevamente.",
    Report_Error: "❌ **Error al generar el reporte de correo:**\n__error__\n\nPor favor, inténtalo de nuevo o contacta a tu administrador.",
    Report_Header: "\n📊 **Reporte de Estadísticas de Correo(últimas 24 horas)**",
    Report_Statistics: "**Recibido**: __receivedToday__ correos\n**Enviado**: __sentToday__ correos\n**No leídos**: __totalUnread__ correos",
    Report_Token_Expired: "❌ **Tu autenticación ha expirado.**\n\nUsa `/email login` para reconectar tu cuenta de __provider__ e intentarlo de nuevo.",
    Report_Categories_Label: "Report Categories",
    Report_Command: "usa `/email report` - Obtener informe diario de estadísticas de correo",

    // Statistics Service Errors
    Statistics_Provider_Not_Supported: "Statistics for provider __provider__ are not supported.",
    Statistics_Not_Implemented: "Statistics are not implemented for provider: __provider__",
    Gmail_Stats_Failed: "Failed to get Gmail statistics: __error__",
    Outlook_Stats_Failed: "Failed to get Outlook statistics: __error__",

    // User Preference Modal
    New_Category_Label: "New Category",
    New_Categories_Placeholder: "Add new categories, comma-separated...",
    // Tool Calling Messages
    LLM_Processing_Query: "Procesando: \"__query__\"...",
    LLM_Tool_Detected: "**Herramienta Detectada** para consulta: \"__query__\"\n\n**Herramienta:** __tool__",
    LLM_No_Tool_Detected: "No se encontró herramienta adecuada para consulta: \"__query__\"",
    LLM_Error_Processing: "**Error procesando consulta:** \"__query__\"\n\n**Error:** __error__",
    Tool_Call_Result: "Resultado de Llamada de Herramienta",
    Tool_Name_Label: "Herramienta",
    Tool_Args_Label: "Argumentos",
    Query_Processed_Success: "Consulta procesada exitosamente",
    Invalid_Tool_Name: "Nombre de herramienta inválido detectado",
    LLM_Parsing_Failed: "Error al analizar respuesta del LLM",
    
    // Tool Names (for user display)
    Tool_Send_Email: "Enviar Email",
    Tool_Count_Emails: "Contar Emails",
    Tool_Search_Emails: "Buscar Emails",
    Tool_Get_Email_Content: "Obtener Contenido de Email",
    Tool_Summarize_And_Send: "Resumir y Enviar Email",
    Tool_Report: "Generar Reporte",

    // Send Email Modal
    Send_Email_Modal_Title: 'Enviar Correo',
    Send_Email_To_Label: 'Para',
    Send_Email_To_Placeholder: 'Ingrese direcciones de correo destinatarias (separadas por comas)',
    Send_Email_CC_Label: 'CC',
    Send_Email_CC_Placeholder: 'Ingrese direcciones de correo CC (separadas por comas)',
    Send_Email_Subject_Label: 'Asunto',
    Send_Email_Subject_Placeholder: 'Ingrese el asunto del correo',
    Send_Email_Content_Label: 'Contenido',
    Send_Email_Content_Placeholder: 'Ingrese el contenido del correo',
    Send_Email_Send_Button: 'Enviar',
    Send_Email_Cancel_Button: 'Cancelar',
    Send_Email_Success: 'Correo enviado exitosamente',
    Send_Email_Failed: 'Error al enviar correo: __error__',
    Send_Email_Modal_Opened: 'Modal de composición de correo abierto',
    Send_Email_Error_No_From_Email: 'No se puede determinar la dirección de correo del remitente',

    // Send Email Validation
    Send_Email_Validation_To_Required: "La dirección de correo del destinatario es obligatoria",
    Send_Email_Validation_Subject_Required: "El asunto del correo es obligatorio",
    Send_Email_Validation_Content_Required: "El contenido del correo es obligatorio",
    
    // Send Email Button Translations
    Email_Ready_To_Send: 'Correo listo para enviar',
    Email_Send_Button: 'Enviar',
    Email_Edit_And_Send_Button: 'Editar y Enviar',
    
    // Send Email with Status
    Send_Email_Success_With_Emoji: '✅ Correo enviado exitosamente',
    Send_Email_Failed_With_Emoji: '❌ Error al enviar correo: __error__',
}; 