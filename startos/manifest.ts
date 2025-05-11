import { setupManifest } from '@start9labs/start-sdk'

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
  images: {
    main: {
      arch: ['x86_64'],
      source: {
        dockerBuild: {
          workdir: '.',
          dockerfile: 'Dockerfile',
          // buildArgs: {
          //   TEST: "test",
          //   TEST_FROMENV: { env: "FROMENV" },
          // }
        },
      },
    },
  },
  // hardwareRequirements: {
  //   arch: ['x86_64'],
  // },
  hardwareRequirements: {},
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    // bitcoind: {
    //   description: 'Used to connect to your Bitcoin node.',
    //   optional: true,
    //   s9pk: 'https://github.com/Start9Labs/bitcoind-startos/releases/download/v28.1.0.0-alpha.3/bitcoind.s9pk',
    // },
  },
})
