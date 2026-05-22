import { VersionGraph } from '@start9labs/start-sdk'
import { v2_5_1, SPARROW_VERSION } from './v2_5_1'
import { v2_4_2 } from './v2_4_2'

export const versionGraph = VersionGraph.of({
  current: v2_5_1,
  other: [v2_4_2],
})

export { SPARROW_VERSION }
