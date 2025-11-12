import { VersionInfo } from '@start9labs/start-sdk'

export const v2_3_1 = VersionInfo.of({
  version: '2.3.1:1.0',
  releaseNotes: 'Updated to Sparrow 2.3.1',
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})

export const SPARROW_VERSION = '2.3.1'