import { store } from '../file-models/store.yaml'
import { sdk } from '../sdk'

export const runtimeInfo = sdk.Action.withoutInput(
  // id
  'runtime-info',

  // metadata
  async ({ effects }) => {
    var conf = await store.read().const(effects)
    return {
      name: 'Web UI Credentials',
      description: 'Show the credentials for the web UI.',
      warning: null,
      allowedStatuses: 'any',
      group: null,
      visibility: conf ? 'enabled' : 'hidden',
    }
  },

  // execution function
  async ({ effects }) => {
    var conf = (await store.read().const(effects))!

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
            value: conf.sparrow.server.user,
            copyable: true,
            masked: false,
            qr: false,
          },
          {
            type: 'single',
            name: 'Password',
            description: 'Password for the web UI',
            value: conf.sparrow.server.password,
            copyable: true,
            masked: true,
            qr: false,
          },
        ],
      },
    }
  },
)
