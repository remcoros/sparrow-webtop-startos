import { store } from '../fileModels/store.yaml'
import { sdk } from '../sdk'

export const uiCredentials = sdk.Action.withoutInput(
  // id
  'ui-credentials',

  // metadata
  async ({ effects }) => {
    var conf = await store.read().const(effects)
    return {
      name: 'Show UI Credentials',
      description: 'Show the credentials for the web UI.',
      warning: null,
      allowedStatuses: 'any',
      group: 'Configuration',
      visibility: conf ? 'enabled' : 'hidden',
    }
  },

  // execution function
  async ({ effects }) => {
    var conf = await store.read().const(effects)

    return {
      version: '1',
      title: 'Web UI Credentials',
      message: null,
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'Username',
            description: 'Username for the web UI',
            value: conf?.username || '',
            copyable: true,
            masked: false,
            qr: false,
          },
          {
            type: 'single',
            name: 'Password',
            description: 'Password for the web UI',
            value: conf?.password || '',
            copyable: true,
            masked: true,
            qr: false,
          },
        ],
      },
    }
  },
)
