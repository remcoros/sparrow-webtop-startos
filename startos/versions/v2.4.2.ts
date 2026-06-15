import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v2_4_2 = VersionInfo.of({
  version: '2.4.2:1',
  releaseNotes: {
    en_US: 'Revamped for StartOS 0.4',
    es_ES: 'Renovado para StartOS 0.4',
    de_DE: 'Überarbeitet für StartOS 0.4',
    pl_PL: 'Przeprojektowany dla StartOS 0.4',
    fr_FR: 'Refonte pour StartOS 0.4',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})

export const SPARROW_VERSION = '2.4.2'
