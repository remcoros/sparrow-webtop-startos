import { matches, FileHelper, T } from '@start9labs/start-sdk'
const { object, string, boolean } = matches

const shape = object({
  title: string,
  username: string,
  password: string,
  reconnect: boolean,
  sparrow: object({
    managesettings: boolean,
    server: object({
      type: string,
      user: string,
      password: string,
      requestCredentials: boolean,
    }),
    proxy: object({
      type: string,
    }),
  }),
})

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
          requestCredentials: false,
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
    title: 'Sparrow on Start9',
    username: 'webtop',
    password: '',
    reconnect: false,
    sparrow: {
      managesettings: true,
      server: {
        type: serverType,
        user: '',
        password: '',
        requestCredentials: serverType == 'bitcoind',
      },
      proxy: {
        type: 'tor',
      },
    },
  })
}
