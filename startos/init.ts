import { sdk } from './sdk'
import { setDependencies } from './dependencies'
import { setInterfaces } from './interfaces'
import { versions } from './versions'
import { actions } from './actions'
import { config } from './actions/config'
import { createDefaultStore, store } from './file-models/store.yaml'
import { generateRpcPassword } from './utils'

// **** PreInstall ****
const preInstall = sdk.setupPreInstall(async ({ effects }) => {
  console.log('setupPreInstall...')

  await createDefaultStore(effects)
})

// **** PostInstall ****
const postInstall = sdk.setupPostInstall(async ({ effects }) => {
  // require the config action to run once, to have a password for the ui set
  await sdk.action.requestOwn(effects, config, 'critical', {
    reason: 'Configure default settings',
  })
})

// **** Uninstall ****
const uninstall = sdk.setupUninstall(async ({ effects }) => {})

/**
 * Plumbing. DO NOT EDIT.
 */
export const { packageInit, packageUninit, containerInit } = sdk.setupInit(
  versions,
  preInstall,
  postInstall,
  uninstall,
  setInterfaces,
  setDependencies,
  actions,
)
