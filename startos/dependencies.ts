import { store } from './file-models/store.yaml'
import { sdk } from './sdk'
import { generateRpcUserDependent } from 'bitcoind-startos/startos/actions/generateRpcUserDependent'
import { canConnectToBTCRpc, generateRpcPassword } from './utils'
import { resetRpcAuth } from './actions/resetRpcAuth'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  // clear any previous rpc credential requests
  await sdk.action.clearRequest(effects, 'bitcoind-rpc')

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
    // let requestCredentials = conf.sparrow.server.requestCredentials

    // // request to create rpc credentials in bitcoind if needed
    // if (requestCredentials) {
    //   const username = conf.sparrow.server.user
    //   const password = conf.sparrow.server.password

    //   store.merge(effects, {
    //     sparrow: {
    //       server: {
    //         requestCredentials: false,
    //       },
    //     },
    //   })
      
    //   await sdk.action.request(
    //     effects,
    //     'bitcoind',
    //     generateRpcUserDependent,
    //     'critical',
    //     {
    //       replayId: 'bitcoind-rpc',
    //       when: {
    //         condition: 'input-not-matches',
    //         once: false,
    //       },
    //       input: {
    //         kind: 'partial',
    //         value: {
    //           username: username,
    //           password: password,
    //         },
    //       },
    //     },
    //   )

    //   // await store.merge(effects, {
    //   //   sparrow: {
    //   //     server: {
    //   //       user: username,
    //   //       password: password,
    //   //     },
    //   //   },
    //   // })

    //   //await sdk.action.requestOwn(effects, resetRpcAuth, 'critical', {})

    //   // @todo remove when this works from inside the resetRpcAuth action
    //   // const conf = (await store.read().once())!
    //   // await sdk.action.request(
    //   //   effects,
    //   //   'bitcoind',
    //   //   generateRpcUserDependent,
    //   //   'critical',
    //   //   {
    //   //     replayId: 'bitcoind-rpc',
    //   //     input: {
    //   //       kind: 'partial',
    //   //       value: {
    //   //         username: conf.sparrow.server.user,
    //   //         password: conf.sparrow.server.password,
    //   //       },
    //   //     },
    //   //   },
    //   // )
    // }

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
