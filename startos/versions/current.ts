import { VersionInfo } from '@start9labs/start-sdk'

export const SPARROW_VERSION = '2.5.1'

export const current = VersionInfo.of({
  version: '2.5.1:2',
  releaseNotes: {
    en_US: 'Fix crash loop on startup when using public Electrum server',
    es_ES: 'Corregir bucle de fallos al iniciar con servidor Electrum público',
    de_DE: 'Absturz-Schleife beim Start mit öffentlichem Electrum-Server beheben',
    pl_PL: 'Napraw pętlę awarii przy uruchomieniu z publicznym serwerem Electrum',
    fr_FR: "Corriger la boucle de plantage au démarrage avec un serveur Electrum public",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
