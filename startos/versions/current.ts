import { VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { removeLegacyProotApps } from '../utils'

export const SPARROW_VERSION = '2.5.4'
export const SPARROW_IMAGE_TAG = '2.5.4.1'

export const current = VersionInfo.of({
  version: '2.5.4:1',
  releaseNotes: {
    en_US: `- Updates the streamed desktop to Selkies 2, including support for browsers without WebCodecs.
- Defaults streaming to 30 fps with Turbo off. The frame rate remains adjustable from 8–120 fps and Turbo can be changed; existing browser-saved choices are retained.
- Adds on-demand browser camera forwarding for QR scanning. Use a supported browser over trusted HTTPS; Tor Browser does not provide camera access.
- Removes the third-party application gallery and its unmodified bundled tools from existing homes. Other desktop tools and user files are preserved.
- Disables and locks desktop audio output and microphone forwarding.`,
    es_ES: `- Actualiza el escritorio remoto a Selkies 2, con compatibilidad para navegadores sin WebCodecs.
- La transmisión usa 30 fps y Turbo desactivado de forma predeterminada. La tasa de fotogramas se puede ajustar entre 8 y 120 fps y se puede cambiar Turbo; se conservan las preferencias guardadas en el navegador.
- Añade el reenvío de la cámara del navegador bajo demanda para escanear códigos QR. Usa un navegador compatible mediante HTTPS de confianza; Tor Browser no permite acceder a la cámara.
- Elimina la galería de aplicaciones de terceros y sus herramientas incluidas sin modificar de las carpetas personales existentes. Conserva las demás herramientas del escritorio y los archivos del usuario.
- Desactiva y bloquea el audio del escritorio y el reenvío del micrófono.`,
    de_DE: `- Aktualisiert den übertragenen Desktop auf Selkies 2, einschließlich Unterstützung für Browser ohne WebCodecs.
- Verwendet standardmäßig 30 fps bei ausgeschaltetem Turbo. Die Bildrate bleibt zwischen 8 und 120 fps einstellbar und Turbo kann geändert werden; im Browser gespeicherte Einstellungen bleiben erhalten.
- Ergänzt die bedarfsgesteuerte Weiterleitung der Browserkamera zum Scannen von QR-Codes. Verwenden Sie einen unterstützten Browser über vertrauenswürdiges HTTPS; Tor Browser bietet keinen Kamerazugriff.
- Entfernt den Anwendungskatalog von Drittanbietern und dessen unveränderte mitgelieferte Werkzeuge aus bestehenden Benutzerverzeichnissen. Andere Desktop-Werkzeuge und Benutzerdateien bleiben erhalten.
- Deaktiviert und sperrt Desktop-Audio und Mikrofonweiterleitung.`,
    pl_PL: `- Aktualizuje przesyłany pulpit do Selkies 2, dodając obsługę przeglądarek bez WebCodecs.
- Domyślnie ustawia transmisję na 30 kl./s z wyłączonym Turbo. Liczbę klatek można zmieniać od 8 do 120 kl./s, a tryb Turbo pozostaje regulowany; ustawienia zapisane w przeglądarce zostają zachowane.
- Dodaje przekazywanie kamery przeglądarki na żądanie do skanowania kodów QR. Użyj obsługiwanej przeglądarki przez zaufane HTTPS; Tor Browser nie udostępnia kamery.
- Usuwa galerię aplikacji innych firm i jej niezmodyfikowane narzędzia z istniejących katalogów domowych. Pozostałe narzędzia pulpitu i pliki użytkownika zostają zachowane.
- Wyłącza i blokuje dźwięk pulpitu oraz przekazywanie mikrofonu.`,
    fr_FR: `- Met à jour le bureau distant vers Selkies 2, avec la prise en charge des navigateurs sans WebCodecs.
- Utilise par défaut 30 images/s avec Turbo désactivé. La fréquence reste réglable de 8 à 120 images/s et le mode Turbo peut être modifié ; les préférences enregistrées dans le navigateur sont conservées.
- Ajoute le transfert à la demande de la caméra du navigateur pour scanner les codes QR. Utilisez un navigateur compatible via une connexion HTTPS de confiance ; Tor Browser ne donne pas accès à la caméra.
- Supprime la galerie d’applications tierces et ses outils fournis non modifiés des dossiers personnels existants. Les autres outils du bureau et les fichiers de l’utilisateur sont conservés.
- Désactive et verrouille le son du bureau et le transfert du microphone.`,
  },
  migrations: {
    up: async () => {
      await removeLegacyProotApps(sdk.volumes.userdir.subpath(''))
    },
    down: async () => {},
  },
})
