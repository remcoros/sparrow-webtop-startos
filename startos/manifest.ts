import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const SPARROW_VERSION = '2.1.3'
const SPARROW_DEBVERSION = '2.1.3-1'
const SPARROW_PGP_SIG = 'E94618334C674B40'
const YQ_VERSION = '4.40.7'

// the following allows us to build the service for x86 or arm64 specifically
// use: 'make x86' or 'make arm' ('make' will build both)
const BUILD = process.env.BUILD || ''

// @todo we need to define two images and decide which one to use when creating
// the subcontainer (in main.ts), is this correct?

const defaultBuildArgs = {
  SPARROW_VERSION: SPARROW_VERSION,
  SPARROW_DEBVERSION: SPARROW_DEBVERSION,
  SPARROW_PGP_SIG: SPARROW_PGP_SIG,
  YQ_VERSION: YQ_VERSION,
}

const main_x64: SDKImageInputSpec = {
  arch: ['x86_64'],
  source: {
    dockerBuild: {
      workdir: '.',
      dockerfile: 'Dockerfile',
      buildArgs: {
        ...defaultBuildArgs,
        PLATFORM: 'amd64',
        // yq sha256 hashes can be found in https://github.com/mikefarah/yq/releases/download/v4.40.7/checksums-bsd
        YQ_SHA:
          '4f13ee9303a49f7e8f61e7d9c87402e07cc920ae8dfaaa8c10d7ea1b8f9f48ed',
      },
    },
  },
}

const main_aarch64: SDKImageInputSpec = {
  arch: ['aarch64'],
  source: {
    dockerBuild: {
      workdir: '.',
      dockerfile: 'Dockerfile.aarch64',
      buildArgs: {
        ...defaultBuildArgs,
        PLATFORM: 'arm64',
        YQ_SHA:
          'a84f2c8f105b70cd348c3bf14048aeb1665c2e7314cbe9aaff15479f268b8412',
      },
    },
  },
}

// @todo name of images cannot contain capital letters, underscores, numbers?
const images: Record<string, SDKImageInputSpec> =
  BUILD === 'x86'
    ? { 'main': main_x64 }
    : BUILD === 'arm'
      ? { 'main-aarch': main_aarch64 }
      : { 'main': main_x64, 'main-aarch': main_aarch64 }

export const manifest = setupManifest({
  id: 'sparrow-webtop',
  title: 'Sparrow',
  license: 'GPLv3',
  wrapperRepo: 'https://github.com/remcoros/sparrow-webtop-startos',
  upstreamRepo: 'https://github.com/sparrowwallet/sparrow',
  supportSite: 'https://github.com/sparrowwallet/sparrow/issues',
  marketingSite: 'https://sparrowwallet.com/',
  donationUrl: 'https://sparrowwallet.com/donate/',
  description: {
    short: 'Sparrow - Desktop Wallet In Your Browser',
    long: "Sparrow on Webtop is a stripped down version of 'Webtop' (a Linux Desktop Environment) running the Sparrow wallet.\nThis allows users to access a simple Linux desktop with Sparrow pre-installed directly from their web browser.",
  },
  volumes: ['main', 'userdir'],
  images: images,
  hardwareRequirements: {
    //arch: ['x86_64', 'aarch64'],
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
      s9pk: 'https://github.com/Start9Labs/bitcoind-startos/releases/download/v28.1.0.0-alpha.6/bitcoind.s9pk',
    },
    electrs: {
      description: 'Used to connect to your Bitcoin node.',
      optional: true,
      s9pk: 'https://github.com/Start9Labs/electrs-startos/releases/download/v0.10.9/electrsV2.s9pk',
    },
  },
})
