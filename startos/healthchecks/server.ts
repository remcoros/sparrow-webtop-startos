import { T } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { StoreType } from '../file-models/store.yaml'
import { config } from '../actions/config'

export const serverHealthCheck = (effects: T.Effects, conf: StoreType) =>
  sdk.HealthCheck.of(effects, {
    name: 'Connected Server',
    fn: async () => {
      if (conf.sparrow.server.type == 'bitcoind') {
        // if (cookieChanged) {
        //   return {
        //     message: 'Bitcoin Cookie changed, please restart the service',
        //     result: 'failure',
        //   }
        // }

        // check if we can connect to the local bitcoin node
        var status = await canConnectToRpc(
          conf.sparrow.server.user,
          conf.sparrow.server.password,
          3000,
        )

        if (status != 'success') {
          if (status == 'auth-error') {
            return {
              message:
                'Invalid RPC credentials, Recreate them in the Action menu',
              result: 'failure',
            }
          }
          return {
            message: 'Failed to connect to local Bitcoin node',
            result: 'failure',
          }
        }

        return {
          message: 'Connected to local Bitcoin node',
          result: 'success',
        }
      }

      if (conf.sparrow.server.type == 'electrs') {
        // @todo: check if we can connect to the local electrum server
        return {
          message: 'Using local electrum server',
          result: 'success',
        }
      }

      sdk.action.requestOwn(effects, config, 'important', {
        reason: 'Change settings to not use a public electrum server',
      })

      return {
        message: 'Using a public electrum server',
        result: 'failure',
      }
    },
    id: 'check-connected-node',
  })

// canConnectToRpc
type RpcConnectionStatus =
  | 'success'
  | 'timeout'
  | 'auth-error'
  | 'network-error'

async function canConnectToRpc(
  username: string,
  password: string,
  timeout: number = 3000,
): Promise<RpcConnectionStatus> {
  const rpcUrl = 'http://bitcoind.startos:8332'
  const controller = new AbortController()
  const timeoutHandle = setTimeout(() => controller.abort(), timeout)

  const headers = {
    'Content-Type': 'application/json',
    Authorization:
      'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
  }

  const body = JSON.stringify({
    jsonrpc: '2.0',
    id: 'auth-test',
    method: 'getblockchaininfo',
    params: [],
  })

  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    })

    if (response.status === 401 || response.status === 403) {
      return 'auth-error'
    }

    if (response.ok) {
      return 'success'
    }

    return 'network-error'
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return 'timeout'
    }

    return 'network-error'
  } finally {
    clearTimeout(timeoutHandle)
  }
}
