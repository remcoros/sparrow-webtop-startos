import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// not all possible fields of Sparrow config are included, so
// do not write a new file, use 'merge' instead
const shape = z.object({
  serverType: z.union([
    z.literal('BITCOIN_CORE'),
    z.literal('ELECTRUM_SERVER'),
    z.literal('PUBLIC_ELECTRUM_SERVER'),
  ]),
  coreServer: z.string().optional(),
  coreAuthType: z.union([z.literal('USERPASS'), z.literal('COOKIE')]),
  // username:password for USERPASS
  coreAuth: z.string().optional(),
  // path to bitcoin data directory containing the .cookie file
  coreDataDir: z.string().optional(),
  electrumServer: z.string().optional(),
  useProxy: z.boolean(),
  proxyServer: z.string(),
})

export type SparrowConfigType = z.infer<typeof shape>

export const sparrow = FileHelper.json(
  {
    base: sdk.volumes.userdir,
    subpath: '.sparrow/config',
  },
  shape,
)
