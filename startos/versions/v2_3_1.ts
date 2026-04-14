import { VersionInfo } from '@start9labs/start-sdk'

export const v2_3_1 = VersionInfo.of({
  version: '2.3.1:1.0',
  releaseNotes: {
    en_US: 'Updated to Sparrow 2.3.1',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
