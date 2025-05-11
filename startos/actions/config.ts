import { sdk } from '../sdk'
import { T, utils } from '@start9labs/start-sdk'
import { createDefaultStore, store } from '../file-models/store.yaml'
import { Variants } from '@start9labs/start-sdk/base/lib/actions/input/builder'
import { generateRpcPassword } from '../utils'
import { generateRpcUserDependent } from 'bitcoind-startos/startos/actions/generateRpcUserDependent'
import { resetRpcAuth } from './resetRpcAuth'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  title: Value.text({
    name: 'Webtop Title',
    description:
      'This value will be displayed as the title of your browser tab.',
    required: true,
    default: 'Sparrow on Start9',
    placeholder: 'Sparrow on Start9',
    patterns: [utils.Patterns.ascii],
  }),
  username: Value.text({
    name: 'Username',
    description: 'The username for logging into your Webtop.',
    required: true,
    default: 'webtop',
    placeholder: '',
    masked: false,
    patterns: [utils.Patterns.ascii],
  }),
  password: Value.text({
    name: 'Password',
    description: 'The password for logging into your Webtop.',
    required: true,
    generate: {
      charset: 'a-z,0-9',
      len: 20,
    },
    default: { charset: 'a-z,0-9', len: 20 },
    placeholder: '',
    masked: true,
    minLength: 8,
  }),
  reconnect: Value.toggle({
    name: 'Automatically reconnect',
    description:
      'Automatically reconnect when the connection to the desktop is lost or the browser tab has been idle for too long.',
    default: false,
  }),
  sparrow: Value.object(
    {
      name: 'Sparrow settings',
      description: 'Sparrow settings',
    },
    InputSpec.of({
      managesettings: Value.toggle({
        name: 'Apply settings on startup',
        description:
          'Disable to manage your own server and proxy settings in Sparrow',
        default: true,
      }),
      server: Value.dynamicUnion(
        async ({ effects }) => {
          // determine default server type and disabled options
          const installedPackages = await effects.getInstalledPackages()
          let disabled: string[] = []
          let serverType: 'electrs' | 'bitcoind' | 'public' = 'public'

          if (installedPackages.includes('bitcoind')) {
            serverType = 'bitcoind'
          } else {
            disabled.push('bitcoind')
          }
          if (installedPackages.includes('electrs')) {
            serverType = 'electrs'
          } else {
            disabled.push('electrs')
          }

          return {
            name: 'Server',
            description: 'Bitcoin/Electrum Server',
            default: serverType,
            disabled: disabled,
          }
        },
        Variants.of({
          electrs: {
            name: 'Electrs (recommended)',
            spec: InputSpec.of({}),
          },
          bitcoind: {
            name: 'Bitcoin Core',
            spec: InputSpec.of({}),
          },
          public: {
            name: 'Public (not recommended)',
            spec: InputSpec.of({}),
          },
        }),
      ),
      proxy: Value.union(
        {
          name: 'Proxy',
          description: 'Proxy settings',
          default: 'tor',
        },
        Variants.of({
          tor: {
            name: 'Tor (recommended)',
            spec: InputSpec.of({}),
          },
          none: {
            name: 'None',
            spec: InputSpec.of({}),
          },
        }),
      ),
    }),
  ),
})

export const config = sdk.Action.withInput(
  // id
  'config',

  // metadata
  async ({ effects }) => ({
    name: 'Settings',
    description: 'Webtop username/password and connection settings',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => readSettings(effects),

  // the execution function
  ({ effects, input }) => writeSettings(effects, input),
)

type InputSpec = typeof inputSpec._TYPE
type PartialInputSpec = typeof inputSpec._PARTIAL

async function readSettings(effects: any): Promise<PartialInputSpec> {
  let settings = await store.read().once()
  if (!settings) {
    await createDefaultStore(effects)
    settings = (await store.read().once())!
  }

  return {
    title: settings.title,
    username: settings.username,
    password: settings.password,
    reconnect: settings.reconnect,
    sparrow: {
      managesettings: settings.sparrow.managesettings,
      server: {
        // @todo 'as any' doesn't work here (error in os ui/logs)
        selection: settings.sparrow.server.type as
          | 'electrs'
          | 'bitcoind'
          | 'public'
          | undefined,
      },
      proxy: {
        selection: settings.sparrow.proxy.type as 'tor' | 'none' | undefined,
      },
    },
  }
}

async function writeSettings(effects: T.Effects, input: InputSpec) {
  const currentConf = await store.read().once()
  // const currentServerType = currentConf?.sparrow?.server.type

  // let username = currentConf?.sparrow?.server.user || ''
  // let password = currentConf?.sparrow?.server.password || ''
  // // if the server type is changed to bitcoind, and we don't have a username/password yet,
  // // generate a new username/password and request credentials from bitcoind
  // if (
  //   input.sparrow.server.selection == 'bitcoind' &&
  //   currentServerType != 'bitcoind'
  // ) {
  //   if (!username || !password) {
  //     console.log('request credentials from bitcoind')
  //     await sdk.action.requestOwn(effects, resetRpcAuth, 'critical', {})
  //     console.log('request credentials from bitcoind done')

  //     // @todo remove when this works from inside the resetRpcAuth action
  //     const conf = (await store.read().once())!
  //     await sdk.action.request(
  //       effects,
  //       'bitcoind',
  //       generateRpcUserDependent,
  //       'critical',
  //       {
  //         replayId: 'bitcoind-rpc',
  //         input: {
  //           kind: 'partial',
  //           value: {
  //             username: conf.sparrow.server.user,
  //             password: conf.sparrow.server.password,
  //           },
  //         },
  //       },
  //     )
  //   }
  // }

  // let username = currentConf?.sparrow?.server.user || ''
  // let password = currentConf?.sparrow?.server.password || ''
  // let requestCredentials = false
  // if (
  //   input.sparrow.server.selection == 'bitcoind' &&
  //   (!username || !password)
  // ) {
  //   username = 'sparrow_' + generateRpcPassword(6)
  //   password = generateRpcPassword()
  //   requestCredentials = true
  // }

  await store.merge(effects, {
    title: input.title,
    username: input.username,
    password: input.password,
    reconnect: input.reconnect,
    sparrow: {
      managesettings: input.sparrow.managesettings,
      server: {
        type: input.sparrow.server.selection,
        //user: username,
        //password: password,
        //requestCredentials: requestCredentials,
      },
      proxy: {
        type: input.sparrow.proxy.selection,
      },
    },
  })
}
