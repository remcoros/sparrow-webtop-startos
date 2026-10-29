import { VersionInfo } from '@start9labs/start-sdk'

export const SPARROW_VERSION = '2.5.6'
export const SPARROW_IMAGE_TAG = '2.5.6'

export const current = VersionInfo.of({
  version: '2.5.6:0',
  releaseNotes: {
    en_US:
      'Updates Sparrow to 2.5.6 with stronger transaction and payjoin verification, screen reader and keyboard improvements, and three QR density levels. Updates bundled Java and Tor and refreshes the Debian desktop base. [Full Sparrow release notes](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.6).',
    es_ES:
      'Actualiza Sparrow a 2.5.6 con una verificación más estricta de transacciones y payjoin, mejoras para lectores de pantalla y navegación con teclado, y tres niveles de densidad QR. Actualiza Java y Tor incluidos y la base del escritorio Debian. [Notas completas de Sparrow](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.6).',
    de_DE:
      'Aktualisiert Sparrow auf 2.5.6 mit strengerer Prüfung von Transaktionen und Payjoin, Verbesserungen für Screenreader und Tastaturbedienung sowie drei QR-Dichtestufen. Aktualisiert das mitgelieferte Java und Tor sowie die Debian-Desktop-Basis. [Vollständige Sparrow-Versionshinweise](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.6).',
    pl_PL:
      'Aktualizuje Sparrow do 2.5.6, wzmacniając weryfikację transakcji i payjoin, usprawniając obsługę czytników ekranu i klawiatury oraz dodając trzy poziomy gęstości kodów QR. Aktualizuje dołączone Java i Tor oraz bazę pulpitu Debian. [Pełne informacje o wydaniu Sparrow](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.6).',
    fr_FR:
      'Met à jour Sparrow vers 2.5.6 avec une vérification renforcée des transactions et de payjoin, des améliorations pour les lecteurs d’écran et la navigation au clavier, et trois niveaux de densité QR. Met à jour Java et Tor inclus ainsi que la base du bureau Debian. [Notes de version complètes de Sparrow](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.6).',
  },
  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
