import { VersionGraph } from '@start9labs/start-sdk'
import { v2_3_1, SPARROW_VERSION } from './v2_3_1'

export const versionGraph = VersionGraph.of({
  current: v2_3_1,
  other: [],
})

export { SPARROW_VERSION }
