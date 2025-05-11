import { sdk } from '../sdk'
import { store } from '../file-models/store.yaml'
import { generateRpcPassword } from '../utils'
import { generateRpcUserDependent } from 'bitcoind-startos/startos/actions/generateRpcUserDependent'

export const resetRpcAuth = sdk.Action.withoutInput(
  // id
  'reset-rpc-auth',

  // metadata
  async ({ effects }) => {
    const conf = await store.read().const(effects)
    const serverType = conf?.sparrow.server.type

    return {
      name: 'Recreate RPC Credentials',
      description:
        'This will ask the Bitcoin service to recreate the RPC credentials.',
      warning: null,
      allowedStatuses: 'any',
      group: 'Maintenance',
      visibility: serverType == 'bitcoind' ? 'enabled' : 'hidden',
    }
  },

  // execution function
  async ({ effects }) => {
    const username = 'sparrow_' + generateRpcPassword(6)
    const password = generateRpcPassword()

    await store.merge(effects, {
      sparrow: {
        server: {
          user: '',
          password: '',
          requestCredentials: true,
        },
      },
    })

    // request to create rpc credentials in bitcoind
    // @todo requesting action from another action doesn't work?
    // await effects.action.run({
    //   packageId: 'bitcoind',
    //   actionId: generateRpcUserDependent.id,
    //   input: {
    //     username: username,
    //     password: password,
    //   },
    // })

    // await sdk.action.request(
    //   effects,
    //   'bitcoind',
    //   generateRpcUserDependent,
    //   'critical',
    //   {
    //     replayId: 'bitcoind-rpc',
    //     input: {
    //       kind: 'partial',
    //       value: {
    //         username: username,
    //         password: password,
    //       },
    //     },
    //   },
    // )

    return {
      version: '1',
      title: 'Success',
      message:
        'RPC credentials have been reset. Follow the instructions in the UI to create new credentials in the Bitcoin service.',
      result: null,
    }
  },
)
