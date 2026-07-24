import * as fs from 'node:fs/promises'
import { FileHelper } from '@start9labs/start-sdk'
import {
  rpcHostId,
  rpcPort,
  rpccookiefile,
} from 'bitcoin-core-startos/startos/utils'
import {
  electrumHostId as electrsHostId,
  port as electrsPort,
} from 'electrs-startos/startos/utils'
import {
  electrumHostId as frigateHostId,
  electrumPort as frigatePort,
} from 'frigate-startos/startos/constants'
import {
  electrumPort as fulcrumPort,
  mainHostId as fulcrumHostId,
} from 'fulcrum-startos/startos/utils'
import { socksHostId, socksPort } from 'tor-startos/startos/utils'
import { sdk } from './sdk'
import { bridgeAddress, uiPort } from './utils'
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

  const selectedAddress =
    conf.sparrow.managesettings && conf.sparrow.server.type === 'bitcoind'
      ? await bridgeAddress(effects, {
          packageId: 'bitcoind',
          hostId: rpcHostId,
          internalPort: rpcPort,
        }).const()
      : conf.sparrow.managesettings && conf.sparrow.server.type === 'fulcrum'
        ? await bridgeAddress(effects, {
            packageId: 'fulcrum',
            hostId: fulcrumHostId,
            internalPort: fulcrumPort,
          }).const()
        : conf.sparrow.managesettings && conf.sparrow.server.type === 'frigate'
          ? await bridgeAddress(effects, {
              packageId: 'frigate',
              hostId: frigateHostId,
              internalPort: frigatePort,
            }).const()
          : conf.sparrow.managesettings &&
              conf.sparrow.server.type === 'electrs'
            ? await bridgeAddress(effects, {
                packageId: 'electrs',
                hostId: electrsHostId,
                internalPort: electrsPort,
              }).const()
            : null

  const proxyAddress =
    conf.sparrow.managesettings && conf.sparrow.proxy.type === 'tor'
      ? await bridgeAddress(effects, {
          packageId: 'tor',
          hostId: socksHostId,
          internalPort: socksPort,
          fallbackPort: socksPort,
        }).const()
      : null

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
  const subcontainer = await sdk.SubContainer.eager(
    effects,
    {
      imageId: 'main',
    },
    mounts,
    'main',
  )

  /*
   * StarOS-specific: fix /dev/dri permissions
   * StartOS passes DRI devices as root:root, preventing the container user from
   * opening them. chmod o+rw so selkies can use hardware acceleration.
   */
  await subcontainer.exec([
    'sh',
    '-c',
    'ls /dev/dri/* 2>/dev/null | xargs -r chmod o+rw',
  ])

  /*
   * Sparrow settings
   */
  if (conf.sparrow.managesettings) {
    let sparrowConfig = {}

    // server config
    if (conf.sparrow.server.type == 'bitcoind') {
      if (!selectedAddress) {
        throw new Error(i18n('Selected server is unavailable'))
      }
      async function copyCookieFile() {
        // copy the .cookie file to a location where we can chown it
        const srcPath = `${subcontainer.rootfs}/tmp/bitcoin/${rpccookiefile}`
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
      await FileHelper.string(
        `${subcontainer.rootfs}/tmp/bitcoin/${rpccookiefile}`,
      )
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
        coreServer: `http://${selectedAddress}`,
        coreAuthType: 'COOKIE',
        coreAuth: '',
        coreDataDir: '/mnt/bitcoin',
      }
    } else if (conf.sparrow.server.type == 'fulcrum') {
      if (!selectedAddress) {
        throw new Error(i18n('Selected server is unavailable'))
      }
      sparrowConfig = {
        ...sparrowConfig,
        serverType: 'ELECTRUM_SERVER',
        electrumServer: `tcp://${selectedAddress}`,
      }
    } else if (conf.sparrow.server.type == 'frigate') {
      if (!selectedAddress) {
        throw new Error(i18n('Selected server is unavailable'))
      }
      sparrowConfig = {
        ...sparrowConfig,
        serverType: 'ELECTRUM_SERVER',
        electrumServer: `tcp://${selectedAddress}`,
      }
    } else if (conf.sparrow.server.type == 'electrs') {
      if (!selectedAddress) {
        throw new Error(i18n('Selected server is unavailable'))
      }
      sparrowConfig = {
        ...sparrowConfig,
        serverType: 'ELECTRUM_SERVER',
        electrumServer: `tcp://${selectedAddress}`,
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
        proxyServer: proxyAddress!,
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
      command: sdk.useEntrypoint(),
      runAsInit: true,
      env: {
        PUID: '1000',
        PGID: '1000',
        TZ: 'Etc/UTC',
        TITLE: conf.title,
        CUSTOM_USER: conf.username,
        PASSWORD: conf.password,
      },
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkWebUrl(effects, 'http://127.0.0.1:' + uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is unreachable'),
        }),
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
