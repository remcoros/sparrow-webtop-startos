import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v2_2_3 = VersionInfo.of({
  version: '2.2.3:0.1',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
