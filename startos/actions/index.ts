import { sdk } from '../sdk'
import { config } from './config'
import { resetRpcAuth } from './resetRpcAuth'
import { restartService } from './restartService'
import { uiCredentials } from './uiCredentials'

export const actions = sdk.Actions.of()
  .addAction(config)
  .addAction(resetRpcAuth)
  .addAction(restartService)
  .addAction(uiCredentials)
