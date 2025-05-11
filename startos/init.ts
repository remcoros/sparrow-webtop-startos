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
  
  // // check if config file exists
  // const conf = await store.read().once()

  // if (conf) {
  //   console.log('Sparrow config file already exists')

  //   // overwrite the rpc user/password with a new one on new installs
  //   // @todo check if this hook runs on every install/update, from 035, etc.
  //   await store.merge(effects, {
  //     sparrow: {
  //       server: {
  //         user: 'sparrow_' + generateRpcPassword(6),
  //         password: generateRpcPassword(),
  //       },
  //     },
  //   })
  // } else {
  //   console.log('Sparrow config file does not exist, creating it')
  //   await createDefaultStore(effects)
  // }
})

// **** PostInstall ****
const postInstall = sdk.setupPostInstall(async ({ effects }) => {
  // require the config action to run once, to have a password for the ui set
  await sdk.action.requestOwn(effects, config, 'critical', {})
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
