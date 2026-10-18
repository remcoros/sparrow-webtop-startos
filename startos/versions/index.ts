import { VersionGraph } from '@start9labs/start-sdk'
import { current, SPARROW_VERSION, SPARROW_IMAGE_TAG } from './current'
import { v_2_5_4_1 } from './v2.5.4_1'
import { v2_5_2 } from './v2.5.2'
import { v2_5_1_1 } from './v2.5.1.1'
import { v2_5_1 } from './v2.5.1'
import { v2_4_2 } from './v2.4.2'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_2_5_4_1, v2_5_2, v2_5_1_1, v2_5_1, v2_4_2],
})

export { SPARROW_VERSION, SPARROW_IMAGE_TAG }
