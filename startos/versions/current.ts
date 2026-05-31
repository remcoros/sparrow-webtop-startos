import { VersionInfo } from '@start9labs/start-sdk'

export const SPARROW_VERSION = '2.5.2'

export const current = VersionInfo.of({
  version: '2.5.2:0',
  releaseNotes: {
    en_US: 'Update Sparrow to 2.5.2',
    es_ES: 'Actualizar Sparrow a 2.5.2',
    de_DE: 'Sparrow auf 2.5.2 aktualisieren',
    pl_PL: 'Zaktualizuj Sparrow do wersji 2.5.2',
    fr_FR: 'Mettre à jour Sparrow vers 2.5.2',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
