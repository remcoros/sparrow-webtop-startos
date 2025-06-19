import os from 'os'
import * as fs from 'node:fs/promises'
import { sdk } from './sdk'
import { T, utils } from '@start9labs/start-sdk'
import { canConnectToRpc, uiPort } from './utils'
import { store } from './fileModels/store.yaml'
import { sparrow } from './fileModels/sparrow.json'
import { config } from './actions/config'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('setupMain: Setting up Sparrow webtop...')

  // setup a watch on the store file for changes (this restarts the service)
  const conf = await store.read().const(effects)

  if (!conf?.password) {
    throw new Error('Password is required')
  }

  /*
   * Subcontainer setup
   */
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

  /*
   * Sparrow settings
   */
  if (conf.sparrow.managesettings) {
    let config = {}

    // server config
    if (conf.sparrow.server.type == 'bitcoind') {
      config = {
        ...config,
        serverType: 'BITCOIN_CORE',
        // socat proxy, to avoid going over tor (sparrow avoids tor only for local addresses)
        coreServer: 'http://127.0.0.1:8332',
        coreAuthType: 'USERPASS',
        coreAuth: conf.sparrow.server.user + ':' + conf.sparrow.server.password,
      }
    } else if (conf.sparrow.server.type == 'electrs') {
      config = {
        ...config,
        serverType: 'ELECTRUM_SERVER',
        coreServer: 'tcp://127.0.0.1:50001',
      }
    } else if (conf.sparrow.server.type == 'public') {
      config = {
        ...config,
        serverType: 'PUBLIC_ELECTRUM_SERVER',
      }
    }

    // proxy config
    if (conf.sparrow.proxy.type == 'tor') {
      const serverIp = await sdk.getOsIp(effects)
      config = {
        ...config,
        useProxy: true,
        proxyServer: `${serverIp}:9050`,
      }
    } else {
      config = {
        ...config,
        useProxy: false,
      }
    }

    // create default config file if it does not exist
    const configFile = `${subcontainer.rootfs}/config/.sparrow/config`
    try {
      await fs.access(configFile, fs.constants.F_OK) // check if configFile exists
    } catch (e) {
      await subcontainer.exec([
        'sh',
        '-c',
        `
         mkdir -p /config/.sparrow && 
         cp /defaults/.sparrow/config /config/.sparrow/config && 
         chown -R 1000:1000 /config/.sparrow
        `,
      ])
    }

    // merge with existing config file
    sparrow.merge(effects, config)
  }

  /*
   * Daemons
   */
  const primaryDaemon = sdk.Daemons.of(effects, started).addDaemon('primary', {
    subcontainer: subcontainer,
    exec: {
      command: ['docker_entrypoint.sh'],
      runAsInit: true,
      env: {
        PUID: '1000',
        PGID: '1000',
        TZ: 'Etc/UTC',
        TITLE: conf.title,
        CUSTOM_USER: conf.username,
        PASSWORD: conf.password,
        RECONNECT: conf.reconnect ? 'true' : 'false',
      },
    },
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

  // if we are managing the Sparrow settings, add a health check to display the connected server
  if (conf.sparrow.managesettings) {
    primaryDaemon.addHealthCheck('check-connected-node', {
      ready: {
        display: 'Connected Node',
        fn: async () => {
          if (conf.sparrow.server.type == 'bitcoind') {
            // check if we can connect to the local bitcoin node
            var status = await canConnectToRpc(
              conf.sparrow.server.user,
              conf.sparrow.server.password,
              3000,
            )

            if (status != 'success') {
              if (status == 'auth-error') {
                return {
                  message:
                    'Invalid RPC credentials, Recreate them in the Action menu',
                  result: 'failure',
                }
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

          sdk.action.createOwnTask(effects, config, 'important', {
            reason: 'Change settings to not use a public electrum server',
          })

          return {
            message: 'Using a public electrum server',
            result: 'failure',
          }
        },
      },
      requires: [],
    })
  }

  return primaryDaemon
})
