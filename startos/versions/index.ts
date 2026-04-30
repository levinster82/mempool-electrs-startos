import { VersionGraph } from '@start9labs/start-sdk'
import { v_3_3_0_0_a0 } from './v3.3.0.0.a0'
import { v_3_3_0_0_a1 } from './v3.3.0.0.a1'

export const versionGraph = VersionGraph.of({
  current: v_3_3_0_0_a1,
  other: [v_3_3_0_0_a0],
})
