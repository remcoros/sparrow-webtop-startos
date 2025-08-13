import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

// the following allows us to build the service for x86 or arm64 specifically
// use: 'make x86' or 'make arm' ('make' will build both)
const BUILD = process.env.BUILD || ''

// @todo we need to define two images and decide which one to use when creating
// the subcontainer (in main.ts), is this correct?
const main_x64: SDKImageInputSpec = {
  arch: ['x86_64'],
  source: {
    dockerTag: 'ghcr.io/remcoros/sparrow-webtop:2.2.3-alpha1',
  },
  emulateMissingAs: null
}

const main_aarch64: SDKImageInputSpec = {
  arch: ['aarch64'],
  source: {
    dockerTag: 'ghcr.io/remcoros/sparrow-webtop:arm64v8-2.2.3-alpha1',
  },
  emulateMissingAs: null
}

// name of images cannot contain capital letters, underscores, numbers?
const images: Record<string, SDKImageInputSpec> =
  BUILD === 'x86'
    ? { main: main_x64 }
    : BUILD === 'arm'
      ? { 'main-aarch': main_aarch64 }
      : { main: main_x64, 'main-aarch': main_aarch64 }

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
  images: images,
  hardwareRequirements: {
    // @TODO: add aarch64 when multi-arch s9pk is fixed
    arch: ['x86_64'],
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
