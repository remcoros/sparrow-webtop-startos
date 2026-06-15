import { VersionInfo } from '@start9labs/start-sdk'

export const SPARROW_VERSION = '2.5.2.1'

export const current = VersionInfo.of({
  version: '2.5.2:1',
  releaseNotes: {
    en_US: 'Replace (deprecated) KASM webtop with new Selkies webtop',
    es_ES: 'Reemplazo de (obsoleto) KASM webtop con el nuevo Selkies webtop',
    de_DE: 'Ersetzen von (veraltet) KASM Webtop durch neues Selkies Webtop',
    pl_PL: 'Zastąpienie (przestarzałego) KASM webtop nowym Selkies webtop',
    fr_FR: 'Remplacement de (obsolète) KASM webtop par le nouveau Selkies webtop',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
