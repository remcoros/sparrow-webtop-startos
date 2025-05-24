import { matches, FileHelper, T } from '@start9labs/start-sdk'
const { object, string, boolean, oneOf, literal } = matches

// not all possible fields of Sparrow config are included, so
// so do not write a new file, use 'merge' instead
const shape = object({
  serverType: oneOf(
    literal('BITCOIN_CORE'),
    literal('ELECTRUM_SERVER'),
    literal('PUBLIC_ELECTRUM_SERVER'),
  ),
  coreServer: string,
  coreAuthType: oneOf(literal('USERPASS'), literal('COOKIE')),
  coreAuth: string,
  useProxy: boolean,
  proxyServer: string,
})

export type SparrowConfigType = typeof shape._TYPE

export const sparrow = FileHelper.json(
  '/media/startos/volumes/userdir/.sparrow/config',
  shape,
)
