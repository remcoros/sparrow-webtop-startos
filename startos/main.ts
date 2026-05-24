import * as fs from 'node:fs/promises'
import { FileHelper } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { uiPort } from './utils'
import { store } from './fileModels/store.yaml'
import { sparrow } from './fileModels/sparrow.json'
import { config } from './actions/config'
import { i18n } from './i18n'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('setupMain: Setting up Sparrow webtop...')

  // watch the store for changes (restarts the service when config changes)
  const conf = await store.read().const(effects)

  if (!conf?.password) {
    throw new Error(i18n('Password is required'))
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
    // override docker_entrypoint.sh with our own
    .mountAssets({
      mountpoint: '/usr/local/bin/docker_entrypoint.sh',
      subpath: 'docker_entrypoint.sh',
      type: 'file',
    })

  if (conf.sparrow.managesettings && conf.sparrow.server.type == 'bitcoind') {
    mounts = mounts.mountDependency({
      dependencyId: 'bitcoind',
      volumeId: 'main',
      subpath: null,
      mountpoint: '/tmp/bitcoin',
      readonly: true,
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

  /*
   * Sparrow settings
   */
  if (conf.sparrow.managesettings) {
    let sparrowConfig = {}

    // server config
    if (conf.sparrow.server.type == 'bitcoind') {
      async function copyCookieFile() {
        // copy the .cookie file to a location where we can chown it
        const srcPath = `${subcontainer.rootfs}/tmp/bitcoin/.cookie`
        const destPath = `${subcontainer.rootfs}/mnt/bitcoin/.cookie`
        await fs.mkdir(`${subcontainer.rootfs}/mnt/bitcoin`, {
          recursive: true,
        })
        await fs.copyFile(srcPath, destPath)
        await fs.chown(destPath, 1000, 1000)
        await fs.chmod(destPath, 0o400)
      }

      // watch for .cookie changes and copy it to the correct location.
      // no need to use .const() / restart the service since Sparrow will pick up changes to the .cookie file automatically
      await FileHelper.string(`${subcontainer.rootfs}/tmp/bitcoin/.cookie`)
        .read()
        .onChange(effects, async (value, error) => {
          // note that .onChange is triggered once immediately
          console.info('.cookie file changed, updating permissions...')
          await copyCookieFile()
          return { cancel: false }
        })

      sparrowConfig = {
        ...sparrowConfig,
        serverType: 'BITCOIN_CORE',
        // socat proxy, to avoid going over tor (sparrow avoids tor only for local addresses)
        coreServer: 'http://bitcoind.startos:8332',
        coreAuthType: 'COOKIE',
        coreAuth: '',
        coreDataDir: '/mnt/bitcoin',
      }
    } else if (conf.sparrow.server.type == 'fulcrum') {
      sparrowConfig = {
        ...sparrowConfig,
        serverType: 'ELECTRUM_SERVER',
        electrumServer: 'tcp://fulcrum.startos:50001',
      }
    } else if (conf.sparrow.server.type == 'frigate') {
      sparrowConfig = {
        ...sparrowConfig,
        serverType: 'ELECTRUM_SERVER',
        electrumServer: 'tcp://frigate.startos:50001',
      }
    } else if (conf.sparrow.server.type == 'electrs') {
      sparrowConfig = {
        ...sparrowConfig,
        serverType: 'ELECTRUM_SERVER',
        electrumServer: 'tcp://electrs.startos:50001',
      }
    } else if (conf.sparrow.server.type == 'public') {
      sparrowConfig = {
        ...sparrowConfig,
        serverType: 'PUBLIC_ELECTRUM_SERVER',
      }
    }

    // proxy config
    if (conf.sparrow.proxy.type == 'tor') {
      sparrowConfig = {
        ...sparrowConfig,
        useProxy: true,
        proxyServer: `tor.startos:9050`,
      }
    } else {
      sparrowConfig = {
        ...sparrowConfig,
        useProxy: false,
      }
    }

    // create default config file if it does not exist
    const configFile = `${subcontainer.rootfs}/config/.sparrow/config`
    try {
      await fs.access(configFile, fs.constants.F_OK)
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
    await sparrow.merge(effects, sparrowConfig)
  }

  /*
   * Daemons
   */
  const primaryDaemon = sdk.Daemons.of(effects).addDaemon('primary', {
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
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkWebUrl(
          effects,
          'http://sparrow-webtop.startos:' + uiPort,
          {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('The web interface is unreachable'),
          },
        ),
    },
    requires: [],
  })

  // if we are managing the Sparrow settings, add a health check to display the connected server
  if (conf.sparrow.managesettings) {
    primaryDaemon.addHealthCheck('check-connected-node', {
      ready: {
        display: i18n('Connected Node'),
        fn: async () => {
          if (conf.sparrow.server.type == 'bitcoind') {
            return {
              message: i18n('Connected to local Bitcoin node'),
              result: 'success',
            }
          }

          if (
            conf.sparrow.server.type == 'electrs' ||
            conf.sparrow.server.type == 'fulcrum' ||
            conf.sparrow.server.type == 'frigate'
          ) {
            return {
              message: i18n('Using local electrum server'),
              result: 'success',
            }
          }

          sdk.action.createOwnTask(effects, config, 'important', {
            reason: i18n('Change settings to not use a public electrum server'),
          })

          return {
            message: i18n('Using a public electrum server'),
            result: 'failure',
          }
        },
      },
      requires: [],
    })
  }

  return primaryDaemon
})
