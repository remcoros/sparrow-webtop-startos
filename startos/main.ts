import os from 'os'
import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { canConnectToRpc, uiPort } from './utils'
import { config } from './actions/config'
import { store } from './file-models/store.yaml'
import { resetRpcAuth } from './actions/resetRpcAuth'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('setupMain: Setting up Sparrow webtop...')

  // setup a watch on the store file for changes (this restarts the service)
  const conf = (await store.read().const(effects))!

  let mounts = sdk.Mounts.of()
    .mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/root/data',
      readonly: false,
    })
    .mountVolume({
      volumeId: 'userdir',
      subpath: null,
      mountpoint: '/config',
      readonly: false,
    })

  /*
  // mount the bitcoin data directory if we are using bitcoind
  // @todo: mount only the .cookie file (could not get this to work)
  if (conf.sparrow.managesettings && conf.sparrow.server.type == 'bitcoind') {
    mounts = mounts.mountDependency({
      dependencyId: 'bitcoind',
      volumeId: 'main',
      //subpath: '.cookie',
      //mountpoint: '/mnt/bitcoind/.cookie',
      //type: 'file',
      subpath: null,
      mountpoint: '/mnt/bitcoind',
      // @todo: this should be readonly, but we need to change its permissions
      readonly: false,
    })
  }
  */

  // main subcontainer (the webtop container)
  // @todo: review this (should the service do this or can the sdk be smarter?)
  const imageId = os.arch() == 'x64' ? 'main' : 'main-aarch'
  const subcontainer = await sdk.SubContainer.of(
    effects,
    {
      imageId: imageId,
    },
    mounts,
    'main',
  )

  /*
  // Detect when the bitcoind cookie changes and report it as a health check failure
  // We do this instead of automatically restarting the service.
  let cookieChanged = false
  if (conf.sparrow.managesettings && conf.sparrow.server.type == 'bitcoind') {
    let currentCookie = await FileHelper.string(
      `${subcontainer.rootfs}/mnt/bitcoind/.cookie`,
    )
      .read()
      .once()

    FileHelper.string(`${subcontainer.rootfs}/mnt/bitcoind/.cookie`)
      .read()
      .onChange(effects, async (value) => {
        if (currentCookie != value) {
          console.log('Bitcoin Cookie changed')

          cookieChanged = true
          // request the user to restart the service
          sdk.action.requestOwn(effects, restartService, 'important', {
            reason: 'Bitcoin Cookie changed, please restart the service',
          })
        }
      })
  }
  */

  const healthReceipts: T.HealthCheck[] = []

  // if we are managing the Sparrow settings, add a health check to display the connected server
  if (conf.sparrow.managesettings) {
    const checkConnectedNode = sdk.HealthCheck.of(effects, {
      name: 'Connected Server',
      fn: async () => {
        if (conf.sparrow.server.type == 'bitcoind') {
          // if (cookieChanged) {
          //   return {
          //     message: 'Bitcoin Cookie changed, please restart the service',
          //     result: 'failure',
          //   }
          // }

          // check if we can connect to the local bitcoin node
          var status = await canConnectToRpc(
            conf.sparrow.server.user,
            conf.sparrow.server.password,
            3000,
          )

          if (status != 'success') {
            if (status == 'auth-error') {
              // if we get an auth error, reset the rpc credentials and ask bitcoind to recreate them
              // disabled for now (same issue as above)
              // await sdk.action.run({
              //   actionId: 'reset-rpc-auth',
              //   effects,
              //   input: {},
              // })
            }
            return {
              message: 'Failed to connect to local Bitcoin node',
              result: 'failure',
            }
          }

          return {
            message: 'Connected to local Bitcoin node',
            result: 'success',
          }
        }

        if (conf.sparrow.server.type == 'electrs') {
          // @todo: check if we can connect to the local electrum server
          return {
            message: 'Using local electrum server',
            result: 'success',
          }
        }

        sdk.action.requestOwn(effects, config, 'important', {
          reason: 'Change settings to not use a public electrum server',
        })

        return {
          message: 'Using a public electrum server',
          result: 'failure',
        }
      },
      id: 'check-connected-node',
    })

    healthReceipts.push(checkConnectedNode)
  }

  return sdk.Daemons.of(effects, started, healthReceipts).addDaemon('primary', {
    subcontainer: subcontainer,
    command: ['docker_entrypoint.sh'],
    runAsInit: true, // If true, this daemon will be run as PID 1 in the container.
    ready: {
      display: 'Web Interface',
      fn: () =>
        sdk.healthCheck.checkWebUrl(
          effects,
          'http://sparrow-webtop.startos:' + uiPort,
          {
            successMessage: 'The web interface is ready',
            errorMessage: 'The web interface is unreachable',
          },
        ),
    },
    requires: [],
  })
})
