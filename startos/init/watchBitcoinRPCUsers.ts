import { bitcoinConfFile } from 'bitcoind-startos/startos/fileModels/bitcoin.conf'
import { store } from '../fileModels/store.yaml'
import { sdk } from '../sdk'
import { generateRpcPassword } from '../utils'
import { generateRpcUserDependent } from 'bitcoind-startos/startos/actions/generateRpcUserDependent'

export const watchBitcoinRPCUsers = sdk.setupOnInit(async (effects, kind) => {
  var settings = await store.read().const(effects)

  if (
    settings?.sparrow?.managesettings &&
    settings.sparrow.server.type == 'bitcoind'
  ) {
    const currentUser = settings.sparrow.server.user
    const currentPassword = settings.sparrow.server.password

    if (!currentUser || !currentPassword) {
      const username = 'sparrow_' + generateRpcPassword(6)
      const password = generateRpcPassword()

      // allowWriteAfterConst is needed because we are writing to the store after reading it,
      // this will trigger a re-run of this hook, but it will enter the else branch
      await store.merge(
        effects,
        {
          sparrow: {
            server: {
              user: username,
              password: password,
            },
          },
        },
        { allowWriteAfterConst: true },
      )
    } else {
      await sdk.mount(effects, {
        location: '/tmp/bitcoin.conf',
        target: {
          packageId: 'bitcoind',
          filetype: 'file',
          readonly: true,
          volumeId: 'main',
          subpath: '/bitcoin.conf',
        },
      })
      const bitcoinConf = await bitcoinConfFile
        .withPath('/tmp/bitcoin.conf')
        .read()
        .const(effects)

      const rpcAuth = bitcoinConf?.rpcauth ?? []
      const users = [rpcAuth].flat().map((e) => e.split(':', 2))
      const rpcAuthEntry = users.find((e) => e[0] == currentUser)

      if (!rpcAuthEntry) {
        await sdk.action.createTask(
          effects,
          'bitcoind',
          generateRpcUserDependent,
          'important',
          {
            replayId: 'request-rpc-credentials',
            reason: 'Create RPC credentials for Sparrow',
            input: {
              kind: 'partial',
              value: {
                username: settings.sparrow.server.user,
                password: settings.sparrow.server.password,
              },
            },
          },
        )
      }
    }
  } else {
    sdk.action.clearTask(effects, 'request-rpc-credentials')
  }
})
