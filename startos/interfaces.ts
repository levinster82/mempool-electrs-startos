import { i18n } from './i18n'
import { sdk } from './sdk'
import { httpPort, port } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const electrumMultihost = sdk.MultiHost.of(effects, 'electrum')
  const electrumMultiOrigin = await electrumMultihost.bindPort(port, {
    protocol: null,
    addSsl: {
      preferredExternalPort: 50002,
      alpn: null,
      addXForwardedHeaders: false,
    },
    preferredExternalPort: port,
    secure: null,
  })
  const electrumInterface = sdk.createInterface(effects, {
    name: i18n('Main'),
    id: 'main',
    description: i18n('The main interface for accessing electrs'),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const httpMultihost = sdk.MultiHost.of(effects, 'rest')
  const httpMultiOrigin = await httpMultihost.bindPort(httpPort, {
    protocol: 'http',
    addSsl: {
      preferredExternalPort: 443,
      alpn: null,
      addXForwardedHeaders: true,
    },
    preferredExternalPort: httpPort,
  })
  const httpInterface = sdk.createInterface(effects, {
    name: i18n('REST API'),
    id: 'rest',
    description: i18n('HTTP REST API for blockchain data queries'),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  const electrumReceipt = await electrumMultiOrigin.export([electrumInterface])
  const httpReceipt = await httpMultiOrigin.export([httpInterface])

  return [electrumReceipt, httpReceipt]
})
