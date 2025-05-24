import { matches, FileHelper, T } from '@start9labs/start-sdk'
const { object, string, boolean, oneOf, literal } = matches

const shape = object({
  title: string,
  username: string,
  password: string.optional(),
  reconnect: boolean.onMismatch(false),
  sparrow: object({
    managesettings: boolean,
    server: object({
      type: oneOf(
        literal('electrs'),
        literal('bitcoind'),
        literal('public'),
      ).onMismatch('electrs'),
      user: string,
      password: string,
    }),
    proxy: object({
      type: oneOf(literal('tor'), literal('none')).onMismatch('tor'),
    }),
  }),
})

export type StoreType = typeof shape._TYPE

export const store = FileHelper.yaml(
  '/media/startos/volumes/main/start9/config.yaml',
  shape,
)

export const createDefaultStore = async (effects: T.Effects) => {
  // check if the file exists (from previous installs or upgrades)
  const conf = await store.read().once()
  if (conf) {
    console.log('Sparrow config file already exists, clearing RPC credentials')
    await store.merge(effects, {
      sparrow: {
        server: {
          user: '',
          password: '',
        },
      },
    })
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
        user: '',
        password: '',
      },
      proxy: {
        type: 'tor',
      },
    },
  })
}
