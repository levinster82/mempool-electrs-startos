import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_3_3_0_0_a1 = VersionInfo.of({
  version: '3.3.0:0-alpha.1',
  releaseNotes: {
    en_US: 'Adds UTXO Limit, Index Unspendable Outputs, and Address Search configuration options. Adds storage requirement warning to documentation.',
    es_ES: 'Añade opciones de configuración: Límite de UTXOs, Indexar salidas no gastables y Búsqueda de direcciones. Añade advertencia de requisito de almacenamiento a la documentación.',
    de_DE: 'Fügt Konfigurationsoptionen hinzu: UTXO-Limit, Nicht ausgebbare Ausgaben indexieren und Adresssuche. Fügt Speicheranforderungswarnung zur Dokumentation hinzu.',
    pl_PL: 'Dodaje opcje konfiguracji: Limit UTXO, Indeksuj niewydawalne wyjścia i Wyszukiwanie adresów. Dodaje ostrzeżenie o wymaganiach dotyczących miejsca na dysku do dokumentacji.',
    fr_FR: "Ajoute les options de configuration : Limite UTXO, Indexer les sorties non dépensables et Recherche d'adresses. Ajoute un avertissement sur les exigences de stockage à la documentation.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
