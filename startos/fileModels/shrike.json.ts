import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Only the fields this package sets. Shrike's config carries many more and the user may change
// them in the wallet, so this is merged into the file rather than written over it.
const shape = z.object({
  serverType: z.literal('ELECTRUM_SERVER'),
  electrumServer: z.string().optional(),
  useProxy: z.boolean(),
  proxyServer: z.string(),
})

export type ShrikeConfigType = z.infer<typeof shape>

/**
 * The config for one network.
 *
 * Shrike keeps a separate configuration per network: mainnet's lives at `.shrike/config` and every
 * other network has its own under a directory named for it. Writing only the first one means a
 * wallet switched to testnet4 silently falls back to Shrike's own defaults, which are a Bitcoin
 * Knots RPC on the network's default port. It then reports a configuration error about a data
 * folder nobody set, which looks nothing like the packaging bug it is.
 *
 * Found on 2026-09-24 by pointing the packaged wallet at a testnet4 server and watching it try to
 * reach a node instead. Nothing on this side looked wrong: the setting was stored, the file was
 * written, and it was the wrong file.
 */
export const shrikeConfig = (network: 'mainnet' | 'testnet4') =>
  FileHelper.json(
    {
      base: sdk.volumes.userdir,
      // Shrike keeps its own directory, separate from Sparrow's, so the two can be installed side
      // by side on a desktop. HOME is /config in this image.
      subpath:
        network === 'mainnet' ? '.shrike/config' : `.shrike/${network}/config`,
    },
    shape,
  )
