import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v2_3_1_2 = VersionInfo.of({
  version: '2.3.1:2-beta.0',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})

export const SPARROW_VERSION = '2.3.1'