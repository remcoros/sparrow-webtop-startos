import { setupManifest } from '@start9labs/start-sdk'
import { SPARROW_VERSION } from '../versions'

export const manifest = setupManifest({
  id: 'sparrow-webtop',
  title: 'Sparrow',
  license: 'GPLv3',
  packageRepo: 'https://github.com/remcoros/sparrow-webtop-startos',
  upstreamRepo: 'https://github.com/sparrowwallet/sparrow',
  supportSites: ['https://github.com/sparrowwallet/sparrow/issues'],
  docsUrls: [
    'https://github.com/remcoros/sparrow-webtop-startos/blob/main/instructions.md',
  ],
  marketingUrl: 'https://sparrowwallet.com/',
  donationUrl: 'https://sparrowwallet.com/donate/',
  description: {
    short: {
      en_US: 'Sparrow - Desktop Wallet In Your Browser',
      es_ES: 'Sparrow - Billetera de escritorio en tu navegador',
      de_DE: 'Sparrow - Desktop-Wallet in Ihrem Browser',
      pl_PL: 'Sparrow - Portfel desktopowy w twojej przeglądarce',
      fr_FR: 'Sparrow - Portefeuille de bureau dans votre navigateur',
    },
    long: {
      en_US:
        "Sparrow on Webtop is a stripped down version of 'Webtop' (a Linux Desktop Environment) running the Sparrow wallet.\nThis allows users to access a simple Linux desktop with Sparrow pre-installed directly from their web browser.",
      es_ES:
        "Sparrow en Webtop es una versión simplificada de 'Webtop' (un entorno de escritorio Linux) que ejecuta la billetera Sparrow.\nEsto permite a los usuarios acceder a un escritorio Linux simple con Sparrow preinstalado directamente desde su navegador web.",
      de_DE:
        "Sparrow auf Webtop ist eine abgespeckte Version von 'Webtop' (einer Linux-Desktop-Umgebung), die die Sparrow-Wallet ausführt.\nDies ermöglicht es Benutzern, direkt über ihren Webbrowser auf einen einfachen Linux-Desktop mit vorinstalliertem Sparrow zuzugreifen.",
      pl_PL:
        "Sparrow na Webtop to okrojona wersja 'Webtop' (środowiska pulpitu Linux) uruchamiająca portfel Sparrow.\nUmożliwia to użytkownikom dostęp do prostego pulpitu Linux ze wstępnie zainstalowanym Sparrow bezpośrednio z ich przeglądarki internetowej.",
      fr_FR:
        "Sparrow sur Webtop est une version allégée de 'Webtop' (un environnement de bureau Linux) exécutant le portefeuille Sparrow.\nCela permet aux utilisateurs d'accéder à un bureau Linux simple avec Sparrow préinstallé directement depuis leur navigateur web.",
    },
  },
  volumes: ['main', 'userdir'],
  images: {
    main: {
      source: {
        dockerTag: 'ghcr.io/remcoros/sparrow-webtop:' + SPARROW_VERSION,
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'aarch64',
    },
  },
  dependencies: {
    bitcoind: {
      description: 'Used to connect to your Bitcoin node.',
      optional: true,
      metadata: {
        title: 'A Bitcoin Full Node',
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
    electrs: {
      description: 'Used to connect to your Bitcoin node.',
      optional: true,
      metadata: {
        title: 'Electrum Rust Server (electrs)',
        icon: 'https://raw.githubusercontent.com/Start9-Community/electrs-startos/master/icon.svg',
      },
    },
    fulcrum: {
      description: 'Used to connect to your Bitcoin node.',
      optional: true,
      metadata: {
        title: 'Fulcrum',
        icon: 'https://raw.githubusercontent.com/Start9Labs/fulcrum-startos/master/icon.png',
      },
    },
    tor: {
      description: 'Used to route Sparrow traffic through Tor for privacy.',
      optional: true,
      metadata: {
        title: 'Tor',
        icon: 'https://raw.githubusercontent.com/Start9Labs/tor-startos/65faea17febc739d910e8c26ff4e61f6333487a8/icon.svg',
      },
    },
  },
})
