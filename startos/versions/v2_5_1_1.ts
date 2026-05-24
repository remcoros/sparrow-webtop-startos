import { VersionInfo } from '@start9labs/start-sdk'

export const v2_5_1_1 = VersionInfo.of({
  version: '2.5.1:1',
  releaseNotes: {
    en_US: 'Add Frigate as a selectable Electrum server backend',
    es_ES: 'Añadir Frigate como servidor Electrum seleccionable',
    de_DE: 'Frigate als auswählbares Electrum-Server-Backend hinzufügen',
    pl_PL: 'Dodaj Frigate jako wybieralny serwer Electrum',
    fr_FR: 'Ajouter Frigate comme backend serveur Electrum sélectionnable',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})

export const SPARROW_VERSION = '2.5.1'
