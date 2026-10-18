import { VersionInfo } from '@start9labs/start-sdk'

export const SPARROW_VERSION = '2.5.5'
export const SPARROW_IMAGE_TAG = '2.5.5'

export const current = VersionInfo.of({
  version: '2.5.5:0',
  releaseNotes: {
    en_US:
      'Sparrow 2.5.5 improves Silent Payments, PSBT verification and fee replacement handling, and adds a system theme. Refreshes the Selkies desktop base. [Full release notes](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.5).',
    es_ES:
      'Sparrow 2.5.5 mejora Silent Payments, la verificación de PSBT y la gestión del reemplazo de comisiones, y añade un tema que sigue el del sistema. Actualiza la imagen base del escritorio Selkies. [Notas completas de la versión](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.5).',
    de_DE:
      'Sparrow 2.5.5 verbessert Silent Payments, die PSBT-Prüfung und den Gebührenersatz und ergänzt ein Systemdesign. Aktualisiert das Basisimage des Selkies-Desktops. [Vollständige Versionshinweise](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.5).',
    pl_PL:
      'Sparrow 2.5.5 usprawnia Silent Payments, weryfikację PSBT i obsługę zastępowania transakcji z wyższą opłatą oraz dodaje motyw systemowy. Aktualizuje obraz bazowy pulpitu Selkies. [Pełne informacje o wydaniu](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.5).',
    fr_FR:
      'Sparrow 2.5.5 améliore Silent Payments, la vérification des PSBT et le remplacement des transactions avec de nouveaux frais, et ajoute un thème système. Actualise l’image de base du bureau Selkies. [Notes de version complètes](https://github.com/sparrowwallet/sparrow/releases/tag/2.5.5).',
  },
  migrations: {
    up: async () => {},
    down: async () => {},
  },
})
