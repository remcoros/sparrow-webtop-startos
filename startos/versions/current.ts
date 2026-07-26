import { VersionInfo } from '@start9labs/start-sdk'

export const SPARROW_VERSION = '2.5.2.1'

export const current = VersionInfo.of({
  version: '2.5.2:4',
  releaseNotes: {
    en_US: 'Avoids cookie-copy errors while Bitcoin Core is shutting down.',
    es_ES:
      'Evita errores al copiar la cookie mientras Bitcoin Core se está apagando.',
    de_DE:
      'Verhindert Fehler beim Kopieren des Cookies, während Bitcoin Core herunterfährt.',
    pl_PL:
      'Zapobiega błędom kopiowania pliku cookie podczas wyłączania Bitcoin Core.',
    fr_FR:
      "Évite les erreurs de copie du cookie pendant l'arrêt de Bitcoin Core.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
