import { config } from '../actions/config'
import { sdk } from '../sdk'
import { createDefaultStore } from '../fileModels/store.yaml'

export const configureDefaultSettings = sdk.setupOnInit(
  async (effects, kind) => {
    if (kind == 'install') {
      // seed the store with defaults
      await createDefaultStore(effects)
      // require the config action to run once, to have a password for the ui set
      await sdk.action.createOwnTask(effects, config, 'critical', {
        reason: 'Configure default settings',
      })
    }
  },
)
