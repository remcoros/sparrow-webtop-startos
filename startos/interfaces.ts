import { sdk } from './sdk'
import { uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiMulti = sdk.MultiHost.of(effects, 'ui')
  const uiMultiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
  })

  const ui = sdk.createInterface(effects, {
    name: 'Web UI',
    id: 'ui',
    description: 'Web Interface',
    type: 'ui',
    schemeOverride: null,
    masked: false,
    username: null,
    path: '',
    query: {},
  })

  const uiReceipt = await uiMultiOrigin.export([ui])

  return [uiReceipt]
})
