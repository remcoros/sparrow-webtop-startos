import { VersionInfo } from '@start9labs/start-sdk'

export const SPARROW_VERSION = '2.5.5'
export const SPARROW_IMAGE_TAG = '2.5.5.1'

export const current = VersionInfo.of({
  version: '2.5.5:1',
  releaseNotes: {
    en_US:
      'Updates the browser desktop to Selkies 2.1.0, with improvements to session reconnection, clipboard handling and security. [Full Selkies release notes](https://github.com/selkies-project/selkies/releases/tag/2.1.0).',
    es_ES:
      'Actualiza el escritorio del navegador a Selkies 2.1.0, con mejoras en la reconexión de sesiones, el portapapeles y la seguridad. [Notas completas de Selkies](https://github.com/selkies-project/selkies/releases/tag/2.1.0).',
    de_DE:
      'Aktualisiert den Browser-Desktop auf Selkies 2.1.0 mit Verbesserungen bei der Wiederverbindung von Sitzungen, der Zwischenablage und der Sicherheit. [Vollständige Selkies-Versionshinweise](https://github.com/selkies-project/selkies/releases/tag/2.1.0).',
    pl_PL:
      'Aktualizuje pulpit w przeglądarce do Selkies 2.1.0, usprawniając ponowne łączenie sesji, obsługę schowka i bezpieczeństwo. [Pełne informacje o wydaniu Selkies](https://github.com/selkies-project/selkies/releases/tag/2.1.0).',
    fr_FR:
      'Met à jour le bureau dans le navigateur vers Selkies 2.1.0, avec des améliorations de la reconnexion des sessions, du presse-papiers et de la sécurité. [Notes de version complètes de Selkies](https://github.com/selkies-project/selkies/releases/tag/2.1.0).',
  },
  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
