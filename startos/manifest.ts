import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86'
    ? ['x86_64']
    : BUILD === 'arm'
      ? ['aarch64']
      : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'sparrow-webtop',
  title: 'Sparrow',
  license: 'GPLv3',
  wrapperRepo: 'https://github.com/remcoros/sparrow-webtop-startos',
  upstreamRepo: 'https://github.com/sparrowwallet/sparrow',
  supportSite: 'https://github.com/sparrowwallet/sparrow/issues',
  docsUrl:
    'https://github.com/remcoros/sparrow-webtop-startos/blob/main/instructions.md',
  marketingSite: 'https://sparrowwallet.com/',
  donationUrl: 'https://sparrowwallet.com/donate/',
  description: {
    short: 'Sparrow - Desktop Wallet In Your Browser',
    long: "Sparrow on Webtop is a stripped down version of 'Webtop' (a Linux Desktop Environment) running the Sparrow wallet.\nThis allows users to access a simple Linux desktop with Sparrow pre-installed directly from their web browser.",
  },
  volumes: ['main', 'userdir'],
  images: {
    main: {
      source: {
        dockerTag: 'ghcr.io/remcoros/sparrow-webtop:2.2.3.2',
      },
      arch: architectures,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch: architectures,
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description: 'Used to connect to your Bitcoin node.',
      optional: true,
      s9pk: null,
    },
    electrs: {
      description: 'Used to connect to your Bitcoin node.',
      optional: true,
      s9pk: null,
    },
  },
})
