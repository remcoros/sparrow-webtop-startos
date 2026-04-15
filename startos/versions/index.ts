import { VersionGraph } from '@start9labs/start-sdk'
import { v2_4_2, SPARROW_VERSION } from './v2_4_2'

export const versionGraph = VersionGraph.of({
  current: v2_4_2,
  other: [],
})

export { SPARROW_VERSION }
