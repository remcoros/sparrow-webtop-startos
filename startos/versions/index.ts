import { VersionGraph } from '@start9labs/start-sdk'
import { current, SPARROW_VERSION } from './current'
import { v2_5_2 } from './v2.5.2'
import { v2_5_1_1 } from './v2.5.1.1'
import { v2_5_1 } from './v2.5.1'
import { v2_4_2 } from './v2.4.2'

export const versionGraph = VersionGraph.of({
  current,
  other: [v2_5_2, v2_5_1_1, v2_5_1, v2_4_2],
})

export { SPARROW_VERSION }
