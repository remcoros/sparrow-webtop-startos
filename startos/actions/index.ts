import { sdk } from '../sdk'
import { config } from './config'
import { uiCredentials } from './uiCredentials'

export const actions = sdk.Actions.of()
  .addAction(config)
  .addAction(uiCredentials)
