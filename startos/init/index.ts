import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../install/versionGraph'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { watchBitcoinRPCUsers } from './watchBitcoinRPCUsers'
import { configureDefaultSettings } from './configureDefaultSettings'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
  configureDefaultSettings,
  watchBitcoinRPCUsers,
)

export const uninit = sdk.setupUninit(versionGraph)
