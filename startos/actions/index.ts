import { sdk } from '../sdk'
import { config } from './config'
import { resetRpcAuth } from './resetRpcAuth'
import { restartService } from './restartService'

export const actions = sdk.Actions.of()
  .addAction(config)
  //.addAction(resetRpcAuth)
  .addAction(restartService)
