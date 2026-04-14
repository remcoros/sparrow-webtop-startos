import { VersionGraph } from '@start9labs/start-sdk'
import { v2_2_3 } from './v2_2_3'
import { v2_3_0 } from './v2_3_0'
import { v2_3_1 } from './v2_3_1'
import { v2_3_1_2, SPARROW_VERSION } from './v2_3_1_2'

export const versionGraph = VersionGraph.of({
  current: v2_3_1_2,
  other: [v2_2_3, v2_3_0, v2_3_1],
})

export { SPARROW_VERSION }
