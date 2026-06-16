import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v2_5_1 = VersionInfo.of({
  version: '2.5.1:0',
  releaseNotes: {
    en_US: 'Update Sparrow to 2.5.1',
    es_ES: 'Actualizar Sparrow a 2.5.1',
    de_DE: 'Sparrow auf 2.5.1 aktualisieren',
    pl_PL: 'Zaktualizuj Sparrow do wersji 2.5.1',
    fr_FR: 'Mettre à jour Sparrow vers 2.5.1',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})

export const SPARROW_VERSION = '2.5.1'
