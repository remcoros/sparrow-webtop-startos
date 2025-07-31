import { config } from '../actions/config'
import { sdk } from '../sdk'

export const configureDefaultSettings = sdk.setupOnInit(
  async (effects, kind) => {
    if (kind == 'install') {
      // require the config action to run once, to have a password for the ui set
      await sdk.action.createOwnTask(effects, config, 'critical', {
        reason: 'Configure default settings',
      })
    }
  },
)
