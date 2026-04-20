import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_3_3_0_0_a0 = VersionInfo.of({
  version: '3.3.0:0-alpha.0',
  releaseNotes: {
    en_US: 'Initial release of Mempool Electrs on StartOS.',
    es_ES: 'Lanzamiento inicial de Mempool Electrs en StartOS.',
    de_DE: 'Erstveröffentlichung von Mempool Electrs auf StartOS.',
    pl_PL: 'Pierwsze wydanie Mempool Electrs na StartOS.',
    fr_FR: 'Version initiale de Mempool Electrs sur StartOS.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
