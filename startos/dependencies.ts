import { store } from './file-models/store.yaml'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const conf = await store.read().const(effects)

  // no dependencies if we are not managing sparrow settings
  if (!conf?.sparrow.managesettings) {
    return {}
  }

  var serverType = conf.sparrow.server.type

  if (serverType == 'electrs') {
    return {
      electrs: {
        kind: 'exists',
        // @todo update version range
        versionRange: '^0.10.9:0',
      },
    }
  }

  if (serverType == 'bitcoind') {
    return {
      bitcoind: {
        kind: 'exists',
        // @todo update version range
        versionRange: '^28.1.0-0',
      },
    }
  }

  return {}
})
