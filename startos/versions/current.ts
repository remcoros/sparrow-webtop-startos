import { VersionInfo } from '@start9labs/start-sdk'

export const SPARROW_VERSION = '2.5.7'
export const SPARROW_IMAGE_REF =
  'ghcr.io/remcoros/sparrow-webtop:2.5.7@sha256:1360ae449e302910ebfa16a58d40258ff5c4166125dad35bae2cabacd3ebdefd'

export const current = VersionInfo.of({
  version: '2.5.7:0',
  releaseNotes: {
    en_US:
      'Requires StartOS 0.4.2 or later. Sparrow 2.5.7 adds Testnet5, improves wallet history sync on slow Electrum servers, and updates bundled Tor. The browser desktop updates to Selkies 2.2.1 with smoother streaming on unstable connections. [Full Sparrow release notes](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.7).',
    es_ES:
      'Requiere StartOS 0.4.2 o posterior. Sparrow 2.5.7 añade Testnet5, mejora la sincronización del historial de las carteras con servidores Electrum lentos y actualiza el Tor incluido. El escritorio del navegador se actualiza a Selkies 2.2.1 para ofrecer una transmisión más fluida en conexiones inestables. [Notas completas de Sparrow](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.7).',
    de_DE:
      'Erfordert StartOS 0.4.2 oder neuer. Sparrow 2.5.7 unterstützt Testnet5, verbessert die Synchronisierung des Wallet-Verlaufs mit langsamen Electrum-Servern und aktualisiert das mitgelieferte Tor. Der Browser-Desktop verwendet Selkies 2.2.1 für flüssigeres Streaming bei instabilen Verbindungen. [Vollständige Sparrow-Versionshinweise](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.7).',
    pl_PL:
      'Wymaga StartOS 0.4.2 lub nowszego. Sparrow 2.5.7 dodaje obsługę Testnet5, poprawia synchronizację historii portfela z wolnymi serwerami Electrum i aktualizuje wbudowany Tor. Pulpit w przeglądarce korzysta z Selkies 2.2.1, co poprawia płynność przesyłania obrazu przy niestabilnym połączeniu. [Pełne informacje o wydaniu Sparrow](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.7).',
    fr_FR:
      'Nécessite StartOS 0.4.2 ou une version ultérieure. Sparrow 2.5.7 ajoute Testnet5, améliore la synchronisation de l’historique des portefeuilles avec les serveurs Electrum lents et met à jour le Tor intégré. Le bureau dans le navigateur passe à Selkies 2.2.1 pour un affichage plus fluide sur les connexions instables. [Notes de version complètes de Sparrow](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.7).',
  },
  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
