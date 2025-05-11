import crypto from 'crypto'

// uiPort
export const uiPort = 3000

// generateRpcPassword
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export const generateRpcPassword = (len = 16) =>
  Array.from(crypto.randomBytes(len))
    .map((b) => chars[b % chars.length])
    .join('')

// canConnectToBTCRpc
// @todo remove if we decide not to use it
export async function canConnectToBTCRpc(
  username: string,
  password: string,
  timeout: number = 5000,
): Promise<boolean> {
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

    return response.ok
  } catch (err) {
    return false
  } finally {
    clearTimeout(timeoutHandle)
  }
}
