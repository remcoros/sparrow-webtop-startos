import { VersionInfo } from '@start9labs/start-sdk'

export const SPARROW_VERSION = '2.5.2.1'

export const current = VersionInfo.of({
  version: '2.5.2:2',
  releaseNotes: {
    en_US:
      'Adds StartOS 0.4.0-beta.10 and Start SDK 2 compatibility with dynamic Bitcoin, Electrum, and Tor routing.',
    es_ES:
      'Añade compatibilidad con StartOS 0.4.0-beta.10 y Start SDK 2 con enrutamiento dinámico de Bitcoin, Electrum y Tor.',
    de_DE:
      'Fügt Kompatibilität mit StartOS 0.4.0-beta.10 und Start SDK 2 sowie dynamisches Bitcoin-, Electrum- und Tor-Routing hinzu.',
    pl_PL:
      'Dodaje zgodność ze StartOS 0.4.0-beta.10 i Start SDK 2 oraz dynamiczny routing Bitcoin, Electrum i Tor.',
    fr_FR:
      'Ajoute la compatibilité avec StartOS 0.4.0-beta.10 et Start SDK 2 avec routage dynamique Bitcoin, Electrum et Tor.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
