import { sdk } from './sdk'
import { FileHelper, T } from '@start9labs/start-sdk'
import { uiPort } from './utils'
import { config } from './actions/config'
import { store } from './file-models/store.yaml'
import { restartService } from './actions/restartService'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('Setting up Sparrow webtop...')

  // setup a watch on the store file for changes (this restarts the service)
  const conf = await store.read().const(effects)
  if (!conf) {
    sdk.action.requestOwn(effects, config, 'critical', {})
    throw new Error('Sparrow config file does not exist')
  }

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

  // mount the bitcoin data directory if we are using bitcoind
  // @todo: mount only the .cookie file (could not get this to work)
  // @todo: when updating using 'make install' while the container is running,
  // the update failed because the volume was in use?
  if (conf.sparrow.managesettings && conf.sparrow.server.type == 'bitcoind') {
    mounts = mounts.mountDependency({
      dependencyId: 'bitcoind',
      volumeId: 'main',
      subpath: null,
      mountpoint: '/mnt/bitcoind',
      // @todo: this should be readonly, but we need to change its permissions
      readonly: false,
    })
  }

  // main subcontainer (the webtop container)
  const subcontainer = await sdk.SubContainer.of(
    effects,
    {
      imageId: 'main',
    },
    mounts,
    'main',
  )

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

  const healthReceipts: T.HealthCheck[] = []

  // if we are managing the Sparrow settings, add a health check to display the connected server
  if (conf.sparrow.managesettings) {
    const checkConnectedNode = sdk.HealthCheck.of(effects, {
      name: 'Connected Server',
      fn: async () => {
        if (conf.sparrow.server.type == 'bitcoind') {
          if (cookieChanged) {
            return {
              message: 'Bitcoin Cookie changed, please restart the service',
              result: 'failure',
            }
          }

          return {
            message: 'Using the to local Bitcoin node',
            result: 'success',
          }
        }

        if (conf.sparrow.server.type == 'electrs') {
          return {
            message: 'Using the local electrum server',
            result: 'success',
          }
        }

        sdk.action.requestOwn(effects, config, 'important', {
          reason: 'Change settings to not use a public electrum server',
        })

        return {
          message: 'Currently using a public electrum server',
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
