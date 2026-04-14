import { FileHelper, T, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  title: z.string(),
  username: z.string(),
  password: z.string().optional(),
  reconnect: z.boolean().catch(false),
  sparrow: z.object({
    managesettings: z.boolean(),
    server: z.object({
      type: z
        .union([
          z.literal('fulcrum'),
          z.literal('electrs'),
          z.literal('bitcoind'),
          z.literal('public'),
        ])
        .catch('fulcrum'),
    }),
    proxy: z.object({
      type: z.union([z.literal('tor'), z.literal('none')]).catch('tor'),
    }),
  }),
})

export type StoreType = z.infer<typeof shape>

export const store = FileHelper.yaml(
  {
    base: sdk.volumes.main,
    subpath: 'start9/config.yaml',
  },
  shape,
)

export const createDefaultStore = async (effects: T.Effects) => {
  // check if the file exists (from previous installs or upgrades)
  const conf = await store.read().once()
  if (conf) {
    // already exists — nothing to migrate (stale user/password keys will be preserved but ignored)
    console.log('Sparrow config file already exists, skipping default creation')
    return
  }

  // config file does not exist, create it
  console.log('Sparrow config file does not exist, creating it')
  const installedPackages = await effects.getInstalledPackages()
  const serverType = installedPackages.includes('electrs')
    ? 'electrs'
    : installedPackages.includes('bitcoind')
      ? 'bitcoind'
      : 'public'

  await store.write(effects, {
    title: 'Sparrow on StartOS',
    username: 'webtop',
    reconnect: false,
    sparrow: {
      managesettings: true,
      server: {
        type: serverType,
      },
      proxy: {
        type: 'tor',
      },
    },
  })
}
