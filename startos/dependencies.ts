import { store } from './fileModels/store.yaml'
import { sdk } from './sdk'

const bitcoin = sdk.Dependency.optional('bitcoind', {
  description: 'Used to connect to your Bitcoin node.',
  metadata: {
    title: 'Bitcoin',
    icon: 'https://bitcoin.org/img/icons/opengraph.png',
  },
  versionRange: '>=28.4:13',
  kind: 'exists',
  enabled: async ({ effects }) => {
    const conf = await store.read().const(effects)
    return (
      !!conf?.sparrow.managesettings && conf.sparrow.server.type === 'bitcoind'
    )
  },
})

const electrs = sdk.Dependency.optional('electrs', {
  description: 'Used to connect to your Bitcoin node.',
  metadata: {
    title: 'Electrum Rust Server (electrs)',
    icon: 'https://raw.githubusercontent.com/Start9-Community/electrs-startos/master/icon.svg',
  },
  versionRange: '>=0.11.1:9',
  kind: 'exists',
  enabled: async ({ effects }) => {
    const conf = await store.read().const(effects)
    return (
      !!conf?.sparrow.managesettings && conf.sparrow.server.type === 'electrs'
    )
  },
})

const fulcrum = sdk.Dependency.optional('fulcrum', {
  description: 'Used to connect to your Bitcoin node.',
  metadata: {
    title: 'Fulcrum',
    icon: 'https://raw.githubusercontent.com/Start9Labs/fulcrum-startos/master/icon.png',
  },
  versionRange: '>=2.1.1:6',
  kind: 'exists',
  enabled: async ({ effects }) => {
    const conf = await store.read().const(effects)
    return (
      !!conf?.sparrow.managesettings && conf.sparrow.server.type === 'fulcrum'
    )
  },
})

const frigate = sdk.Dependency.optional('frigate', {
  description: 'Used to connect to your Bitcoin node.',
  metadata: {
    title: 'Frigate',
    icon: 'https://raw.githubusercontent.com/remcoros/frigate-startos/master/icon.png',
  },
  versionRange: '>=1.5.3:5',
  kind: 'exists',
  enabled: async ({ effects }) => {
    const conf = await store.read().const(effects)
    return (
      !!conf?.sparrow.managesettings && conf.sparrow.server.type === 'frigate'
    )
  },
})

const tor = sdk.Dependency.optional('tor', {
  description: 'Used to route Sparrow traffic through Tor for privacy.',
  metadata: {
    title: 'Tor',
    icon: 'https://raw.githubusercontent.com/Start9Labs/tor-startos/65faea17febc739d910e8c26ff4e61f6333487a8/icon.svg',
  },
  versionRange: '>=0.4.9.5:0',
  kind: 'running',
  healthChecks: [],
  enabled: async ({ effects }) => {
    const conf = await store.read().const(effects)
    return !!conf?.sparrow.managesettings && conf.sparrow.proxy.type === 'tor'
  },
})

export const dependencies = sdk.Dependencies.of()
  .addDependency(bitcoin)
  .addDependency(electrs)
  .addDependency(fulcrum)
  .addDependency(frigate)
  .addDependency(tor)
