import { VersionInfo, VersionGraph, IMPOSSIBLE } from '@start9labs/start-sdk'

export const versions = VersionGraph.of(
  VersionInfo.of({
    version: '2.2.0:0.1',
    releaseNotes: 'Revamped for StartOS 0.4.0',
    migrations: {
      up: async ({ effects }) => {},
      down: IMPOSSIBLE,
    },
  }),
)
