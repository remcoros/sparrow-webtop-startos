import crypto from 'crypto'

// uiPort
export const uiPort = 3000

// generateRpcPassword
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export const generateRpcPassword = (len = 16) =>
  Array.from(crypto.randomBytes(len))
    .map((b) => chars[b % chars.length])
    .join('')

// canConnectToRpc
type RpcConnectionStatus =
  | 'success'
  | 'timeout'
  | 'auth-error'
  | 'network-error'

export async function canConnectToRpc(
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
