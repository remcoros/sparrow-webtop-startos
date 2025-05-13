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
      name: 'Create RPC Credentials',
      description:
        'Create new Bitcoin RPC credentials for Sparrow. NOTE: this will restart the service!',
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

    console.log('resetRpcAuth: username:', username)

    console.log('resetRpcAuth: merge username and password into store')
    await store.merge(effects, {
      sparrow: {
        server: {
          user: username,
          password: password,
        },
      },
    })

    // request to create rpc credentials in bitcoind
    console.log('resetRpcAuth: requesting bitcoind-rpc action')
    await sdk.action.request(
      effects,
      'bitcoind',
      generateRpcUserDependent,
      'critical',
      {
        replayId: 'request-rpc-credentials',
        reason: 'Create RPC credentials for Sparrow',
        input: {
          kind: 'partial',
          value: {
            username: username,
            password: password,
          },
        },
      },
    )

    return {
      version: '1',
      title: 'Success',
      message:
        'RPC credentials have been reset. Follow the instructions in the UI to create new credentials in the Bitcoin service.',
      result: null,
    }
  },
)
