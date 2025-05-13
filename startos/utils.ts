import crypto from 'crypto'

// uiPort
export const uiPort = 3000

// generateRpcPassword
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export const generateRpcPassword = (len = 16) =>
  Array.from(crypto.randomBytes(len))
    .map((b) => chars[b % chars.length])
    .join('')
