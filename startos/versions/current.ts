import { VersionInfo } from '@start9labs/start-sdk'

export const SPARROW_VERSION = '2.5.3'

export const current = VersionInfo.of({
  version: '2.5.3:0',
  releaseNotes: {
    en_US:
      'Strengthens transaction and PSBT verification and fixes wallet label imports and JSON serialization; see the [Sparrow 2.5.3 release notes](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.3).',
    es_ES:
      'Refuerza la verificación de transacciones y PSBT y corrige la importación de etiquetas de carteras y la serialización JSON; consulta las [notas de la versión Sparrow 2.5.3](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.3).',
    de_DE:
      'Verbessert die Transaktions- und PSBT-Prüfung und behebt Fehler beim Import von Wallet-Labels und bei der JSON-Serialisierung; siehe die [Versionshinweise zu Sparrow 2.5.3](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.3).',
    pl_PL:
      'Usprawnia weryfikację transakcji i PSBT oraz naprawia import etykiet portfela i serializację JSON; zobacz [informacje o wydaniu Sparrow 2.5.3](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.3).',
    fr_FR:
      'Renforce la vérification des transactions et des PSBT et corrige l’importation des étiquettes de portefeuille et la sérialisation JSON ; consultez les [notes de version de Sparrow 2.5.3](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.3).',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
