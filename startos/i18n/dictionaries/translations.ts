import { LangDict } from './default'

export default {
  es_ES: {
    // main.ts
    1: 'La interfaz web está lista',
    2: 'La interfaz web no está lista',
    3: 'Se requiere contraseña',
    4: 'La interfaz web no es accesible',
    5: 'Nodo conectado',
    6: 'Credenciales RPC inválidas, recréalas en el menú de acciones',
    7: 'Error al conectar al nodo Bitcoin local',
    8: 'Conectado al nodo Bitcoin local',
    9: 'Usando servidor electrum local',
    10: 'Cambia la configuración para no usar un servidor electrum público',
    11: 'Usando un servidor electrum público',

    // interfaces.ts
    100: 'Interfaz web',

    // actions/uiCredentials.ts
    200: 'Mostrar las credenciales de la interfaz web.',
    201: 'Nombre de usuario para la interfaz web',
    202: 'Contraseña para la interfaz web',

    // actions/config.ts
    300: 'El nombre de usuario para iniciar sesión en tu Webtop.',
    301: 'La contraseña para iniciar sesión en tu Webtop.',
    302: 'Configuración de Sparrow',
    303: 'Servidor Bitcoin/Electrum',
    304: 'Configuración de proxy',
    305: 'Nombre de usuario/contraseña de Webtop y configuración de conexión',

    // manifest/index.ts
    400: 'Usado para conectar a tu nodo Bitcoin.',
  },
  de_DE: {
    // main.ts
    1: 'Die Weboberfläche ist bereit',
    2: 'Die Weboberfläche ist nicht bereit',
    3: 'Passwort ist erforderlich',
    4: 'Die Weboberfläche ist nicht erreichbar',
    5: 'Verbundener Knoten',
    6: 'Ungültige RPC-Anmeldedaten, erstellen Sie sie im Aktionsmenü neu',
    7: 'Verbindung zum lokalen Bitcoin-Knoten fehlgeschlagen',
    8: 'Verbunden mit lokalem Bitcoin-Knoten',
    9: 'Lokaler Electrum-Server wird verwendet',
    10: 'Ändern Sie die Einstellungen, um keinen öffentlichen Electrum-Server zu verwenden',
    11: 'Öffentlicher Electrum-Server wird verwendet',

    // interfaces.ts
    100: 'Weboberfläche',

    // actions/uiCredentials.ts
    200: 'Anmeldedaten für die Weboberfläche anzeigen.',
    201: 'Benutzername für die Weboberfläche',
    202: 'Passwort für die Weboberfläche',

    // actions/config.ts
    300: 'Der Benutzername zum Anmelden bei Ihrem Webtop.',
    301: 'Das Passwort zum Anmelden bei Ihrem Webtop.',
    302: 'Sparrow-Einstellungen',
    303: 'Bitcoin/Electrum Server',
    304: 'Proxy-Einstellungen',
    305: 'Webtop-Benutzername/-Passwort und Verbindungseinstellungen',

    // manifest/index.ts
    400: 'Wird verwendet, um eine Verbindung zu Ihrem Bitcoin-Knoten herzustellen.',
  },
  pl_PL: {
    // main.ts
    1: 'Interfejs webowy jest gotowy',
    2: 'Interfejs webowy nie jest gotowy',
    3: 'Hasło jest wymagane',
    4: 'Interfejs webowy jest niedostępny',
    5: 'Podłączony węzeł',
    6: 'Nieprawidłowe dane RPC, utwórz je ponownie w menu akcji',
    7: 'Nie udało się połączyć z lokalnym węzłem Bitcoin',
    8: 'Połączono z lokalnym węzłem Bitcoin',
    9: 'Używanie lokalnego serwera electrum',
    10: 'Zmień ustawienia, aby nie używać publicznego serwera electrum',
    11: 'Używanie publicznego serwera electrum',

    // interfaces.ts
    100: 'Interfejs webowy',

    // actions/uiCredentials.ts
    200: 'Pokaż dane logowania do interfejsu webowego.',
    201: 'Nazwa użytkownika dla interfejsu webowego',
    202: 'Hasło dla interfejsu webowego',

    // actions/config.ts
    300: 'Nazwa użytkownika do logowania w twoim Webtop.',
    301: 'Hasło do logowania w twoim Webtop.',
    302: 'Ustawienia Sparrow',
    303: 'Serwer Bitcoin/Electrum',
    304: 'Ustawienia proxy',
    305: 'Nazwa użytkownika/hasło Webtop i ustawienia połączenia',

    // manifest/index.ts
    400: 'Używany do połączenia z twoim węzłem Bitcoin.',
  },
  fr_FR: {
    // main.ts
    1: "L'interface web est prête",
    2: "L'interface web n'est pas prête",
    3: 'Mot de passe requis',
    4: "L'interface web est inaccessible",
    5: 'Nœud connecté',
    6: "Identifiants RPC invalides, recréez-les dans le menu d'action",
    7: 'Échec de la connexion au nœud Bitcoin local',
    8: 'Connecté au nœud Bitcoin local',
    9: 'Utilisation du serveur electrum local',
    10: 'Modifiez les paramètres pour ne pas utiliser un serveur electrum public',
    11: 'Utilisation d\'un serveur electrum public',

    // interfaces.ts
    100: 'Interface web',

    // actions/uiCredentials.ts
    200: "Afficher les identifiants de l'interface web.",
    201: "Nom d'utilisateur pour l'interface web",
    202: "Mot de passe pour l'interface web",

    // actions/config.ts
    300: "Le nom d'utilisateur pour se connecter à votre Webtop.",
    301: 'Le mot de passe pour se connecter à votre Webtop.',
    302: 'Paramètres Sparrow',
    303: 'Serveur Bitcoin/Electrum',
    304: 'Paramètres proxy',
    305: "Nom d'utilisateur/mot de passe Webtop et paramètres de connexion",

    // manifest/index.ts
    400: 'Utilisé pour se connecter à votre nœud Bitcoin.',
  },
} satisfies Record<string, LangDict>
