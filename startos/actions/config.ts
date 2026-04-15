import { sdk } from '../sdk'
import { T, utils } from '@start9labs/start-sdk'
import { createDefaultStore, store } from '../fileModels/store.yaml'
import { Variants } from '@start9labs/start-sdk/base/lib/actions/input/builder'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  title: Value.text({
    name: 'Webtop Title',
    description:
      'This value will be displayed as the title of your browser tab.',
    required: true,
    default: 'Sparrow on StartOS',
    placeholder: 'Sparrow on StartOS',
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
      server: Value.dynamicUnion(async ({ effects }) => {
        // determine default server type and disabled options
        const installedPackages = await effects.getInstalledPackages()
        let serverType: 'fulcrum' | 'electrs' | 'bitcoind' | 'public' = 'public'
        let disabled: string[] = []

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

        if (installedPackages.includes('fulcrum')) {
          serverType = 'fulcrum'
        } else {
          disabled.push('fulcrum')
        }

        return {
          name: 'Server',
          description: 'Bitcoin/Electrum Server',
          default: serverType,
          disabled: disabled,
          variants: Variants.of({
            fulcrum: {
              name:
                'Fulcrum (recommended)' +
                (disabled.includes('fulcrum') ? ' (not installed)' : ''),
              spec: InputSpec.of({}),
            },
            electrs: {
              name:
                'Electrs' +
                (disabled.includes('electrs') ? ' (not installed)' : ''),
              spec: InputSpec.of({}),
            },
            bitcoind: {
              name:
                'Local Bitcoin Node' +
                (disabled.includes('bitcoind') ? ' (not installed)' : ''),
              spec: InputSpec.of({}),
            },
            public: {
              name: 'Public (not recommended)',
              spec: InputSpec.of({}),
            },
          }),
        }
      }),
      proxy: Value.dynamicUnion(async ({ effects }) => {
        const installedPackages = await effects.getInstalledPackages()
        const torInstalled = installedPackages.includes('tor')
        return {
          name: 'Proxy',
          description: 'Proxy settings',
          default: torInstalled ? 'tor' : 'none',
          disabled: [],
          variants: Variants.of({
            tor: {
              name: 'Tor (recommended)',
              spec: InputSpec.of({}),
            },
            none: {
              name: 'None',
              spec: InputSpec.of({}),
            },
          }),
        }
      }),
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

async function readSettings(effects: T.Effects): Promise<PartialInputSpec> {
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
        selection: settings.sparrow.server.type,
      },
      proxy: {
        selection: settings.sparrow.proxy.type as 'tor' | 'none',
      },
    },
  }
}

async function writeSettings(effects: T.Effects, input: InputSpec) {
  await store.merge(effects, {
    title: input.title,
    username: input.username,
    password: input.password,
    reconnect: input.reconnect,
    sparrow: {
      managesettings: input.sparrow.managesettings,
      server: {
        type: input.sparrow.server.selection,
      },
      proxy: {
        type: input.sparrow.proxy.selection,
      },
    },
  })
}
