import { T } from '@start9labs/start-sdk'
import { store } from './fileModels/store.yaml'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const conf = await store.read().const(effects)

  // no dependencies if we are not managing sparrow settings
  if (!conf?.sparrow.managesettings) {
    return {}
  }

  const proxyType = conf.sparrow.proxy.type
  const serverType = conf.sparrow.server.type

  const deps: T.CurrentDependenciesResult<T.SDKManifest> = {}

  if (serverType == 'fulcrum') {
    deps['fulcrum'] = { kind: 'exists', versionRange: '>=2.1.0:1' }
  } else if (serverType == 'electrs') {
    deps['electrs'] = { kind: 'exists', versionRange: '>=0.10.9:1-alpha.1' }
  } else if (serverType == 'bitcoind') {
    deps['bitcoind'] = { kind: 'exists', versionRange: '>=28.1:3-alpha.4' }
  }

  if (proxyType == 'tor') {
    deps['tor'] = {
      kind: 'running',
      versionRange: '>=0.4.9.5:0',
      healthChecks: [],
    }
  }

  return deps
})
